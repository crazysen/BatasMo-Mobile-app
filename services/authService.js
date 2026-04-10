import { supabase } from './supabaseClient';
import { clearCachedProfile } from './profileCache';

/** Philippine mobile → E.164 (+639XXXXXXXXX). */
export function normalizePhilippinesToE164(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Phone number is required');
  }
  let d = input.replace(/\s/g, '').replace(/-/g, '');
  if (d.startsWith('+63')) {
    if (!/^\+63\d{10}$/.test(d)) {
      throw new Error('Enter a valid Philippine mobile number');
    }
    return d;
  }
  if (d.startsWith('63') && d.length === 12) {
    return `+${d}`;
  }
  if (d.startsWith('0')) {
    d = `63${d.slice(1)}`;
  } else if (/^9\d{9}$/.test(d)) {
    d = `63${d}`;
  }
  if (!/^63\d{10}$/.test(d)) {
    throw new Error('Enter a valid Philippine mobile number');
  }
  return `+${d}`;
}

/**
 * DB `profiles.phone` uses Philippine local format (11 digits, e.g. 09XXXXXXXXX).
 * Auth APIs use E.164 (+63…); convert before writing to `profiles`.
 */
export function e164ToPhilippinesLocal11(input) {
  if (!input || typeof input !== 'string') return null;
  const t = input.replace(/\s/g, '');
  if (/^09\d{9}$/.test(t)) return t;
  try {
    const e164 = normalizePhilippinesToE164(t);
    const m = e164.match(/^\+63(\d{10})$/);
    if (m) return `0${m[1]}`;
  } catch (_) {
    /* ignore */
  }
  return null;
}

export function maskPhilippinesPhone(e164) {
  if (!e164 || typeof e164 !== 'string' || e164.length < 4) {
    return 'your phone';
  }
  return `***${e164.slice(-4)}`;
}

export function isPhoneVerified(user) {
  return Boolean(user?.phone_confirmed_at);
}

function toE164OrNull(raw) {
  if (!raw) return null;
  try { return normalizePhilippinesToE164(String(raw)); } catch { return null; }
}

export async function signUpWithEmail({
  email,
  password,
  fullName,
  role,
  phone,
  age,
  address,
  guardianName,
  guardianContact
}) {
  const normalizedRole = String(role || 'Client').toLowerCase();
  const roleValue =
    normalizedRole === 'attorney'
      ? 'Attorney'
      : normalizedRole === 'admin'
      ? 'Admin'
      : 'Client';

  if (!phone || !String(phone).trim()) {
    throw new Error('Mobile number is required for SMS verification.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: roleValue,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.session || !data.user) {
    throw new Error(
      'Could not start your session after sign-up. In Supabase Dashboard → Authentication → Providers → Email, disable "Confirm email" so SMS verification can run, or confirm your email first.'
    );
  }

  let phoneE164 = null;
  if (phone) {
    phoneE164 = normalizePhilippinesToE164(phone);
    const { error: phoneErr } = await supabase.auth.updateUser({ phone: phoneE164 });
    if (phoneErr) {
      throw new Error(phoneErr.message || 'Failed to send verification SMS.');
    }
  }

  const phoneForProfile = e164ToPhilippinesLocal11(phoneE164 || phone);

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: data.user.id,
    email: email,
    full_name: fullName,
    role: roleValue,
    phone: phoneForProfile,
    age: age || null,
    address: address || null,
    guardian_name: guardianName || null,
    guardian_contact: guardianContact || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    console.error('Failed to create profile:', profileError);
  }

  data.user.role = roleValue;
  data.user.name = fullName;
  data.user.phone = phoneE164 || phone;
  data.user.address = address;

  return {
    token: data?.session?.access_token,
    user: data?.user,
    phoneE164,
  };
}

export async function checkEmailLockout(email) {
  try {
    const { data } = await supabase.rpc('check_login_lockout', { user_email: email });
    return Number(data) || 0;
  } catch (error) {
    return 0;
  }
}

export async function signInWithEmail({ email, password }) {
  const lockoutTime = await checkEmailLockout(email);
  if (lockoutTime > 0) {
    throw new Error(`LOCKOUT:${lockoutTime}`);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes('credential') || error.message.toLowerCase().includes('invalid')) {
      await supabase.rpc('log_failed_login', { user_email: email });
    }
    throw new Error(error.message);
  }

  try {
    await supabase.rpc('clear_failed_logins', { user_email: email });
  } catch (rpcError) {
    console.warn('Failed to clear failed login attempts:', rpcError?.message || rpcError);
  }

  const { data: freshAuth } = await supabase.auth.getUser();
  const authedUser = freshAuth?.user || data?.user;

  if (authedUser) {
    const meta = authedUser.user_metadata || {};

    let existingProfile = null;
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name, phone, address')
        .eq('id', authedUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.warn('Failed to fetch profile during sign-in:', profileError.message);
      }
      existingProfile = profileData;
    } catch (profileFetchError) {
      console.warn('Profile fetch exception during sign-in:', profileFetchError?.message || profileFetchError);
    }

    const dbRole = existingProfile?.role || meta.role || 'Client';
    const dbName = existingProfile?.full_name || meta.full_name || email;

    authedUser.role = dbRole;
    authedUser.name = dbName;
    authedUser.phone = existingProfile?.phone;
    authedUser.address = existingProfile?.address;

    const phoneE164ForVerification = toE164OrNull(authedUser.new_phone)
      || toE164OrNull(authedUser.phone)
      || toE164OrNull(existingProfile?.phone);

    const needsPhoneVerification = !isPhoneVerified(authedUser);

    return {
      user: authedUser,
      token: data.session?.access_token,
      needsPhoneVerification,
      phoneE164ForVerification,
    };
  }

  return {
    user: data.user,
    token: data.session?.access_token,
    needsPhoneVerification: false,
    phoneE164ForVerification: null,
  };
}

