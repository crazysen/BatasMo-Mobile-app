import {apiRequest} from './apiClient';

export async function getAttorneys() {
  const response = await apiRequest('/attorneys', {auth: true});
  return response?.data ?? [];
}
