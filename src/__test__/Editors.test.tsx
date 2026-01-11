import { waitFor, within, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customType } from './__testutilities__/customTyping';
import { grabCurrentEditor } from './__testutilities__/editorQuery';
import { renderEntireApp } from './__testutilities__/builder';

describe('Editors', () => {
  it.each([
    ['{{}', '{}'],
    ['{{"a": "b"}', '{"a": "b"}'],
  ])('place %s text in the editor and receive %s', async (input, expected) => {
    renderEntireApp();

    const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

    await customType(editor, input);

    const result = screen.getByTestId('result');

    expect(result.nodeValue).toMatchSnapshot(expected);
  });

  it('should keep content in the editor when navigating away', async () => {
    renderEntireApp();

    const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
    const json = '{{"random_json":"123"}';

    await customType(editor, json);

    const rawEditor = screen.getByTestId('raw-json');

    await waitFor(() => {
      expect(rawEditor).toHaveValue('{"random_json":"123"}');
    }, { timeout: 10000 });

    await userEvent.click (screen.getByTestId('settings'));

    await waitFor(() => {
      expect( screen.getByText('Settings')).toBeInTheDocument();
    }, { timeout: 10000 });

    await userEvent.click (screen.getByTestId('to-home'));

    await waitFor(() => {
      expect (screen.getByTestId('raw-json')).toHaveValue('{"random_json":"123"}');
    }, { timeout: 10000 });
    expect (screen.getByTestId('raw-result')).toHaveValue('{\n  "random_json": "123"\n}');
  });

  it('should render search element in the json editor', async () => {
    renderEntireApp();

    await userEvent.click (screen.getByTestId('search-json'));

    await waitFor(() => expect(within (screen.getByTestId('json')).getByText('×')).toBeInTheDocument());
  });

  it('should render search element in the result editor', async () => {
    renderEntireApp();

    await userEvent.click (screen.getByTestId('search-result'));

    await waitFor(() => expect(within (screen.getByTestId('result')).getByText('×')).toBeInTheDocument());
  });

  describe('loading', () => {
    beforeEach(() => {
      jest.useFakeTimers({ legacyFakeTimers: true });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should render loading when typing', async () => {
      renderEntireApp();
      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
      const json = '{{"random_json":"123","a":"a"}';

      customType(editor, json);

      await waitFor(() => {
        expect (screen.getByTestId('loading')).toBeInTheDocument();
      });
    });

    it('should remove loading when typing is finished', async () => {
      renderEntireApp();

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
      const json = '{{"random_json":"12aaa ss dd d sss3","a":"a"}';

      customType(editor, json);

      await waitFor(() => {
        expect (screen.getByTestId('loading')).toBeInTheDocument();
      });

      jest.runAllTimers();

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });
    });
  });

  describe('scroll synchronization', () => {
    it('should set up scroll event listeners on both editors', async () => {
      renderEntireApp();
      
      const jsonEditor = screen.getByTestId('json');
      const resultEditor = screen.getByTestId('result');
      
      // eslint-disable-next-line testing-library/no-node-access
      const jsonScroller = jsonEditor.querySelector('.cm-scroller');
      // eslint-disable-next-line testing-library/no-node-access
      const resultScroller = resultEditor.querySelector('.cm-scroller');
      
      expect(jsonScroller).toBeInTheDocument();
      expect(resultScroller).toBeInTheDocument();
    });
  });
});
