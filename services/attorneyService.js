import { supabase } from './supabaseClient';

export async function getAttorneys() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url, attorney_profiles(firm_name, years_experience, specialties, consultation_fee, is_verified)')
    .eq('role', 'Attorney')
    .order('full_name', { ascending: true });

  if (error) throw new Error(error.message);

  return (data || []).map(row => {
    const ap = Array.isArray(row.attorney_profiles) ? row.attorney_profiles[0] : row.attorney_profiles;
    return { ...row, ...(ap || {}) };
  });
}
