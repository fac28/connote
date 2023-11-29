'use client';
import React from 'react';
import { useState } from 'react';
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

export default function ResponsePage() {
  const params = useParams();
  const poemid = +params['poem-id'];
  const searchParams = useSearchParams();
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const promptNumber = Number(searchParams.get('prompt'));
  const [selectedPromptNumber, setSelectedPromptNumber] = useState<number>(
    promptNumber || 0
  );
  const router = useRouter();

  const { poem, prompts, responses } = useFetchResponsePageData(poemid);

  const updatedResponses = updateResponses012(poem[0], responses);
  const updatedPrompts = updatePrompts012(prompts);

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

  const handleLikeClick = (responseId: number) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [responseId]: (prevLikes[responseId] || 0) + 1,
    }));
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
                    .map((response) => (
                      <React.Fragment key={response.id}>
                        <div className='bg-connote_white p-4 mt-4 rounded-md flex justify-between shadow-inner'>
                          <div className='flex flex-col'>
                            <h2 className='responseUser text-connote_dark text-md '>
                              @{response.user?.username}
                            </h2>

                            <p className='responseComment text-connote_dark pr-3 text-sm'>
                              {response.response_written}
                            </p>
                          </div>
                          <div className='flex items-center flex-col'>
                            <Button
                              isIconOnly
                              color='danger'
                              aria-label='Like'
                              onClick={() => handleLikeClick(response.id)}
                            >
                              <HeartIcon />
                            </Button>
                            <span className='text-secondary'>
                              {likes[response.id] || 0}
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
      </div>
    </main>
  );
}
