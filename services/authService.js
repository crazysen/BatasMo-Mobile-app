import { supabase } from './supabaseClient';

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

  if (data?.session && data.user) {
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      email: email,
      full_name: fullName,
      role: roleValue,
      phone: phone || null,
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
    
    // Attach profile fields so frontend routing works
    data.user.role = roleValue;
    data.user.name = fullName;
    data.user.phone = phone;
    data.user.address = address;
  }

  return { token: data?.session?.access_token, user: data?.user };
}

export async function checkEmailLockout(email) {
  try {
    const { data } = await supabase.rpc('check_login_lockout', { user_email: email });
    return Number(data) || 0;
  } catch (error) {
    return 0; // Fail open slightly if RPC doesn't exist yet
  }
}

export async function signInWithEmail({ email, password }) {
  // 1. PRE-FLIGHT: Check if user is already locked out (3 consecutive fails)
  const lockoutTime = await checkEmailLockout(email);
  if (lockoutTime > 0) {
    throw new Error(`LOCKOUT:${lockoutTime}`);
  }

  // 2. ATTEMPT LOGIN
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // 3. LOG FAILURE: If the password was wrong, securely log it to the audit_logs table
    if (error.message.toLowerCase().includes('credential') || error.message.toLowerCase().includes('invalid')) {
      await supabase.rpc('log_failed_login', { user_email: email });
    }
    throw new Error(error.message);
  }

  // 4. ON SUCCESS: Wipe the failed attempts log for this user
  try {
    await supabase.rpc('clear_failed_logins', { user_email: email });
  } catch (rpcError) {
    console.warn('Failed to clear failed login attempts:', rpcError?.message || rpcError);
  }

  if (data?.user) {
    const meta = data.user.user_metadata || {};

    // Fetch role from profiles when available, but never block auth if profile sync fails.
    let existingProfile = null;
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name, phone, address')
        .eq('id', data.user.id)
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

    try {
      await supabase
        .from('profiles')
        .upsert(
          {
            id: data.user.id,
            email: data.user.email,
            full_name: dbName,
            role: dbRole.charAt(0).toUpperCase() + dbRole.slice(1).toLowerCase(),
          },
          { onConflict: 'id' }
        )
        .select();
    } catch (profileUpsertError) {
      console.warn('Profile upsert failed during sign-in:', profileUpsertError?.message || profileUpsertError);
    }

    // Attach profile fields so frontend routing works
    data.user.role = dbRole;
    data.user.name = dbName;
    data.user.phone = existingProfile?.phone;
    data.user.address = existingProfile?.address;
  }

  return {
    user: data.user,
    token: data.session?.access_token,
  };
}

export async function signOutCurrentUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    // throw new Error(error.message);
  }
}

export async function verifySignUpOtp({ email, token }) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function resendSignUpOtp({ email }) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    throw new Error(error.message);
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
  // Verifying recovery code logs the user in
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
