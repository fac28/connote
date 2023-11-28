'use client';
import React from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Button, ButtonGroup } from '@nextui-org/react';
import useFetchResponsePageData from '@/utils/supabase/models/fetchResponsePageData';
import ResponsePoem from '@/components/ResponsePoem';
import { useRouter } from 'next/navigation';

export default function ResponsePage() {
  const params = useParams();
  const poemid = +params['poem-id'];
  const searchParams = useSearchParams();
  const promptNumber = Number(searchParams.get('prompt'));
  const [selectedPromptNumber, setSelectedPromptNumber] = useState<number>(
    promptNumber || 0
  );
  const router = useRouter();

  const { poem, prompts, responses } = useFetchResponsePageData(poemid);

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
      <ResponsePoem poem={poem} />

      <div className='flex flex-wrap md:max-w-xs'>
        {prompts.map((prompt, index) => {
          const matchingResponse = responses.find(
            (response) => response.prompt_id === prompt.id
          );

          return (
            index === Number(selectedPromptNumber) && (
              <span key={prompt.id}>
                <p>promptid: {prompt.id}</p>
                <p>initialprompt: {prompt.initial_prompt}</p>
                <p>followupprompt: {prompt.follow_up_prompt}</p>
                <p>highlightingformat: {prompt.highlighting_format}</p>
                <p>
                  response_selected:{' '}
                  {matchingResponse ? matchingResponse.response_selected : ''}
                </p>
                <p>
                  response_written:{' '}
                  {matchingResponse ? matchingResponse.response_written : ''}
                </p>
                <br></br>
              </span>
            )
          );
        })}
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
