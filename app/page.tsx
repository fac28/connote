'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';
import { useEffect, useState } from 'react';

type PoemsType =
  | {
      id: number;
      author: string;
      name: string;
      content: string;
      display_date: string;
    }
  | undefined;

export default function Home() {
  const [poemOfTheDay, setPoemOfTheDay] = useState<PoemsType>(undefined);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    const fetchData = async () => {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('poems')
        .select('id, author, name, content, display_date')
        .eq('display_date', formattedDate);

      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        if (data && data.length > 0) {
          setPoemOfTheDay(data[0]);
        } else {
          console.error('No poem found for the current date');
        }
      }
    };

    fetchData();
  }, [setPoemOfTheDay]);

  return (
    <main>
      {' '}
      <h1 className='headingPurple'>Poem of the day</h1>
      <div className='dark flex min-h-screen flex-col items-center justify-between pt-10'>
        <div>
          {poemOfTheDay && (
            <>
              <p className='text-tiny uppercase font-bold'>
                {poemOfTheDay.display_date}
              </p>
              <small className='text-default-500'>{poemOfTheDay.author}</small>
              <h4 className='font-bold text-large'>{poemOfTheDay.name}</h4>
              <br></br>
              <p>
                {poemOfTheDay.content
                  .split('\n\n')
                  .map((stanza: string, index: number) => (
                    <React.Fragment key={index}>
                      {stanza.split('\n').map((line, lineIndex) => (
                        <React.Fragment key={lineIndex}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                      <br />
                    </React.Fragment>
                  ))}
              </p>
            </>
          )}
          <br></br>
        </div>
      </div>
    </main>
  );
}
