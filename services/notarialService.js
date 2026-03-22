import { supabase } from './supabaseClient';

export function resolveNotarialDocumentUrl(documentUrl) {
  const rawUrl = String(documentUrl || '').trim();
  if (!rawUrl) return '';
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;

  // For Supabase storage, get the public URL
  const { data } = supabase.storage.from('documents').getPublicUrl(rawUrl);
  return data?.publicUrl || rawUrl;
}

export async function getNotarialRequests() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('notarial_requests')
    .select(`
      *,
      client:client_id (full_name),
      attorney:attorney_id (full_name)
    `)
    .or(`client_id.eq.${user.id},attorney_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map(row => ({
    ...row,
    client_name: Array.isArray(row.client) ? row.client[0]?.full_name : row.client?.full_name,
    attorney_name: Array.isArray(row.attorney) ? row.attorney[0]?.full_name : row.attorney?.full_name,
  }));
}

export async function createNotarialRequest(payload) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let documentUrl = payload.document_url;

  // IMPORTANT: For Base64 documents in React Native and Supabase Storage,
  // we recommend using the `expo-file-system` or `base64-arraybuffer` package 
  // to properly upload to Supabase storage buckets.
  // For now, if your backend supported massive Base64 strings, we will just prefix it as a data URI
  // to circumvent the missing Laravel storage API, or assume the client uploaded it using Edge Functions.
  if (!documentUrl && payload.document_base64) {
    documentUrl = `data:application/pdf;base64,${payload.document_base64}`;
  }

  const { data, error } = await supabase
    .from('notarial_requests')
    .insert({
      client_id: user.id,
      attorney_id: payload.attorney_id || null,
      service_type: payload.service_type,
      details: payload.details || null,
      document_url: documentUrl,
      preferred_date: payload.preferred_date || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateNotarialRequestStatus(requestId, status) {
  const { data, error } = await supabase
    .from('notarial_requests')
    .update({ 
      status: String(status).toLowerCase(), 
      updated_at: new Date().toISOString() 
    })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
