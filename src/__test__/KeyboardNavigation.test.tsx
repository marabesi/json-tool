import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderEntireApp } from './__testutilities__/builder';

describe('Keyboard Navigation', () => {
  describe('Navigation shortcuts', () => {
    it('should navigate to settings with Alt+S', async () => {
      renderEntireApp();

      await userEvent.keyboard('{Alt>}s{/Alt}');

      await waitFor(() => {
        expect(screen.getByText('Settings')).toBeInTheDocument();
      });
    });

    it('should navigate to docs with Alt+D', async () => {
      renderEntireApp();

      await userEvent.keyboard('{Alt>}d{/Alt}');

      await waitFor(() => {
        expect(screen.getByText('JSON tool docs')).toBeInTheDocument();
      });
    });

    it('should navigate to home with Alt+Home', async () => {
      renderEntireApp();

      // First navigate away from home
      await userEvent.click(screen.getByTestId('settings'));

      await waitFor(() => {
        expect(screen.getByText('Settings')).toBeInTheDocument();
      });

      // Then navigate back with keyboard
      await userEvent.keyboard('{Alt>}{Home}{/Alt}');

      await waitFor(() => {
        expect(screen.getByTestId('editor-container')).toBeInTheDocument();
      });
    });
  });

  describe('Interactive elements focus', () => {
    it('should allow tabbing through header navigation', async () => {
      renderEntireApp();

      const homeLink = screen.getByTestId('to-home');
      const docsLink = screen.getByTestId('docs');
      const settingsLink = screen.getByTestId('settings');

      // Tab through navigation
      await userEvent.tab();
      expect(document.activeElement).toBe(homeLink);

      await userEvent.tab();
      expect(document.activeElement).toBe(docsLink);

      await userEvent.tab();
      expect(document.activeElement).toBe(settingsLink);
    });

    it('should focus buttons on tab', async () => {
      renderEntireApp();

      // Get the first button in the editor
      const searchButton = screen.getByTestId('search-json');

      // Tab until we reach the search button
      let attempts = 0;
      while (document.activeElement !== searchButton && attempts < 20) {
        await userEvent.tab();
        attempts++;
      }

      expect(document.activeElement).toBe(searchButton);
    });

    it('should activate button with Enter key', async () => {
      renderEntireApp();

      const settingsLink = screen.getByTestId('settings');
      settingsLink.focus();

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Settings')).toBeInTheDocument();
      });
    });
  });

  describe('Settings page keyboard navigation', () => {
    it('should allow toggling checkboxes with keyboard', async () => {
      renderEntireApp();

      // Navigate to settings
      await userEvent.click(screen.getByTestId('settings'));

      await waitFor(() => {
        expect(screen.getByText('Settings')).toBeInTheDocument();
      });

      // Find a checkbox and toggle it with Space key
      const checkboxes = screen.getAllByRole('checkbox');
      const firstCheckbox = checkboxes[0] as HTMLInputElement;
      const initialState = firstCheckbox.checked;

      firstCheckbox.focus();
      await userEvent.keyboard(' ');

      await waitFor(() => {
        expect(firstCheckbox.checked).toBe(!initialState);
      });
    });
  });
});
