import { act, render, RenderResult, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';

describe('Clean up json new lines', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    setUpClipboard();
    wrapper = render(<App />);
  });

  afterEach(() => {
    tearDownClipboard();
    wrapper.unmount();
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
    const { getByTestId } = wrapper;

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
    }, { timeout: 10000 });
  });
});
