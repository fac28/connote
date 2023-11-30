import { ResponsesType } from '@/types';

export let topThreeColours = [
  'bg-connote_orange',
  'bg-connote_green',
  'bg-connote_pastel_blue',
];

export function addingHighlightAttribute(responses: ResponsesType) {
  let sortedResponses = [...responses].sort(
    (a, b) => a.prompt_id - b.prompt_id
  );

  let result: Record<number, ResponsesType> = {};

  sortedResponses.forEach((response) => {
    if (!result[response.prompt_id]) {
      result[response.prompt_id] = [];
    }

    result[response.prompt_id].push(response);
  });

  for (let key in result) {
    result[key].slice(0, 3).forEach((response, index) => {
      response.highlight_colour = topThreeColours[index];
    });
  }

  let finalResult = Object.values(result).flat();

  return finalResult;
}
