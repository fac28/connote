'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
      const { data: poemdata, error: poemerror } = await supabase
        .from('poems')
        .select(
          'id, author, name, content, first_prompt_id, second_prompt_id, third_prompt_id, display_date'
        )
        .eq('id', poemid);
      if (poemerror) {
        console.error('Error fetching data:', poemerror.message);
      } else {
        setPoem(poemdata);
        const { data: promptdata, error: prompterror } = await supabase
          .from('prompts')
          .select('id, initial_prompt, follow_up_prompt, highlighting_format')
          .in('id', [
            poemdata[0].first_prompt_id,
            poemdata[0].second_prompt_id,
            poemdata[0].third_prompt_id,
          ]);
        if (prompterror) {
          console.error('Error fetching data:', prompterror.message);
        } else {
          console.log(promptdata, 'promptdata');
          setPrompts(promptdata);
        }
      }
    };
    fetchData();
  }, [setPoem, setPrompts]);

  return (
    <>
      <h1>This is the prompts page!</h1>
      <div className='flex flex-wrap'>
        {poem.map((poem) => (
          <span key={poem.id}>
            <p>{poem.first_prompt_id}</p>
          </span>
        ))}
      </div>
      <div className='flex flex-wrap'>
        {prompts.map((prompt) => (
          <span key={prompt.id}>
            <p>{prompt.initial_prompt}</p>
            <p>{prompt.follow_up_prompt}</p>
            <p>{prompt.highlighting_format}</p>
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
