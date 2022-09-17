import { render, screen, act, waitFor, fireEvent, within } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

function grabCurrentEditor(container: HTMLElement): HTMLElement {
  const editor = container.querySelector('[data-testid="json"] .cm-content');
  if (!editor) {
    throw new Error('Could not find editor');
  }
  return editor as HTMLElement;
}

describe('Editors', () => {
  beforeEach(() => {
    document.createRange = () => {
      const range = new Range();

      range.getBoundingClientRect = jest.fn();

      range.getClientRects = () => {
        return {
          item: () => null,
          length: 0,
          [Symbol.iterator]: jest.fn()
        };
      };

      return range;
    };
  });

  it.each([
    ['{{}', '{}'],
    ['{{"a": "b"}', '{"a": "b"}'],
  ])('place %s text in the editor and receive %s', async (input, expected) => {
    const { container } = render(<App />);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      await userEvent.type(editor, input);
    });

    const result = screen.getByTestId('result');

    expect(result.nodeValue).toMatchSnapshot(expected);
  });

  it('should keep content in the editor when navigating away', async () => {
    const { container, getByTestId, getByText } = render(<App/>);

    const editor = grabCurrentEditor(container);
    const json = '{{"random_json":"123"}';

    await act(async () => {
      await userEvent.type(editor, json);
    });

    const rawEditor = screen.getByTestId('raw-json');

    await waitFor(() => {
      expect(rawEditor).toHaveValue('{"random_json":"123"}');
    });

    fireEvent.click(getByTestId('settings'));

    await waitFor(() => {
      expect(getByText('Settings')).toBeInTheDocument();
    });

    fireEvent.click(getByTestId('to-home'));

    await waitFor(() => {
      expect(screen.getByTestId('raw-json')).toHaveValue('{"random_json":"123"}');
    });
  });

  it('should render search element in the json editor', async () => {
    const { getByTestId } = render(<App/>);

    fireEvent.click(getByTestId('search-json'));

    await waitFor(() => expect(within(getByTestId('json')).getByText('×')).toBeInTheDocument());
  });

  it('should render search element in the result editor', async () => {
    const { getByTestId } = render(<App/>);

    fireEvent.click(getByTestId('search-result'));

    await waitFor(() => expect(within(getByTestId('result')).getByText('×')).toBeInTheDocument());
  });
});
