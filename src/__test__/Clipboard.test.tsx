import { render, act, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import Formatter from '../core/formatter';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';
import { grabCurrentEditor } from '../__testutilities__/editorQuery';

describe('Clipboard', () => {

  describe('clipboard api available', () => {
    beforeEach(() => {
      setUpClipboard();
    });

    afterEach(() => {
      tearDownClipboard();
    });

    it('should paste json string from copy area into the editor on clicking the button', async () => {
      const { getByTestId } = render(<App />);

      await writeTextToClipboard('{}');

      await act(async () => {
        await userEvent.click(getByTestId('paste-from-clipboard'));
      });

      await waitFor(() => {
        expect(getByTestId('raw-json')).toHaveValue('{}');
        expect(getByTestId('raw-result')).toHaveValue('{}');
      });
    });

    it('should copy json string from result editor to transfer area on clicking the button', async () => {
      const { container, getByTestId } = render(<App />);

      jest.spyOn(global.navigator.clipboard, 'writeText');

      const editor = grabCurrentEditor(container);

      await act(async () => {
        await userEvent.type(editor, '{{"a":"a"}');
      });

      await waitFor(() => {
        expect(getByTestId('raw-json')).toHaveValue('{"a":"a"}');
      });

      await act(async () => {
        await userEvent.click(getByTestId('copy-json'));
      });


      await waitFor(async () => {
        const formatter = new Formatter('{"a":"a"}');
        expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(await formatter.format());
      });
    });
  });

  describe('clipboard api not available', () => {
    beforeEach(() => {
      // @ts-ignore
      global.navigator.clipboard = {};
    });

    it('copy json should be disabled', async () => {
      const { getByTestId, getByTitle } = render(<App/>);

      await waitFor(async () => {
        expect(getByTestId('copy-json')).toBeDisabled();
        expect(getByTitle('Copy json is disabled due lack of browser support')).toBeInTheDocument();
      });
    });

    it('paste json should be disabled', async () => {
      const { getByTestId, getByTitle } = render(<App/>);

      await waitFor(async () => {
        expect(getByTestId('paste-from-clipboard')).toBeDisabled();
        expect(getByTitle('Paste from clipboard is disabled due lack of browser support')).toBeInTheDocument();
      });
    });
  });
});
