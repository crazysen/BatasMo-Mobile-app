import { supabase } from './supabaseClient';

export async function getAppointmentMessages(appointmentId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('appointment_messages')
    .select('*, sender:sender_id(full_name)')
    .eq('appointment_id', appointmentId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (data || []).map(row => ({
    id: row.id,
    appointment_id: row.appointment_id,
    sender_id: row.sender_id,
    sender_name: Array.isArray(row.sender) ? row.sender[0]?.full_name : row.sender?.full_name,
    is_mine: row.sender_id === user.id,
    message: row.message,
    created_at: row.created_at,
  }));
}

export async function sendAppointmentMessage(appointmentId, message) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('appointment_messages')
    .insert({
      appointment_id: appointmentId,
      sender_id: user.id,
      message: message,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('*, sender:sender_id(full_name)')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    appointment_id: data.appointment_id,
    sender_id: data.sender_id,
    sender_name: Array.isArray(data.sender) ? data.sender[0]?.full_name : data.sender?.full_name,
    is_mine: true,
    message: data.message,
    created_at: data.created_at,
  };
}
