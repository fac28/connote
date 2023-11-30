import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export const fetchReacts = async (type: string, supabase: SupabaseClient) => {
  try {
    console.log("fetchReacts start")
    const { data, error } = await supabase
      .from('reacts')
      .select('response_id, type')
      .eq('type', type);

    if (error) {
      console.error('Error fetching react data:', error);
      throw new Error('Error fetching react data');
    }

    // Perform grouping manually
    const groupedData: { [key: number]: number } = data.reduce(
      (acc: { [key: number]: number }, item: { response_id: number }) => {
        const responseId = item.response_id;
        acc[responseId] = (acc[responseId] || 0) + 1;
        return acc;
      },
      {}
    );
    return groupedData;
  } catch (error) {
    console.error('Error fetching react data:', error);
    throw error;
  }
};
