import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchPoemById } from './fetchPoemById';
import { fetchPromptsByIds } from './fetchPromptsByIds';
import { PoemsType, PromptsType } from '@/types';

const useFetchPromptPageData = (poemid: number) => {
  const [poem, setPoem] = useState<PoemsType>([]);
  const [prompts, setPrompts] = useState<PromptsType[]>([]);

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
    };

    fetchData();
  }, [poemid]);

  return { poem, prompts };
};

export default useFetchPromptPageData;
