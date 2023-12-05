import React, { useEffect } from 'react';
import { PoemsType, PromptsType } from '@/types';
import { ScrollShadow } from '@nextui-org/react';

type PromptPoemProps = {
  poem: PoemsType;
  selectedPromptNumber: number;
  highlightedWordIds: number[][];
  setHighlightedWordIds: (newHighlightedWordIds: number[][]) => void;
  prompts: PromptsType;
};

export default function PromptPoem({
  poem,
  selectedPromptNumber,
  highlightedWordIds,
  setHighlightedWordIds,
  prompts,
}: PromptPoemProps) {
  function oneWordIdStoringFucnction(event: React.MouseEvent<HTMLSpanElement>) {
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
        //Remove all highlighted words if highlight_limit > 3
        if (prompts[selectedPromptNumber].highlight_limit > 3) {
          currentPromptHighlightedWords.splice(
            0,
            currentPromptHighlightedWords.length
          );
          return;
        }

        // Remove the word ID from the array if already highlighted
        newHighlightedWordIds[selectedPromptNumber] =
          currentPromptHighlightedWords.filter((id) => id !== spanId);
      } else {
        //Check if limit reached and do an early return
        if (
          currentPromptHighlightedWords.length >=
          prompts[selectedPromptNumber].highlight_limit
        ) {
          console.log('early return, too long');
          return;
        }

        // Check if word is adjacent if highlight_limit > 3
        if (
          currentPromptHighlightedWords.length >= 1 &&
          prompts[selectedPromptNumber].highlight_limit > 3 &&
          !currentPromptHighlightedWords.some(
            (id) => id - 1 === spanId || id + 1 === spanId
          )
        ) {
          console.log('early return');
          return;
        }

        // Add the word ID to the array if not highlighted
        newHighlightedWordIds[selectedPromptNumber] = [
          ...currentPromptHighlightedWords,
          spanId,
        ];
      }

      setHighlightedWordIds(newHighlightedWordIds);

      clickedSpan.classList.toggle('bg-black');
      clickedSpan.classList.toggle('text-white');
    }
  }

  function highlightWords() {
    // Remove styling from all spans
    document.querySelectorAll('span').forEach((span) => {
      span.classList.remove('bg-black', 'text-white');
    });

    // Apply styling to spans with corresponding IDs in the highlightedWordIds array
    highlightedWordIds[selectedPromptNumber]?.forEach((wordId) => {
      const span = document.getElementById(String(wordId));
      if (span) {
        span.classList.add('text-black');
      }
    });
  }

  useEffect(() => {
    highlightWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPromptNumber, oneWordIdStoringFucnction]);

  let wordCounter = 0;

  return (
    <div className='flex flex-col items-center justify-between p-4'>
      {poem.map((poem) => (
        <span key={poem.id}>
          <small className='text-connote_orange'>{poem.author}</small>
          <h4 className='font-bold text-large'>{poem.name}</h4>
          <ScrollShadow className='w-[300px] h-[300px] md:h-full'>
            {poem.content.split('\n\n').map((stanza, index) => (
              <React.Fragment key={index}>
                {stanza.split('\n').map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {/* Split each line into words and add click event listener */}
                    {line.split(' ').map((word, wordIndex) => (
                      <React.Fragment key={wordCounter++}>
                        <span
                          id={String(wordCounter)}
                          onClick={(event) => oneWordIdStoringFucnction(event)}
                          className={`cursor-pointer ${
                            highlightedWordIds[selectedPromptNumber]?.includes(
                              wordCounter
                            )
                              ? 'bg-white text-black p-0.5 px-1 rounded-md shadow-lg '
                              : ''
                          }`}
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
          </ScrollShadow>
          <br></br>
        </span>
      ))}
    </div>
  );
}
