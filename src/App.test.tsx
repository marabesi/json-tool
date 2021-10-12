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

  test.skip.each([
    ['{}', '{}'],
    // ['{"a": "b"}', '{"a": "b"}'],
  ])('place %s text in the editor and receive %s', async (input, expected) => {
    const { container } = render(<App />);

    const editor = container.getElementsByClassName('original');

    // @ts-ignore
    fireEvent.change(editor[0], {target: { value: input }});

    const result = await container.getElementsByClassName('result');

    expect(result[0].nodeValue).toMatchSnapshot(expected);
  });

  test.skip('inform error when json is invalid', () => {
    render(<App />);

    const editor = screen.getByTestId('json');

    fireEvent.change(editor, {target: { value: 'bla bla' }});

    const result = screen.getByTestId('error');

    expect(result).toEqual('invalid json');
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
