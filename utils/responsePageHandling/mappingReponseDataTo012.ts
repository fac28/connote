import { ResponsesType, PromptsType } from '@/types';

export type PoemType = {
  id: number;
  author: string;
  name: string;
  content: string;
  first_prompt_id: number;
  second_prompt_id: number;
  third_prompt_id: number;
  display_date: string;
};

export function updateResponses012(poem: PoemType, responses: ResponsesType) {
  return responses.map((response) => {
    let updatedResponse = { ...response };

    if (response.prompt_id === poem.first_prompt_id) {
      updatedResponse.prompt_id = 0;
    } else if (response.prompt_id === poem.second_prompt_id) {
      updatedResponse.prompt_id = 1;
    } else if (response.prompt_id === poem.third_prompt_id) {
      updatedResponse.prompt_id = 2;
    }

    return updatedResponse;
  });
}

export function updatePrompts012(prompts: any) {
  return prompts.map((prompt: any, index: any) => {
    return {
      ...prompt,
      id: index, // Sets the id to the current index (0, 1, or 2)
    };
  });
}
