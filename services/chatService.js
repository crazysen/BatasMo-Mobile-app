import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_PREFIX = 'chat_thread_';

function buildThreadKey(threadId) {
  return `${CHAT_PREFIX}${String(threadId || 'general').trim()}`;
}

function nowTimeLabel() {
  return new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

export async function getThreadMessages(threadId) {
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

export async function appendThreadMessage(threadId, payload) {
  const key = buildThreadKey(threadId);
  const current = await getThreadMessages(threadId);

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

export async function ensureThreadSeed(threadId, seedMessages) {
  const existing = await getThreadMessages(threadId);
  if (existing.length > 0) {
    return existing;
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
  return normalizedSeed;
}
