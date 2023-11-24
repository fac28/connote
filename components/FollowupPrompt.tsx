import { Input } from '@nextui-org/react';
import { PromptsType } from '@/types';

type FollowupPromptProps = {
  prompts: PromptsType;
  selectedPromptNumber: string;
  onInputChange: (value: string) => void;
  inputValue: string;
};

export default function FollowupPrompt({
  prompts,
  selectedPromptNumber,
  onInputChange,
  inputValue,
}: FollowupPromptProps) {
  return (
    <div className='flex flex-wrap'>
      {prompts.map(
        (prompt, index) =>
          index === Number(selectedPromptNumber) && (
            <span key={prompt.id}>
              <p>{prompt.follow_up_prompt}</p>
              <Input
                isRequired
                placeholder='I think...'
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
              />
              <br></br>
            </span>
          )
      )}
    </div>
  );
}
