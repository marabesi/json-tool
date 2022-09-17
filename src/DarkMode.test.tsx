import { render } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

describe.skip('dark mode', () => {
  it('should enable dark mode in the ui', () => {
    const { getByTestId, container } = render(<App/>);

    const darkModeSwitch = getByTestId('dark-mode');

    userEvent.click(darkModeSwitch);

    expect(container.querySelector('.dark')).toBeInTheDocument();
  });

  it('should enable dark mode in the editors', () => {
    const { getByTestId } = render(<App/>);

    const darkModeSwitch = getByTestId('dark-mode');

    userEvent.click(darkModeSwitch);

    expect(getByTestId('json')).toHaveClass('cm-theme-dark');
  });
});
