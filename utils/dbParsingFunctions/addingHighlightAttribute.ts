import { ResponsesType } from '@/types';

export let topThreeColours = [
  'bg-connote_orange',
  'bg-connote_green',
  'bg-connote_pastel_blue',
];

export let topThreeTextColours = [
  'text-connote_orange',
  'text-connote_green',
  'text-connote_pastel_blue',
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
