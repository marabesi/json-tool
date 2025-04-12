import { render, screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';

describe('Clean up json new lines', () => {
  beforeEach(() => {
    setUpClipboard();
  });

  afterEach(() => {
    tearDownClipboard();
  });

  it.each([
    [`{
  "name" : "json from clipboard"
}`, '{  "name" : "json from clipboard"}'],
    [`{
  "name" : "json from clipboard",
  "last_name" : "another name"
}`, '{  "name" : "json from clipboard",  "last_name" : "another name"}'],
  ])('should clean json with new lines (%s, %s)', async (inputJson: string, desiredJson: string) => {
    render(<App />);

    await writeTextToClipboard(inputJson);

    await userEvent.click(screen.getByTestId('paste-from-clipboard'));

    expect(await screen.findByTestId('raw-json')).toHaveValue(inputJson);

    await userEvent.click(screen.getByTestId('clean-new-lines'));

    expect(await screen.findByTestId('raw-result')).toHaveValue(desiredJson);
  });
});
