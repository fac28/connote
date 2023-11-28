import React, { useEffect } from 'react';
import { PoemsType } from '@/types';
import { useState } from 'react';

type children = {
  poem: PoemsType;
};

export default function PromptPoem({ poem }: children) {
  const [highlightedWordIds, setHighlightedWordIds] = useState<number[]>([]);

  function oneWordHighlightingFunction(
    event: React.MouseEvent<HTMLSpanElement>,
    word: string
  ) {
    // Check if event and event.target are defined
    if (event && event.target) {
      const clickedSpan = event.target as HTMLSpanElement;
      const spanId = parseInt(clickedSpan.id);

      const isHighlighted = highlightedWordIds.includes(spanId);

      if (isHighlighted) {
        setHighlightedWordIds((prevIds) =>
          prevIds.filter((id) => id !== spanId)
        );
      } else {
        setHighlightedWordIds((prevIds) => [...prevIds, spanId]);
      }

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
