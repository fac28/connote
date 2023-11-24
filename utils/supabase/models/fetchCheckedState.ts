export const fetchCheckedState = async (
  poemId: any,
  supabase: any,
  userId: any
) => {
  try {
    const { data, error } = await supabase
      .from('user_poem_checks')
      .select('checked')
      .eq('user_id', userId)
      .eq('poem_id', poemId);

    if (error) throw error;

    return data && data.length > 0 ? data[0].checked : false;
  } catch (error) {
    console.error('Error fetching checked state:', error);
    throw error;
  }
};
