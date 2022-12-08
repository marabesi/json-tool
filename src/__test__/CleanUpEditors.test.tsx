import { act, render, RenderResult, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { grabCurrentEditor } from '../__testutilities__/editorQuery';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';
import { customType } from '../__testutilities__/customTyping';

describe('Clean up editors', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    setUpClipboard();
    wrapper = render(<App />);
  });

  afterEach(() => {
    tearDownClipboard();
    wrapper.unmount();
  });

  it('should clean editors once clean is clicked', async () => {
    const { container, getByTestId } = wrapper;

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

  it.skip.each([
    [`{
  "name" : "json from clipboard",
  "last_name" : "another name"
}`, '{"name":"json from clipboard","last_name":"another name"}'],
  ])('should clean blank spaces and new lines in the json (%s, %s)', async (inputJson: string, desiredJson: string) => {
    const { getByTestId } = wrapper;

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
