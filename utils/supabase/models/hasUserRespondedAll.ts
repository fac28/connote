import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PoemsType } from '@/types';

export async function hasUserRespondedAll(
  userId: string | null,
  poems: PoemsType
): Promise<boolean[]> {
  const supabase = createClientComponentClient();
  if (!userId || poems.length === 0) {
    return poems.map(() => false);
  }

  const poemIds = poems.map((poem) => poem.id);
  const { data: responses } = await supabase
    .from('responses')
    .select('poem_id')
    .in('poem_id', poemIds)
    .eq('user_id', userId);

  const respondedPoemIds = new Set(
    responses?.map((response) => response.poem_id)
  );
  return poems.map((poem) => respondedPoemIds.has(poem.id));
}
