export const checkPoem = async (
  userId: any,
  poemId: any,
  newCheckedState: any,
  supabase: any
) => {
  try {
    let updatedExistingRow = false;

    const { data: updateData, error: updateError } = await supabase
      .from('user_poem_checks')
      .update({ checked: newCheckedState })
      .match({ user_id: userId, poem_id: poemId });

    if (updateError) {
      throw updateError;
    }

    if (updateData) {
      updatedExistingRow = true;
    }

    if (!updatedExistingRow) {
      const { error: insertError } = await supabase
        .from('user_poem_checks')
        .insert([
          { user_id: userId, poem_id: poemId, checked: newCheckedState },
        ]);

      if (insertError) throw insertError;
    }
  } catch (error) {
    throw error;
  }
};
