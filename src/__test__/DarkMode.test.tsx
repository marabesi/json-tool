import { render, screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('dark mode', () => {
  describe('when preferred dark mode is on', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: true,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: null
      });
    });

    it('should enable dark mode by default', async () => {
      render(<App/>);

      expect(screen.getByTestId('json')).toHaveClass('cm-theme-dark');
    });
  });

  describe('when preferred dark mode is off', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: null
      });
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
