import { supabase } from './supabaseClient';

async function notifyClientReschedulePush(appointmentId) {
  try {
    const { error } = await supabase.functions.invoke('send-reschedule-push', {
      body: { appointment_id: appointmentId },
    });
    if (error) {
      console.warn('send-reschedule-push:', error.message);
    }
  } catch (e) {
    console.warn('send-reschedule-push:', e?.message ?? e);
  }
}

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

/** Original booking notes without any appended "Reschedule reason:" blocks. */
function stripRescheduleBlocks(notes) {
  if (!notes || typeof notes !== 'string') {
    return '';
  }
  const parts = notes.split('\n\nReschedule reason:');
  return parts[0].trim();
}

/**
 * Replaces previous reschedule reasons with one latest block (avoids duplicate lines in DB).
 */
export function mergeRescheduleNotes(existingNotes, reason) {
  const base = stripRescheduleBlocks(existingNotes);
  const r = String(reason || '').trim();
  if (!r) {
    return base || null;
  }
  const block = `Reschedule reason: ${r}`;
  return base ? `${base}\n\n${block}` : block;
}

/** Collapses legacy duplicate "Reschedule reason:" blocks to base + latest only. */
export function formatAppointmentNotesForDisplay(notes) {
  if (!notes?.trim()) {
    return '';
  }
  const parts = notes.split('\n\nReschedule reason:').map(s => s.trim()).filter(Boolean);
  if (parts.length <= 1) {
    return notes.trim();
  }
  const base = parts[0];
  const latest = parts[parts.length - 1];
  return base ? `${base}\n\nReschedule reason: ${latest}` : `Reschedule reason: ${latest}`;
}

export function getLatestRescheduleReason(notes) {
  if (!notes?.includes('Reschedule reason:')) {
    return '';
  }
  const parts = notes.split('\n\nReschedule reason:');
  return parts.length > 1 ? parts[parts.length - 1].trim() : '';
}

export function formatScheduledAtDisplay(isoDateTime) {
  if (!isoDateTime) {
    return {date: '—', time: '—'};
  }
  const rawValue = String(isoDateTime).trim();
  const hasTimezoneInfo = /([zZ]|[+-]\d{2}:?\d{2})$/.test(rawValue);
  let value;
  if (hasTimezoneInfo) {
    const normalizedValue = rawValue.replace(' ', 'T').replace(/\+00$/, 'Z');
    value = new Date(normalizedValue);
  } else {
    const localMatch = rawValue.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
    if (localMatch) {
      value = new Date(
        Number(localMatch[1]),
        Number(localMatch[2]) - 1,
        Number(localMatch[3]),
        Number(localMatch[4]),
        Number(localMatch[5]),
      );
    } else {
      value = new Date(rawValue);
    }
  }
  if (!value || Number.isNaN(value.getTime())) {
    return {date: '—', time: '—'};
  }
  return {
    date: value.toLocaleDateString(),
    time: value.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
  };
}

