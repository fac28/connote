'use client';
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@nextui-org/react';
import { ResponsesType, PromptsType } from '@/types';
import { FaRegHeart, FaHeart } from 'react-icons/fa6';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { topThreeTextColours } from '@/utils/responsePageHandling/addingHighlightAttribute';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchReacts } from '@/utils/supabase/models/fetchReacts';

type ResponsesSectionProps = {
  reupdatedResponses: ResponsesType;
  updatedPrompts: PromptsType;
  selectedPromptNumber: number;
  handlePrevClick: () => void;
  handleNextClick: () => void;
};

export default function ResponsesSection({
  reupdatedResponses,
  updatedPrompts,
  selectedPromptNumber,
  handlePrevClick,
  handleNextClick,
}: ResponsesSectionProps) {
  const [hearts, setHearts] = useState<{ [key: number]: number }>({});
  const [loadingHearts, setLoadingHearts] = useState(true);
  const [likedResponses, setLikedResponses] = useState<{
    [key: number]: boolean;
  }>({});

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
  }, [reupdatedResponses]);

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

  return (
    <div className='flex flex-col items-center justify-between p-4'>
      <div className='flex flex-wrap max-w-xs'>
        {updatedPrompts.map(
          (prompt) =>
            prompt.id === selectedPromptNumber && (
              <span key={prompt.id}>
                {reupdatedResponses
                  .filter((response) => response.prompt_id === prompt.id)
                  .sort((a, b) => (hearts[b.id] || 0) - (hearts[a.id] || 0))
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
                                handleHeartsClick(response.id, response.user_id)
                              }
                            />
                          ) : (
                            <FaRegHeart
                              className='hover:cursor-pointer'
                              onClick={() =>
                                handleHeartsClick(response.id, response.user_id)
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
            selectedPromptNumber === 0 ? 'text-gray-500 cursor-not-allowed' : ''
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
  );
}
