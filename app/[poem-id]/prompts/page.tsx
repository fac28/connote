'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Button, ButtonGroup } from '@nextui-org/react';
import FollowupPrompt from '@/components/FollowupPrompt';
import useFetchPromptPageData from '@/utils/supabase/models/fetchPromptPageData';
import PromptPoem from '@/components/PromptPoem';
import { submitPromptsData } from '@/utils/supabase/models/submitPromptsData';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import InitialPromptBanner from '@/components/InitialPromptBanner';

export default function PromptPage() {
  const params = useParams();
  const poemid = +params['poem-id'];
  const searchParams = useSearchParams();
  const router = useRouter();
  const { poem, prompts } = useFetchPromptPageData(poemid);

  const promptNumber = Number(searchParams.get('prompt'));
  const [selectedPromptNumber, setSelectedPromptNumber] = useState<number>(
    promptNumber || 0
  );
  const [promptInputs, setPromptInputs] = useState<string[]>([]);
  const [highlightedWordIds, setHighlightedWordIds] = useState<number[][]>(
    new Array(3).fill([])
  );
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const supabase = createClientComponentClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.id) {
        setUserId(sessionData.session.user.id);
      }
    };
    fetchUserId();
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
    const supabase = createClientComponentClient();
    prompts.forEach((prompt, index) => {
      submitPromptsData(
        userId,
        poemid,
        prompt.id,
        highlightedWordIds[index],
        promptInputs[index],
        supabase
      );
    });
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
      <InitialPromptBanner
        prompts={prompts}
        selectedPromptNumber={selectedPromptNumber}
      />

      <PromptPoem
        poem={poem}
        selectedPromptNumber={selectedPromptNumber}
        highlightedWordIds={highlightedWordIds}
        setHighlightedWordIds={setHighlightedWordIds}
      />

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
