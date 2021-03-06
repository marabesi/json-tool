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

describe('json utility', () => {
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

  describe('UI elements', () => {
    test('error message is hidden by default', () => {
      render(<App />);
      const errorLabel = screen.queryByTestId(/error/);
      expect(errorLabel).toBeNull();
    });

    test('should render buy me a coffee link', () => {
      render(<App />);
      expect(screen.queryByTestId(/buy-me-a-coffee/)).toBeInTheDocument();
      expect(screen.queryByTestId(/buy-me-a-coffee/)).toHaveAttribute('href', 'https://www.buymeacoffee.com/marabesi');
      expect(screen.getByText(/Buy me a coffee/)).toBeInTheDocument();
      expect(screen.getByTestId(/buy-me-a-coffee/)).toHaveAttribute('target', '_blank');
      expect(screen.getByTestId(/buy-me-a-coffee/)).toHaveAttribute('rel', 'noreferrer');
    });

    test('should render github link', () => {
      render(<App />);
      expect(screen.queryByText(/by marabesi/)).toBeInTheDocument();
      expect(screen.queryByText(/by marabesi/)).toHaveAttribute('href', 'https://github.com/marabesi/json-tool');
      expect(screen.getByText(/by marabesi/)).toBeInTheDocument();
      expect(screen.getByText(/by marabesi/)).toHaveAttribute('target', '_blank');
      expect(screen.getByText(/by marabesi/)).toHaveAttribute('rel', 'noreferrer');
    });

    test('should render license link', () => {
      render(<App />);
      expect(screen.queryByText(/CC0 1.0 Universal/)).toBeInTheDocument();
      expect(screen.queryByText(/CC0 1.0 Universal/)).toHaveAttribute('href', 'https://github.com/marabesi/json-tool/blob/main/LICENSE.md');
      expect(screen.getByText(/CC0 1.0 Universal/)).toBeInTheDocument();
      expect(screen.getByText(/CC0 1.0 Universal/)).toHaveAttribute('target', '_blank');
      expect(screen.getByText(/CC0 1.0 Universal/)).toHaveAttribute('rel', 'noreferrer');
    });
  });

  describe('Editors', () => {
    test.each([
      ['{}', '{}'],
      ['{"a": "b"}', '{"a": "b"}'],
    ])('place %s text in the editor and receive %s', async (input, expected) => {
      const { container } = render(<App />);

      const editor = grabCurrentEditor(container);

      act(() => {
        userEvent.type(editor, input);
      });

      const result = screen.getByTestId('result');

      expect(result.nodeValue).toMatchSnapshot(expected);
    });
  });

  describe('Error handling', () => {
    test.each([
      ['bla bla'],
      ['not a json'],
    ])('hides the error after a valid json is given (%s, %s)', async (originalCode: string) => {
      const { container, getByTestId } = render(<App/>);

      const editor = grabCurrentEditor(container);

      await act(async () => {
        await userEvent.type(editor, originalCode);
      });

      act(() => {
        userEvent.click(getByTestId('clean'));
      });

      const result = screen.queryByTestId('error');

      expect(result).not.toBeInTheDocument();
    });

    test('inform error when json is invalid', async () => {
      const { container } = render(<App />);

      const editor = grabCurrentEditor(container);

      await act(async () => {
        await userEvent.type(editor, 'bla bla', { delay: 100 });
      });

      const result = screen.getByTestId('error');

      expect(result.innerHTML).toEqual('invalid json');
    });
  });

  describe('Clipboard', () => {
    beforeEach(() => {
      tearDownClipboard();
    });

    afterEach(() => {
      tearDownClipboard();
    });

    test('should paste json string from copy area into the editor on clicking the button', async () => {
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

    test('should copy json string from result editor to transfer area on clicking the button', async () => {
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

  describe('Clean up editors', () => {
    test('should clean editors once clean is clicked', async () => {
      const { container } = render(<App />);

      const editor = grabCurrentEditor(container);

      await act(async () => {
        userEvent.type(editor, '{}');
      });

      await act(async () => {
        userEvent.click(screen.getByTestId('clean'));
      });

      expect(screen.getByTestId('raw-json')).toHaveValue('');
      expect(screen.getByTestId('raw-result')).toHaveValue('');
    });

    test.each([
      ['{"name" : "json from clipboard"}', '{"name":"json from clipboard"}'],
      ['    {"name" : "json from clipboard"}', '{"name":"json from clipboard"}'],
      ['    {"name" : "json    from   clipboard"}', '{"name":"json    from   clipboard"}'],
      ['    { "a" : "a", "b" : "b" }', '{"a":"a","b":"b"}'],
      ['{ "a" : true,         "b" : "b" }', '{"a":true,"b":"b"}'],
      ['{ "a" : true,"b" : 123 }', '{"a":true,"b":123}'],
      ['{"private_key" : "-----BEGIN PRIVATE KEY-----\nMIIEvgI\n-----END PRIVATE KEY-----\n" }', '{"private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgI\n-----END PRIVATE KEY-----\n"}'],
      [`{
  "type": "aaaa",
  "project_id": "any",
  "private_key_id": "111111111111111111",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADG9w0BAQEFAASCBKgwggSkiEus62eZ\n-----END PRIVATE KEY-----\n",
  "client_email": "banana@banana",
  "client_id": "999",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/"
}`, `{
"type":"aaaa",
"project_id":"any",
"private_key_id":"111111111111111111",
"private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADG9w0BAQEFAASCBKgwggSkiEus62eZ\n-----END PRIVATE KEY-----\n",
"client_email":"banana@banana",
"client_id":"999",
"auth_uri":"https://accounts.google.com/o/oauth2/auth",
"token_uri":"https://oauth2.googleapis.com/token",
"auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
"client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/"
}`
      ],
      ['{"key with spaces" : "json from clipboard"}', '{"key with spaces":"json from clipboard"}'],
    ])('should clean json white spaces', async (inputJson: string, desiredJson: string) => {
      const { getByTestId } = render(<App />);

      setUpClipboard(inputJson);

      act(() => {
        userEvent.click(getByTestId('paste-from-clipboard'));
      });

      await waitFor(() => {
        expect(getByTestId('raw-json')).toHaveValue(inputJson);
      });

      act(() => {
        userEvent.click(screen.getByTestId('clean-spaces'));
      });


      await waitFor(() => {
        expect(getByTestId('raw-result')).toHaveValue(desiredJson);
      });
    });

    test.each([
      [`{
  "name" : "json from clipboard"
}`, '{  "name" : "json from clipboard"}'],
      [`{
  "name" : "json from clipboard",
  "last_name" : "another name"
}`, '{  "name" : "json from clipboard",  "last_name" : "another name"}'],
    ])('should clean json with new lines', async (inputJson: string, desiredJson: string) => {
      const { getByTestId } = render(<App />);

      setUpClipboard(inputJson);

      act(() => {
        userEvent.click(getByTestId('paste-from-clipboard'));
      });

      await waitFor(() => {
        expect(getByTestId('raw-json')).toHaveValue(inputJson);
      });

      act(() => {
        userEvent.click(screen.getByTestId('clean-new-lines'));
      });

      await waitFor(() => {
        expect(getByTestId('raw-result')).toHaveValue(desiredJson);
      });
    });

    test.each([
      [`{
  "name" : "json from clipboard",
  "last_name" : "another name"
}`, '{"name":"json from clipboard","last_name":"another name"}'],
    ])('should clean blank spaces and new lines in the json', async (inputJson: string, desiredJson: string) => {
      const { getByTestId } = render(<App />);

      setUpClipboard(inputJson);

      act(() => {
        userEvent.click(getByTestId('paste-from-clipboard'));
      });

      await waitFor(() => {
        expect(getByTestId('raw-json')).toHaveValue(inputJson);
      });

      act(() => {
        userEvent.click(getByTestId('clean-new-lines-and-spaces'));
      });

      await waitFor(() => {
        expect(getByTestId('raw-result')).toHaveValue(desiredJson);
      });
    });
  });

  describe('Custom spacing for formatting json', () => {
    test('should have space of 2 as default', async () => {
      render(<App />);

      const space = screen.getByDisplayValue('2');

      expect(space).toBeInTheDocument();
    });

    test('should do nothing if spacing is empty', async () => {
      const { container } = render(<App />);

      const space = screen.getByDisplayValue('2');

      act(() => {
        userEvent.clear(space);
      });

      const editor = grabCurrentEditor(container);

      await act(async () => {
        await userEvent.type(editor, '{{"a":"a"}', { delay: 100 });
      });

      const result = (screen.getByTestId('result') as HTMLInputElement);

      expect(result.value).toBeFalsy();
    });

    test.each([
      '4',
      '16'
    ])('should change spacing for %s spaces', async (spacing: string) => {
      render(<App/>);

      const space = screen.getByDisplayValue('2');

      await act(async () => {
        await userEvent.clear(space);
      });

      await act(async () => {
        await userEvent.type(space, spacing, { delay: 100 });
      });

      expect(space).toHaveValue(spacing);
    });

    test.each([
      ['4', '{{"a":"a"}', `{
    "a": "a"
}`
      ],
      ['2', '{{"a":"a"}', `{
  "a": "a"
}`
      ],
      ['8', '{{"a":"a"}', `{
        "a": "a"
}`
      ],
      ['invalid', '{{"a":"a"}', `{
  "a": "a"
}`
      ],
    ])('should format json with %s spaces', async (spacing: string, inputJson: string, outputJson: string) => {
      const { container, getByTestId } = render(<App />);

      const space = screen.getByDisplayValue('2');

      act(() => {
        userEvent.clear(space);
      });

      await act(async () => {
        await userEvent.type(space, spacing);
      });

      const editor = grabCurrentEditor(container);

      await act(async () => {
        await userEvent.type(editor, inputJson);
      });

      const result = (getByTestId('raw-result') as HTMLInputElement);

      expect(result).toHaveValue(outputJson);
    });

    test('should reformat json if space changes', async () => {
      const { container, getByTestId } = render(<App />);
      const editor = grabCurrentEditor(container);

      await act(async () => {
        await userEvent.type(editor, '{{"a":"a"}');
      });

      const space = screen.getByDisplayValue('2');

      act(() => {
        userEvent.clear(space);
      });

      await act(async () => {
        await userEvent.type(space, '4');
      });

      expect(getByTestId('raw-result')).toHaveValue(`{
    "a": "a"
}`);
    });
  });
});
