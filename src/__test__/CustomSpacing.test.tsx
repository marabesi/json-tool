import { render, screen, act } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { grabCurrentEditor } from '../__testutilities__/editorQuery';

describe('Custom spacing for formatting json', () => {
  it('should have space of 2 as default', async () => {
    render(<App />);

    const space = screen.getByDisplayValue('2');

    expect(space).toBeInTheDocument();
  });

  it('should do nothing if spacing is empty', async () => {
    const { container } = render(<App />);

    const space = screen.getByDisplayValue('2');

    act(() => {
      userEvent.clear(space);
    });

    const editor = grabCurrentEditor(container);

    await act(async () => {
      await userEvent.type(editor, '{{"a":"a"}', { delay: 100 });
    });

    const result = (screen.getByTestId('result') as HTMLInputElement);

    expect(result.value).toBeFalsy();
  });

  it.each([
    '4',
    '16'
  ])('should change spacing for %s spaces', async (spacing: string) => {
    render(<App/>);

    const space = screen.getByDisplayValue('2');

    await act(async () => {
      await userEvent.clear(space);
    });

    await act(async () => {
      await userEvent.type(space, spacing, { delay: 100 });
    });

    expect(space).toHaveValue(spacing);
  });

  it.each([
    ['4', '{{"a":"a"}', `{
    "a": "a"
}`
    ],
    ['2', '{{"a":"a"}', `{
  "a": "a"
}`
    ],
    ['8', '{{"a":"a"}', `{
        "a": "a"
}`
    ],
    ['invalid', '{{"a":"a"}', `{
  "a": "a"
}`
    ],
  ])('should format json with %s spaces', async (spacing: string, inputJson: string, outputJson: string) => {
    const { container, getByTestId } = render(<App />);

    const space = screen.getByDisplayValue('2');

    act(() => {
      userEvent.clear(space);
    });

    await act(async () => {
      await userEvent.type(space, spacing);
    });

    const editor = grabCurrentEditor(container);

    await act(async () => {
      await userEvent.type(editor, inputJson);
    });

    const result = (getByTestId('raw-result') as HTMLInputElement);

    expect(result).toHaveValue(outputJson);
  });

  it('should reformat json if space changes', async () => {
    const { container, getByTestId } = render(<App />);
    const editor = grabCurrentEditor(container);

    await act(async () => {
      await userEvent.type(editor, '{{"a":"a"}');
    });

    const space = screen.getByDisplayValue('2');

    act(() => {
      userEvent.clear(space);
    });

    await act(async () => {
      await userEvent.type(space, '4');
    });

    expect(getByTestId('raw-result')).toHaveValue(`{
    "a": "a"
}`);
  });

  it('should format json from uploaded file', async () => {
    const file = new File(['{"a":"b"}'], 'hello.json', { type: 'application/json' });

    const { getByTestId } = render(<App />);

    await userEvent.upload(getByTestId('upload-json'), file);

    expect(getByTestId('raw-result')).toHaveValue(`{
  "a": "b"
}`);
  });
});
