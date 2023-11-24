'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchPoemById } from '@/utils/supabase/models/fetchPoemById';
import { fetchPromptsByIds } from '@/utils/supabase/models/fetchPromptsByIds';
import { useParams } from 'next/navigation';
import { hasUserResponded } from '@/utils/supabase/models/hasUserResponded';

type PoemsType =
  | Array<{
      id: number;
      author: string;
      name: string;
      content: string;
      first_prompt_id: number;
      second_prompt_id: number;
      third_prompt_id: number;
      display_date: string;
    }>
  | [];

type PromptsType =
  | Array<{
      id: number;
      initial_prompt: string;
      follow_up_prompt: string;
      highlighting_format: string;
    }>
  | [];

type ResponsesType =
  | Array<{
      id: number;
      poem_id: number;
      prompt_id: number;
      response_selected: string;
      response_written: string;
      user_id: string;
    }>
  | [];

export default function PromptPage() {
  const [poem, setPoem] = useState<PoemsType>([]);
  const [prompts, setPrompts] = useState<PromptsType>([]);
  const [responses, setResponses] = useState<ResponsesType>([]);

  const params = useParams();
  const poemid = +params['poem-id'];

  useEffect(() => {
    if (!poemid) return;
    const fetchData = async () => {
      const supabase = createClientComponentClient();

      const poemData = await fetchPoemById(poemid, supabase);
      if (poemData) {
        setPoem(poemData);
        const promptIds = [
          poemData[0].first_prompt_id,
          poemData[0].second_prompt_id,
          poemData[0].third_prompt_id,
        ];
        const promptData = await fetchPromptsByIds(promptIds, supabase);
        if (promptData) {
          setPrompts(promptData);
        }
      } else {
        console.error('Error fetching poem or prompt data');
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.id) {
        const userid = sessionData.session.user.id;
        const responses = (await hasUserResponded({ userid, poemid })) || [];
        if (responses) {
          setResponses(responses);
        }
      }
    };

    fetchData();
  }, [setPoem, setPrompts, poemid]);

  return (
    <>
      <h1>This is the responses page!</h1>
      <br></br>

      <div className='flex flex-wrap'>
        {poem.map((poem) => (
          <span key={poem.id}>
            <p>id: {poem.id}</p>
            <p>author: {poem.author}</p>
            <p>name: {poem.name}</p>
            <p>content: {poem.content}</p>
            <br></br>
          </span>
        ))}
      </div>

      <div className='flex flex-wrap'>
        {prompts.map((prompt) => {
          const matchingResponse = responses.find(
            (response) => response.prompt_id === prompt.id
          );

          return (
            <span key={prompt.id}>
              <p>promptid: {prompt.id}</p>
              <p>initialprompt: {prompt.initial_prompt}</p>
              <p>followupprompt: {prompt.follow_up_prompt}</p>
              <p>highlightingformat: {prompt.highlighting_format}</p>
              <p>
                response_selected:{' '}
                {matchingResponse ? matchingResponse.response_selected : ''}
              </p>
              <p>
                response_written:{' '}
                {matchingResponse ? matchingResponse.response_written : ''}
              </p>
              <br></br>
            </span>
          );
        })}
      </div>
    </>
  );
}
