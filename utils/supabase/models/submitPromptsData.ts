export const submitPromptsData = async (
  userId: any,
  poemId: any,
  promptId: any,
  response_selected: any,
  supabase: any
) => {
  try {
    // Check if a row already exists with the specified criteria
    const { data: existingRow, error: selectError } = await supabase
      .from('responses')
      .select()
      .eq('user_id', userId)
      .eq('poem_id', poemId)
      .eq('prompt_id', promptId)
      .single();

    if (selectError) {
      throw selectError;
    }

    // If a matching row exists, do not insert a new one
    if (existingRow) {
      console.log('Row already exists:', existingRow);
      return;
    }

    // Insert a new row if no matching row exists
    const { data, error } = await supabase.from('responses').insert([
      {
        user_id: userId,
        poem_id: poemId,
        prompt_id: promptId,
        response_selected: response_selected,
      },
    ]);

    if (error) {
      throw error;
    }
  } catch (error) {
    // Handle the error
    throw error;
  }
};
