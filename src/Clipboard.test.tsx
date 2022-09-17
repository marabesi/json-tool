import { render, screen, act, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { Blob } from 'buffer';
import Formatter from './core/formatter';

function grabCurrentEditor(container: HTMLElement): HTMLElement {
  const editor = container.querySelector('[data-testid="json"] .cm-content');
  if (!editor) {
    throw new Error('Could not find editor');
  }
  return editor as HTMLElement;
}

function setUpClipboard(json: string) {
  Object.assign(global.navigator,
    {
      clipboard: {
        async read() {
          const blob = new Blob([json], { type: 'text/plain' });

          return Promise.resolve([
            {
              [blob.type]: blob,
              types: [ blob.type ],
              getType: () => blob
            }
          ]);
        }
      }
    });
}

function tearDownClipboard() {
  Object.assign(global.navigator, {
    clipboard: null
  });
}

describe('Clipboard', () => {
  beforeEach(() => {
    tearDownClipboard();
  });

  afterEach(() => {
    tearDownClipboard();
  });

  it('should paste json string from copy area into the editor on clicking the button', async () => {
    const { getByTestId } = render(<App />);

    setUpClipboard('{}');

    act(() => {
      userEvent.click(getByTestId('paste-from-clipboard'));
    });

    await waitFor(() => {
      expect(getByTestId('raw-json')).toHaveValue('{}');
      expect(getByTestId('raw-result')).toHaveValue('{}');
    });
  });

  it('should copy json string from result editor to transfer area on clicking the button', async () => {
    const { container, getByTestId } = render(<App />);

    Object.assign(global.navigator, {
      clipboard :{
        async writeText(text: string) {
          return text;
        }
      }
    });

    jest.spyOn(global.navigator.clipboard, 'writeText');

    const editor = grabCurrentEditor(container);

    act(() => {
      userEvent.type(editor, '{{"a":"a"}');
    });

    await waitFor(() => {
      expect(getByTestId('raw-json')).toHaveValue('{"a":"a"}');
    });

    act(() => {
      userEvent.click(screen.getByTestId('copy-json'));
    });

    const formatter = new Formatter('{"a":"a"}');

    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(await formatter.format());
  });
});
