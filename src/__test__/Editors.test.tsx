import { waitFor, within, screen, fireEvent } from '@testing-library/react';
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

  describe('scroll synchronization', () => {
    const makeScrollable = (element: HTMLElement, scrollHeight: number, clientHeight: number) => {
      Object.defineProperty(element, 'scrollHeight', { value: scrollHeight, configurable: true });
      Object.defineProperty(element, 'clientHeight', { value: clientHeight, configurable: true });
    };

    const scrollers = () => {
      return {
        jsonScroller: screen.getByTestId('json').querySelector('.cm-scroller') as HTMLElement,
        resultScroller: screen.getByTestId('result').querySelector('.cm-scroller') as HTMLElement,
      };
    };

    it('should be disabled by default', () => {
      renderEntireApp();

      expect(screen.getByTestId('is-sync-scroll')).not.toBeChecked();
    });

    it('should sync both editors on the same relative line once enabled', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('is-sync-scroll'));

      const { jsonScroller, resultScroller } = scrollers();

      makeScrollable(jsonScroller, 1000, 100);
      makeScrollable(resultScroller, 2000, 100);

      jsonScroller.scrollTop = 450;
      fireEvent.scroll(jsonScroller);

      await waitFor(() => {
        expect(resultScroller.scrollTop).toBe(950);
      });
    });

    it('should sync the json editor when the result editor scrolls once enabled', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('is-sync-scroll'));

      const { jsonScroller, resultScroller } = scrollers();

      makeScrollable(jsonScroller, 1000, 100);
      makeScrollable(resultScroller, 2000, 100);

      resultScroller.scrollTop = 950;
      fireEvent.scroll(resultScroller);

      await waitFor(() => {
        expect(jsonScroller.scrollTop).toBe(450);
      });
    });

    it('should not sync the editors while the toggle is off', async () => {
      renderEntireApp();

      const { jsonScroller, resultScroller } = scrollers();

      makeScrollable(jsonScroller, 1000, 100);
      makeScrollable(resultScroller, 2000, 100);

      jsonScroller.scrollTop = 450;
      fireEvent.scroll(jsonScroller);

      await waitFor(() => {
        expect(resultScroller.scrollTop).toBe(0);
      });
    });
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
});
