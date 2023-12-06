'use client';
import { formatDate } from '@/utils/poemLibraryFunctions/formatDate';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import { hasUserResponded } from '@/utils/supabase/models/hasUserResponded';
import { Tooltip, Link } from '@nextui-org/react';
import { IoLogoYoutube } from 'react-icons/io5';
type PoemsType =
  | {
      link: string | undefined;
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
        .select('id, author, name, content, display_date, link')
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

              if (Array.isArray(hasResponded) && hasResponded.length > 0) {
                setHasResponded(true);
                setButtonText('Responses');
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
            window.location.href = `${poemid}/prompts`;
          } else {
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
              <div className='flex border-b-1 border-shadow-md  pb-1 border-connote_orange '>
                <div className='flex-grow'>
                  <p className='text-tiny font-bold'>
                    {formatDate(poemOfTheDay.display_date)}
                  </p>
                  <small className='text-connote_orange'>
                    {poemOfTheDay.author}
                  </small>
                  <h4 className='font-bold text-large pb-4 w-40'>
                    {poemOfTheDay.name}
                  </h4>
                </div>

                <div className='flex  items-center mt-auto pb-4'>
                  <button
                    className='button-respond'
                    onClick={handleButtonClick}
                  >
                    {buttonText}
                  </button>
                  <Tooltip
                    showArrow={true}
                    content='Watch on YouTube'
                    placement='top-start'
                  >
                    <Link
                      isExternal
                      href={poemOfTheDay.link}
                      color='warning'
                      aria-label='Watch on YouTube (opens in new tab)'
                    >
                      <IoLogoYoutube className='scale-150 ml-4' />
                    </Link>
                  </Tooltip>
                </div>
              </div>

              <br></br>

              <p className='w-full'>
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
