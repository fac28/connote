export const submitPromptsData = async (
  userId: any,
  poemId: any,
  promptId: any,
  response_selected: any,
  supabase: any
) => {
  try {
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
