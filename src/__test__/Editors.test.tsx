import { render, act, waitFor, within } from '@testing-library/react';
import App from '../App';
import { customType } from './__testutilities__/customTyping';
import userEvent from '@testing-library/user-event';

function grabCurrentEditor(container: HTMLElement): HTMLElement {
  const editor = container.querySelector('[data-testid="json"] .cm-content');
  if (!editor) {
    throw new Error('Could not find editor');
  }
  return editor as HTMLElement;
}

describe('Editors', () => {
  it.each([
    ['{{}', '{}'],
    ['{{"a": "b"}', '{"a": "b"}'],
  ])('place %s text in the editor and receive %s', async (input, expected) => {
    const { container, getByTestId } = render(<App />);

    const editor = grabCurrentEditor(container);

    await act(async () => {
      await customType(editor, input);
    });

    const result = getByTestId('result');

    expect(result.nodeValue).toMatchSnapshot(expected);
  });

  it('should keep content in the editor when navigating away', async () => {
    const { container, getByTestId, getByText } = render(<App/>);

    const editor = grabCurrentEditor(container);
    const json = '{{"random_json":"123"}';

    await act(async () => {
      await customType(editor, json);
    });

    const rawEditor = getByTestId('raw-json');

    await waitFor(() => {
      expect(rawEditor).toHaveValue('{"random_json":"123"}');
    }, { timeout: 10000 });

    await userEvent.click(getByTestId('settings'));

    await waitFor(() => {
      expect(getByText('Settings')).toBeInTheDocument();
    }, { timeout: 10000 });

    await userEvent.click(getByTestId('to-home'));

    await waitFor(() => {
      expect(getByTestId('raw-json')).toHaveValue('{"random_json":"123"}');
    }, { timeout: 10000 });
  });

  it('should render search element in the json editor', async () => {
    const { getByTestId } = render(<App/>);

    await userEvent.click(getByTestId('search-json'));

    await waitFor(() => expect(within(getByTestId('json')).getByText('×')).toBeInTheDocument());
  });

  it('should render search element in the result editor', async () => {
    const { getByTestId } = render(<App/>);

    await userEvent.click(getByTestId('search-result'));

    await waitFor(() => expect(within(getByTestId('result')).getByText('×')).toBeInTheDocument());
  });

  describe.skip('loading', () => {
    beforeEach(() => {
      jest.useFakeTimers({ legacyFakeTimers: true });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should render loading when typing', async () => {
      const { container, getByTestId } = render(<App/>);
      const editor = grabCurrentEditor(container);
      const json = '{{"random_json":"123","a":"a"}';

      act(() => {
        customType(editor, json);
      });

      await waitFor(() => {
        expect(getByTestId('loading')).toBeInTheDocument();
      });
    });

    it('should remove loading when typing is finished', async () => {
      const { container, getByTestId, queryByTestId } = render(<App/>);
      const editor = grabCurrentEditor(container);
      const json = '{{"random_json":"123"}';

      act(() => {
        customType(editor, json);
      });

      await waitFor(() => {
        expect(getByTestId('loading')).toBeInTheDocument();
      });

      jest.runAllImmediates();

      await waitFor(() => {
        expect(queryByTestId('loading')).not.toBeInTheDocument();
      });
    });
  });
});
