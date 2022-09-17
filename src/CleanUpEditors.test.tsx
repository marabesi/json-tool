import { render, screen, act, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { Blob } from 'buffer';

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
describe('Clean up editors', () => {
  it('should clean editors once clean is clicked', async () => {
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

  it.each([
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

  it.each([
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

  it.each([
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
