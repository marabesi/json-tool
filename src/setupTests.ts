// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import toast from 'react-hot-toast';
import 'jsdom-worker';
import { TextEncoder, TextDecoder } from 'util';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fmt2json = require('format-to-json');

Object.assign(global, { TextDecoder, TextEncoder });

// @ts-expect-error fmt2json is injected as a global for the worker simulation
// eslint-disable-next-line no-undef
globalThis.fmt2json = fmt2json;

// @ts-expect-error importScripts is a worker-only global, stubbed here for jsdom
// eslint-disable-next-line no-undef
globalThis.importScripts = (url: string) => {
  console.log(`returning null for url ${url}`);
  return null;
};

jest.setTimeout(30000);

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();

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

  // reset because the screen persists the toast between tests for some
  // reason. It is cached, and I am not sure where the reset should be.
  toast.dismiss();
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();

  // reset because the screen persists the toast between tests for some
  // reason. It is cached, and I am not sure where the reset should be.
  toast.dismiss();
});
