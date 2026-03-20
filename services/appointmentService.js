import {apiRequest} from './apiClient';

const APPOINTMENTS_CACHE_TTL_MS = 15000;
let appointmentsCache = {
  data: null,
  updatedAt: 0,
};

function invalidateAppointmentsCache() {
  appointmentsCache = {
    data: null,
    updatedAt: 0,
  };
}

export async function getMyAppointments(options = {}) {
  const force = Boolean(options?.force);
  const cacheIsFresh =
    Array.isArray(appointmentsCache.data) &&
    Date.now() - appointmentsCache.updatedAt < APPOINTMENTS_CACHE_TTL_MS;

  if (!force && cacheIsFresh) {
    return appointmentsCache.data;
  }

  const response = await apiRequest('/appointments', {auth: true});
  const rows = response?.data ?? [];
  appointmentsCache = {
    data: Array.isArray(rows) ? rows : [],
    updatedAt: Date.now(),
  };

  return appointmentsCache.data;
}

export async function createAppointment(payload) {
  const response = await apiRequest('/appointments', {
    method: 'POST',
    auth: true,
    body: payload,
  });
  invalidateAppointmentsCache();
  return response?.data;
}

export async function updateAppointmentStatus(appointmentId, status) {
  const response = await apiRequest(`/appointments/${appointmentId}/status`, {
    method: 'PUT',
    auth: true,
    body: {status},
  });
  invalidateAppointmentsCache();
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
  invalidateAppointmentsCache();
  return response?.data;
}
