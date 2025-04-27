import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { grabCurrentEditor } from './__testutilities__/editorQuery';
import { customType } from './__testutilities__/customTyping';
import { renderEntireApp } from './__testutilities__/builder';

describe('Error handling', () => {
  it.each([
    ['bla bla'],
    ['Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley'],
  ])('hides the error after cleaning random string (%s)', async (originalCode: string) => {
    renderEntireApp();

    await userEvent.keyboard(originalCode);

    await userEvent.click(screen.getByTestId('clean'));

    const result = screen.queryByTestId('error');

    await waitFor(() => {
      expect(result).not.toBeInTheDocument();
    });
  });

  it('inform error when json is invalid', async () => {
    renderEntireApp();

    const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

    await customType(editor, 'bla bla');

    await waitFor(() => {
      const result = screen.getByTestId('error');

      expect(result.innerHTML).toEqual('invalid json');
    });
  });

  describe('validation disabled', () => {

    it('should not render error when validate json is disabled', async () => {
      renderEntireApp();

      await waitFor(() => {
        expect(screen.getByTestId('is-validate-json')).toBeChecked();
      });

      await userEvent.click(screen.getByText('validate json'));

      await waitFor(() => {
        expect(screen.getByTestId('is-validate-json')).not.toBeChecked();
      });

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, 'bla bla');

      await waitFor(() => {
        expect(screen.queryByTestId('error')).not.toBeInTheDocument();
      });
    });
  });
});
