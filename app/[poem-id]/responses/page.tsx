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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchReacts } from '@/utils/supabase/models/fetchReacts';

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

  const [hearts, setHearts] = useState<{ [key: number]: number }>({});
  const [loadingHearts, setLoadingHearts] = useState(true);
  const [likedResponses, setLikedResponses] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const fetchInitialHearts = async () => {
      try {
        const supabase = createClientComponentClient();
        const heartReacts = await fetchReacts('heart', supabase);
        setHearts(heartReacts);
        setLoadingHearts(false);
      } catch (error) {
        console.error('Error fetching initial hearts:', error);
        setLoadingHearts(false);
      }
    };
    fetchInitialHearts();
  }, [updatedResponses]);

  const handleHeartsClick = async (responseId: number, userId: string) => {
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase.from('reacts').insert([
        {
          response_id: responseId,
          type: 'heart',
          reacter_id: userId,
        },
      ]);
      const { data: updatedHearts, error: fetchError } = await supabase
        .from('reacts')
        .select('response_id, count', { count: 'exact' })
        .eq('response_id', responseId)
        .eq('type', 'heart')
        .single();

      if (updatedHearts) {
        setHearts((prevHearts) => ({
          ...prevHearts,
          [responseId]: updatedHearts.count || 0,
        }));
      }

      setLikedResponses((prev) => ({
        ...prev,
        [responseId]: !prev[responseId],
      }));
    } catch (error) {
      console.error('Error adding heart:', error);
    }
  };

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
        hearts={hearts}
        likedResponses={likedResponses}
        handleHeartsClick={handleHeartsClick}
        loadingHearts={loadingHearts}
        updatedResponses={updatedResponses}
        reupdatedResponses={reupdatedResponses}
        updatedPrompts={updatedPrompts}
        selectedPromptNumber={selectedPromptNumber}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
      />
    </main>
  );
}
