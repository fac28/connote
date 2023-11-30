'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import FollowupPrompt from '@/components/FollowupPrompt';
import useFetchPromptPageData from '@/utils/supabase/models/fetchPromptPageData';
import PromptPoem from '@/components/PromptPoem';
import { submitPromptsData } from '@/utils/supabase/models/submitPromptsData';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import InitialPromptBanner from '@/components/InitialPromptBanner';
import PromptButtons from '@/components/PromptButtons';

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
      } else {
        router.push('/');
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

      <PromptButtons
        selectedPromptNumber={selectedPromptNumber}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
        prompts={prompts}
        highlightedWordIds={highlightedWordIds}
        promptInputs={promptInputs}
      />
    </main>
  );
}