export async function getMyAppointments(options = {}) {
  const force = Boolean(options?.force);
  const cacheIsFresh = Array.isArray(appointmentsCache.data) && Date.now() - appointmentsCache.updatedAt < APPOINTMENTS_CACHE_TTL_MS;

  if (!force && cacheIsFresh) {
    return appointmentsCache.data;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Assuming you have foreign key relationships in Supabase from appointments to profiles
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      client:client_id (full_name),
      attorney:attorney_id (full_name)
    `)
    .or(`client_id.eq.${user.id},attorney_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Map nested objects to top-level properties to match frontend expectations
  const mapped = (data || []).map(row => ({
    ...row,
    client_name: Array.isArray(row.client) ? row.client[0]?.full_name : row.client?.full_name,
    attorney_name: Array.isArray(row.attorney) ? row.attorney[0]?.full_name : row.attorney?.full_name,
  }));

  appointmentsCache = {
    data: mapped,
    updatedAt: Date.now(),
  };

  return appointmentsCache.data;
}

export async function createAppointment(payload) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const scheduledAtIso = payload?.scheduled_at
    ? new Date(payload.scheduled_at).toISOString()
    : null;

  // Call the RPC with the full signature to avoid overload ambiguity
  const { data: appointmentId, error } = await supabase.rpc('book_appointment', {
    client_uuid: user.id,
    attorney_uuid: payload.attorney_id,
    scheduled_time: scheduledAtIso,
    title_text: payload.title,
    notes_text: payload.notes || null,
    slot_date: payload.slot_date || null,
    slot_time: payload.slot_time || null,
    amount_value: payload.amount || 0,
    duration_minutes_value: payload.duration_minutes || 60,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (payload.slot_date && payload.slot_time) {
    await supabase.rpc('mark_slot_booked', {
      p_attorney_id: payload.attorney_id,
      p_date: payload.slot_date,
      p_time: payload.slot_time
    });
  }

  // Payment-first flow: mark newly created booking as confirmed immediately.
  if (appointmentId) {
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        notes: payload.notes || null,
        duration_minutes: payload.duration_minutes || 60,
        amount: payload.amount || 0,
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  invalidateAppointmentsCache();
  return { success: true };
}

export async function updateAppointmentStatus(appointmentId, status) {
  const { error } = await supabase
    .from('appointments')
    .update({ 
      status: String(status).toLowerCase(), 
      updated_at: new Date().toISOString() 
    })
    .eq('id', appointmentId);

  if (error) throw new Error(error.message);

  invalidateAppointmentsCache();
  return { success: true };
}

export async function rescheduleAppointment(appointmentId, scheduledAt, reason) {
  const { data: existingAppt } = await supabase
    .from('appointments')
    .select('notes')
    .eq('id', appointmentId)
    .single();

  const newNotes = mergeRescheduleNotes(existingAppt?.notes ?? '', reason);

  const { error } = await supabase
    .from('appointments')
    .update({
      status: 'rescheduled',
      scheduled_at: scheduledAt,
      notes: newNotes,
      updated_at: new Date().toISOString()
    })
    .eq('id', appointmentId);

  if (error) throw new Error(error.message);

  invalidateAppointmentsCache();
  await notifyClientReschedulePush(appointmentId);
  return { success: true };
}

export async function getAvailability(attorneyId, date) {
  let query = supabase
    .from('availability_slots')
    .select('date, time')
    .eq('attorney_id', attorneyId)
    .eq('is_booked', false)
    .order('time', { ascending: true });

  if (date) {
    query = query.eq('date', date);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function setAvailability(date, slots) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Delete all unbooked slots for this date first
  await supabase
    .from('availability_slots')
    .delete()
    .eq('attorney_id', user.id)
    .eq('date', date)
    .eq('is_booked', false);

  if (!slots || slots.length === 0) return [];

  // Verify which ones are already booked to avoid overwriting them
  const { data: booked } = await supabase
    .from('availability_slots')
    .select('time')
    .eq('attorney_id', user.id)
    .eq('date', date)
    .eq('is_booked', true);

  const bookedTimes = booked?.map(b => b.time) || [];
  
  // Insert slots that are not already booked
  const toInsert = slots
    .filter(t => !bookedTimes.includes(t))
    .map(time => ({
      attorney_id: user.id,
      date: date,
      time: time,
      is_booked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

  if (toInsert.length > 0) {
    const { error } = await supabase.from('availability_slots').insert(toInsert);
    if (error) throw new Error(error.message);
  }

  return await getAvailability(user.id, date);
}

export async function setWeeklyAvailability(startDate, endDate, slots) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Delete all unbooked slots for this week first
  await supabase
    .from('availability_slots')
    .delete()
    .eq('attorney_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .eq('is_booked', false);

  if (!slots || slots.length === 0) return true;

  // Verify which ones are already booked to avoid overwriting them
  const { data: booked } = await supabase
    .from('availability_slots')
    .select('date, time')
    .eq('attorney_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .eq('is_booked', true);

  const bookedKeys = (booked || []).map(b => `${b.date}|${b.time}`);
  
  // Insert slots that are not already booked
  const toInsert = slots
    .filter(slot => !bookedKeys.includes(`${slot.date}|${slot.time}`))
    .map(slot => ({
      attorney_id: user.id,
      date: slot.date,
      time: slot.time,
      is_booked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

  if (toInsert.length > 0) {
    const { error } = await supabase.from('availability_slots').insert(toInsert);
    if (error) throw new Error(error.message);
  }

  return true;
}
