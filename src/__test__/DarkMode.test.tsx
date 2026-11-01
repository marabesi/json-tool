import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { emptyMatchMedia, matchMedia } from './__testutilities__/matchMedia';
import { renderEntireApp } from './__testutilities__/builder';

describe('dark mode', () => {
  describe('when preferred dark mode is on', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', matchMedia(true));
    });

    afterEach(() => {
      Object.defineProperty(window, 'matchMedia', emptyMatchMedia());
    });

    it('should enable dark mode by default', async () => {
      renderEntireApp();

      expect(screen.getByTestId('json')).toHaveClass('cm-theme-dark');
    });
  });

  describe('when preferred dark mode is off', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', matchMedia(false));
    });

    afterEach(() => {
      Object.defineProperty(window, 'matchMedia', emptyMatchMedia());
    });

    it('should enable dark mode in the ui', async () => {
      renderEntireApp();

      const darkModeSwitch = screen.getByTestId('dark-mode');

      await userEvent.click(darkModeSwitch);

      expect(screen.getByTestId('app-container')).toHaveClass('dark');
    });

    it('should enable dark mode in the editors', async () => {
      renderEntireApp();

      const darkModeSwitch = screen.getByTestId('dark-mode');

      await userEvent.click(darkModeSwitch);

      expect(screen.getByTestId('json')).toHaveClass('cm-theme-dark');
    });

    it('should enable dark mode with Alt+M', () => {
      renderEntireApp();

      fireEvent.keyDown(window, { key: 'm', code: 'KeyM', altKey: true });

      expect(screen.getByTestId('app-container')).toHaveClass('dark');
    });

    it('should keep the dark mode switch keyboard focusable', () => {
      renderEntireApp();

      const darkModeSwitch = screen.getByTestId('dark-mode');

      expect(darkModeSwitch).toHaveAttribute('role', 'switch');
      expect(darkModeSwitch).toHaveAttribute('aria-keyshortcuts', 'Alt+M');
      expect(darkModeSwitch).not.toBeDisabled();
    });
  });
});
