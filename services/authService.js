import {getSupabaseClient, isSupabaseConfigured} from '../lib/supabase';

function requireSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase environment is missing. Create .env with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY, then restart Expo.',
    );
  }

  return getSupabaseClient();
}

export async function signUpWithEmail({email, password, fullName, role}) {
  const supabase = requireSupabase();
  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithEmail({email, password}) {
  const supabase = requireSupabase();
  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOutCurrentUser() {
  const supabase = requireSupabase();
  const {error} = await supabase.auth.signOut();
  if (error) throw error;
}

export async function verifySignUpOtp({email, token}) {
  const supabase = requireSupabase();
  const {data, error} = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });

  if (error) throw error;
  return data;
}

export async function resendSignUpOtp({email}) {
  const supabase = requireSupabase();
  const {data, error} = await supabase.auth.resend({
    email,
    type: 'signup',
  });

  if (error) throw error;
  return data;
}

export async function startPasswordRecovery({email}) {
  const supabase = requireSupabase();
  const {data, error} = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) throw error;
  return data;
}

export async function verifyRecoveryOtp({email, token}) {
  const supabase = requireSupabase();
  const {data, error} = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) throw error;
  return data;
}

export async function updatePasswordForCurrentUser({newPassword}) {
  const supabase = requireSupabase();
  const {data, error} = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
}
