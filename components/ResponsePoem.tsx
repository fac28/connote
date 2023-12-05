'use client';

import React, { useEffect, useState } from 'react';
import { PoemsType, ResponsesType } from '@/types';
import { Button, ScrollShadow } from '@nextui-org/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Tooltip } from '@nextui-org/react';

type ResponsePoemProps = {
  poem: PoemsType;
  responses: ResponsesType;
  selectedPromptNumber: number;
};

type TooltipData = {
  isOpen: boolean;
  wordIndex: number;
};

export default function ResponsePoem({
  poem,
  responses,
  selectedPromptNumber,
}: ResponsePoemProps) {
  const supabase = createClientComponentClient();

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  // const [isOpen, setIsOpen] = React.useState(false);
  const [tooltipData, setTooltipData] = useState<TooltipData[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user.id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [supabase.auth]);

  // Initialize tooltipData when the component mounts
  useEffect(() => {
    setTooltipData(
      poem
        .map((poemItem) =>
          poemItem.content
            .split('\n\n')
            .flatMap((stanza) => stanza.split('\n'))
            .flatMap((line) => line.split(' '))
            .map((_, wordIndex) => ({
              isOpen: false,
              wordIndex,
            }))
        )
        .flat()
    );
  }, [poem]);

  const handleTooltipOpenChange = (wordIndex: number, open: boolean) => {
    // Update the state for the specific tooltip
    setTooltipData((prevData) =>
      prevData.map((data) =>
        data.wordIndex === wordIndex ? { ...data, isOpen: open } : data
      )
    );
  };

  // Calculate most frequently highlighted word
  const allHighlightedResponses = responses
    .filter((response) => response.prompt_id === selectedPromptNumber)
    .map((response) => response.response_selected)
    .flat();

  // Find the mode and its frequency
  let mode: string | null = null;
  let numericMode: number[] = []; // Change to an array
  let modeFrequency = 0;

  function findMode(arr: number[]) {
    // Count the occurrences of each number
    let countMap: { [key: string]: number } = {};
    arr.forEach((num) => {
      countMap[num.toString()] = (countMap[num.toString()] || 0) + 1;
    });

    // Find the mode and its frequency
    Object.keys(countMap).forEach((key) => {
      const currentFrequency = countMap[key];

      if (currentFrequency > modeFrequency) {
        mode = key;
        modeFrequency = currentFrequency;
        numericMode = [parseInt(key, 10)]; // Set numericMode as an array with a single element
      } else if (currentFrequency === modeFrequency) {
        numericMode.push(parseInt(key, 10)); // Add to the array for multiple modes
      }
    });

    // If there's no mode, set numericMode to an empty array
    if (mode === null) {
      numericMode = [];
    }
  }

  findMode(allHighlightedResponses);

  // let maxHighlightedWordIndex = numericMode;

  // Word counter
  let wordCounter = 0;

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-wrap'>
          {poem.map((poemItem) => (
            <span key={poemItem.id}>
              <small className='text-connote_orange'>{poemItem.author}</small>
              <h4 className='font-bold text-large'>{poemItem.name}</h4>
              <ScrollShadow className='w-[300px] h-[300px] md:h-full'>
                {poemItem.content.split('\n\n').map((stanza, index) => (
                  <React.Fragment key={index}>
                    {stanza.split('\n').map((line, lineIndex) => (
                      <React.Fragment key={lineIndex}>
                        {line.split(' ').map((word, wordIndex) => {
                          const currentWordIndex = wordCounter++;

                          const tooltipInfo = tooltipData.find(
                            (info) => info.wordIndex === currentWordIndex
                          );

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
                              {numericMode.includes(currentWordIndex) ? (
                                <Tooltip
                                  key={currentWordIndex}
                                  isOpen={tooltipInfo?.isOpen ?? false}
                                  radius='sm'
                                  closeDelay={0}
                                  onOpenChange={(open) =>
                                    handleTooltipOpenChange(
                                      currentWordIndex,
                                      open
                                    )
                                  }
                                  content={modeFrequency + ' highlights'}
                                >
                                  <span
                                    className={
                                      'underline ' +
                                      (isSelected
                                        ? `${
                                            matchingResponse?.highlight_colour ??
                                            ''
                                          } `
                                        : '') +
                                      (myHighlights.includes(currentWordIndex)
                                        ? 'border-2 border-primary px-1.5 rounded-md shadow-lg m-0.5'
                                        : '')
                                    }
                                  >
                                    {word}
                                  </span>
                                </Tooltip>
                              ) : (
                                <span
                                  id={String(currentWordIndex)}
                                  className={
                                    (isSelected
                                      ? `${
                                          matchingResponse?.highlight_colour ??
                                          ''
                                        } `
                                      : '') +
                                    ' ' +
                                    (myHighlights.includes(currentWordIndex)
                                      ? 'border-2 border-primary px-1.5 rounded-md shadow-lg m-0.5'
                                      : '')
                                  }
                                >
                                  {word}
                                </span>
                              )}{' '}
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
              <br />
            </span>
          ))}
        </div>
        <div className='flex mt-1 bg-connote_pastel_purple p-2 bg-opacity-30 rounded-md shadow-md'>
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
      </div>
    </>
  );
}
