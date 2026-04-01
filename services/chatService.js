import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAppointmentMessages, sendAppointmentMessage} from './messageService';

const CHAT_PREFIX = 'chat_thread_';

function buildThreadKey(threadId) {
  return `${CHAT_PREFIX}${String(threadId || 'general').trim()}`;
}

function nowTimeLabel() {
  return new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

function normalizeIsMine(value) {
  if (value === true || value === 1 || value === '1') return true;
  if (typeof value === 'string') {
    const lowered = value.trim().toLowerCase();
    return lowered === 'true' || lowered === 'yes';
  }
  return false;
}

function mapApiMessage(item) {
  const createdAt = item?.created_at || new Date().toISOString();
  const isMine = normalizeIsMine(item?.is_mine);
  return {
    id: String(item?.id || `${Date.now()}-${Math.floor(Math.random() * 1000)}`),
    text: String(item?.message || item?.text || ''),
    sender: isMine ? 'me' : 'client',
    time: new Date(createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
    created_at: createdAt,
  };
}

async function getLocalThreadMessages(threadId) {
  const key = buildThreadKey(threadId);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

async function appendLocalThreadMessage(threadId, payload) {
  const key = buildThreadKey(threadId);
  const current = await getLocalThreadMessages(threadId);

  const message = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    text: String(payload?.text || '').trim(),
    sender: payload?.sender === 'me' ? 'me' : 'client',
    time: payload?.time || nowTimeLabel(),
    created_at: new Date().toISOString(),
  };

  if (!message.text) {
    return current;
  }

  const next = [...current, message];
  await AsyncStorage.setItem(key, JSON.stringify(next));
  return next;
}

export async function getThreadMessages(threadId) {
  try {
    const rows = await getAppointmentMessages(threadId);
    if (Array.isArray(rows)) {
      return {
        messages: rows.map(mapApiMessage),
        isClosed: rows.length > 0 ? rows[0].is_closed : false,
      };
    }
    return { messages: [], isClosed: false };
  } catch (_) {
    const local = await getLocalThreadMessages(threadId);
    return { messages: local, isClosed: false };
  }
}

export async function appendThreadMessage(threadId, payload) {
  const text = String(payload?.text || '').trim();
  if (!text) {
    return getThreadMessages(threadId);
  }

  try {
    await sendAppointmentMessage(threadId, text);
    return getThreadMessages(threadId);
  } catch (_) {
    await appendLocalThreadMessage(threadId, payload);
    return getThreadMessages(threadId);
  }
}

export async function ensureThreadSeed(threadId, seedMessages) {
  try {
    return await getThreadMessages(threadId);
  } catch (_) {
    const existing = await getLocalThreadMessages(threadId);
    if (existing.length > 0) {
      return { messages: existing, isClosed: false };
    }

    const normalizedSeed = (Array.isArray(seedMessages) ? seedMessages : []).map((item, index) => ({
      id: item?.id || `seed-${index + 1}`,
      text: String(item?.text || ''),
      sender: item?.sender === 'me' ? 'me' : 'client',
      time: item?.time || nowTimeLabel(),
      created_at: item?.created_at || new Date().toISOString(),
    }));

    const key = buildThreadKey(threadId);
    await AsyncStorage.setItem(key, JSON.stringify(normalizedSeed));
    return { messages: normalizedSeed, isClosed: false };
  }
}
