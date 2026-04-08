import { readAsStringAsync } from 'expo-file-system/legacy';
import { supabase } from './supabaseClient';
import { bucketForMessageType, validateAttachment } from './chatTypes';

/**
 * Read a picked file into an ArrayBuffer. `fetch(uri)` is unreliable for Android
 * `content://` URIs and can return an empty body, which uploads as a blank image.
 */
async function readLocalFileAsArrayBuffer(uri) {
  const u = String(uri || '');
  if (u.startsWith('http://') || u.startsWith('https://')) {
    const response = await fetch(u);
    if (!response.ok) {
      throw new Error('Could not download file.');
    }
    const buf = await response.arrayBuffer();
    if (!buf?.byteLength) {
      throw new Error('Downloaded file was empty.');
    }
    return buf;
  }

  const base64 = await readAsStringAsync(u, {
    encoding: 'base64',
  });
  if (!base64?.length) {
    throw new Error('Could not read the selected file from this device.');
  }
  const binaryString = global.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getOrCreateRoom(appointmentId) {
  const { data: room, error: roomError } = await supabase
    .from('consultation_rooms')
    .select('id, is_closed')
    .eq('appointment_id', appointmentId)
    .single();

  if (room) return room;

  const { data: appt, error: apptError } = await supabase
    .from('appointments')
    .select('status')
    .eq('id', appointmentId)
    .single();

  const okStatus =
    appt?.status === 'confirmed' ||
    appt?.status === 'rescheduled';
  if (okStatus) {
    const { data: newRoom, error: createError } = await supabase
      .from('consultation_rooms')
      .insert({ appointment_id: appointmentId })
      .select('id, is_closed')
      .single();

    if (newRoom) return newRoom;
  }

  throw new Error(roomError?.message || 'No consultation room available for this appointment.');
}

function mapRow(row, roomId, isClosed, userId) {
  return {
    id: row.id,
    room_id: roomId,
    is_closed: isClosed,
    sender_id: row.sender_id,
    sender_name: Array.isArray(row.sender) ? row.sender[0]?.full_name : row.sender?.full_name,
    is_mine: row.sender_id === userId,
    message: row.message ?? '',
    message_type: row.message_type || 'text',
    file_bucket: row.file_bucket ?? null,
    file_path: row.file_path ?? null,
    file_name: row.file_name ?? null,
    mime_type: row.mime_type ?? null,
    file_size_bytes: row.file_size_bytes ?? null,
    created_at: row.created_at,
  };
}

export async function getAppointmentMessages(appointmentId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('consultation_rooms')
    .select(`
      id,
      is_closed,
      messages (
        id,
        sender_id,
        message,
        message_type,
        file_bucket,
        file_path,
        file_name,
        mime_type,
        file_size_bytes,
        created_at,
        sender:sender_id(full_name)
      )
    `)
    .eq('appointment_id', appointmentId)
    .single();

  if (error || !data) {
    const room = await getOrCreateRoom(appointmentId);
    return [];
  }

  const list = (data.messages || []).slice().sort((a, b) =>
    String(a.created_at).localeCompare(String(b.created_at)),
  );

  return list.map(row => mapRow(row, data.id, data.is_closed, user.id));
}

export async function sendAppointmentMessage(appointmentId, text) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const room = await getOrCreateRoom(appointmentId);
  if (room.is_closed) throw new Error('This consultation is closed.');

  const body = String(text ?? '').trim();
  if (!body) throw new Error('Message cannot be empty.');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      room_id: room.id,
      sender_id: user.id,
      message: body,
      message_type: 'text',
    })
    .select('*, sender:sender_id(full_name)')
    .single();

  if (error) throw new Error(error.message);

  return mapRow(data, room.id, room.is_closed, user.id);
}

/**
 * Upload file from device URI then insert message row.
 * @param {string} appointmentId
 * @param {{ uri: string, fileName: string, mime: string, size: number, caption?: string }} asset
 */
export async function uploadAndSendChatAttachment(appointmentId, asset) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const mime = String(asset.mime || 'application/octet-stream').toLowerCase();
  const size = Number(asset.size) || 0;
  const v = validateAttachment(size, mime);
  if (!v.ok) throw new Error(v.error);

  const room = await getOrCreateRoom(appointmentId);
  if (room.is_closed) throw new Error('This consultation is closed.');

  const bucket = bucketForMessageType(mime);
  const messageType = mime.startsWith('image/') ? 'image' : 'file';
  const ext =
    asset.fileName?.split('.').pop() ||
    (messageType === 'image' ? 'jpg' : 'bin');
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const path = `${appointmentId}/${user.id}/${safeName}`;

  const arrayBuffer = await readLocalFileAsArrayBuffer(asset.uri);
  const actualSize = arrayBuffer.byteLength;
  if (actualSize === 0) {
    throw new Error('The selected file is empty or unreadable.');
  }
  const vSize = validateAttachment(actualSize, mime);
  if (!vSize.ok) {
    throw new Error(vSize.error);
  }

  const { error: upErr } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, {
      contentType: mime,
      upsert: false,
    });

  if (upErr) throw new Error(upErr.message);

  const caption = String(asset.caption ?? '').trim();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      room_id: room.id,
      sender_id: user.id,
      message: caption || (messageType === 'image' ? 'Photo' : 'Attachment'),
      message_type: messageType,
      file_bucket: bucket,
      file_path: path,
      file_name: asset.fileName || safeName,
      mime_type: mime,
      file_size_bytes: actualSize,
    })
    .select('*, sender:sender_id(full_name)')
    .single();

  if (error) throw new Error(error.message);

  return mapRow(data, room.id, room.is_closed, user.id);
}

export async function getSignedUrlForMessage(msg) {
  if (!msg?.file_bucket || !msg?.file_path) return null;
  const { data, error } = await supabase.storage
    .from(msg.file_bucket)
    .createSignedUrl(msg.file_path, 3600);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/**
 * Subscribe to new messages for an appointment's room. Calls onInsert with enriched row map.
 * @returns {Promise<() => void>}
 */
export async function subscribeToRoomMessages(appointmentId, onInsert) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const room = await getOrCreateRoom(appointmentId);

  const channel = supabase
    .channel(`chat-room:${room.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${room.id}`,
      },
      async payload => {
        const row = payload.new;
        if (!row?.id) return;

        const { data: prof } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', row.sender_id)
          .single();

        const mapped = mapRow(
          {
            ...row,
            sender: prof ? { full_name: prof.full_name } : null,
          },
          room.id,
          room.is_closed,
          user.id,
        );
        onInsert(mapped);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
