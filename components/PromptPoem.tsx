import React, { useEffect } from 'react';
import { PoemsType, PromptsType } from '@/types';
import { useState } from 'react';

type PromptPoemProps = {
  poem: PoemsType;
  selectedPromptNumber: number;
  highlightedWordIds: number[][];
  setHighlightedWordIds: (newHighlightedWordIds: number[][]) => void;
};

export default function PromptPoem({
  poem,
  selectedPromptNumber,
  highlightedWordIds,
  setHighlightedWordIds,
}: PromptPoemProps) {
  function oneWordIdStoringFucnction(
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

  function highlightWords() {
    // Remove styling from all spans
    document.querySelectorAll('span').forEach((span) => {
      span.classList.remove('bg-black', 'text-white');
    });

    // Apply styling to spans with corresponding IDs in the highlightedWordIds array
    highlightedWordIds[selectedPromptNumber]?.forEach((wordId) => {
      const span = document.getElementById(String(wordId));
      if (span) {
        span.classList.add('bg-black', 'text-white');
      }
    });
  }

  useEffect(() => {
    console.log('Change');
    highlightWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPromptNumber]);

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
                            oneWordIdStoringFucnction(event, word)
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
