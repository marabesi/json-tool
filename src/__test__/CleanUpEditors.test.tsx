import { act, render, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { grabCurrentEditor } from '../__testutilities__/editorQuery';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';
import { customType } from '../__testutilities__/customTyping';

describe('Clean up editors', () => {
  beforeEach(() => {
    setUpClipboard();
  });

  afterEach(() => {
    tearDownClipboard();
  });

  it('should clean editors once clean is clicked', async () => {
    const { container, getByTestId } = render(<App />);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      await customType(editor, '{{}');
    });

    await act(async () => {
      await userEvent.click(getByTestId('clean'));
    });

    expect(getByTestId('raw-json')).toHaveValue('');
    expect(getByTestId('raw-result')).toHaveValue('');
  });

  it.each([
    ['{"name" : "json from clipboard"}', '{"name":"json from clipboard"}'],
    ['    {"name" : "json from clipboard"}', '{"name":"json from clipboard"}'],
    ['    {"name" : "json    from   clipboard"}', '{"name":"json    from   clipboard"}'],
    ['{"key with spaces" : "json from clipboard"}', '{"key with spaces":"json from clipboard"}'],
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
  ])('should clean json white spaces %s, %s', async (inputJson: string, desiredJson: string) => {
    const { getByTestId } = render(<App />);

    await writeTextToClipboard(inputJson);

    await act(async () => {
      await userEvent.click(getByTestId('paste-from-clipboard'));
    });

    await waitFor(() => {
      expect(getByTestId('raw-json')).toHaveValue(inputJson);
    }, { timeout: 10000 });

    await act(async () => {
      await userEvent.click(getByTestId('clean-spaces'));
    });

    await waitFor(() => {
      expect(getByTestId('raw-result')).toHaveValue(desiredJson);
    }, { timeout: 10000 });
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

    await writeTextToClipboard(inputJson);

    await act(async () => {
      await userEvent.click(getByTestId('paste-from-clipboard'));
    });

    await waitFor(() => {
      expect(getByTestId('raw-json')).toHaveValue(inputJson);
    });

    await act(async () => {
      await userEvent.click(getByTestId('clean-new-lines'));
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

    await writeTextToClipboard(inputJson);

    await act(async () => {
      await userEvent.click(getByTestId('paste-from-clipboard'));
    });

    await waitFor(() => {
      expect(getByTestId('raw-json')).toHaveValue(inputJson);
    });

    await act(async () => {
      await userEvent.click(getByTestId('clean-new-lines-and-spaces'));
    });

    await waitFor(() => {
      expect(getByTestId('raw-result')).toHaveValue(desiredJson);
    });
  });
});
