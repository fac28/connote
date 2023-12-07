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
import { LikedResponsesType } from '@/types';
import ResponseKey from '@/components/ResponseKey';

export default function ResponsePage() {
  const [hearts, setHearts] = useState<{ [key: number]: number }>({});
  const [loadingHearts, setLoadingHearts] = useState(true);
  const [likedResponses, setLikedResponses] = useState<{
    [key: number]: boolean;
  }>({});

  const params = useParams();
  const poemid = +params['poem-id'];
  const searchParams = useSearchParams();
  const promptNumber = Number(searchParams.get('prompt'));
  const [selectedPromptNumber, setSelectedPromptNumber] = useState<number>(
    promptNumber || 0
  );
  const router = useRouter();

  const [isPoemLoading, setIsPoemLoading] = useState(true);
  const { poem, prompts, responses } = useFetchResponsePageData(poemid);

  let updatedResponses = updateResponses012(poem[0], responses);
  const updatedPrompts = updatePrompts012(prompts);
  let reupdatedResponses = addingHighlightAttribute(updatedResponses, hearts);

  const [clickedCommentWords, setClickedCommentWords] = useState<number[]>([]);

  const fetchHearts = async () => {
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

  useEffect(() => {
    // Check if the poem is loaded
    if (poem) {
      setIsPoemLoading(false);
    }
  }, [poem]);

  useEffect(() => {
    fetchHearts();
  }, []);

  useEffect(() => {
    const fetchUserReactions = async () => {
      try {
        const supabase = createClientComponentClient();
        const user = await supabase.auth.getUser();

        if (!user.data.user) {
          // User not logged in
          return;
        }

        const userId = user.data.user.id;

        // Fetch all heart reactions by the user
        const { data: userReactions, error } = await supabase
          .from('reacts')
          .select('response_id')
          .eq('reacter_id', userId)
          .eq('type', 'heart');

        if (error) {
          throw error;
        }

        // Map the reactions to the likedResponses state
        const newLikedResponses: LikedResponsesType = {};
        userReactions.forEach((reaction) => {
          newLikedResponses[reaction.response_id] = true;
        });
        setLikedResponses(newLikedResponses);
      } catch (error) {
        console.error('Error fetching user reactions:', error);
      }
    };

    fetchUserReactions();
  }, []);

  const handleHeartsClick = async (responseId: number) => {
    try {
      const supabase = createClientComponentClient();
      const user = await supabase.auth.getUser();

      // Check if user is logged in and has a valid user object
      if (!user.data.user) {
        // User not logged in
        return;
      }

      const userId = user.data.user.id;

      // Check if the current user has already reacted with a heart
      const { data: existingReact, error: reactError } = await supabase
        .from('reacts')
        .select('*')
        .eq('response_id', responseId)
        .eq('type', 'heart')
        .eq('reacter_id', userId)
        .single();

      if (existingReact) {
        // If the heart react exists, delete it
        const { error: deleteError } = await supabase
          .from('reacts')
          .delete()
          .match({ id: existingReact.id });
      } else {
        // If the heart react does not exist, insert it
        const { error: insertError } = await supabase.from('reacts').insert([
          {
            response_id: responseId,
            type: 'heart',
            reacter_id: userId,
          },
        ]);
      }

      // Fetch the updated heart count
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
      console.error('Error handling heart click:', error);
      return;
    }
    await fetchHearts();
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
    router.push('/poemLibrary');
  };

  return (
    <main>
      <InitialPromptBanner
        prompts={prompts}
        selectedPromptNumber={selectedPromptNumber}
      />
      <div className='md:flex md:justify-center md:gap-12'>
        <div className='flex flex-col items-center justify-between p-4'>
          <ResponsePoem
            poem={poem}
            responses={reupdatedResponses}
            selectedPromptNumber={selectedPromptNumber}
            clickedCommentWords={clickedCommentWords}
          />
        </div>
        {!isPoemLoading && (
          <div className='mt-2'>
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
              setClickedCommentWords={setClickedCommentWords}
            />
          </div>
        )}
      </div>
    </main>
  );
}
