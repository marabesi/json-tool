import { fireEvent, render, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Settings', () => {
  test.each([
    ['foldGutter'],
    ['syntaxHighlighting'],
    ['history'],
    ['highlightActiveLine'],
    ['autocompletion'],
    ['closeBrackets'],
  ])('should  renders option %s available for editors', (option: string) => {
    const { getByTestId, getByText } = render(<App/>);

    fireEvent.click(getByTestId('settings'));

    expect(getByText(option)).toBeInTheDocument();
  });

  describe('editors font size', () => {
    it('should use 12 as font size by default', () => {
      const { getByTestId, getByDisplayValue } = render(<App/>);

      fireEvent.click(getByTestId('settings'));

      expect(getByDisplayValue('12px')).toBeVisible();
    });

    it('should define font size to 18px to be used', async () => {
      const { getByTestId, getByText } = render(<App/>);

      fireEvent.click(getByTestId('settings'));

      await userEvent.clear(getByTestId('font-size'));
      await userEvent.type(getByTestId('font-size'), '18px');
      await userEvent.click(getByText('Save'));

      fireEvent.click(getByTestId('to-home'));

      await waitFor(() => {
        expect(getByTestId('json')).toHaveAttribute('style', expect.stringContaining('font-size: 18px'));
      });
    });
  });
});
