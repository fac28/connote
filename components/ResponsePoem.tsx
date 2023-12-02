'use client';

import React, { useEffect, useState } from 'react';
import { PoemsType, ResponsesType } from '@/types';
import { ScrollShadow } from '@nextui-org/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type ResponsePoemProps = {
  poem: PoemsType;
  responses: ResponsesType;
  selectedPromptNumber: number;
};

export default function ResponsePoem({
  poem,
  responses,
  selectedPromptNumber,
}: ResponsePoemProps) {
  const supabase = createClientComponentClient();

  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          console.log('user id', user.id);
          setCurrentUser(user.id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  let wordCounter = 0;

  return (
    <div className='flex flex-wrap'>
      {poem.map((poemItem) => (
        <span key={poemItem.id}>
          <small className='text-connote_orange'>{poemItem.author}</small>
          <h4 className='font-bold text-large'>{poemItem.name}</h4>
          <ScrollShadow className='w-[300px] h-[300px]'>
            {poemItem.content.split('\n\n').map((stanza, index) => (
              <React.Fragment key={index}>
                {stanza.split('\n').map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line.split(' ').map((word, wordIndex) => {
                      const currentWordIndex = wordCounter++;
                      const isSelected = responses.some(
                        (response) =>
                          response.response_selected.includes(
                            currentWordIndex
                          ) && response.prompt_id === selectedPromptNumber
                      );

                      const matchingResponse = responses.find(
                        (response) =>
                          response.response_selected.includes(
                            currentWordIndex
                          ) && response.prompt_id === selectedPromptNumber
                      );

                      const myHighlights = responses
                        .filter(
                          (response) =>
                            response.user_id === currentUser &&
                            response.response_selected.includes(
                              currentWordIndex
                            ) &&
                            response.prompt_id === selectedPromptNumber
                        )
                        .map((response) => response.response_selected)
                        .flat();

                      return (
                        <React.Fragment key={currentWordIndex}>
                          <span
                            id={String(currentWordIndex)}
                            className={
                              (isSelected
                                ? `${
                                    matchingResponse?.highlight_colour ?? ''
                                  } py-0.5 px-1.5 rounded-md shadow-lg m-0.5`
                                : '') +
                              ' ' +
                              (myHighlights.includes(currentWordIndex)
                                ? 'border-2 border-primary'
                                : '')
                            }
                          >
                            {word}
                          </span>{' '}
                        </React.Fragment>
                      );
                    })}
                    <br />
                  </React.Fragment>
                ))}
                <br />
              </React.Fragment>
            ))}
          </ScrollShadow>
          <div className='flex mt-6 bg-connote_pastel_purple p-2 bg-opacity-30 rounded-md shadow-md'>
            <div className='flex flex-col'>
              <div>
                <p className='text-xs'> Top 3 likes</p>
              </div>
              <div className='flex'>
                <p className='py-0.5 px-1.5  text-xs  bg-connote_orange rounded-md shadow-lg m-0.5'>
                  First
                </p>
                <p className='py-0.5 px-1.5 text-xs  bg-connote_green rounded-md shadow-lg m-0.5'>
                  Second
                </p>
                <p className='py-0.5 px-1.5 text-xs  bg-connote_pastel_blue rounded-md shadow-lg m-0.5'>
                  Third
                </p>
              </div>
            </div>
            <div className='px-3'>
              <div>
                <p className='text-xs'>Your selection</p>
              </div>
              <div>
                <p className='py-0.5  text-xs px-1.5 rounded-md shadow-lg m-0.5 border-2 border-primary'>
                  Selected word
                </p>
              </div>
            </div>
          </div>
          <br />
        </span>
      ))}
    </div>
  );
}
