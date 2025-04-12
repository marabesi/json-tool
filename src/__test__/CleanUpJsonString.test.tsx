import { render, screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';

describe('Clean up json', () => {
  beforeEach(() => {
    setUpClipboard();
  });

  afterEach(() => {
    tearDownClipboard();
  });

  it.each([
    ['{"name" : "json from clipboard"}', '{"name":"json from clipboard"}'],
    ['    {"name" : "json from clipboard"}', '{"name":"json from clipboard"}'],
    ['    {"name" : "json    from   clipboard"}', '{"name":"json    from   clipboard"}'],
    ['    { "a" : "a", "b" : "b" }', '{"a":"a","b":"b"}'],
    ['{ "a" : true,         "b" : "b" }', '{"a":true,"b":"b"}'],
    ['{ "a" : true,"b" : 123 }', '{"a":true,"b":123}'],
    ['{"key with spaces" : "json from clipboard"}', '{"key with spaces":"json from clipboard"}'],
    ['{"private_key" : "-----BEGIN PRIVATE KEY-----\nMIIEvgI\n-----END PRIVATE KEY-----\n" }', '{"private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgI\n-----END PRIVATE KEY-----\n"}'],
  ])('should clean specific spaces in a json string (%s, %s)', async (inputJson: string, desiredJson: string) => {
    render(<App />);

    await writeTextToClipboard(inputJson);

    await userEvent.click(screen.getByTestId('paste-from-clipboard'));

    expect(await screen.findByTestId('raw-json')).toHaveValue(inputJson);

    await userEvent.click(screen.getByTestId('clean-spaces'));

    expect(await screen.findByTestId('raw-result')).toHaveValue(desiredJson);
  });

  it.each([
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
  ])('should clean firebase json white spaces (%s, %s)', async (inputJson: string, desiredJson: string) => {
    render(<App />);

    await writeTextToClipboard(inputJson);

    await userEvent.click(screen.getByTestId('paste-from-clipboard'));

    expect(await screen.findByTestId('raw-json')).toHaveValue(inputJson);

    await userEvent.click(screen.getByTestId('clean-spaces'));

    expect(await screen.findByTestId('raw-result')).toHaveValue(desiredJson);
  });
});
