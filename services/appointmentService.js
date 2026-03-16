import {apiRequest} from './apiClient';

export async function getMyAppointments() {
  const response = await apiRequest('/appointments', {auth: true});
  return response?.data ?? [];
}

export async function createAppointment(payload) {
  const response = await apiRequest('/appointments', {
    method: 'POST',
    auth: true,
    body: payload,
  });
  return response?.data;
}

export async function updateAppointmentStatus(appointmentId, status) {
  const response = await apiRequest(`/appointments/${appointmentId}/status`, {
    method: 'PUT',
    auth: true,
    body: {status},
  });
  return response?.data;
}

export async function rescheduleAppointment(appointmentId, scheduledAt, reason) {
  const response = await apiRequest(`/appointments/${appointmentId}/status`, {
    method: 'PUT',
    auth: true,
    body: {
      status: 'rescheduled',
      scheduled_at: scheduledAt,
      reschedule_reason: reason,
    },
  });
  return response?.data;
}
