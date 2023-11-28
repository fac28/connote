export const mapPromptIdsToIndices = (
  promptIds: number[],
  promptOrder: number[]
) => {
  const indexMap: Record<number, number> = {};

  promptOrder.forEach((promptId, index) => {
    const idFromList = promptIds.find((id) => id === promptId);
    if (idFromList !== undefined) {
      indexMap[idFromList] = index;
    }
  });

  return indexMap;
};