export async function signOutCurrentUser() {
  await clearCachedProfile();
  const { error } = await supabase.auth.signOut();
  if (error) {
    // non-fatal
  }
}

/** Triggers or re-sends SMS OTP for the current session (e.g. phone change / verification). */
export async function requestPhoneVerificationSms(phoneE164) {
  const { error } = await supabase.auth.updateUser({ phone: phoneE164 });
  if (error) {
    throw new Error(error.message);
  }
  return { success: true };
}

/**
 * GoTrue stores the pending number in `auth.users.phone_change`, exposed in the API as
 * `user.new_phone` (digits-only E.164, no "+"). Until verified, `user.phone` is often empty.
 * `verifyOtp` must use type `phone_change` for updateUser({ phone }) — type `sms` checks
 * `confirmation_token` and `user.phone`, which is the wrong row for this flow.
 *
 * See: supabase/auth internal verifyUserAndToken + sendPhoneConfirmation(phoneChangeVerification).
 */
function buildPhoneVerifyCandidates(primary, user) {
  const out = [];
  const push = (v) => {
    if (!v || typeof v !== 'string') return;
    const t = v.trim().replace(/\s/g, '');
    if (t && !out.includes(t)) out.push(t);
  };

  if (user?.new_phone) push(String(user.new_phone));
  if (user?.phone) push(String(user.phone));
  push(primary);

  for (const raw of [user?.new_phone, user?.phone, primary]) {
    if (!raw) continue;
    try {
      const e164 = normalizePhilippinesToE164(String(raw));
      push(e164);
      push(e164.replace(/^\+/, ''));
    } catch {
      /* ignore */
    }
  }

  return out;
}

export async function verifyPhoneOtp({ phone, token }) {
  const cleanToken = String(token ?? '').replace(/\s/g, '');
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const candidates = buildPhoneVerifyCandidates(phone, user);

  if (candidates.length === 0) {
    throw new Error('No phone number on file for verification.');
  }

  let lastErr = null;

  for (const p of candidates) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: p,
      token: cleanToken,
      type: 'phone_change',
    });
    if (!error && data?.session) {
      return { session: data.session, user: data.user };
    }
    lastErr = error;
  }

  throw new Error(lastErr?.message || 'Invalid or expired code.');
}

export async function resendPhoneVerificationOtp({ phone }) {
  const { error } = await supabase.auth.resend({
    type: 'phone_change',
    phone,
  });
  if (!error) {
    return { success: true };
  }
  const { error: retry } = await supabase.auth.updateUser({ phone });
  if (retry) {
    throw new Error(error.message || retry.message);
  }
  return { success: true };
}

export async function startPasswordRecovery({ email }) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function verifyRecoveryOtp({ email, token }) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function updatePasswordForCurrentUser({ newPassword }) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

/**
 * After SMS OTP success, persist verified E.164 phone (and optional full profile from signup).
 * When profilePayload is null, only phone + email sync from auth user are applied.
 */
export async function upsertProfileFromVerificationPayload(phoneE164, profilePayload) {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    throw new Error(userErr?.message || 'Not signed in');
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('full_name, role, age, address, guardian_name, guardian_contact')
    .eq('id', user.id)
    .maybeSingle();

  const roleRaw = profilePayload?.role || existing?.role || user.user_metadata?.role || 'Client';
  const roleValue =
    String(roleRaw).toLowerCase() === 'attorney'
      ? 'Attorney'
      : String(roleRaw).toLowerCase() === 'admin'
        ? 'Admin'
        : 'Client';

  const phoneLocal = e164ToPhilippinesLocal11(phoneE164);
  if (!phoneLocal) {
    throw new Error('Could not save phone to profile. Check the number format.');
  }

  const row = {
    id: user.id,
    email: profilePayload?.email ?? user.email,
    phone: phoneLocal,
    full_name:
      profilePayload?.fullName ??
      existing?.full_name ??
      user.user_metadata?.full_name ??
      '',
    role: roleValue,
    age: profilePayload ? profilePayload.age ?? null : existing?.age ?? null,
    address: profilePayload ? profilePayload.address ?? null : existing?.address ?? null,
    guardian_name: profilePayload
      ? profilePayload.guardianName ?? null
      : existing?.guardian_name ?? null,
    guardian_contact: profilePayload
      ? profilePayload.guardianContact ?? null
      : existing?.guardian_contact ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'id' });
  if (error) {
    console.error('upsertProfileFromVerificationPayload:', error);
    throw new Error(error.message);
  }
}
