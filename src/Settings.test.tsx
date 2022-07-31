import { fireEvent, render } from '@testing-library/react';
import App from './App';
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

      expect(getByDisplayValue('12')).toBeVisible();
    });

    it.skip('should define font size to be used', () => {
      const { getByTestId } = render(<App/>);

      fireEvent.click(getByTestId('settings'));

      userEvent.type(getByTestId('font-size'), '18');

      fireEvent.click(getByTestId('to-home'));

      expect(getByTestId('json')).toHaveAttribute('style', expect.stringContaining('font-size: 18px'));
    });
  });
});
