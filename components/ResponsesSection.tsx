'use client';
import React from 'react';
import { Button, ButtonGroup } from '@nextui-org/react';
import { ResponsesType, PromptsType } from '@/types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import ResponseItem from './ResponseItem';

type ResponsesSectionProps = {
  updatedResponses: ResponsesType;
  reupdatedResponses: ResponsesType;
  updatedPrompts: PromptsType;
  selectedPromptNumber: number;
  handlePrevClick: () => void;
  handleNextClick: () => void;
  hearts: { [key: number]: number };
  likedResponses: { [key: number]: boolean };
  handleHeartsClick: (responseId: number, userId: string) => Promise<void>;
  // Adjusted to match the function signature
  loadingHearts: boolean;
};

export default function ResponsesSection({
  hearts,
  likedResponses,
  handleHeartsClick,
  loadingHearts,
  reupdatedResponses,
  updatedPrompts,
  selectedPromptNumber,
  handlePrevClick,
  handleNextClick,
}: ResponsesSectionProps) {
  return (
    <div className='flex flex-col items-center justify-between p-4'>
      <div className='flex flex-wrap max-w-xs '>
        {updatedPrompts.map(
          (prompt) =>
            prompt.id === selectedPromptNumber && (
              <span key={prompt.id}>
                {reupdatedResponses
                  .filter((response) => response.prompt_id === prompt.id)
                  .sort((a, b) => (hearts[b.id] || 0) - (hearts[a.id] || 0))
                  .map((response, index) => (
                    <ResponseItem
                      key={response.id}
                      response={response}
                      index={index}
                      hearts={hearts}
                      likedResponses={likedResponses}
                      handleHeartsClick={handleHeartsClick}
                      loadingHearts={loadingHearts}
                    />
                  ))}
              </span>
            )
        )}
      </div>

      <ButtonGroup className='mt-4'>
        <Button
          disabled={selectedPromptNumber === 0}
          onClick={handlePrevClick}
          className={`bg-connote_orange rounded-xl mx-12 ${
            selectedPromptNumber === 0 ? 'text-gray-500 cursor-not-allowed' : ''
          }`}
        >
          <FaChevronLeft />
        </Button>
        <Button
          className='bg-connote_orange rounded-xl mx-12'
          onClick={handleNextClick}
        >
          {selectedPromptNumber === 2 ? 'Done' : <FaChevronRight />}
        </Button>
      </ButtonGroup>
    </div>
  );
}
