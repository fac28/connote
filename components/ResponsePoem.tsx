import React from 'react';
import { PoemsType, ResponsesType } from '@/types';

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
  let wordCounter = 0;
  return (
    <div className='flex flex-wrap'>
      {poem.map((poemItem) => (
        <span key={poemItem.id}>
          <p>id: {poemItem.id}</p>
          <p>author: {poemItem.author}</p>
          <p>name: {poemItem.name}</p>
          <br />
          <p className='poemScrollOverflow'>
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

                      return (
                        <React.Fragment key={currentWordIndex}>
                          <span
                            id={String(currentWordIndex)}
                            className={isSelected ? 'bg-connote_orange' : ''}
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
          </p>
          <br />
        </span>
      ))}
    </div>
  );
}
