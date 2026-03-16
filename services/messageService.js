import {apiRequest} from './apiClient';

export async function getAppointmentMessages(appointmentId) {
  const response = await apiRequest(`/appointments/${appointmentId}/messages`, {
    auth: true,
  });
  return response?.data ?? [];
}

export async function sendAppointmentMessage(appointmentId, message) {
  const response = await apiRequest(`/appointments/${appointmentId}/messages`, {
    method: 'POST',
    auth: true,
    body: {message},
  });
  return response?.data;
}
