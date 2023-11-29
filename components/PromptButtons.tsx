import { Button, ButtonGroup } from '@nextui-org/react';
import { isSubmitDisabled } from '@/utils/supabase/models/isSubmitDisabled';
import { PromptsType } from '@/types';

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
    <ButtonGroup>
      <Button
        disabled={selectedPromptNumber === 0}
        onClick={handlePrevClick}
        className={`${
          selectedPromptNumber === 0
            ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
            : ''
        }`}
      >
        Prev
      </Button>
      <Button
        disabled={
          selectedPromptNumber === 2 &&
          isSubmitDisabled(prompts, highlightedWordIds, promptInputs)
        }
        className={`${
          selectedPromptNumber === 2 &&
          isSubmitDisabled(prompts, highlightedWordIds, promptInputs)
            ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
            : ''
        }`}
        onClick={handleNextClick}
      >
        {selectedPromptNumber === 2 ? 'Submit' : 'Next'}
      </Button>
    </ButtonGroup>
  );
}
