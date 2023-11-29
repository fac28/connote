import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export const fetchReacts = async (type: string, supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from('reacts')
    .select('response_id, type, count(*) as reaction_count')
    .eq('type', type)
    .group_by('response_id');

  if (error || !data) {
    throw new Error('Error fetching react data');
  }

  return data;
};
