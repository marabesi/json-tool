import { render, screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Documentation page', () => {

  it('renders docs icon', async () => {
    render(<App/>);

    expect(screen.getByTestId('docs')).toBeInTheDocument();
  });

  it('renders documentation page', async () => {
    render(<App/>);

    await userEvent.click( screen.getByTestId('docs'));

    expect(screen.getByText('JSON tool docs')).toBeInTheDocument();
  });
});
