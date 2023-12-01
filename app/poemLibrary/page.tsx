'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import PoemCard from '../../components/PoemCard';
import { PoemsType } from '@/types';
import { hasUserRespondedAll } from '@/utils/supabase/models/hasUserRespondedAll';

export default function PoemDirectory() {
  const [poems, setPoems] = useState<PoemsType>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isResponded, setIsResponded] = useState<boolean[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      const supabase = createClientComponentClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.id) {
        setUserId(sessionData.session.user.id);
        await fetchData(sessionData.session.user.id);
      } else await fetchData(null);
    };

    const currentDate = new Date();
    const fetchData = async (fetchedUserId: string | null) => {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('poems')
        .select(
          'id, author, name, content, first_prompt_id, second_prompt_id, third_prompt_id, display_date, image'
        )
        .order('display_date', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        const filteredPoems = data.filter(
          (poem) => new Date(poem.display_date) <= currentDate
        );
        setPoems(data);

        if (fetchUserId != null) {
          const IsRespondedArray = await hasUserRespondedAll(
            fetchedUserId,
            data
          );
          setIsResponded(IsRespondedArray);
        }
      }
    };
    fetchUserId();
  }, []);

  const filteredPoems = poems.filter(
    (poem) =>
      poem.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <h1 className='headingPurple'>Poem Library</h1>
        <div className='flex flex-col items-center'>
          <input
            type='text'
            placeholder='Search poems...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='p-3 mb-4 rounded-full w-72 bg-secondary'
          />
          <div className='flex flex-wrap justify-center max-w-[1024px]'>
            {filteredPoems.map((poem, index) => (
              <span key={poem.id}>
                <PoemCard
                  poemDate={poem.display_date}
                  poemAuthor={poem.author}
                  poemName={poem.name}
                  poemImage={poem.image}
                  poemId={poem.id}
                  userId={userId ? userId : null}
                  supabase={createClientComponentClient()}
                  key={poem.id}
                  isResponded={isResponded ? isResponded[index] : false}
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
