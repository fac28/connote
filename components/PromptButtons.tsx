import { Button, ButtonGroup } from '@nextui-org/react';
import { isSubmitDisabled } from '@/utils/supabase/models/isSubmitDisabled';
import { PromptsType } from '@/types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

type PromptButtonsProps = {
  selectedPromptNumber: number;
  handlePrevClick: () => void;
  handleNextClick: () => void;
  prompts: PromptsType;
  highlightedWordIds: number[][];
  promptInputs: string[];
};

export default function PromptButtons({
  selectedPromptNumber,
  handlePrevClick,
  handleNextClick,
  prompts,
  highlightedWordIds,
  promptInputs,
}: PromptButtonsProps) {
  return (
    <ButtonGroup className='flex items-center p-4'>
      <Button
        disabled={selectedPromptNumber === 0}
        onClick={handlePrevClick}
        className={`bg-connote_orange rounded-xl mx-12 ${
          selectedPromptNumber === 0 ? ' text-gray-500 cursor-not-allowed' : ''
        }`}
      >
        <FaChevronLeft />
      </Button>
      <Button
        disabled={
          selectedPromptNumber === 2 &&
          isSubmitDisabled(prompts, highlightedWordIds, promptInputs)
        }
        className={`bg-connote_orange rounded-xl mx-12 ${
          selectedPromptNumber === 2 &&
          isSubmitDisabled(prompts, highlightedWordIds, promptInputs)
            ? 'text-gray-500 opacity-70 rounded-xl cursor-not-allowed'
            : ''
        }`}
        onClick={handleNextClick}
      >
        {selectedPromptNumber === 2 ? 'Submit' : <FaChevronRight />}
      </Button>
    </ButtonGroup>
  );
}
