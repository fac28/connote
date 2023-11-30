'use client';
import { useState, useEffect } from 'react';
import PoemCard from './PoemCard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PoemsType } from '@/types';
import { hasUserResponded } from '@/utils/supabase/models/hasUserResponded';

export default function CheckedPoems() {
  const [checkedPoems, setCheckedPoems] = useState<PoemsType>([]);
  const [userId, setUserId] = useState<string | null>(null);

  async function handleSubmit(poemid: number) {
    const supabase = createClientComponentClient();
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user?.id) {
      const userid = sessionData.session.user.id;
      const responses = (await hasUserResponded({ userid, poemid })) || [];
      if (responses.length) {
        window.location.href = `${poemid}/responses`;
      } else {
        window.location.href = `${poemid}/prompts`;
      }
    }
  }

  useEffect(() => {
    const fetchUserIdAndCheckedPoems = async () => {
      const supabase = createClientComponentClient();
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData?.session?.user?.id) {
        const userId = sessionData.session.user.id;
        setUserId(userId);

        // First, fetch the poem_ids from user_poem_checks
        const { data: checkedPoemIds, error: checkedPoemsError } =
          await supabase
            .from('user_poem_checks')
            .select('poem_id')
            .eq('user_id', userId)
            .eq('checked', true);

        if (checkedPoemsError) {
          console.error('Error fetching checked poems:', checkedPoemsError);
          return;
        }

        // Extract poem ids
        const poemIds = checkedPoemIds.map((item) => item.poem_id);

        // Now, fetch the poems using the ids
        const { data: poems, error: poemsError } = await supabase
          .from('poems')
          .select(
            `
            id,
            author,
            name,
            content,
            first_prompt_id,
            second_prompt_id,
            third_prompt_id,
            display_date,
            image
          `
          )
          .in('id', poemIds);

        if (poemsError) {
          console.error('Error fetching poems:', poemsError);
        } else {
          setCheckedPoems(poems);
        }
      }
    };

    fetchUserIdAndCheckedPoems();
  }, []);

  return (
    <div className='flex flex-col items-center'>
      <h1 className='sub-heading'>My Bookmarked Poems</h1>
      <div className='flex flex-wrap justify-center max-w-[1024px]'>
        {checkedPoems.map((poem) => (
          <span key={poem.id}>
            <PoemCard
              poemDate={poem.display_date}
              poemAuthor={poem.author}
              poemName={poem.name}
              poemImage={poem.image}
              poemId={poem.id}
              userId={userId}
              supabase={createClientComponentClient()}
              isResponded={true}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
