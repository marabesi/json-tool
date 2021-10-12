import {  fireEvent, render, screen, act } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event'

describe('json utility', () => {

  document.createRange = () => {
    const range = new Range();

    range.getBoundingClientRect = jest.fn();
    // @ts-ignore
    range.getClientRects = jest.fn(() => ({
      item: () => null,
      length: 0,
    }));

    return range;
  };

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
    const { container } = render(<App />);

    const editor = container.getElementsByClassName('original');

    await act(async () => {
      await fireEvent.change(editor[0], {target: { value: input }});
    });

    const result = await container.getElementsByClassName('result');

    expect(result[0].nodeValue).toMatchSnapshot(expected);
  });

  test('inform error when json is invalid', async () => {
    const { container } = render(<App />);

    const editor = container.getElementsByClassName('original');

    await act(async () => {
      fireEvent.change(editor[0], {target: { value: 'bla bla' }});
    });

    const result = screen.getByTestId('error');

    expect(result.innerHTML).toEqual('invalid json');
  });

  test('hides the error after a valid json is given', async () => {
    const { container } = render(<App />);

    const editor = container.getElementsByClassName('original');

    await act(async () => {
      fireEvent.change(editor[0], {target: { value: 'bla bla' }});
    });

    await act(async () => {
      fireEvent.change(editor[0], {target: { value: '{}' }});
    });

    const result = screen.queryByTestId('error');

    expect(result).toBeNull();
  });

  test('should paste json string from copy area into the editor', async () => {
    const { container } = render(<App />);

    const editorByClassname = container.getElementsByClassName('original');
    const editor = editorByClassname[0];

    await act(async () => {
      userEvent.paste(editor, '{}');
    });

    const result = await container.getElementsByClassName('result');

    expect(result[0].innerHTML).toEqual('{}')
  });
})
