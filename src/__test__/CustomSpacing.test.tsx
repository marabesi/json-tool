import { waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { grabCurrentEditor } from './__testutilities__/editorQuery';
import { customType } from './__testutilities__/customTyping';
import { renderEntireApp } from './__testutilities__/builder';

describe('Custom spacing for formatting json', () => {
  it('should have space of 2 as default', async () => {
    renderEntireApp();

    const space = screen.getByDisplayValue('2');

    expect(space).toBeInTheDocument();
  });

  describe('typing json manually', () => {
    it('should do nothing if spacing is empty', async () => {
      renderEntireApp();

      const space = screen.getByDisplayValue('2');

      await userEvent.clear(space);

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, '{{"a":"a"}');

      const result = (screen.getByTestId('result') as HTMLInputElement);

      expect(result.value).toBeFalsy();
    });

    it.each([
      '4',
      '16'
    ])('should change spacing for %s spaces', async (spacing: string) => {
      renderEntireApp();

      const space = screen.getByDisplayValue('2');

      await userEvent.clear(space);

      await customType(space, spacing);

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
      renderEntireApp();

      const space = screen.getByDisplayValue('2');

      await userEvent.clear(space);

      await customType(space, spacing);

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, inputJson);

      await waitFor(() => {
        const result = (screen.getByTestId('raw-result') as HTMLInputElement);

        expect(result).toHaveValue(outputJson);
      });
    });

    it('should reformat json if space changes', async () => {
      renderEntireApp();

      const editor = grabCurrentEditor(screen.getByTestId('editor-container'));

      await customType(editor, '{{"a":"a"}');

      const space = screen.getByDisplayValue('2');

      await userEvent.clear(space);

      await customType(space, '4');

      await waitFor(() => {
        expect(screen.getByTestId('raw-result')).toHaveValue(`{
    "a": "a"
}`);
      });
    });
  });

  describe('uploading a json file', function () {
    it('should format json from uploaded file', async () => {
      const file = new File(['{"a":"b"}'], 'hello.json', { type: 'application/json' });

      renderEntireApp();

      await userEvent.upload(screen.getByTestId('upload-json'), file);

      await waitFor(() => {
        expect(screen.getByTestId('raw-result')).toHaveValue(`{
  "a": "b"
}`);
      });
    });

    it('dismiss upload file when there is no file content', async () => {
      renderEntireApp();

      // @ts-ignore when dismissing an input file without selecting a file it is normal to see undefined from the input
      // the flow is: 1. upload a file, 2. open the input file and dismiss the dialog
      // the code will return undefined
      const file = new File([], '');
      await userEvent.upload(screen.getByTestId('upload-json'),  file);

      fireEvent.change(screen.getByTestId('upload-json'), undefined);

      await waitFor(() => {
        expect(screen.getByTestId('raw-result')).toHaveValue('');
      });
    });

    it('clear file input when click on delete all', async () => {
      const file = new File(['{"a":"b"}'], 'hello.json', { type: 'application/json' });

      renderEntireApp();

      await userEvent.upload(screen.getByTestId('upload-json'),  file);

      await userEvent.click(screen.getByText('Delete all'));

      await waitFor(() => {
        // @ts-ignore
        expect(screen.getByTestId('upload-json').value).toBe('');
      });
    });
  });
});
