export type PromptsType =
  | Array<{
      id: number;
      initial_prompt: string;
      follow_up_prompt: string;
      highlighting_format: string;
    }>
  | [];

export type PoemsType =
  | Array<{
      id: number;
      author: string;
      name: string;
      content: string;
      first_prompt_id: number;
      second_prompt_id: number;
      third_prompt_id: number;
      display_date: string;
      image: string;
    }>
  | [];

export type ResponsesType =
  | Array<{
      id: number;
      poem_id: number;
      prompt_id: number;
      response_selected: number[];
      response_written: string;
      user_id: string;
      user?: {
        username: string;
      };
    }>
  | [];

export type ReactsType =
  | Array<{
      id: number;
      response_id: number;
      reacter_id: string;
      type: string;
      reacter?: {
        username: string;
      };
    }>
  | [];
