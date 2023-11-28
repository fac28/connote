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
                <p>promptid: {prompt.id}</p>
                <p>initialprompt: {prompt.initial_prompt}</p>
                <p>followupprompt: {prompt.follow_up_prompt}</p>
                <p>highlightingformat: {prompt.highlighting_format}</p>
                <br></br>
                {updatedResponses
                  .filter((response) => response.prompt_id === prompt.id)
                  .map((response) => (
                    <React.Fragment key={response.id}>
                      <p>response_selected: {response.response_selected}</p>
                      <div>
                        <h2>Username:{response.user?.username}</h2>

                        <p>Response: {response.response_written}</p>
                        <div></div>
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
