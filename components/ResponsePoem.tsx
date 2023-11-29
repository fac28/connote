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
  // let topThreeColours = [
  //   'bg-connote_orange',
  //   'bg-connote_green',
  //   'bg-connote_pastel_blue',
  // ];

  // // Function to process and assign highlight_colour
  // function processResponses(responses) {
  //   let sortedResponses = responses.sort((a, b) => a.prompt_id - b.prompt_id);

  //   let result = sortedResponses.reduce((acc, response) => {
  //     if (!acc[response.prompt_id]) {
  //       acc[response.prompt_id] = [];
  //     }

  //     acc[response.prompt_id].push(response);

  //     return acc;
  //   }, {});

  //   for (let key in result) {
  //     result[key].slice(0, 3).forEach((response, index) => {
  //       response.highlight_colour = topThreeColours[index];
  //     });
  //   }

  //   let finalResult = Object.values(result).flat();

  //   return finalResult;
  // }

  // let processedResponses = processResponses(responses);

  return (
    <div className='flex flex-wrap'>
      {poem.map((poemItem) => (
        <span key={poemItem.id}>
          <p>id: {poemItem.id}</p>
          <p>author: {poemItem.author}</p>
          <p>name: {poemItem.name}</p>
          <br />
          <p>
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

                      return (
                        <React.Fragment key={currentWordIndex}>
                          <span
                            id={String(currentWordIndex)}
                            className={
                              isSelected
                                ? matchingResponse.highlight_colour
                                : ''
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
          </p>
          <br />
        </span>
      ))}
    </div>
  );
}
