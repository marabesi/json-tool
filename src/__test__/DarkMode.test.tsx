import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { emptyMatchMedia, matchMedia } from './__testutilities__/matchMedia';

describe('dark mode', () => {
  describe('when preferred dark mode is on', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', matchMedia(true));
    });

    afterEach(() => {
      Object.defineProperty(window, 'matchMedia', emptyMatchMedia());
    });

    it('should enable dark mode by default', async () => {
      render(<App/>);

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
      render(<App/>);

      const darkModeSwitch = screen.getByTestId('dark-mode');

      await userEvent.click(darkModeSwitch);

      expect(screen.getByTestId('app-container')).toHaveClass('dark');
    });

    it('should enable dark mode in the editors', async () => {
      render(<App/>);

      const darkModeSwitch = screen.getByTestId('dark-mode');

      await userEvent.click(darkModeSwitch);

      expect(screen.getByTestId('json')).toHaveClass('cm-theme-dark');
    });
  });
});
