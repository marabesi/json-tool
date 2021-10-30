import { fireEvent, render, screen, act } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { Blob } from 'buffer';
import Formatter from './core/formatter';

describe('json utility', () => {

  test('renders place your json here label', () => {
    render(<App />);
    const placeJsonLabel = screen.getByTestId('label-json');
    expect(placeJsonLabel).toBeInTheDocument();
  });

  test('renders result label', () => {
    render(<App />);
    const resultLabel = screen.getByTestId('label-result');
    expect(resultLabel).toBeInTheDocument();
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

  test('should paste json string from copy area into the editor on clicking the button', async () => {
    render(<App />);

    Object.assign(global.navigator,
      {
        clipboard :{
          async read() {
            const blob = new Blob([JSON.stringify({})], { type: 'text/plain' });

            return Promise.resolve([
              {
                [blob.type]: blob,
                types: [ blob.type ],
                getType: () => blob
              }
            ]);
          }
        }
      });

    await act(async () => {
      const fromClipboard = screen.getByTestId('paste-from-clipboard');
      fromClipboard.click();
    });

    expect(screen.getByTestId('json')).toHaveValue('{}');
    expect(screen.getByTestId('result')).toHaveValue('{}');
  });

  test('should copy json string from result editor to transfer area on clicking the button', async () => {
    render(<App />);

    Object.assign(global.navigator, {
      clipboard :{
        async writeText(text: string) {
          return text;
        }
      }
    });

    jest.spyOn(global.navigator.clipboard, 'writeText');

    const editor = screen.getByTestId('json');

    await act(async () => {
      userEvent.paste(editor, '{"a":"a"}');
    });

    await act(async () => {
      userEvent.click(screen.getByTestId('copy-json'));
    });

    const formatter = new Formatter('{"a":"a"}');

    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(await formatter.format());
  });

  test('should clean editors once clean is clicked', async () => {
    render(<App />);

    const editor = screen.getByTestId('json');

    await act(async () => {
      userEvent.paste(editor, '{}');
    });

    await act(async () => {
      userEvent.click(screen.getByTestId('clean'));
    });

    const result = screen.getByTestId('result');

    expect(editor).toHaveValue('');
    expect(result).toHaveValue('');
  });

  describe('custom spacing for formatting json', () => {
    test('should have space of 2 as default', async () => {
      render(<App />);
  
      const space = screen.getByTestId('space-size');
  
      expect(space).toHaveValue("2");
    });

    test('should do nothing is spacing is empty', async () => {
      render(<App />);
  
      const space = screen.getByTestId('space-size');
  
      await act(async () => {
        fireEvent.change(space, { target: { value: '' }});
      });
  
      const editor = screen.getByTestId('json');

      await act(async () => {
        fireEvent.change(editor, { target: { value: '{"a":"a"}' }});
      });

      const result = (screen.getByTestId('result') as HTMLInputElement);

      expect(result.value).toBe('');
    });
  
    test.each([
      "4",
      "16"
    ])('should change spacing for %s spaces', async (spacing: string) => {
      render(<App />);
  
      const space = screen.getByTestId('space-size');
  
      await act(async () => {
        fireEvent.change(space, { target: { value: '' }});
      });
  
      await act(async () => {
        fireEvent.change(space, { target: { value: spacing }});
      });
  
  
      expect(space).toHaveValue(spacing);
    });

    test.each([
      ['4', '{"a":"a"}', `{
    "a": "a"
}`
      ],
      ['2', '{"a":"a"}', `{
  "a": "a"
}`
      ],
      ['8', '{"a":"a"}', `{
        "a": "a"
}`
      ],
      ['invalid', '{"a":"a"}', `{
  "a": "a"
}`
      ],
    ])('should format json with %s spaces', async (spacing: string, inputJson: string, outputJson: string) => {
      render(<App />);
  
      const space = screen.getByTestId('space-size');
  
      await act(async () => {
        fireEvent.change(space, { target: { value: '' }});
      });
  
      await act(async () => {
        fireEvent.change(space, { target: { value: spacing }});
      });

      const editor = screen.getByTestId('json');

      await act(async () => {
        fireEvent.change(editor, { target: { value: inputJson }});
      });

      const result = (screen.getByTestId('result') as HTMLInputElement);

      expect(result.value).toBe(outputJson);
    });

    test('should reformat json if space changes', async () => {
      render(<App />);
  
      const editor = screen.getByTestId('json');

      await act(async () => {
        fireEvent.change(editor, { target: { value: '{"a":"a"}' }});
      });

      const space = screen.getByTestId('space-size');
  
      await act(async () => {
        fireEvent.change(space, { target: { value: '' }});
      });
  
      await act(async () => {
        fireEvent.change(space, { target: { value: 4 }});
      });

      const result = (screen.getByTestId('result') as HTMLInputElement);

      expect(result.value).toBe(`{
    "a": "a"
}`);
    });
  });
});
