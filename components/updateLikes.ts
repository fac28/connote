export const updateLikes = async (
  responseId: number,
  //   likes: number,
  supabase: any
) => {
  try {
    const { data, error } = await supabase
      .from('responses')
      .update([
        {
          //   likes: likes,
          likes: supabase.sql`likes + 1`,
        },
      ])
      .eq('id', responseId);

    console.error('ri', responseId);
    // console.error('likes', likes);
    console.error('data', data);

    // Fetch the updated data after the update operation
    const { data: updatedData, error: fetchError } = await supabase
      .from('responses')
      .select('*')
      .eq('id', responseId);

    if (fetchError) {
      console.error('Error updating likes:', fetchError);

      throw new Error('Failed to update likes');
    }

    return updatedData;
  } catch (error) {
    console.error('Error in updateLikes function:', error);

    throw error;
  }
};
