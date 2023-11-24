import { Card, CardHeader, CardBody, Image, Checkbox } from '@nextui-org/react';
import { Bookmark } from './Bookmark';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import React, { useState, useEffect } from 'react';

type children = {
  poemDate: string;
  poemAuthor: string;
  poemName: string;
  poemImage: string;
  poemId: number;
  userId: string | null;
  supabase: SupabaseClient;
};

export default function PoemCard({
  poemDate,
  poemAuthor,
  poemName,
  poemImage,
  poemId,
  supabase,
  userId,
}: children) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchCheckedState = async () => {
      try {
        const { data, error } = await supabase
          .from('user_poem_checks')
          .select('checked')
          .eq('user_id', userId)
          .eq('poem_id', poemId);

        if (error) throw error;

        // Check if any data was returned
        if (data && data.length > 0) {
          setIsChecked(data[0].checked);
        } else {
          // No rows found, meaning the poem has not been checked by this user
          setIsChecked(false);
        }
      } catch (error) {
        console.error('Error fetching checked state:', error);
      }
    };

    fetchCheckedState();
  }, [userId, poemId, supabase]);

  const handleCheckboxChange = async () => {
    const newCheckedState = !isChecked;

    // Optimistically update the UI
    setIsChecked(newCheckedState);

    try {
      let updatedExistingRow = false;

      // Try to update the existing row
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

      // If no existing row was updated, insert a new row
      if (!updatedExistingRow) {
        const { error: insertError } = await supabase
          .from('user_poem_checks')
          .insert([
            { user_id: userId, poem_id: poemId, checked: newCheckedState },
          ]);

        if (insertError) throw insertError;
      }
    } catch (error) {}
  };

  return (
    <Card className='p-3 m-3 w-64 h-64 aspect-w-1 cursor-pointer'>
      <CardHeader className='pt-2 px-4 flex-col items-start'>
        <div className='flex'>
          <p className='text-tiny uppercase font-bold'>{poemDate}</p>

          <Checkbox
            radius='full'
            isSelected={!isChecked}
            icon={Bookmark}
            color='default'
            className='ml-28'
            onChange={handleCheckboxChange}
          ></Checkbox>
        </div>
        <small className='text-default-500'>{poemAuthor}</small>

        <h4 className='font-bold text-large'>{poemName}</h4>
      </CardHeader>

      <CardBody className='overflow-hidden relative rounded-xl '>
        <div className='absolute top-0 left-0 right-0 bottom-0 rounded-xl overflow-hidden'>
          <Image
            alt='Card background'
            className='object-contain '
            src={poemImage}
          />
        </div>
      </CardBody>
    </Card>
  );
}
