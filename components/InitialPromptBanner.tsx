import { PromptsType } from '@/types';

type children = {
  prompts: any;
  selectedPromptNumber: number;
};

export default function InitialPromptBanner({
  prompts,
  selectedPromptNumber,
}: children) {
  return (
    <>
      {prompts.map((prompt: any, index: number) =>
        index === selectedPromptNumber ? (
          <h2 key={prompt.id} className='promptPurple w-full'>
            {prompt.initial_prompt}
          </h2>
        ) : null
      )}
    </>
  );
}
