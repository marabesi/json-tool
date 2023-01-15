import { render, act, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { grabCurrentEditor } from './__testutilities__/editorQuery';
import { customType } from './__testutilities__/customTyping';

describe('Error handling', () => {
  it.each([
    ['bla bla'],
    ['Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley'],
  ])('hides the error after cleaning random string (%s)', async (originalCode: string) => {
    const { container, getByTestId,queryByTestId } = render(<App/>);
    const editor = grabCurrentEditor(container);

    await act(async () => {
      fireEvent.focus(editor);
      await userEvent.keyboard(originalCode);
    });

    await act(async () => {
      await userEvent.click(getByTestId('clean'));
    });

    const result = queryByTestId('error');

    await waitFor(() => {
      expect(result).not.toBeInTheDocument();
    });
  });

  it('inform error when json is invalid', async () => {
    const { container, getByTestId } = render(<App />);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      await customType(editor, 'bla bla');
    });

    await waitFor(() => {
      const result = getByTestId('error');

      expect(result.innerHTML).toEqual('invalid json');
    });
  });
});
