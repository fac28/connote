export const submitPromptsData = async (
  userId: any,
  poemId: any,
  promptId: any,
  response_selected: any,
  response_written: any,
  supabase: any
) => {
  try {
    const { data, error } = await supabase.from('responses').insert([
      {
        user_id: userId,
        poem_id: poemId,
        prompt_id: promptId,
        response_selected: response_selected,
        response_written: response_written,
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
