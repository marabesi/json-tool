export const matchMedia = (matches: boolean) => {
  return {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  };
};

export const emptyMatchMedia = () => {
  return {
    writable: true,
    value: null
  };
};