import { Input } from '@nextui-org/react';
import { PromptsType } from '@/types';

type FollowupPromptProps = {
  prompts: PromptsType;
  selectedPromptNumber: number;
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
    <>
      <div>
        {prompts.map((prompt: PromptsType, index: number) =>
          index === selectedPromptNumber ? (
            <h2 key={prompt.id} className='promptPurple w-full'>
              {prompt.follow_up_prompt}
            </h2>
          ) : null
        )}
        <div className='flex flex-col items-center justify-between mt-4'>
          <div className='flex flex-wrap md:max-w-xs'>
            {prompts.map(
              (prompt: PromptsType, index: number) =>
                index === selectedPromptNumber && (
                  <span key={prompt.id}>
                    <Input
                      isRequired
                      placeholder='I think...'
                      value={inputValue}
                      onChange={(e) => onInputChange(e.target.value)}
                      maxLength={200}
                      className='w-72'
                    />
                    <br></br>
                  </span>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
