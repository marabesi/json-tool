import { render, screen, act } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

function grabCurrentEditor(container: HTMLElement): HTMLElement {
  const editor = container.querySelector('[data-testid="json"] .cm-content');
  if (!editor) {
    throw new Error('Could not find editor');
  }
  return editor as HTMLElement;
}

describe.skip('Error handling', () => {
  it.each([
    ['bla bla'],
    ['not a json'],
  ])('hides the error after a valid json is given (%s, %s)', async (originalCode: string) => {
    const { container, getByTestId } = render(<App/>);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      await userEvent.type(editor, originalCode);
    });

    act(() => {
      userEvent.click(getByTestId('clean'));
    });

    const result = screen.queryByTestId('error');

    expect(result).not.toBeInTheDocument();
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
