'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { hasUserResponded } from '@/utils/supabase/models/hasUserResponded';
import PoemCard from '../../components/PoemCard';

type PoemsType =
  | Array<{
      id: number;
      author: string;
      name: string;
      content: string;
      first_prompt_id: number;
      second_prompt_id: number;
      third_prompt_id: number;
      display_date: string;
    }>
  | [];

export default function PoemDirectory() {
  const [poems, setPoems] = useState<PoemsType>([]);

  useEffect(() => {
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

  return (
    <>
      <h1>Poems list:</h1>
      <div className='flex flex-wrap'>
        {poems.map((poem) => (
          // eslint-disable-next-line react/jsx-key
          <span onClick={() => handleSubmit(poem.id)}>
            <PoemCard
              key={poem.id}
              poemDate={poem.display_date}
              poemAuthor={poem.author}
              poemName={poem.name}
              poemImage='https://images.unsplash.com/photo-1575707751065-42256084fbb7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />
          </span>
        ))}
      </div>
    </>
  );
}
