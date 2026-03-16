import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  apiRequest,
  clearAuthToken,
  setAuthToken,
} from './apiClient';

const RECOVERY_EMAIL_KEY = 'recovery_email';
const RECOVERY_CODE_KEY = 'recovery_code';

export async function signUpWithEmail({email, password, fullName, role}) {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: {
      full_name: fullName,
      email,
      password,
      role,
    },
  });

  return response?.data;
}

export async function signInWithEmail({email, password}) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: {
      email,
      password,
    },
  });

  const token = response?.data?.token;
  if (token) {
    await setAuthToken(token);
  }

  return {
    user: response?.data?.user,
  };
}

export async function signOutCurrentUser() {
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
      auth: true,
    });
  } catch (_) {
    // Clear local token even if API logout fails.
  }

  await clearAuthToken();
}

export async function verifySignUpOtp({email, token}) {
  await apiRequest('/auth/verify-email', {
    method: 'POST',
    body: {
      email,
      code: token,
    },
  });

  return {success: true};
}

export async function resendSignUpOtp({email}) {
  await apiRequest('/auth/resend-verification', {
    method: 'POST',
    body: {
      email,
    },
  });

  return {success: true};
}

export async function startPasswordRecovery({email}) {
  await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: {
      email,
    },
  });

  await AsyncStorage.setItem(RECOVERY_EMAIL_KEY, email);
  return {success: true};
}

export async function verifyRecoveryOtp({email, token}) {
  await apiRequest('/auth/verify-recovery', {
    method: 'POST',
    body: {
      email,
      code: token,
    },
  });

  await AsyncStorage.setItem(RECOVERY_EMAIL_KEY, email);
  await AsyncStorage.setItem(RECOVERY_CODE_KEY, token);

  return {success: true};
}

export async function updatePasswordForCurrentUser({newPassword}) {
  const recoveryEmail = await AsyncStorage.getItem(RECOVERY_EMAIL_KEY);
  const recoveryCode = await AsyncStorage.getItem(RECOVERY_CODE_KEY);

  if (!recoveryEmail || !recoveryCode) {
    throw new Error('Recovery session missing. Verify your code again.');
  }

  await apiRequest('/auth/reset-password', {
    method: 'POST',
    body: {
      email: recoveryEmail,
      code: recoveryCode,
      password: newPassword,
    },
  });

  await AsyncStorage.removeItem(RECOVERY_CODE_KEY);
  return {success: true};
}
