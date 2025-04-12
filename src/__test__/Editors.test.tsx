import { render, waitFor, within, screen } from '@testing-library/react';
import App from '../App';
import { customType } from './__testutilities__/customTyping';
import userEvent from '@testing-library/user-event';
import { grabCurrentEditor } from './__testutilities__/editorQuery';

describe('Editors', () => {
  it.each([
    ['{{}', '{}'],
    ['{{"a": "b"}', '{"a": "b"}'],
  ])('place %s text in the editor and receive %s', async (input, expected) => {
    render(<App />);

    const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

    await customType(editor, input);

    const result = screen.getByTestId('result');

    expect(result.nodeValue).toMatchSnapshot(expected);
  });

  it('should keep content in the editor when navigating away', async () => {
    render(<App/>);

    const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
    const json = '{{"random_json":"123"}';

    await customType(editor, json);

    const rawEditor = await screen.findByTestId('raw-json');

    expect(rawEditor).toHaveValue('{"random_json":"123"}');

    await userEvent.click (screen.getByTestId('settings'));

    expect(await screen.findByText('Settings')).toBeInTheDocument();

    await userEvent.click (screen.getByTestId('to-home'));

    expect (await screen.findByTestId('raw-json')).toHaveValue('{"random_json":"123"}');
    expect (await screen.findByTestId('raw-result')).toHaveValue('{\n  "random_json": "123"\n}');
  });

  it('should render search element in the json editor', async () => {
    render(<App/>);

    await userEvent.click (screen.getByTestId('search-json'));

    expect(within (await screen.findByTestId('json')).getByText('×')).toBeInTheDocument();
  });

  it('should render search element in the result editor', async () => {
    render(<App/>);

    await userEvent.click (screen.getByTestId('search-result'));

    expect(within (await screen.findByTestId('result')).getByText('×')).toBeInTheDocument();
  });

  describe.skip('loading', () => {
    beforeEach(() => {
      jest.useFakeTimers({ legacyFakeTimers: true });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should render loading when typing', async () => {
      render(<App/>);
      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
      const json = '{{"random_json":"123","a":"a"}';

      await customType(editor, json);

      expect (await screen.findByTestId('loading')).toBeInTheDocument();
    });

    it('should remove loading when typing is finished', async () => {
      render(<App/>);
      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
      const json = '{{"random_json":"123"}';

      await customType(editor, json);

      expect (await screen.findByTestId('loading')).toBeInTheDocument();

      jest.runAllImmediates();

      expect(await screen.findByTestId('loading')).not.toBeInTheDocument();
    });
  });
});
