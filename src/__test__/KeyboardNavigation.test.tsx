import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderEntireApp } from './__testutilities__/builder';

function pressViewShortcut(number: string) {
  fireEvent.keyDown(window, { key: number, code: `Digit${number}`, altKey: true });
}

function pressLetterShortcut(key: string, options: { shiftKey?: boolean } = {}) {
  fireEvent.keyDown(window, { key, code: `Key${key.toUpperCase()}`, altKey: true, ...options });
}

describe('Keyboard navigation', () => {
  describe('view shortcuts', () => {
    it.each([
      ['2', 'table-page'],
      ['3', 'schema-page'],
      ['4', 'diff-page'],
      ['5', 'settings-page'],
    ])('navigates with Alt+%s', async (number, pageTestId) => {
      renderEntireApp();

      pressViewShortcut(number);

      expect(await screen.findByTestId(pageTestId)).toBeInTheDocument();
    });

    it('navigates back home with Alt+1', async () => {
      renderEntireApp();

      pressViewShortcut('5');
      expect(await screen.findByText('Settings')).toBeInTheDocument();

      pressViewShortcut('1');

      expect(await screen.findByTestId('editors-page')).toBeInTheDocument();
    });

    it('navigates back home with Alt+Home', async () => {
      renderEntireApp();

      pressViewShortcut('5');
      expect(await screen.findByText('Settings')).toBeInTheDocument();

      await userEvent.keyboard('{Alt>}{Home}{/Alt}');

      expect(await screen.findByTestId('editors-page')).toBeInTheDocument();
    });

    it('navigates to settings with Alt+S', async () => {
      renderEntireApp();

      await userEvent.keyboard('{Alt>}s{/Alt}');

      expect(await screen.findByTestId('settings-page')).toBeInTheDocument();
    });
  });

  describe('application shortcuts', () => {
    it('opens and closes the history drawer with Alt+H', async () => {
      renderEntireApp();

      pressLetterShortcut('H');

      expect(await screen.findByTestId('drawer')).toHaveClass('opacity-100');

      pressLetterShortcut('H');

      await waitFor(() => expect(screen.getByTestId('drawer')).not.toHaveClass('opacity-100'));
    });

    it('closes the history drawer with Escape', async () => {
      renderEntireApp();

      pressLetterShortcut('H');
      expect(await screen.findByTestId('drawer')).toHaveClass('opacity-100');

      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

      await waitFor(() => expect(screen.getByTestId('drawer')).not.toHaveClass('opacity-100'));
    });

    it('opens the documentation with Alt+D', () => {
      const open = jest.spyOn(window, 'open').mockImplementation(() => null);

      renderEntireApp();

      pressLetterShortcut('D');

      expect(open).toHaveBeenCalledWith('./docs/', '_blank', 'noopener,noreferrer');

      open.mockClear();
      pressLetterShortcut('D', { shiftKey: true });

      expect(open).toHaveBeenCalledWith('./docs/', '_blank', 'noopener,noreferrer');

      open.mockRestore();
    });
  });

  describe('shortcut help', () => {
    it('opens the shortcut list with the question mark key', async () => {
      renderEntireApp();

      fireEvent.keyDown(window, { key: '?', code: 'Slash', shiftKey: true });

      expect(await screen.findByTestId('keyboard-shortcuts')).toBeInTheDocument();
    });

    it('does not open the shortcut list while typing in a text field', async () => {
      renderEntireApp();

      const spacing = screen.getByTestId('space-size');

      fireEvent.keyDown(spacing, { key: '?', code: 'Slash', shiftKey: true });

      expect(screen.queryByTestId('keyboard-shortcuts')).not.toBeInTheDocument();
    });

    it('opens the shortcut list from the header button', async () => {
      renderEntireApp();

      screen.getByTestId('keyboard-shortcuts-open').focus();
      await userEvent.keyboard('{Enter}');

      expect(await screen.findByTestId('keyboard-shortcuts')).toBeInTheDocument();
    });

    it('closes the shortcut list with Escape', async () => {
      renderEntireApp();

      fireEvent.keyDown(window, { key: '?', code: 'Slash', shiftKey: true });
      expect(await screen.findByTestId('keyboard-shortcuts')).toBeInTheDocument();

      await userEvent.keyboard('{Escape}');

      await waitFor(() => expect(screen.queryByTestId('keyboard-shortcuts')).not.toBeInTheDocument());
    });
  });

  describe('keyboard friendly controls', () => {
    it('toggles a settings checkbox with the space key', async () => {
      renderEntireApp();

      pressViewShortcut('5');

      const checkbox = await screen.findByLabelText('foldGutter');
      expect(checkbox).toBeChecked();

      checkbox.focus();
      await userEvent.keyboard(' ');

      expect(checkbox).not.toBeChecked();
    });

    it('exits the table full screen with Escape', async () => {
      renderEntireApp();

      pressViewShortcut('2');
      await screen.findByTestId('table-page');

      const fullscreen = screen.getByTestId('toggle-fullscreen');
      fullscreen.focus();
      await userEvent.keyboard('{Enter}');

      expect(screen.getByTestId('table-pane')).toHaveAttribute('data-fullscreen', 'true');

      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

      await waitFor(() => expect(screen.getByTestId('table-pane')).toHaveAttribute('data-fullscreen', 'false'));
    });

    it('moves the focus into the history drawer and back to the history button', async () => {
      renderEntireApp();

      const historyButton = screen.getByTestId('json-drawer-history-button');
      historyButton.focus();
      await userEvent.keyboard('{Enter}');

      const closeButton = await screen.findByTestId('close-drawer');
      await waitFor(() => expect(closeButton).toHaveFocus());

      await userEvent.keyboard('{Escape}');

      await waitFor(() => expect(historyButton).toHaveFocus());
    });

    it('toggles the header checkboxes with the space key', async () => {
      renderEntireApp();

      const validate = screen.getByTestId('is-validate-json');
      validate.focus();
      await userEvent.keyboard(' ');
      expect(validate).not.toBeChecked();

      const syncScroll = screen.getByTestId('is-sync-scroll');
      syncScroll.focus();
      await userEvent.keyboard(' ');
      expect(syncScroll).toBeChecked();
    });

    it('keeps the dark mode switch keyboard focusable', () => {
      renderEntireApp();

      const darkMode = screen.getByTestId('dark-mode');

      expect(darkMode).toHaveAttribute('role', 'switch');
      expect(darkMode).not.toBeDisabled();
    });

    it('keeps the upload control focusable with the keyboard', () => {
      renderEntireApp();

      const upload = screen.getByTestId('upload-json');
      upload.focus();

      expect(upload).toHaveFocus();
      expect(upload).toHaveAttribute('aria-label', 'Upload JSON file');
    });

    it('exposes the shortcuts to screen readers', () => {
      renderEntireApp();

      expect(screen.getByTestId('to-home')).toHaveAttribute('aria-keyshortcuts', 'Alt+1 Alt+Home');
      expect(screen.getByTestId('table')).toHaveAttribute('aria-keyshortcuts', 'Alt+2');
      expect(screen.getByTestId('schema')).toHaveAttribute('aria-keyshortcuts', 'Alt+3');
      expect(screen.getByTestId('diff')).toHaveAttribute('aria-keyshortcuts', 'Alt+4');
      expect(screen.getByTestId('settings')).toHaveAttribute('aria-keyshortcuts', 'Alt+5 Alt+S');
      expect(screen.getByTestId('json-drawer-history-button')).toHaveAttribute('aria-keyshortcuts', 'Alt+H');
      expect(screen.getByTestId('keyboard-shortcuts-open')).toHaveAttribute('aria-keyshortcuts', '?');
      expect(screen.getByTestId('docs')).toHaveAttribute('aria-keyshortcuts', 'Alt+D Alt+Shift+D');
      expect(screen.getByTestId('is-validate-json')).toHaveAttribute('aria-keyshortcuts', 'Alt+J');
      expect(screen.getByTestId('is-sync-scroll')).toHaveAttribute('aria-keyshortcuts', 'Alt+Y');
      expect(screen.getByTestId('dark-mode')).toHaveAttribute('aria-keyshortcuts', 'Alt+M');
    });
  });
});
