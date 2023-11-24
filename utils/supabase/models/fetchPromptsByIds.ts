import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export const fetchPromptsByIds = async (
  promptIds: number[],
  supabase: SupabaseClient
) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('id, initial_prompt, follow_up_prompt, highlighting_format')
    .in('id', promptIds);
  if (error || !data) {
    throw new Error('Error fetching prompt data');
  }
  return data;
};
