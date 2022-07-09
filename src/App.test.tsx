import { fireEvent, render, screen, act } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { Blob } from 'buffer';
import Formatter from './core/formatter';

function grabCurrentEditor(container: HTMLElement): HTMLElement {
  const editor = container.querySelector('[data-testid=json]');
  if (!editor) {
    throw new Error('Could not find editor');
  }
  return editor as HTMLElement;
}

describe('json utility', () => {

  test('renders place your json here label', () => {
    render(<App />);
    const placeJsonLabel = screen.getByTestId('label-json');
    expect(placeJsonLabel).toBeInTheDocument();
  });

  test('renders result label', () => {
    render(<App />);
    const resultLabel = screen.getByTestId('label-result');
    expect(resultLabel).toBeInTheDocument();
  });

  test('renders resulting formatted json label', () => {
    render(<App />);
    const resultLabel = screen.getByText(/result/i);
    expect(resultLabel).toBeInTheDocument();
  });

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
    expect(screen.getByText(/Buy me a coffee/)).toHaveAttribute('target', '_blank');
    expect(screen.getByText(/Buy me a coffee/)).toHaveAttribute('rel', 'noreferrer');
  });

  test.each([
    ['{}', '{}'],
    ['{"a": "b"}', '{"a": "b"}'],
  ])('place %s text in the editor and receive %s', async (input, expected) => {
    const {container} = render(<App />);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      await fireEvent.change(editor, {target: { value: input }});
    });

    const result = screen.getByTestId('result');

    expect(result.nodeValue).toMatchSnapshot(expected);
  });

  test('inform error when json is invalid', async () => {
    const {container} = render(<App />);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      fireEvent.change(editor, {target: { value: 'bla bla' }});
    });

    const result = screen.getByTestId('error');

    expect(result.innerHTML).toEqual('invalid json');
  });

  test.each([
    ['bla bla', '{}'],
    ['not a json', ''],
  ])('hides the error after a valid json is given', async (originalCode: string, afterChangeCode: string) => {
    const {container} = render(<App />);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      fireEvent.change(editor, {target: { value: originalCode }});
    });

    await act(async () => {
      fireEvent.change(editor, {target: { value: afterChangeCode }});
    });

    const result = screen.queryByTestId('error');

    expect(result).toBeNull();
  });

  test('should paste json string from copy area into the editor', async () => {
    const {container} = render(<App />);

    const editor = grabCurrentEditor(container);
    await act(async () => {
      userEvent.paste(editor, '{}');
    });

    const result = screen.getByTestId('result');

    expect(result).toHaveValue('{}');
  });

  test('should paste json string from copy area into the editor on clicking the button', async () => {
    const {container} = render(<App />);

    Object.assign(global.navigator,
      {
        clipboard :{
          async read() {
            const blob = new Blob([JSON.stringify({})], { type: 'text/plain' });

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

    await act(async () => {
      const fromClipboard = screen.getByTestId('paste-from-clipboard');
      fromClipboard.click();
    });

    expect(grabCurrentEditor(container)).toHaveValue('{}');
    expect(screen.getByTestId('result')).toHaveValue('{}');
  });

  test('should copy json string from result editor to transfer area on clicking the button', async () => {
    const {container} = render(<App />);

    Object.assign(global.navigator, {
      clipboard :{
        async writeText(text: string) {
          return text;
        }
      }
    });

    jest.spyOn(global.navigator.clipboard, 'writeText');

    const editor = grabCurrentEditor(container);

    await act(async () => {
      userEvent.paste(editor, '{"a":"a"}');
    });

    await act(async () => {
      userEvent.click(screen.getByTestId('copy-json'));
    });

    const formatter = new Formatter('{"a":"a"}');

    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(await formatter.format());
  });

  test('should clean editors once clean is clicked', async () => {
    const {container} = render(<App />);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      userEvent.paste(editor, '{}');
    });

    await act(async () => {
      userEvent.click(screen.getByTestId('clean'));
    });

    const result = screen.getByTestId('result');

    expect(editor).toHaveValue('');
    expect(result).toHaveValue('');
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
    const {container} = render(<App />);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      userEvent.paste(editor, inputJson);
    });

    await act(async () => {
      userEvent.click(screen.getByTestId('clean-spaces'));
    });

    const result = screen.getByTestId('result');

    expect(editor).toHaveValue(inputJson);
    expect(result).toHaveValue(desiredJson);
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
    const {container} = render(<App />);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      userEvent.paste(editor, inputJson);
    });

    await act(async () => {
      userEvent.click(screen.getByTestId('clean-new-lines'));
    });

    const result = screen.getByTestId('result');

    expect(editor).toHaveValue(inputJson);
    expect(result).toHaveValue(desiredJson);
  });

  test.each([
    [`{
  "name" : "json from clipboard",
  "last_name" : "another name"
}`, '{"name":"json from clipboard","last_name":"another name"}'],
  ])('should clean blank spaces and new lines in the json', async (inputJson: string, desiredJson: string) => {
    const {container} = render(<App />);

    const editor = grabCurrentEditor(container);
    await act(async () => {
      userEvent.paste(editor, inputJson);
    });

    await act(async () => {
      userEvent.click(screen.getByTestId('clean-new-lines-and-spaces'));
    });

    const result = screen.getByTestId('result');

    expect(editor).toHaveValue(inputJson);
    expect(result).toHaveValue(desiredJson);
  });

  describe('custom spacing for formatting json', () => {
    test('should have space of 2 as default', async () => {
      render(<App />);

      const space = screen.getByDisplayValue('2');

      expect(space).toBeInTheDocument();
    });

    test('should do nothing if spacing is empty', async () => {
      const {container} = render(<App />);

      const space = screen.getByDisplayValue('2');

      await act(async () => {
        fireEvent.input(space, { target: { value: '' }});
      });

      const editor = grabCurrentEditor(container);

      await act(async () => {
        fireEvent.input(editor, { target: { value: '{"a":"a"}' }});
      });

      const result = (screen.getByTestId('result') as HTMLInputElement);

      expect(result.value).toBe('');
    });

    test.each([
      "4",
      "16"
    ])('should change spacing for %s spaces', async (spacing: string) => {
      render(<App />);

      const space = screen.getByDisplayValue('2');

      await act(async () => {
        fireEvent.input(space, { target: { value: '' }});
      });

      await act(async () => {
        fireEvent.input(space, { target: { value: spacing }});
      });


      expect(space).toHaveValue(spacing);
    });

    test.each([
      ['4', '{"a":"a"}', `{
    "a": "a"
}`
      ],
      ['2', '{"a":"a"}', `{
  "a": "a"
}`
      ],
      ['8', '{"a":"a"}', `{
        "a": "a"
}`
      ],
      ['invalid', '{"a":"a"}', `{
  "a": "a"
}`
      ],
    ])('should format json with %s spaces', async (spacing: string, inputJson: string, outputJson: string) => {
      const {container} = render(<App />);

      const space = screen.getByDisplayValue('2');

      await act(async () => {
        fireEvent.input(space, { target: { value: '' }});
      });

      await act(async () => {
        fireEvent.input(space, { target: { value: spacing }});
      });

      const editor = grabCurrentEditor(container);

      await act(async () => {
        fireEvent.input(editor, { target: { value: inputJson }});
      });

      const result = (screen.getByTestId('result') as HTMLInputElement);

      expect(result.value).toBe(outputJson);
    });

    test('should reformat json if space changes', async () => {
      const {container} = render(<App />);
      const editor = grabCurrentEditor(container);

      await act(async () => {
        fireEvent.input(editor, { target: { value: '{"a":"a"}' }});
      });

      const space = screen.getByDisplayValue('2');

      await act(async () => {
        fireEvent.input(space, { target: { value: '' }});
      });

      await act(async () => {
        fireEvent.input(space, { target: { value: 4 }});
      });

      const result = (screen.getByTestId('result') as HTMLInputElement);

      expect(result.value).toBe(`{
    "a": "a"
}`);
    });
  });
});
