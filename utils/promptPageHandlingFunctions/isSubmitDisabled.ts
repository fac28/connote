import { PromptsType } from '@/types';

export const isSubmitDisabled = (
  prompts: PromptsType,
  highlightedWordIds: number[][],
  promptInputs: string[]
) => {
  for (let i = 0; i < prompts.length; i++) {
    if (
      (highlightedWordIds[i].length === 0 && promptInputs[i]) ||
      ((!promptInputs[i] || !promptInputs[i].trim()) &&
        highlightedWordIds[i].length > 0)
    ) {
      return true; // Disable if any pair is incomplete.
    }
  }
  if (highlightedWordIds.every((ids) => ids.length === 0)) {
    return true; //Disable if no responses recorded at all.
  }
  return false; // Enable if all pairs are complete or empty.
};
