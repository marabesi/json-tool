import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderEntireApp } from './__testutilities__/builder';

describe('Documentation page', () => {

  it('renders docs icon', async () => {
    renderEntireApp();

    expect(screen.getByTestId('docs')).toBeInTheDocument();
  });

  it('renders documentation page', async () => {
    renderEntireApp();

    await userEvent.click( screen.getByTestId('docs'));

    expect(screen.getByText('JSON tool docs')).toBeInTheDocument();
  });
});
