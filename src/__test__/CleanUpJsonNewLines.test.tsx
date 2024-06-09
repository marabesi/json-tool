import { render, waitFor, screen } from '@testing-library/react';
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

    await waitFor(() => {
      expect(screen.getByTestId('raw-json')).toHaveValue(inputJson);
    });

    await userEvent.click(screen.getByTestId('clean-new-lines'));

    await waitFor(() => {
      expect(screen.getByTestId('raw-result')).toHaveValue(desiredJson);
    }, { timeout: 10000 });
  });
});
