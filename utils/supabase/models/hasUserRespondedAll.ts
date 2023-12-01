import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PoemsType } from '@/types';

export async function hasUserRespondedAll(
  userId: string | null,
  poems: PoemsType
): Promise<boolean[]> {
  const supabase = createClientComponentClient();
  const { data: responses } = await supabase
    .from('responses')
    .select('poem_id')
    .eq('user_id', userId);

  // Create a Set of poem IDs that the user has responded to
  const respondedPoemIds = new Set(
    responses?.map((response) => response.poem_id)
  );

  // Map each poem to true or false depending on whether the user has responded
  const responseArray = poems.map((poem) => respondedPoemIds.has(poem.id));

  return responseArray;
}
