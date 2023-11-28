import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchPoemById } from './fetchPoemById';
import { fetchPromptsByIds } from './fetchPromptsByIds';
import { hasUserResponded } from './hasUserResponded';
import { PoemsType, PromptsType, ResponsesType } from '@/types';

const useFetchResponsePageData = (poemid: number) => {
  const [poem, setPoem] = useState<PoemsType>([]);
  const [prompts, setPrompts] = useState<PromptsType>([]);
  const [responses, setResponses] = useState<ResponsesType>([]);

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

  return { poem, prompts, responses };
};

export default useFetchResponsePageData;
