'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchPoemById } from '@/utils/supabase/models/fetchPoemById';
import { fetchPromptsByIds } from '@/utils/supabase/models/fetchPromptsByIds';

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
  const poemid = 1;
  const [poem, setPoem] = useState<PoemsType>([]);
  const [prompts, setPrompts] = useState<PromptsType>([]);

  useEffect(() => {
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
        {prompts.map((prompt) => (
          <span key={prompt.id}>
            <p>init: {prompt.initial_prompt}</p>
            <p>follow up: {prompt.follow_up_prompt}</p>
            <p>highlighting format: {prompt.highlighting_format}</p>
            <br></br>
          </span>
        ))}
      </div>
    </>
  );
}

// const responses = JSON.parse(localStorage.getItem('responses'));
//get poem. get url. get the poem name, author, date, id1, id2, id3 of that poem
//get prompts of id1, id2, id3
//render a prompt compononent to show the poem. containing:
// // cross on the left
// // progress bar
// initialprompt
// poem
// followupprompt
// input box
// arrow and skip
