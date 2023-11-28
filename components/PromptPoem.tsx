import React, { useEffect } from 'react';
import { PoemsType, PromptsType } from '@/types';
import { useState } from 'react';

type PromptPoemProps = {
  poem: PoemsType;
  prompts: PromptsType[];
  selectedPromptNumber: number;
  onHighlightChange: (
    promptNumber: number,
    highlightedWordIds: number[]
  ) => void;
};

export default function PromptPoem({
  poem,
  selectedPromptNumber,
}: PromptPoemProps) {
  const [highlightedWordIds, setHighlightedWordIds] = useState<number[][]>([
    [],
    [],
    [],
  ]);

  function oneWordHighlightingFunction(
    event: React.MouseEvent<HTMLSpanElement>,
    word: string
  ) {
    // Check if event and event.target are defined
    if (event && event.target) {
      const clickedSpan = event.target as HTMLSpanElement;
      const spanId = parseInt(clickedSpan.id);

      // Create a copy of the current state to avoid modifying it directly
      const newHighlightedWordIds = [...highlightedWordIds];

      // Get the array for the current prompt
      const currentPromptHighlightedWords =
        newHighlightedWordIds[selectedPromptNumber];

      const isHighlighted = currentPromptHighlightedWords.includes(spanId);

      if (isHighlighted) {
        // Remove the word ID from the array if already highlighted
        newHighlightedWordIds[selectedPromptNumber] =
          currentPromptHighlightedWords.filter((id) => id !== spanId);
      } else {
        // Add the word ID to the array if not highlighted
        newHighlightedWordIds[selectedPromptNumber] = [
          ...currentPromptHighlightedWords,
          spanId,
        ];
      }

      setHighlightedWordIds(newHighlightedWordIds);

      console.log(`Clicked word: ${word}, Span ID: ${spanId}`);

      clickedSpan.classList.toggle('bg-black');
      clickedSpan.classList.toggle('text-white');
    }
  }

  useEffect(() => {
    console.log('Highlighted Word IDs:', highlightedWordIds);
  }, [highlightedWordIds]);

  let wordCounter = 0;

  return (
    <div className='flex flex-wrap'>
      {poem.map((poem) => (
        <span key={poem.id}>
          <small className='text-default-500'>{poem.author}</small>
          <h4 className='font-bold text-large'>{poem.name}</h4>
          <br></br>
          <p className='md:overflow-y-scroll md:h-96'>
            {poem.content.split('\n\n').map((stanza, index) => (
              <React.Fragment key={index}>
                {stanza.split('\n').map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {/* Split each line into words and add click event listener */}
                    {line.split(' ').map((word, wordIndex) => (
                      <React.Fragment key={wordCounter++}>
                        <span
                          id={String(wordCounter)}
                          onClick={(event) =>
                            oneWordHighlightingFunction(event, word)
                          }
                        >
                          {word}
                        </span>{' '}
                      </React.Fragment>
                    ))}
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
  );
}
