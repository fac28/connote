type children = {
  prompts: PromptsType;
  selectedPromptNumber: string;
};

type PromptsType =
  | Array<{
      id: number;
      initial_prompt: string;
      follow_up_prompt: string;
      highlighting_format: string;
    }>
  | [];

export default function FollowupPrompt({
  prompts,
  selectedPromptNumber,
}: children) {
  return (
    <div className='flex flex-wrap'>
      {prompts.map(
        (prompt, index) =>
          index === Number(selectedPromptNumber) && (
            <span key={prompt.id}>
              <p>followupprompt: {prompt.follow_up_prompt}</p>
              <br></br>
            </span>
          )
      )}
    </div>
  );
}
