'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchPoemById } from '@/utils/supabase/models/fetchPoemById';
import { fetchPromptsByIds } from '@/utils/supabase/models/fetchPromptsByIds';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Button, ButtonGroup } from '@nextui-org/react';

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

export default function PromptPage() {
  const [poem, setPoem] = useState<PoemsType>([]);
  const [prompts, setPrompts] = useState<PromptsType>([]);

  const params = useParams();
  const poemid = +params['poem-id'];

  const searchParams = useSearchParams();
  const promptNumber = searchParams.get('prompt');

  const [selectedPromptNumber, setSelectedPromptNumber] = useState<string>(
    promptNumber || '1'
  );

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
    };

    fetchData();
  }, [setPoem, setPrompts, poemid]);

  const setPromptNumber = (number: string) => {
    setSelectedPromptNumber(number);

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('prompt', number);
    window.history.pushState({}, '', newUrl);
  };

  return (
    <>
      <h1>This is the prompts page!</h1>
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
        {prompts.map(
          (prompt) =>
            prompt.id === Number(selectedPromptNumber) && (
              <span key={prompt.id}>
                <p>Prompt id: {prompt.id}</p>
                <p>initialprompt: {prompt.initial_prompt}</p>
                <p>followupprompt: {prompt.follow_up_prompt}</p>
                <p>highlightingformat: {prompt.highlighting_format}</p>
                <br></br>
              </span>
            )
        )}
      </div>
      <ButtonGroup>
        <Button onClick={() => setPromptNumber('1')}>One</Button>
        <Button onClick={() => setPromptNumber('2')}>Two</Button>
        <Button onClick={() => setPromptNumber('3')}>Three</Button>
      </ButtonGroup>
    </>
  );
}
