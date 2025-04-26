import { RenderResult, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';
import { grabCurrentEditor } from './__testutilities__/editorQuery';
import { customType } from './__testutilities__/customTyping';
import { renderEntireApp } from './__testutilities__/builder';

describe('Clean up editors', () => {

  beforeEach(() => {
    setUpClipboard();
  });

  afterEach(() => {
    tearDownClipboard();
  });

  it('should clean editors once clean is clicked', async () => {
    const view: RenderResult = renderEntireApp();
    const { container } = view;

    const editor = grabCurrentEditor(container);

    await customType(editor, '{{}');

    await userEvent.click(screen.getByTestId('clean'));

    await waitFor(() => {
      expect(screen.getByTestId('raw-json')).toHaveValue('');
    });
    expect(screen.getByTestId('raw-result')).toHaveValue('');
  });

  it.each([
    [`{
  "name" : "json from clipboard",
  "last_name" : "another name"
}`, '{"name":"json from clipboard","last_name":"another name"}'],
  ])('should clean blank spaces and new lines in the json (%s, %s)', async (inputJson: string, desiredJson: string) => {
    renderEntireApp();

    await writeTextToClipboard(inputJson);

    await userEvent.click(screen.getByTestId('paste-from-clipboard'));

    await waitFor(() => {
      expect(screen.getByTestId('raw-json')).toHaveValue(inputJson);
    });

    await userEvent.click(screen.getByTestId('clean-new-lines-and-spaces'));

    await waitFor(() => {
      expect(screen.getByTestId('raw-result')).toHaveValue(desiredJson);
    });
  });
});
