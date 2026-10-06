export const maxScrollTop = (scrollHeight: number, clientHeight: number): number => {
  return Math.max(0, scrollHeight - clientHeight);
};

export const scrollRatio = (scrollTop: number, scrollHeight: number, clientHeight: number): number => {
  const max = maxScrollTop(scrollHeight, clientHeight);

  if (max === 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, scrollTop / max));
};

export const scrollTopForRatio = (ratio: number, scrollHeight: number, clientHeight: number): number => {
  return Math.min(1, Math.max(0, ratio)) * maxScrollTop(scrollHeight, clientHeight);
};
