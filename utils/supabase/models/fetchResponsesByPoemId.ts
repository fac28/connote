import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export const fetchResponsesByPoemId = async (
  poemId: number,
  supabase: SupabaseClient
) => {
  const { data, error } = await supabase
    .from('responses')
    .select(
      'id, poem_id,prompt_id,  response_selected, response_written, user_id'
    )
    .eq('poem_id', poemId);

  if (error || !data) {
    throw new Error('Error fetching response data');
  }

  return data;
};
