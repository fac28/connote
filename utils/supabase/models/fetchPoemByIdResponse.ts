import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export const fetchPoemByIdResponse = async (
  poemId: number,
  supabase: SupabaseClient
) => {
  const { data, error } = await supabase
    .from('poems')
    .select(
      'id, author, name, content, first_prompt_id, second_prompt_id, third_prompt_id, display_date'
    )
    .eq('id', poemId);

  if (error || !data || data.length === 0) {
    console.error(
      'Error fetching poem data:',
      error?.message || 'No poem data found'
    );
    return null;
  }

  const promptOrder = [
    data[0].first_prompt_id,
    data[0].second_prompt_id,
    data[0].third_prompt_id,
  ];

  return { ...data[0], promptOrder };
};
