'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Button, ButtonGroup } from '@nextui-org/react';
import FollowupPrompt from '@/components/FollowupPrompt';
import useFetchPromptPageData from '@/utils/supabase/models/fetchPromptPageData';
import PromptPoemLine from '@/components/PromptPoemLine';
import { useRouter } from 'next/navigation';
import { submitPromptsData } from '@/utils/supabase/models/submitPromptsData';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PromptPage() {
  const params = useParams();
  const poemid = +params['poem-id'];
  const searchParams = useSearchParams();
  const promptNumber = Number(searchParams.get('prompt'));
  const [selectedPromptNumber, setSelectedPromptNumber] = useState<number>(
    promptNumber || 0
  );
  const [promptInputs, setPromptInputs] = useState<string[]>([]);
  const router = useRouter();
  const [highlightedWordIds, setHighlightedWordIds] = useState<number[][]>([
    [],
    [],
    [],
  ]);
  const [userId, setUserId] = useState<string | null>(null);

  const { poem, prompts } = useFetchPromptPageData(poemid);

  useEffect(() => {
    const fetchUserId = async () => {
      const supabase = createClientComponentClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.id) {
        setUserId(sessionData.session.user.id);
      }
    };
    fetchUserId();
    console.log('UserID', userId);
  });

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
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    console.log('Submitting answer for prompt', promptInputs);
    console.log('Highlighted Word IDs:', highlightedWordIds);
    // Implement submission logic here
    submitPromptsData(
      userId,
      poemid,
      prompts[0].id,
      highlightedWordIds[0],
      promptInputs[0],
      createClientComponentClient()
    );
    submitPromptsData(
      userId,
      poemid,
      prompts[1].id,
      highlightedWordIds[1],
      promptInputs[1],
      createClientComponentClient()
    );
    submitPromptsData(
      userId,
      poemid,
      prompts[2].id,
      highlightedWordIds[2],
      promptInputs[2],
      createClientComponentClient()
    );

    window.location.href = `/poemLibrary`;
  };

  const isSubmitDisabled = () => {
    for (let i = 0; i < prompts.length; i++) {
      if (
        (highlightedWordIds[i].length === 0 && promptInputs[i]) ||
        ((!promptInputs[i] || !promptInputs[i].trim()) &&
          highlightedWordIds[i].length > 0)
      ) {
        return true; // Disable if any pair is incomplete.
      }
    }

    if (highlightedWordIds.every((ids) => ids.length === 0)) {
      return true; //Disable if no responses recorded at all.
    }

    return false; // Enable if all pairs are complete or empty.
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
        <div className='flex flex-wrap md:max-w-xs'>
          {prompts.map(
            (prompt, index) =>
              index === selectedPromptNumber && (
                <span key={prompt.id}>
                  <br></br>
                </span>
              )
          )}
        </div>

        <PromptPoemLine
          poem={poem}
          selectedPromptNumber={selectedPromptNumber}
          highlightedWordIds={highlightedWordIds}
          setHighlightedWordIds={setHighlightedWordIds}
        />
      </div>

      <FollowupPrompt
        prompts={prompts}
        selectedPromptNumber={selectedPromptNumber}
        onInputChange={(value: string) => {
          setPromptInputs((prevInputs) => {
            const newInputs = [...prevInputs];
            newInputs[selectedPromptNumber] = value;
            return newInputs;
          });
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
        <Button
          disabled={selectedPromptNumber === 2 && isSubmitDisabled()}
          className={`${
            selectedPromptNumber === 2 && isSubmitDisabled()
              ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
              : ''
          }`}
          onClick={handleNextClick}
        >
          {selectedPromptNumber === 2 ? 'Submit' : 'Next'}
        </Button>
      </ButtonGroup>
    </main>
  );
}
