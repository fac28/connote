import { ResponsesType } from '@/types';

let topThreeColours = ['orange_bg_col', 'green_bg_col', 'pastel_blue_bg_col'];

export let topThreeTextColours = [
  'orange_text_col',
  'green_text_col',
  'pastel_blue_text_col',
];

export function addingHighlightAttribute(responses: ResponsesType) {
  const sortedResponses: ResponsesType = [...responses].sort(
    (a, b) => a.prompt_id - b.prompt_id
  );

  const result: Record<number, ResponsesType> = {};

  sortedResponses.forEach((response) => {
    const { prompt_id } = response;
    result[prompt_id] = [...(result[prompt_id] || []), response];
  });

  for (const key in result) {
    result[key].slice(0, 3).forEach((response, index) => {
      response.highlight_colour = topThreeColours[index];
    });
  }

  return Object.values(result).flat();
}
