import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import Formatter from '../core/formatter';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';
import { grabCurrentEditor } from './__testutilities__/editorQuery';

describe('Clipboard', () => {

  describe('clipboard api available', () => {
    beforeEach(() => {
      setUpClipboard();
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          matches: false,
        }))
      });
    });

    afterEach(() => {
      tearDownClipboard();
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: null
      });
    });

    it('should paste json string from copy area into the editor on clicking the button', async () => {
      render(<App />);

      await writeTextToClipboard('{}');

      await userEvent.click(screen.getByTestId('paste-from-clipboard'));

      expect(await screen.findByTestId('raw-json')).toHaveValue('{}');
      expect(await screen.findByTestId('raw-result')).toHaveValue('{}');
    });

    it('should copy json string from result editor to transfer area on clicking the button', async () => {
      render(<App />);

      jest.spyOn(global.navigator.clipboard, 'writeText');

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await userEvent.type(editor, '{{"a":"a"}', { delay: 100 });

      expect(await screen.findByTestId('raw-json')).toHaveValue('{"a":"a"}');

      await userEvent.click(screen.getByTestId('copy-json'));

      await waitFor(async () => {
        const formatter = new Formatter('{"a":"a"}');
        expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(await formatter.format());
      });
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });

  describe('clipboard api not available', () => {
    beforeEach(() => {
      // @ts-ignore
      global.navigator.clipboard = {};
    });

    it('copy json should be disabled', async () => {
      render(<App/>);

      expect(await screen.findByTestId('copy-json')).toBeDisabled();
      expect(await screen.findByTitle('Copy json is disabled due lack of browser support')).toBeInTheDocument();
    });

    it('paste json should be disabled', async () => {
      render(<App/>);

      expect(await screen.findByTestId('paste-from-clipboard')).toBeDisabled();
      expect(await screen.findByTitle('Paste from clipboard is disabled due lack of browser support')).toBeInTheDocument();
    });
  });
});
