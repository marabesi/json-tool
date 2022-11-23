import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { grabCurrentEditor } from '../__testutilities__/editorQuery';

describe('Error handling', () => {
  it.concurrent.each([
    ['bla bla'],
    [faker.lorem.words(2)],
    [faker.lorem.paragraph(5)],
  ])('hides the error after cleaning random string (%s)', async (originalCode: string) => {
    const { container, getByTestId } = render(<App/>);
    const editor = grabCurrentEditor(container);

    await act(async () => {
      fireEvent.focus(editor);
      await userEvent.keyboard(originalCode);
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
