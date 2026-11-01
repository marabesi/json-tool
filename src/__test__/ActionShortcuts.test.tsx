import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import {
  readTextFromClipboard,
  setUpClipboard,
  tearDownClipboard,
  writeTextToClipboard,
} from 'jest-clipboard';
import { renderEntireApp } from './__testutilities__/builder';
import { grabCurrentEditor, grabResultEditor } from './__testutilities__/editorQuery';
import { customType } from './__testutilities__/customTyping';
import { emptyMatchMedia, matchMedia } from './__testutilities__/matchMedia';

function press(key: string, options: KeyboardEventInit = {}) {
  fireEvent.keyDown(window, { key, ...options });
}

function pressAlt(key: string, options: KeyboardEventInit = {}) {
  press(key, { altKey: true, ...options });
}

function pressMod(key: string, options: KeyboardEventInit = {}) {
  press(key, { ctrlKey: true, ...options });
}

async function openTable() {
  pressAlt('2', { code: 'Digit2' });
  await screen.findByTestId('table-page');
}

function resultValue(): string {
  return (screen.getByTestId('raw-result') as HTMLTextAreaElement).value;
}

describe('Action shortcuts', () => {
  describe('header actions', () => {
    it('toggles validate json with Alt+J', () => {
      renderEntireApp();

      const validate = screen.getByTestId('is-validate-json');
      expect(validate).toBeChecked();

      pressAlt('j', { code: 'KeyJ' });

      expect(validate).not.toBeChecked();
    });

    it('toggles sync scroll with Alt+Y', () => {
      renderEntireApp();

      const syncScroll = screen.getByTestId('is-sync-scroll');
      expect(syncScroll).not.toBeChecked();

      pressAlt('y', { code: 'KeyY' });

      expect(syncScroll).toBeChecked();
    });

    it('toggles dark mode with Alt+M', () => {
      renderEntireApp();

      expect(screen.getByTestId('app-container')).not.toHaveClass('dark');

      pressAlt('m', { code: 'KeyM' });

      expect(screen.getByTestId('app-container')).toHaveClass('dark');
    });
  });

  describe('working editor actions', () => {
    it('opens the input search with Ctrl+F', async () => {
      renderEntireApp();

      pressMod('f', { code: 'KeyF' });

      await waitFor(() => expect(within(screen.getByTestId('json')).getByText('×')).toBeInTheDocument());
    });

    it('opens the result search with Ctrl+Shift+F', async () => {
      renderEntireApp();

      pressMod('f', { code: 'KeyF', shiftKey: true });

      await waitFor(() => expect(within(screen.getByTestId('result')).getByText('×')).toBeInTheDocument());
    });

    it('opens the file picker with Alt+O', () => {
      const click = jest.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => undefined);

      renderEntireApp();

      pressAlt('o', { code: 'KeyO' });

      expect(click).toHaveBeenCalled();
      click.mockRestore();
    });

    it('deletes all with Alt+Delete', async () => {
      renderEntireApp();

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
      await customType(editor, '{{"a":1}');

      await waitFor(() => expect(screen.getByTestId('raw-json')).toHaveValue('{"a":1}'));

      pressAlt('Delete', { code: 'Delete' });

      await waitFor(() => expect(screen.getByTestId('raw-json')).toHaveValue(''));
    });
  });

  describe('result editor actions', () => {
    it('focuses the space tabulation input with Alt+Shift+T', () => {
      renderEntireApp();

      pressAlt('t', { code: 'KeyT', shiftKey: true });

      expect(screen.getByTestId('space-size')).toHaveFocus();
    });

    it('cleans spaces with Alt+Shift+S', async () => {
      renderEntireApp();

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
      await customType(editor, '{{"a": 1}');

      await waitFor(() => expect(resultValue()).toContain('"a"'));

      pressAlt('s', { code: 'KeyS', shiftKey: true });

      await waitFor(() => {
        expect(resultValue().replace(/\n/g, '')).toBe('{"a":1}');
      });
    });

    it('cleans new lines with Alt+Shift+N', async () => {
      renderEntireApp();

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
      await customType(editor, '{{"a": 1}');

      await waitFor(() => expect(resultValue()).toContain('\n'));

      pressAlt('n', { code: 'KeyN', shiftKey: true });

      await waitFor(() => expect(resultValue()).not.toContain('\n'));
    });

    it('cleans new lines and spaces with Alt+Shift+B', async () => {
      renderEntireApp();

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
      await customType(editor, '{{"a": 1}');

      await waitFor(() => expect(resultValue()).toContain('\n'));

      pressAlt('b', { code: 'KeyB', shiftKey: true });

      await waitFor(() => expect(screen.getByTestId('raw-result')).toHaveValue('{"a":1}'));
    });
  });

  describe('clipboard shortcuts', () => {
    beforeEach(() => {
      setUpClipboard();
      Object.defineProperty(window, 'matchMedia', matchMedia(false));
    });

    afterEach(() => {
      tearDownClipboard();
      Object.defineProperty(window, 'matchMedia', emptyMatchMedia());
    });

    it('pastes with Alt+V', async () => {
      renderEntireApp();

      await writeTextToClipboard('{"from":"shortcut"}');

      pressAlt('v', { code: 'KeyV' });

      await waitFor(() => expect(screen.getByTestId('raw-json')).toHaveValue('{"from":"shortcut"}'));
    });

    it('copies the result with Alt+Shift+C', async () => {
      renderEntireApp();

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));
      await customType(editor, '{{"a":1}');

      await waitFor(() => expect(resultValue()).toContain('"a"'));

      pressAlt('c', { code: 'KeyC', shiftKey: true });

      await waitFor(async () => {
        expect(await readTextFromClipboard()).toContain('"a": 1');
      });
      expect(await screen.findByText('Copied')).toBeInTheDocument();
    });
  });

  describe('table actions', () => {
    it('focuses the table search with Alt+G', async () => {
      renderEntireApp();

      await openTable();
      const search = screen.getByTestId('table-search');

      pressAlt('g', { code: 'KeyG' });

      expect(search).toHaveFocus();
    });

    it('toggles exact match with Alt+E', async () => {
      renderEntireApp();

      await openTable();
      const exactMatch = screen.getByTestId('table-exact-match');
      expect(exactMatch).not.toBeChecked();

      pressAlt('e', { code: 'KeyE' });

      expect(exactMatch).toBeChecked();
    });

    it('toggles full screen with Alt+Enter', async () => {
      renderEntireApp();

      await openTable();

      pressAlt('Enter', { code: 'Enter' });

      await waitFor(() => expect(screen.getByTestId('table-pane')).toHaveAttribute('data-fullscreen', 'true'));
      expect(screen.getByTestId('toggle-fullscreen')).toHaveTextContent('Exit full screen');
    });
  });

  describe('editor focus', () => {
    it('focuses the working editor with Alt+Shift+W', () => {
      renderEntireApp();

      const workingEditor = grabCurrentEditor(screen.getByTestId('editor-container'));

      pressAlt('w', { code: 'KeyW', shiftKey: true });

      expect(workingEditor).toHaveFocus();
    });

    it('focuses the result editor with Alt+Shift+R', () => {
      renderEntireApp();

      const resultEditor = grabResultEditor(screen.getByTestId('editor-container'));

      pressAlt('r', { code: 'KeyR', shiftKey: true });

      expect(resultEditor).toHaveFocus();
    });
  });

  describe('shortcut list', () => {
    it('lists the actions available on the current page', async () => {
      renderEntireApp();

      press('?', { code: 'Slash', shiftKey: true });

      const dialog = await screen.findByTestId('keyboard-shortcuts');

      expect(within(dialog).getByText('Working editor')).toBeInTheDocument();
      expect(within(dialog).getByText('Result editor')).toBeInTheDocument();
      expect(within(dialog).getByText('Toggle JSON validation')).toBeInTheDocument();
      expect(within(dialog).getByText('Search in the editor')).toBeInTheDocument();
      expect(within(dialog).getByText('Remove all spaces from the result')).toBeInTheDocument();
    });
  });
});
