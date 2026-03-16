import {apiRequest} from './apiClient';

export async function getAvailability() {
  const response = await apiRequest('/availability', {auth: true});
  return response?.data ?? [];
}

export async function createAvailabilitySlot({start_time, end_time}) {
  const response = await apiRequest('/availability', {
    method: 'POST',
    auth: true,
    body: {start_time, end_time},
  });
  return response?.data;
}

export async function updateAvailabilitySlot(slotId, payload) {
  const response = await apiRequest(`/availability/${slotId}`, {
    method: 'PUT',
    auth: true,
    body: payload,
  });
  return response?.data;
}

export async function deleteAvailabilitySlot(slotId) {
  await apiRequest(`/availability/${slotId}`, {
    method: 'DELETE',
    auth: true,
  });
  return true;
}
