import { PromptsType } from '@/types';

type children = {
  prompts: PromptsType;
  selectedPromptNumber: number;
};

export default function InitialPromptBanner({
  prompts,
  selectedPromptNumber,
}: children) {
  return (
    <>
      {prompts.map((prompt, index) =>
        index === selectedPromptNumber ? (
          <h2 key={prompt.id} className='promptPurple w-full'>
            {prompt.initial_prompt}
          </h2>
        ) : null
      )}
    </>
  );
}
