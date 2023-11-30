'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import useFetchResponsePageData from '@/utils/supabase/models/fetchResponsePageData';
import ResponsePoem from '@/components/ResponsePoem';
import { useRouter } from 'next/navigation';
import InitialPromptBanner from '@/components/InitialPromptBanner';
import ResponsesSection from '@/components/ResponsesSection';
import { addingHighlightAttribute } from '@/utils/responsePageHandling/addingHighlightAttribute';
import {
  updatePrompts012,
  updateResponses012,
} from '@/utils/responsePageHandling/mappingReponseDataTo012';

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

  let updatedResponses = updateResponses012(poem[0], responses);
  const updatedPrompts = updatePrompts012(prompts);
  let reupdatedResponses = addingHighlightAttribute(updatedResponses);

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
    <main>
      <InitialPromptBanner
        prompts={prompts}
        selectedPromptNumber={selectedPromptNumber}
      />

      <div className='flex flex-col items-center justify-between p-4'>
        <ResponsePoem
          poem={poem}
          responses={reupdatedResponses}
          selectedPromptNumber={selectedPromptNumber}
        />
      </div>

      <h2 className='promptPurple w-full'>Responses</h2>

      <ResponsesSection
        reupdatedResponses={reupdatedResponses}
        updatedPrompts={updatedPrompts}
        selectedPromptNumber={selectedPromptNumber}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
      />
    </main>
  );
}
