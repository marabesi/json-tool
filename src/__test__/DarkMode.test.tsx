import { render } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('dark mode', () => {
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
