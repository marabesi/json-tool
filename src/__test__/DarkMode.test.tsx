import { render } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('dark mode', () => {
  describe('when preferred dark mode is on', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          matches: true,
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
      const { getByTestId } = render(<App/>);

      expect(getByTestId('json')).toHaveClass('cm-theme-dark');
    });
  });

  describe('when preferred dark mode is off', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          matches: false,
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
      const { getByTestId, container } = render(<App/>);

      const darkModeSwitch = getByTestId('dark-mode');

      await userEvent.click(darkModeSwitch);

      expect(container.querySelector('.dark')).toBeInTheDocument();
    });

    it('should enable dark mode in the editors', async () => {
      const { getByTestId } = render(<App/>);

      const darkModeSwitch = getByTestId('dark-mode');

      await userEvent.click(darkModeSwitch);

      expect(getByTestId('json')).toHaveClass('cm-theme-dark');
    });
  });
});
