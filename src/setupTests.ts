// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jsdom-worker';

const fmt2json = require('format-to-json');

// @ts-ignore
// eslint-disable-next-line no-undef
globalThis.fmt2json = fmt2json;

// @ts-ignore
// eslint-disable-next-line no-undef
globalThis.importScripts = (url: string) => {
  console.log(`returning null for url ${url}`);
  return null;
};

beforeEach(() => {
  jest.setTimeout(10000);

  document.createRange = () => {
    const range = new Range();

    range.getBoundingClientRect = jest.fn();

    range.getClientRects = () => {
      return {
        item: () => null,
        length: 0,
        [Symbol.iterator]: jest.fn()
      };
    };

    return range;
  };
});
