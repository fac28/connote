'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, ButtonGroup } from '@nextui-org/react';
import FollowupPrompt from '@/components/FollowupPrompt';
import useFetchPromptPageData from '@/utils/supabase/models/fetchPromptPageData';

export default function PromptPage() {
  const params = useParams();
  const poemid = +params['poem-id'];

  const searchParams = useSearchParams();
  const promptNumber = Number(searchParams.get('prompt'));

  const [selectedPromptNumber, setSelectedPromptNumber] = useState<number>(
    promptNumber || 1
  );

  const [promptInputs, setPromptInputs] = useState<Record<string, string>>({});

  const { poem, prompts } = useFetchPromptPageData(poemid);

  const setPromptNumber = (number: number) => {
    setSelectedPromptNumber(number);

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('prompt', String(number));
    window.history.pushState({}, '', newUrl);
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
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    console.log('Submitting answer for prompt', promptInputs);
    // Implement submission logic here
  };

  return (
    <div className='p-2'>
      <h1>This is the prompts page!</h1>
      <br></br>

      <div className='flex flex-wrap max-w-xs'>
        {prompts.map(
          (prompt, index) =>
            index === selectedPromptNumber && (
              <span key={prompt.id}>
                <p>initialprompt: {prompt.initial_prompt}</p>
                <p>highlightingformat: {prompt.highlighting_format}</p>
                <br></br>
              </span>
            )
        )}
      </div>

      <div className='flex flex-wrap'>
        {poem.map((poem) => (
          <span key={poem.id}>
            <p>id: {poem.id}</p>
            <p>author: {poem.author}</p>
            <p>name: {poem.name}</p>
            <br></br>
            <p>
              {poem.content.split('\n\n').map((stanza, index) => (
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
            <br></br>
          </span>
        ))}
      </div>

      <FollowupPrompt
        prompts={prompts}
        selectedPromptNumber={selectedPromptNumber}
        onInputChange={(value: string) => {
          setPromptInputs({ ...promptInputs, [selectedPromptNumber]: value });
        }}
        inputValue={promptInputs[selectedPromptNumber] || ''}
      />

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
          {selectedPromptNumber === 2 ? 'Submit' : 'Next'}
        </Button>
      </ButtonGroup>
    </div>
  );
}
