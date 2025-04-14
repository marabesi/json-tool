// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jsdom-worker';
import { TextEncoder, TextDecoder } from 'util';

const fmt2json = require('format-to-json');

Object.assign(global, { TextDecoder, TextEncoder });

// @ts-ignore
// eslint-disable-next-line no-undef
globalThis.fmt2json = fmt2json;

// @ts-ignore
// eslint-disable-next-line no-undef
globalThis.importScripts = (url: string) => {
  console.log(`returning null for url ${url}`);
  return null;
};

jest.setTimeout(30000);

beforeEach(() => {
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
