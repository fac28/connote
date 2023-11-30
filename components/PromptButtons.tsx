import { Button, ButtonGroup } from '@nextui-org/react';
import { isSubmitDisabled } from '@/utils/promptPageHandlingFunctions/isSubmitDisabled';
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

let goBackCounter = 0;
function goBack() {
  if (goBackCounter % 2 === 0) {
    alert('Are you sure you want to go back? Your answers might not be saved.');
    goBackCounter++;
    return false;
  } else {
    goBackCounter++;
    return true;
  }
}

export default function PromptButtons({
  selectedPromptNumber,
  handlePrevClick,
  handleNextClick,
  prompts,
  highlightedWordIds,
  promptInputs,
}: PromptButtonsProps) {
  const handleGoBack = () => {
    if (goBack()) {
      handlePrevClick();
    }
  };

  return (
    <ButtonGroup className='flex items-center p-4'>
      <Button
        onClick={selectedPromptNumber === 0 ? handleGoBack : handlePrevClick}
        className={`bg-connote_orange rounded-xl mx-12 `}
      >
        {selectedPromptNumber === 0 ? 'Go Back' : <FaChevronLeft />}
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
