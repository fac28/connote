'use client';
import { formatDate } from '@/utils/poemLibraryFunctions/formatDate';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import { hasUserResponded } from '@/utils/supabase/models/hasUserResponded';

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
  const [hasResponded, setHasResponded] = useState(false);
  const [buttonText, setButtonText] = useState<string>('Respond');

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

          const poemid = data[0].id;
          const { data: sessionData } = await supabase.auth.getSession();

          if (sessionData?.session?.user?.id) {
            const userid = sessionData.session.user.id;

            try {
              const hasResponded = await hasUserResponded({ userid, poemid });
              console.log('Has Responded:', hasResponded);

              if (Array.isArray(hasResponded) && hasResponded.length > 0) {
                setHasResponded(true);
                setButtonText('View Responses');
              }
            } catch (error) {
              console.error('Error checking user response:', error);
            }
          }
        } else {
          console.error('No poem found for the current date');
        }
      }
    };

    fetchData();
  }, [setPoemOfTheDay]);

  const handleButtonClick = async () => {
    const poemid = poemOfTheDay?.id;
    if (poemid) {
      const supabase = createClientComponentClient();
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData?.session?.user?.id) {
        const userid = sessionData.session.user.id;

        try {
          const hasResponded = await hasUserResponded({ userid, poemid });

          if (Array.isArray(hasResponded) && hasResponded.length === 0) {
            console.log('User has not responded. Redirecting to prompts.');

            window.location.href = `${poemid}/prompts`;
          } else {
            console.log('User has responded. Redirecting to responses.');
            window.location.href = `${poemid}/responses`;
          }
        } catch (error) {
          console.error('Error checking user response:', error);
        }
      } else {
        window.location.href = `/account`;
      }
    }
  };

  return (
    <main>
      <h1 className='headingPurple'>Poem of the day</h1>
      <div className='dark flex flex-col min-h-screen items-center justify-between pt-10'>
        <div>
          {poemOfTheDay && (
            <>
              <div className='flex flex-col  border-b pb-4 border-connote_orange'>
                <div className='w-56'>
                  <p className='text-tiny font-bold'>
                    {formatDate(poemOfTheDay.display_date)}
                  </p>
                  <small className='text-default-500'>
                    {poemOfTheDay.author}
                  </small>
                  <h4 className='font-bold text-large w-56 pb-4'>
                    {poemOfTheDay.name}
                  </h4>
                  <div>
                    <button
                      className='button-respond'
                      onClick={handleButtonClick}
                    >
                      {buttonText}
                    </button>
                  </div>
                </div>
              </div>

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
