'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchPoemById } from '@/utils/supabase/models/fetchPoemById';
import { fetchPromptsByIds } from '@/utils/supabase/models/fetchPromptsByIds';
import { useParams } from 'next/navigation';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, ButtonGroup } from '@nextui-org/react';
import FollowupPrompt from '@/components/FollowupPrompt';

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

  const [promptInputs, setPromptInputs] = useState<Record<string, string>>({});

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
    <div className='p-2'>
      <h1>This is the prompts page!</h1>
      <br></br>

      <div className='flex flex-wrap'>
        {prompts.map(
          (prompt, index) =>
            index === Number(selectedPromptNumber) && (
              <span key={prompt.id}>
                <p>initialprompt: {prompt.initial_prompt}</p>
                <p>highlightingformat: {prompt.highlighting_format}</p>
                <br></br>
              </span>
            )
        )}
      </div>

      <div className='flex flex-wrap'>
        {poem.map((poem) => (
          <span key={poem.id}>
            <p>id: {poem.id}</p>
            <p>author: {poem.author}</p>
            <p>name: {poem.name}</p>
            <br></br>
            <p>
              {poem.content.split('\n\n').map((stanza, index) => (
                <React.Fragment key={index}>
                  {stanza.split('\n').map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                  <br />
                </React.Fragment>
              ))}
            </p>
            <br></br>
          </span>
        ))}
      </div>

      <FollowupPrompt
        prompts={prompts}
        selectedPromptNumber={selectedPromptNumber}
        onInputChange={(value: string) => {
          setPromptInputs({ ...promptInputs, [selectedPromptNumber]: value });
        }}
        inputValue={promptInputs[selectedPromptNumber] || ''}
      />

      <ButtonGroup>
        <Button onClick={() => setPromptNumber('0')}>One</Button>
        <Button onClick={() => setPromptNumber('1')}>Two</Button>
        <Button onClick={() => setPromptNumber('2')}>Three</Button>
      </ButtonGroup>
    </div>
  );
}
