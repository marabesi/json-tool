import { render, waitFor, screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Settings', () => {
  it.each([
    ['foldGutter'],
    ['syntaxHighlighting'],
    ['history'],
    ['highlightActiveLine'],
    ['autocompletion'],
    ['closeBrackets'],
  ])('should  renders option %s available for editors', async (option: string) => {
    render(<App/>);

    await userEvent.click( screen.getByTestId('settings'));

    expect( screen.getByText(option)).toBeInTheDocument();
  });

  it.each([
    ['foldGutter'],
    ['syntaxHighlighting'],
    ['highlightActiveLine'],
  ])('should mark option %s as true by default', async (option: string) => {
    render(<App/>);

    await userEvent.click( screen.getByTestId('settings'));

    expect(screen.getByLabelText(option)).toBeChecked();
  });

  it.each([
    ['history'],
    ['autocompletion'],
    ['closeBrackets'],
  ])('check option %s that is unchecked by default', async (option) => {
    render(<App/>);

    await userEvent.click( screen.getByTestId('settings'));

    expect(screen.getByLabelText(option)).not.toBeChecked();

    await userEvent.click( screen.getByText(option));

    expect(screen.getByLabelText(option)).toBeChecked();
  });

  describe('editors font size', () => {
    it('should use 12 as font size by default', async () => {
      render(<App/>);

      await userEvent.click( screen.getByTestId('settings'));

      expect(screen.getByDisplayValue('12px')).toBeVisible();
    });

    it('should define font size to 18px to be used', async () => {
      render(<App/>);

      await userEvent.click( screen.getByTestId('settings'));

      await userEvent.clear( screen.getByTestId('font-size'));
      await userEvent.type( screen.getByTestId('font-size'), '18px');
      await userEvent.click( screen.getByText('Save'));

      await userEvent.click( screen.getByTestId('to-home'));

      await waitFor(() => {
        expect( screen.getByTestId('json')).toHaveAttribute('style', expect.stringContaining('font-size: 18px'));
      });
    });
  });
});
