import { render, waitFor } from '@testing-library/react';
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
    const { getByTestId, getByText } = render(<App/>);

    await userEvent.click(getByTestId('settings'));

    expect(getByText(option)).toBeInTheDocument();
  });

  it.each([
    ['foldGutter'],
    ['syntaxHighlighting'],
    ['highlightActiveLine'],
  ])('should mark option %s as true by default', async (option: string) => {
    const { getByTestId, getByLabelText } = render(<App/>);

    await userEvent.click(getByTestId('settings'));

    expect(getByLabelText(option)).toBeChecked();
  });

  it.each([
    ['history'],
    ['autocompletion'],
    ['closeBrackets'],
  ])('check option %s that is unchecked by default', async (option) => {
    const { getByTestId, getByLabelText, getByText } = render(<App/>);

    await userEvent.click(getByTestId('settings'));

    expect(getByLabelText(option)).not.toBeChecked();

    await userEvent.click(getByText(option));

    expect(getByLabelText(option)).toBeChecked();
  });

  describe('editors font size', () => {
    it('should use 12 as font size by default', async () => {
      const { getByTestId, getByDisplayValue } = render(<App/>);

      await userEvent.click(getByTestId('settings'));

      expect(getByDisplayValue('12px')).toBeVisible();
    });

    it('should define font size to 18px to be used', async () => {
      const { getByTestId, getByText } = render(<App/>);

      await userEvent.click(getByTestId('settings'));

      await userEvent.clear(getByTestId('font-size'));
      await userEvent.type(getByTestId('font-size'), '18px');
      await userEvent.click(getByText('Save'));

      await userEvent.click(getByTestId('to-home'));

      await waitFor(() => {
        expect(getByTestId('json')).toHaveAttribute('style', expect.stringContaining('font-size: 18px'));
      });
    });
  });
});
