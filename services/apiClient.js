import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const AUTH_TOKEN_KEY = 'auth_token';

function assertApiConfigured() {
  if (!API_BASE_URL) {
    throw new Error(
      'API base URL is missing. Set EXPO_PUBLIC_API_BASE_URL in .env and restart Expo.',
    );
  }
}

export async function setAuthToken(token) {
  if (!token) return;
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function clearAuthToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function getAuthToken() {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export async function apiRequest(path, {method = 'GET', body, auth = false} = {}) {
  assertApiConfigured();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Not authenticated. Please log in again.');
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.errors?.email?.[0] ||
      payload?.errors?.code?.[0] ||
      'Request failed.';
    throw new Error(message);
  }

  return payload;
}
