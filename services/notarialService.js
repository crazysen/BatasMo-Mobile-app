import {apiRequest} from './apiClient';

function normalizeBaseApiUrl() {
  return String(process.env.EXPO_PUBLIC_API_BASE_URL || '').trim().replace(/\/+$/, '');
}

export function resolveNotarialDocumentUrl(documentUrl) {
  const rawUrl = String(documentUrl || '').trim();
  if (!rawUrl) return '';
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;

  const apiBase = normalizeBaseApiUrl();
  if (!apiBase) return rawUrl;

  const origin = apiBase.replace(/\/api$/i, '');
  return `${origin}/${rawUrl.replace(/^\/+/, '')}`;
}

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
