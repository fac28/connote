'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';

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

export default function PoemDirectory () {
    const [poems, setPoems] = useState<PoemsType>([]);  
  
    useEffect(() => {
        const currentDate = new Date();


      const fetchData = async () => {
        const supabase = createClientComponentClient();
        const { data, error } = await supabase.from('poems')
        .select('id, author, name, content, first_prompt_id, second_prompt_id, third_prompt_id, display_date')
        .order('display_date', { ascending: false })
;

        if (error) {
          console.error('Error fetching data:', error.message);
        } else {
            console.log(data)
            console.log(typeof data[1].display_date)

            const filteredPoems = data.filter((poem) => new Date(poem.display_date) <= currentDate);
            setPoems(filteredPoems);
        }
      };
      fetchData();
    }, [setPoems]);

      
    return (
        <>
        <h1>Poems list:</h1>
        <ul>
            {poems.map((poem) => (
                <li key={poem.id}>
                    <h2>{poem.name} by {poem.author}</h2>
                    <p>{poem.content}</p>
                    <p>{poem.display_date}</p>
                </li>
            ))}
        </ul>
        </>
    )
}