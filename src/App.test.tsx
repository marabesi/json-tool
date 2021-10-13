import {  fireEvent, render, screen, act } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

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

  test('error message is hidden by default', () => {
    render(<App />);
    const errorLabel = screen.queryByTestId(/error/);
    expect(errorLabel).toBeNull();
  });

  test.each([
    ['{}', '{}'],
    ['{"a": "b"}', '{"a": "b"}'],
  ])('place %s text in the editor and receive %s', async (input, expected) => {
    render(<App />);

    const editor = screen.getByTestId('json');

    await act(async () => {
      await fireEvent.change(editor, {target: { value: input }});
    });

    const result = screen.getByTestId('result');

    expect(result.nodeValue).toMatchSnapshot(expected);
  });

  test('inform error when json is invalid', async () => {
    render(<App />);

    const editor = screen.getByTestId('json');

    await act(async () => {
      fireEvent.change(editor, {target: { value: 'bla bla' }});
    });

    const result = screen.getByTestId('error');

    expect(result.innerHTML).toEqual('invalid json');
  });

  test.each([
    ['bla bla', '{}'],
    ['not a json', ''],
  ])('hides the error after a valid json is given', async (originalCode: string, afterChangeCode: string) => {
    render(<App />);

    const editor = screen.getByTestId('json');

    await act(async () => {
      fireEvent.change(editor, {target: { value: originalCode }});
    });

    await act(async () => {
      fireEvent.change(editor, {target: { value: afterChangeCode }});
    });

    const result = screen.queryByTestId('error');

    expect(result).toBeNull();
  });

  test('should paste json string from copy area into the editor', async () => {
    render(<App />);

    const editor = screen.getByTestId('json');

    await act(async () => {
      userEvent.paste(editor, '{}');
    });

    const result = screen.getByTestId('result');

    expect(result).toHaveValue('{}');
  });
})
