import { supabase } from './supabaseClient';

async function getOrCreateRoom(appointmentId) {
  // Try to find the room
  const { data: room, error: roomError } = await supabase
    .from('consultation_rooms')
    .select('id, is_closed')
    .eq('appointment_id', appointmentId)
    .single();

  if (room) return room;

  // If not found, check if appointment is confirmed to perform lazy creation
  const { data: appt, error: apptError } = await supabase
    .from('appointments')
    .select('status')
    .eq('id', appointmentId)
    .single();

  if (appt?.status === 'confirmed') {
    const { data: newRoom, error: createError } = await supabase
      .from('consultation_rooms')
      .insert({ appointment_id: appointmentId })
      .select('id, is_closed')
      .single();
    
    if (newRoom) return newRoom;
  }

  throw new Error(roomError?.message || 'No consultation room available for this appointment.');
}

export async function getAppointmentMessages(appointmentId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Optimized query: get room and its messages in one go
  const { data, error } = await supabase
    .from('consultation_rooms')
    .select(`
      id,
      is_closed,
      messages (
        id,
        sender_id,
        message,
        created_at,
        sender:sender_id(full_name)
      )
    `)
    .eq('appointment_id', appointmentId)
    .single();

  if (error || !data) {
    // If not found, try lazy creation (this will throw if it can't be created)
    const room = await getOrCreateRoom(appointmentId);
    return []; // Return empty messages since it's a new room
  }

  const messages = data.messages || [];
  return messages.map(row => ({
    id: row.id,
    room_id: data.id,
    is_closed: data.is_closed,
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

  // Ensure room exists
  const room = await getOrCreateRoom(appointmentId);
  if (room.is_closed) throw new Error('This consultation is closed.');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      room_id: room.id,
      sender_id: user.id,
      message: message,
    })
    .select('*, sender:sender_id(full_name)')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    room_id: data.room_id,
    sender_id: data.sender_id,
    sender_name: Array.isArray(data.sender) ? data.sender[0]?.full_name : data.sender?.full_name,
    is_mine: true,
    message: data.message,
    created_at: data.created_at,
  };
}
