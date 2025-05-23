import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderEntireApp } from './__testutilities__/builder';
import { grabCurrentEditor } from './__testutilities__/editorQuery';
import { customType } from './__testutilities__/customTyping';
import { setUpClipboard, tearDownClipboard, readTextFromClipboard } from 'jest-clipboard';
import { emptyMatchMedia, matchMedia } from './__testutilities__/matchMedia';

async function clickJsonHistoryDrawer() {
  await userEvent.click(screen.getByTestId('json-drawer-history-button'));
}

describe('Used Json History', () => {
  it('should render drawer', async () => {
    renderEntireApp();

    await clickJsonHistoryDrawer();

    expect(await screen.findByTestId('drawer')).toBeInTheDocument();
  });

  it('when opening drawer it show for the user', async () => {
    renderEntireApp();

    await clickJsonHistoryDrawer();

    expect(await screen.findByTestId('drawer')).toHaveClass('opacity-100');
  });

  it('renders area for history', async () => {
    renderEntireApp();

    await clickJsonHistoryDrawer();

    expect(await screen.findByTestId('history-content')).toBeInTheDocument();
  });

  it('renders friendly message when json entries are empty', async () => {
    renderEntireApp();

    await clickJsonHistoryDrawer();

    expect(await within(await screen.findByTestId('history-content')).findByText('No entries yet. Start using the editor and come back here!')).toBeInTheDocument();
  });

  describe('storing entries', () => {
    it('should store json in the list to be used later', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('to-home'));

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, '{{}');

      await clickJsonHistoryDrawer();

      expect(await within(await screen.findByTestId('history-content')).findByText('{}')).toBeInTheDocument();
    });

    it('should remove empty entry message when adding one', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('to-home'));

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, '{{}');

      await clickJsonHistoryDrawer();

      expect(within(await screen.findByTestId('history-content')).queryByText('No entries yet. Start using the editor and come back here!')).not.toBeInTheDocument();
    });

    it('for jsons that are greater than 25 chars add a ... to it', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('to-home'));

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      const json = '{{"random_json_with_long_proprty":"12334sssss value_fr"}';
      await customType(editor, json);

      await clickJsonHistoryDrawer();

      await waitFor(() => {
        // this is a wip, because for each key there is an entry in the list of jsons
        // this is not the expected behaviour.
        expect(screen.getAllByText('{"random_json_with_long_p...').length).toBeGreaterThan(0);
      });
    });

    it('render copy button', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('to-home'));

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, '{{');

      await clickJsonHistoryDrawer();

      expect(await within(await screen.findByTestId('history-content')).findByTestId('json-copy-entry')).toBeInTheDocument();
    });

    it('render send to editor button', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('to-home'));

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, '{{');

      await clickJsonHistoryDrawer();

      expect(await within(await screen.findByTestId('history-content')).findByTestId('json-send-to-editor-entry')).toBeInTheDocument();
    });
  });

  describe('clipboard', () => {
    beforeEach(() => {
      setUpClipboard();
      Object.defineProperty(window, 'matchMedia', matchMedia(false));
    });

    afterEach(async () => {
      tearDownClipboard();
      // restore to false, for some reason testing library is storing it between tests
      // once it is enabled it will keep enabled, leaking to the next test. This is
      // a workaround until a final solution is found.
      Object.defineProperty(window, 'matchMedia', emptyMatchMedia());
    });

    it('copy json to clipboard', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('to-home'));

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, '{{');

      await clickJsonHistoryDrawer();

      await userEvent.click(await within(await screen.findByTestId('history-content')).findByTestId('json-copy-entry'));

      expect(await readTextFromClipboard()).toEqual('{');
    });

    it('show feedback message when json is copied to clipboard', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('to-home'));

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, '{{');

      await clickJsonHistoryDrawer();

      await userEvent.click(await screen.findByTestId('json-copy-entry'));

      expect(await screen.findByText('Copied')).toBeInTheDocument();
    });
  });

  describe('use json', () => {
    it('send json to the editor', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('to-home'));

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, '{{');

      await userEvent.click(await screen.findByTestId('clean'));

      await clickJsonHistoryDrawer();

      await userEvent.click(await screen.findByTestId('json-send-to-editor-entry'));

      const rawEditor = screen.getByTestId('raw-json');

      await waitFor(() => {
        expect(rawEditor).toHaveValue('{');
      });
    });

    it('restoring from json history does not add a new entry in the list', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('to-home'));

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, '{{');

      await userEvent.click(await screen.findByTestId('clean'));

      await clickJsonHistoryDrawer();

      await userEvent.click(await screen.findByTestId('json-send-to-editor-entry'));

      expect(await within(await screen.findByTestId('history-content')).findAllByTestId('json-send-to-editor-entry')).toHaveLength(1);
    });

    it('close drawer once clicked to restore json', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('to-home'));

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, '{{');

      await clickJsonHistoryDrawer();

      await userEvent.click(await screen.findByTestId('json-send-to-editor-entry'));

      expect(await screen.findByTestId('drawer')).not.toHaveClass('opacity-100');
    });
  });
});

