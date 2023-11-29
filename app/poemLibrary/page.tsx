'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import PoemCard from '../../components/PoemCard';
import { PoemsType } from '@/types';

export default function PoemDirectory() {
  const [poems, setPoems] = useState<PoemsType>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const supabase = createClientComponentClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.id) {
        setUserId(sessionData.session.user.id);
      }
    };
    fetchUserId();
    const currentDate = new Date();
    const fetchData = async () => {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('poems')
        .select(
          'id, author, name, content, first_prompt_id, second_prompt_id, third_prompt_id, display_date'
        )
        .order('display_date', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        const filteredPoems = data.filter(
          (poem) => new Date(poem.display_date) <= currentDate
        );
        setPoems(data); //Change this to filtered poems for production.
      }
    };
    fetchData();
  }, [setPoems]);

  return (
    <>
      <div>
        <h1 className='headingPurple'>Poem Library</h1>
        <div className='flex flex-col items-center'>
          <div className='flex flex-wrap justify-center'>
            {poems.map((poem, userid) => (
              <span key={poem.id}>
                <PoemCard
                  poemDate={poem.display_date}
                  poemAuthor={poem.author}
                  poemName={poem.name}
                  poemImage='https://images.unsplash.com/photo-1575707751065-42256084fbb7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  poemId={poem.id}
                  userId={userId}
                  supabase={createClientComponentClient()}
                  key={poem.id}
                  // onClick={() => handleSubmit(poem.id)}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
