import {apiRequest} from './apiClient';

export async function getNotarialRequests() {
  const response = await apiRequest('/notarial-requests', {auth: true});
  return response?.data ?? [];
}

export async function createNotarialRequest(payload) {
  const response = await apiRequest('/notarial-requests', {
    method: 'POST',
    auth: true,
    body: payload,
  });
  return response?.data;
}

export async function updateNotarialRequestStatus(requestId, status) {
  const response = await apiRequest(`/notarial-requests/${requestId}/status`, {
    method: 'PUT',
    auth: true,
    body: {status},
  });
  return response?.data;
}
