import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('json utility', () => {
  test('renders place your json here label', () => {
    render(<App />);
    const placeJsonLabel = screen.getByText(/place your json here/i);
    expect(placeJsonLabel).toBeInTheDocument();
  });

  test('renders resulting formatted json label', () => {
    render(<App />);
    const resultLabel = screen.getByText(/result/i);
    expect(resultLabel).toBeInTheDocument();
  });

  test.each([
    ['{}', '{}'],
    ['{"a": "b"}', '{"a": "b"}'],
  ])('place %s text in the editor and receive %s', async (input, expected) => {
    render(<App />);

    const editor = screen.getByTestId('json');

    fireEvent.change(editor, {target: { value: input }});

    const result = await screen.findByTestId('result');

    expect(result.nodeValue).toMatchSnapshot(expected);
  });

  test.skip('inform error when json is invalid', () => {
    render(<App />);

    const editor = screen.getByTestId('json');

    fireEvent.change(editor, {target: { value: 'bla bla' }});

    const result = screen.getByTestId('error');

    expect(result).toEqual('invalid json');
  });
})
