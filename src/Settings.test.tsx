import { fireEvent, render } from '@testing-library/react';
import App from './App';

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
});
