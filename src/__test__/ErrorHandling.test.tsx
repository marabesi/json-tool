import { render, act, waitFor, fireEvent } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { grabCurrentEditor } from '../__testutilities__/editorQuery';
import { customType } from '../__testutilities__/customTyping';

describe('Error handling', () => {
  it.each([
    ['bla bla'],
    [faker.lorem.words(2)],
    [faker.lorem.paragraph(5)],
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
