import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { renderEntireApp } from './__testutilities__/builder';
import userEvent from '@testing-library/user-event';

describe('UI elements', () => {
  it('error message is hidden by default', () => {
    renderEntireApp();
    expect(screen.queryByTestId(/error/)).toBeNull();
  });

  it('should render buy me a coffee link', () => {
    renderEntireApp();
    expect(screen.getByTestId(/buy-me-a-coffee/)).toBeInTheDocument();
    expect(screen.queryByTestId(/buy-me-a-coffee/)).toHaveAttribute('href', 'https://www.buymeacoffee.com/marabesi');
    expect(screen.getByText(/Buy me a coffee/)).toBeInTheDocument();
    expect(screen.getByTestId(/buy-me-a-coffee/)).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId(/buy-me-a-coffee/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render license link', () => {
    renderEntireApp();
    expect(screen.getByText(/CC0 1.0 Universal/)).toBeInTheDocument();
    expect(screen.queryByText(/CC0 1.0 Universal/)).toHaveAttribute('href', 'https://github.com/marabesi/json-tool/blob/main/LICENSE.md');
    expect(screen.getByText(/CC0 1.0 Universal/)).toBeInTheDocument();
    expect(screen.getByText(/CC0 1.0 Universal/)).toHaveAttribute('target', '_blank');
    expect(screen.getByText(/CC0 1.0 Universal/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render found a issue', () => {
    renderEntireApp();
    expect(screen.getByTestId(/found-issue/)).toBeInTheDocument();
    expect(screen.queryByTestId(/found-issue/)).toHaveAttribute('href', 'https://github.com/marabesi/json-tool/issues');
    expect(screen.getByText(/Found an issue?/)).toBeInTheDocument();
    expect(screen.getByTestId(/found-issue/)).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId(/found-issue/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render settings link', () => {
    renderEntireApp();
    expect(screen.getByTestId('settings')).toBeInTheDocument();
    expect(screen.getByTestId('settings')).toHaveAttribute('href', expect.stringContaining('/settings'));
  });

  it('should use 12 as font size', () => {
    renderEntireApp();

    expect(screen.getByTestId('json')).toHaveAttribute('style', expect.stringContaining('font-size: 12px'));
  });

  it('should render search button for json editor', () => {
    renderEntireApp();

    expect(screen.getByTestId('search-json')).toBeInTheDocument();
  });

  it('should render search button for result editor', () => {
    renderEntireApp();

    expect(screen.getByTestId('search-result')).toBeInTheDocument();
  });

  it('should render dark mode switcher', () => {
    renderEntireApp();

    expect(screen.getByTestId('dark-mode')).toBeInTheDocument();
  });

  it('should have dark mode disabled by default', () => {
    renderEntireApp();

    expect(screen.queryByTestId('app-container')).not.toHaveClass('dark');
  });

  it('should render validate json checkbox', () => {
    renderEntireApp();

    expect(screen.getByText('validate json')).toBeInTheDocument();
    expect(screen.getByTestId('is-validate-json')).toBeChecked();
  });

  it('should render sync scroll checkbox unchecked by default', () => {
    renderEntireApp();

    expect(screen.getByText('sync scroll')).toBeInTheDocument();
    expect(screen.getByTestId('is-sync-scroll')).not.toBeChecked();
  });

  describe('navigation', () => {
    it('should mark main page as active by default', () => {
      renderEntireApp();

      expect(screen.getByTestId('to-home')).toHaveClass('bg-blue-400 dark:bg-gray-600');
    });

    it('should mark settings page as active by default', async () => {
      renderEntireApp();

      await userEvent.click(screen.getByTestId('settings'));

      expect(screen.getByTestId('settings')).toHaveClass('bg-blue-400 dark:bg-gray-600');
    });
  });

  describe('keyboard shortcuts', () => {
    const pressAlt = (key: string, options: KeyboardEventInit = {}) => {
      fireEvent.keyDown(window, { key, altKey: true, ...options });
    };

    it.each([
      ['2', 'table-page'],
      ['3', 'schema-page'],
      ['4', 'diff-page'],
      ['5', 'settings-page'],
    ])('navigates with Alt+%s', async (number, pageTestId) => {
      renderEntireApp();

      pressAlt(number, { code: `Digit${number}` });

      expect(await screen.findByTestId(pageTestId)).toBeInTheDocument();
    });

    it('navigates back home with Alt+1', async () => {
      renderEntireApp();

      pressAlt('5', { code: 'Digit5' });
      expect(await screen.findByText('Settings')).toBeInTheDocument();

      pressAlt('1', { code: 'Digit1' });

      expect(await screen.findByTestId('editors-page')).toBeInTheDocument();
    });

    it('navigates back home with Alt+Home', async () => {
      renderEntireApp();

      pressAlt('5', { code: 'Digit5' });
      expect(await screen.findByText('Settings')).toBeInTheDocument();

      await userEvent.keyboard('{Alt>}{Home}{/Alt}');

      expect(await screen.findByTestId('editors-page')).toBeInTheDocument();
    });

    it('navigates to settings with Alt+S', async () => {
      renderEntireApp();

      await userEvent.keyboard('{Alt>}s{/Alt}');

      expect(await screen.findByTestId('settings-page')).toBeInTheDocument();
    });

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

    it('opens the shortcut list with the question mark key', async () => {
      renderEntireApp();

      fireEvent.keyDown(window, { key: '?', code: 'Slash', shiftKey: true });

      expect(await screen.findByTestId('keyboard-shortcuts')).toBeInTheDocument();
    });

    it('does not open the shortcut list while typing in a text field', () => {
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

    it('lists the actions available on the current page', async () => {
      renderEntireApp();

      fireEvent.keyDown(window, { key: '?', code: 'Slash', shiftKey: true });

      const dialog = await screen.findByTestId('keyboard-shortcuts');

      expect(within(dialog).getByText('Working editor')).toBeInTheDocument();
      expect(within(dialog).getByText('Result editor')).toBeInTheDocument();
      expect(within(dialog).getByText('Toggle JSON validation')).toBeInTheDocument();
      expect(within(dialog).getByText('Search in the editor')).toBeInTheDocument();
      expect(within(dialog).getByText('Remove all spaces from the result')).toBeInTheDocument();
    });

    it('exposes the header shortcuts to screen readers', () => {
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
    });
  });
});
