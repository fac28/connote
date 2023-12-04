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
import { Button } from '@nextui-org/react';

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
  const [showFollowupPrompt, setShowFollowupPrompt] = useState(false);
  const [showPromptButtons, setShowPromptButtons] = useState(false);

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
  useEffect(() => {
    // Reset the visibility state when the component mounts
    setShowFollowupPrompt(false);
    setShowPromptButtons(false);
  }, [poemid]);
  const setPromptNumber = (number: number) => {
    setSelectedPromptNumber(number);
    const newQueryParams = new URLSearchParams(window.location.search);
    newQueryParams.set('prompt', String(number));
    router.push(`${window.location.pathname}?${newQueryParams.toString()}`);
  };

  const handlePrevClick = () => {
    if (selectedPromptNumber > 0) {
      setPromptNumber(selectedPromptNumber - 1);
    } else {
      router.push('/poemLibrary');
    }
  };

  const handleSubmit = async () => {
    // Server-side validation logic
    if (
      highlightedWordIds.some(
        (ids, index) => ids.length > prompts[index].highlight_limit
      )
    ) {
      console.error('Too many words highlighted.');
      return;
    }

    if (promptInputs.some((input) => input && input.length > 200)) {
      console.error('Input length exceeds the allowed limit.');
      return;
    }

    const supabase = createClientComponentClient();

    prompts.forEach((prompt, index) => {
      const input = promptInputs[index];

      // Check if the prompt input is not empty
      if (input && input.trim() !== '') {
        submitPromptsData(
          userId,
          poemid,
          prompt.id,
          highlightedWordIds[index],
          input,
          supabase
        );
      }
    });

    window.location.href = `/${poemid}/responses`;
  };
  const handleNextClick = () => {
    if (selectedPromptNumber < 2) {
      // Reset the visibility state when clicking the right chevron
      setShowFollowupPrompt(false);
      setShowPromptButtons(false);

      setPromptNumber(selectedPromptNumber + 1);
    } else {
      handleSubmit();
    }
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
        prompts={prompts}
      />
      <Button
        className='bg-connote_orange rounded-xl mx-12 flex items-center'
        onClick={() => {
          setShowFollowupPrompt(true);
          setShowPromptButtons(true);
        }}
      >
        Follow-up Prompt
      </Button>
      {showFollowupPrompt && (
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
      )}

      {showPromptButtons && (
        <PromptButtons
          selectedPromptNumber={selectedPromptNumber}
          handlePrevClick={handlePrevClick}
          handleNextClick={handleNextClick}
          prompts={prompts}
          highlightedWordIds={highlightedWordIds}
          promptInputs={promptInputs}
        />
      )}
    </main>
  );
}
