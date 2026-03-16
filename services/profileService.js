import {apiRequest} from './apiClient';

export async function getMyProfile() {
  const response = await apiRequest('/me', {auth: true});
  return response?.data;
}

export async function updateMyProfile(payload) {
  const response = await apiRequest('/me', {
    method: 'PUT',
    auth: true,
    body: payload,
  });
  return response?.data;
}
