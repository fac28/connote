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
  let topThreeColours = [
    'bg-connote_orange',
    'bg-connote_green',
    'bg-connote_white',
  ];

  // Function to process and assign highlight_colour
  function processResponses(responses) {
    // Sort responses by prompt_id
    let sortedResponses = responses.sort((a, b) => a.prompt_id - b.prompt_id);

    // Initialize an object to store the final result
    let result = sortedResponses.reduce((acc, response) => {
      // If the prompt_id is not in the result object, add it with an empty array
      if (!acc[response.prompt_id]) {
        acc[response.prompt_id] = [];
      }

      // Push the response to the corresponding prompt_id array
      acc[response.prompt_id].push(response);

      return acc;
    }, {});

    // Iterate through the result object and assign highlight_colour to the first three responses of each prompt_id
    for (let key in result) {
      result[key].slice(0, 3).forEach((response, index) => {
        response.highlight_colour = topThreeColours[index];
      });
    }

    // Flatten the result object back to an array
    let finalResult = Object.values(result).flat();

    return finalResult;
  }

  // Call the function with the provided responses
  let processedResponses = processResponses(responses);

  // Log the result
  console.log(processedResponses);

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
