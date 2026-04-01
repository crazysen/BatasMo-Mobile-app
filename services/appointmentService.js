import { supabase } from './supabaseClient';

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

  // Call the Supabase RPC function you created
  const { error } = await supabase.rpc('book_appointment', {
    client_uuid: user.id,
    attorney_uuid: payload.attorney_id,
    scheduled_time: payload.scheduled_at,
    title_text: payload.title,
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

  // Update additional fields that the RPC doesn't handle, if any
  if (payload.notes || payload.duration_minutes || payload.amount) {
    const { data: latestAppt } = await supabase
      .from('appointments')
      .select('id')
      .eq('client_id', user.id)
      .eq('attorney_id', payload.attorney_id)
      .eq('scheduled_at', payload.scheduled_at)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (latestAppt) {
      await supabase.from('appointments').update({
        notes: payload.notes || null,
        duration_minutes: payload.duration_minutes || 60,
        amount: payload.amount || null
      }).eq('id', latestAppt.id);
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

  const newNotes = existingAppt?.notes 
    ? `${existingAppt.notes}\n\nReschedule reason: ${reason}` 
    : `Reschedule reason: ${reason}`;

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
  return { success: true };
}

export async function getAvailability(attorneyId, date) {
  let query = supabase
    .from('availability_slots')
    .select('*')
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
