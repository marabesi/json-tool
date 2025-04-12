import { render, waitFor, screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { grabCurrentEditor } from './__testutilities__/editorQuery';
import { customType } from './__testutilities__/customTyping';

describe('Error handling', () => {
  it.each([
    ['bla bla'],
    ['Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley'],
  ])('hides the error after cleaning random string (%s)', async (originalCode: string) => {
    render(<App/>);

    await userEvent.keyboard(originalCode);

    await userEvent.click(screen.getByTestId('clean'));

    const result = screen.queryByTestId('error');

    await waitFor(() => {
      expect(result).not.toBeInTheDocument();
    });
  });

  it('inform error when json is invalid', async () => {
    render(<App />);

    const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

    await customType(editor, 'bla bla');

    const result = await screen.findByTestId('error');

    expect(result.innerHTML).toEqual('invalid json');
  });

  describe('validation disabled', () => {

    it('should not render error when validate json is disabled', async () => {
      render(<App/>);

      expect(await screen.findByTestId('is-validate-json')).toBeChecked();

      await userEvent.click(screen.getByText('validate json'));

      expect(await screen.findByTestId('is-validate-json')).not.toBeChecked();

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, 'bla bla');

      await waitFor(() => {
        expect(screen.queryByTestId('error')).not.toBeInTheDocument();
      });
    });
  });
});
