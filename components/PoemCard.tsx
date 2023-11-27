import { Card, CardHeader, CardBody, Image, Checkbox } from '@nextui-org/react';
import { Bookmark } from './Bookmark';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import React, { useState, useEffect } from 'react';
import { fetchCheckedState } from '@/utils/supabase/models/fetchCheckedState';
import { checkPoem } from '@/utils/supabase/models/checkPoem';
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
    // Call fetchCheckedState from utils
    const initializeCheckedState = async () => {
      const checked = await fetchCheckedState(poemId, supabase, userId);
      setIsChecked(checked);
    };

    initializeCheckedState();
  }, [userId, poemId, supabase]);

  const handleCheckboxChange = async () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState); // Optimistically update the state

    try {
      await checkPoem(userId, poemId, newCheckedState, supabase);
    } catch (error) {
      // Revert on error
    }
  };

  return (
    <Card className='p-3 m-3 w-64 h-64 aspect-w-1 cursor-pointer bg-secondary'>
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
