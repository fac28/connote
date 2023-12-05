import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchPoemById } from './fetchPoemById';
import { fetchPromptsByIds } from './fetchPromptsByIds';
import { fetchResponsesByPoemId } from './fetchResponsesByPoemId';
import { PoemsType, PromptsType, ResponsesType } from '@/types';

const useFetchResponsePageData = (poemid: number) => {
  const [poem, setPoem] = useState<PoemsType>([]);
  const [prompts, setPrompts] = useState<PromptsType[]>([]);
    const [responses, setResponses] = useState<ResponsesType>([]);

  useEffect(() => {
    if (!poemid) return;

    const fetchData = async () => {
      try {
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
            const organisedPrompts: PromptsType[] = promptIds
            .map(
              (id) =>
                promptData.find(
                  (prompt) => prompt?.id === id
                ) as unknown as PromptsType
            )
            .filter((prompt): prompt is PromptsType => prompt !== undefined);

          setPrompts(organisedPrompts);
          }
        } else {
          console.error('Error fetching poem or prompt data');
        }

        const fetchedResponses = await fetchResponsesByPoemId(poemid, supabase);
        if (fetchedResponses) {
          // Modify responses to include user information
          const responsesWithUsers: ResponsesType = await Promise.all(
            fetchedResponses.map(async (response) => {
              const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', response.user_id)
                .single();

              if (!error && data) {
                return {
                  ...response,
                  user: data,
                };
              }

              return response;
            })
          );

          setResponses(responsesWithUsers);
        }
      } catch (error) {
        console.error('Error in useFetchResponsePageData:', error);
      }
    };

    fetchData();
  }, [setPoem, setPrompts, setResponses, poemid]);

  return { poem, prompts, responses };
};

export default useFetchResponsePageData;
