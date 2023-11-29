'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Button, ButtonGroup } from '@nextui-org/react';
import useFetchResponsePageData from '@/utils/supabase/models/fetchResponsePageData';
import ResponsePoem from '@/components/ResponsePoem';
import { useRouter } from 'next/navigation';
import {
  updatePrompts012,
  updateResponses012,
} from '@/utils/supabase/models/mappingReponseDataTo012';
import HeartIcon from '@/components/HeartIcon';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchReacts } from '@/utils/supabase/models/fetchReacts';

export default function ResponsePage() {
  const params = useParams();
  const poemid = +params['poem-id'];
  const searchParams = useSearchParams();
  const promptNumber = Number(searchParams.get('prompt'));
  const [selectedPromptNumber, setSelectedPromptNumber] = useState<number>(
    promptNumber !== undefined ? promptNumber + 1 : 0
  );
  const router = useRouter();

  const { poem, prompts, responses } = useFetchResponsePageData(poemid);

  const updatedResponses = updateResponses012(poem[0], responses);
  const updatedPrompts = updatePrompts012(prompts);

  const [hearts, setHearts] = useState<{ [key: number]: number }>({});
  const [loadingHearts, setLoadingHearts] = useState(true);
  useEffect(() => {
    const fetchInitialHearts = async () => {
      try {
        const supabase = createClientComponentClient();
        const heartReacts = await fetchReacts('heart', supabase);

        // console.log(heartReacts);
        setHearts(heartReacts);
        setLoadingHearts(false);
      } catch (error) {
        console.error('Error fetching initial hearts:', error);
        setLoadingHearts(false);
      }
    };
    fetchInitialHearts();
  }, [updatedResponses]);
  const handleHeartsClick = async (responseId: number) => {
    try {
      const supabase = createClientComponentClient();

      // Insert a new row into the 'reacts' table
      const { data, error } = await supabase.from('reacts').insert([
        {
          response_id: responseId,
          type: 'heart',
        },
      ]);

      // Fetch the updated count of hearts from the database
      const { data: updatedHearts, error: fetchError } = await supabase
        .from('reacts')
        .select('response_id, count', { count: 'exact' })
        .eq('response_id', responseId)
        .eq('type', 'heart')
        .single();

      if (updatedHearts) {
        setHearts((prevHearts) => ({
          ...prevHearts,
          [responseId]: updatedHearts.count || 0,
        }));
      }
    } catch (error) {
      console.error('Error adding heart:', error);
    }
  };

  const setPromptNumber = (number: number) => {
    setSelectedPromptNumber(number);
    const newQueryParams = new URLSearchParams(window.location.search);
    newQueryParams.set('prompt', String(number));
    router.push(`${window.location.pathname}?${newQueryParams.toString()}`);
  };

  const handlePrevClick = () => {
    if (selectedPromptNumber > 0) {
      setPromptNumber(selectedPromptNumber - 1);
    }
  };

  const handleNextClick = () => {
    if (selectedPromptNumber < 2) {
      setPromptNumber(selectedPromptNumber + 1);
    } else {
      handleDone();
    }
  };

  const handleDone = () => {
    console.log('handle redirecting after you`ve looked through comments');
  };

  return (
    <main className='flex flex-col items-center justify-between p-4'>
      <ResponsePoem
        poem={poem}
        responses={updatedResponses}
        selectedPromptNumber={selectedPromptNumber}
      />

      <div className='flex flex-wrap md:max-w-xs'>
        {updatedPrompts.map(
          (prompt) =>
            prompt.id === selectedPromptNumber && (
              <span key={prompt.id}>
                {updatedResponses
                  .filter((response) => response.prompt_id === prompt.id)
                  .map((response) => (
                    <React.Fragment key={response.id}>
                      <div className='bg-connote_white p-4 mt-4 rounded-md flex justify-between shadow-inner'>
                        <div className='flex flex-col'>
                          <h2 className='text-connote_orange text-lg '>
                            @{response.user?.username}
                          </h2>

                          <p className='italic text-connote_dark pr-3'>
                            {response.response_written}
                          </p>
                        </div>
                        <div className='flex items-center flex-col'>
                          <Button
                            isIconOnly
                            color='danger'
                            aria-label='Like'
                            onClick={() => handleHeartsClick(response.id)}
                          >
                            <HeartIcon />
                          </Button>
                          {/* <span className='text-connote_dark'>
                            {hearts[response.id] || 0}
                            response id {response.id}
                          </span> */}
                          <span className='text-connote_dark'>
                            {loadingHearts
                              ? 'Loading...'
                              : hearts[response.id] || 0}
                          </span>
                        </div>
                      </div>
                      <br />
                    </React.Fragment>
                  ))}
              </span>
            )
        )}
      </div>

      <ButtonGroup>
        <Button
          disabled={selectedPromptNumber === 0}
          onClick={handlePrevClick}
          className={`${
            selectedPromptNumber === 0
              ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
              : ''
          }`}
        >
          Prev
        </Button>
        <Button onClick={handleNextClick}>
          {selectedPromptNumber === 2 ? 'Done' : 'Next'}
        </Button>
      </ButtonGroup>
    </main>
  );
}
