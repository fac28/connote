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
} from '@/utils/responsePageHandling/mappingReponseDataTo012';
import { FaRegHeart, FaHeart } from 'react-icons/fa6';

import {
  addingHighlightAttribute,
  topThreeTextColours,
} from '@/utils/responsePageHandling/addingHighlightAttribute';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchReacts } from '@/utils/supabase/models/fetchReacts';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

export default function ResponsePage() {
  const params = useParams();
  const poemid = +params['poem-id'];
  const searchParams = useSearchParams();
  const promptNumber = Number(searchParams.get('prompt'));
  const [selectedPromptNumber, setSelectedPromptNumber] = useState<number>(
    promptNumber || 0
  );
  const [likedResponses, setLikedResponses] = useState<{
    [key: number]: boolean;
  }>({});
  const router = useRouter();

  const { poem, prompts, responses } = useFetchResponsePageData(poemid);

  let updatedResponses = updateResponses012(poem[0], responses);
  const updatedPrompts = updatePrompts012(prompts);

  updatedResponses = addingHighlightAttribute(updatedResponses);

  const [hearts, setHearts] = useState<{ [key: number]: number }>({});
  const [loadingHearts, setLoadingHearts] = useState(true);
  useEffect(() => {
    const fetchInitialHearts = async () => {
      try {
        const supabase = createClientComponentClient();
        const heartReacts = await fetchReacts('heart', supabase);
        setHearts(heartReacts);
        setLoadingHearts(false);
      } catch (error) {
        console.error('Error fetching initial hearts:', error);
        setLoadingHearts(false);
      }
    };
    fetchInitialHearts();
  }, [updatedResponses]);

  const handleHeartsClick = async (responseId: number, userId: string) => {
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase.from('reacts').insert([
        {
          response_id: responseId,
          type: 'heart',
          reacter_id: userId,
        },
      ]);
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

      setLikedResponses((prev) => ({
        ...prev,
        [responseId]: !prev[responseId],
      }));
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
    <main>
      {prompts.map((prompt, index) =>
        index === selectedPromptNumber ? (
          <h2 key={prompt.id} className='promptPurple w-full'>
            {prompt.initial_prompt}
          </h2>
        ) : null
      )}
      <div className='flex flex-col items-center justify-between p-4'>
        <ResponsePoem
          poem={poem}
          responses={updatedResponses}
          selectedPromptNumber={selectedPromptNumber}
        />
      </div>
      <h2 className='promptPurple w-full'>Responses</h2>
      <div className='flex flex-col items-center justify-between p-4'>
        <div className='flex flex-wrap max-w-xs'>
          {updatedPrompts.map(
            (prompt) =>
              prompt.id === selectedPromptNumber && (
                <span key={prompt.id}>
                  {updatedResponses
                    .filter((response) => response.prompt_id === prompt.id)
                    .map((response, index) => (
                      <React.Fragment key={response.id}>
                        <div className='bg-connote_white p-4 mt-4 rounded-md flex justify-between shadow-inner responseComment'>
                          <div className='flex flex-col'>
                            <h2
                              className={`${
                                topThreeTextColours[index]
                                  ? topThreeTextColours[index]
                                  : 'text-connote_dark'
                              } responseUser  text-md`}
                            >
                              @{response.user?.username}
                            </h2>

                            <p className=' text-connote_dark '>
                              {response.response_written}
                            </p>
                          </div>
                          <br />
                          <div className='flex items-center flex-col '>
                            {likedResponses[response.id] ? (
                              <FaHeart
                                className='text-red-500 hover:cursor-pointer'
                                onClick={() =>
                                  handleHeartsClick(
                                    response.id,
                                    response.user_id
                                  )
                                }
                              />
                            ) : (
                              <FaRegHeart
                                className='hover:cursor-pointer'
                                onClick={() =>
                                  handleHeartsClick(
                                    response.id,
                                    response.user_id
                                  )
                                }
                              />
                            )}

                            <span className='text-connote_dark text-tiny'>
                              {loadingHearts
                                ? 'Loading...'
                                : hearts[response.id] || 0}
                            </span>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                </span>
              )
          )}
        </div>

        <ButtonGroup className='mt-4'>
          <Button
            disabled={selectedPromptNumber === 0}
            onClick={handlePrevClick}
            className={`bg-connote_orange rounded-xl mx-12 ${
              selectedPromptNumber === 0
                ? 'text-gray-500 cursor-not-allowed'
                : ''
            }`}
          >
            <FaChevronLeft />
          </Button>
          <Button
            className='bg-connote_orange rounded-xl mx-12'
            onClick={handleNextClick}
          >
            {selectedPromptNumber === 2 ? 'Done' : <FaChevronRight />}
          </Button>
        </ButtonGroup>
      </div>
    </main>
  );
}
