'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Button, ButtonGroup } from '@nextui-org/react';
import FollowupPrompt from '@/components/FollowupPrompt';
import useFetchPromptPageData from '@/utils/supabase/models/fetchPromptPageData';
import PromptPoem from '@/components/PromptPoem';
import { PoemsType, PromptsType } from '@/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchPoemById } from '@/utils/supabase/models/fetchPoemById';
import { fetchPromptsByIds } from '@/utils/supabase/models/fetchPromptsByIds';

export default function PromptPage() {
  const [highlightedWordIds, setHighlightedWordIds] = useState<number[]>([]);

  const params = useParams();
  const poemid = +params['poem-id'];
  const searchParams = useSearchParams();
  const promptNumber = Number(searchParams.get('prompt'));
  const [selectedPromptNumber, setSelectedPromptNumber] = useState<number>(
    promptNumber || 0
  );
  const [promptInputs, setPromptInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log('Highlighted Word IDs:', highlightedWordIds);
  }, [highlightedWordIds]);

  function oneWordHighlightingFunction(
    event: React.MouseEvent<HTMLSpanElement>,
    word: string
  ) {
    // Check if event and event.target are defined
    if (event && event.target) {
      const clickedSpan = event.target as HTMLSpanElement;
      const spanId = parseInt(clickedSpan.id);

      const isHighlighted = highlightedWordIds.includes(spanId);

      if (isHighlighted) {
        setHighlightedWordIds((prevIds) =>
          prevIds.filter((id) => id !== spanId)
        );
      } else {
        setHighlightedWordIds((prevIds) => [...prevIds, spanId]);
      }

      console.log(`Clicked word: ${word}, Span ID: ${spanId}`);

      clickedSpan.classList.toggle('bg-black');
      clickedSpan.classList.toggle('text-white');
    }
  }

  const { poem, prompts } = useFetchPromptPageData(poemid);

  const setPromptNumber = (number: number) => {
    setSelectedPromptNumber(number);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('prompt', String(number));
    window.history.pushState({}, '', newUrl);
  };

  let wordCounter = 0;

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
    <main className='flex flex-col items-center justify-between p-4'>
      <div className='flex flex-wrap md:max-w-xs'>
        {prompts.map(
          (prompt, index) =>
            index === selectedPromptNumber && (
              <span key={prompt.id}>
                <p>{prompt.initial_prompt}</p>
                <br></br>
              </span>
            )
        )}
      </div>

      <PromptPoem poem={poem} />

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
    </main>
  );
}
