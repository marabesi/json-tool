import { render, screen, act, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { grabCurrentEditor } from '../__testutilities__/editorQuery';

describe('Error handling', () => {
  it.each([
    ['bla bla'],
  ])('hides the error after a valid json is given (%s, %s)', async (originalCode: string) => {
    const { container, getByTestId } = render(<App/>);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      await userEvent.type(editor, originalCode);
    });

    await act(async () => {
      await userEvent.click(getByTestId('clean'));
    });

    const result = screen.queryByTestId('error');

    await waitFor(() => {
      expect(result).not.toBeInTheDocument();
    });
  });

  it('inform error when json is invalid', async () => {
    const { container } = render(<App />);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      await userEvent.type(editor, 'bla bla', { delay: 100 });
    });

    const result = screen.getByTestId('error');

    expect(result.innerHTML).toEqual('invalid json');
  });
});
