import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';
import { renderEntireApp } from './__testutilities__/builder';
import { grabEditor } from './__testutilities__/editorQuery';

describe('JSON diff page', () => {
  beforeEach(() => {
    setUpClipboard();
  });

  afterEach(() => {
    tearDownClipboard();
  });

  const openDiffWith = async (original: string, compared: string) => {
    renderEntireApp();

    await writeTextToClipboard(original);
    await userEvent.click(screen.getByTestId('paste-from-clipboard'));

    await waitFor(() => {
      expect(screen.getByTestId('raw-json')).toHaveValue(original);
    });

    await userEvent.click(screen.getByTestId('diff'));
    await screen.findByTestId('diff-page');

    await writeTextToClipboard(compared);
    await userEvent.click(screen.getByTestId('diff-compare-paste-from-clipboard'));

    await waitFor(() => {
      expect(screen.getByTestId('raw-diff-compare-json')).toHaveValue(compared);
    });
  };

  it('renders the diff navigation link', () => {
    renderEntireApp();

    expect(screen.getByTestId('diff')).toBeInTheDocument();
  });

  it('shows a placeholder when there is no json to compare', async () => {
    renderEntireApp();

    await userEvent.click(screen.getByTestId('diff'));

    expect(screen.getByTestId('diff-empty')).toBeInTheDocument();
  });

  it('shows the differences between two json documents', async () => {
    await openDiffWith(
      '{"name":"Ada","age":36}',
      '{"name":"Grace","email":"grace@example.com"}',
    );

    expect(await screen.findByTestId('json-diff')).toBeInTheDocument();
    expect(screen.getByTestId('json-diff-added-value')).toHaveTextContent('1');
    expect(screen.getByTestId('json-diff-removed-value')).toHaveTextContent('1');
    expect(screen.getByTestId('json-diff-changed-value')).toHaveTextContent('1');

    const entries = screen.getAllByTestId('json-diff-entry');
    expect(entries).toHaveLength(3);
    expect(screen.getAllByTestId('json-diff-entry-path').map((path) => path.textContent)).toEqual([
      '$.name',
      '$.age',
      '$.email',
    ]);
  });

  it('shows a message when both documents are identical', async () => {
    await openDiffWith('{"name":"Ada"}', '{"name":"Ada"}');

    expect(await screen.findByTestId('json-diff-identical')).toBeInTheDocument();
  });

  it('shows an error when the compared json is invalid', async () => {
    await openDiffWith('{"name":"Ada"}', '{invalid json');

    expect(await screen.findByTestId('diff-error')).toHaveTextContent('invalid json');
  });

  it('focuses the compare editor with Alt+Shift+R', async () => {
    const { container } = renderEntireApp();

    await userEvent.click(screen.getByTestId('diff'));
    await screen.findByTestId('diff-page');

    const compareEditor = grabEditor(container, 'diff-compare-json');

    fireEvent.keyDown(window, { key: 'r', code: 'KeyR', altKey: true, shiftKey: true });

    expect(compareEditor).toHaveFocus();
  });

  it('pastes into the compare editor with Alt+Shift+V', async () => {
    renderEntireApp();

    await userEvent.click(screen.getByTestId('diff'));
    await screen.findByTestId('diff-page');

    await writeTextToClipboard('{"a":1}');

    fireEvent.keyDown(window, { key: 'v', code: 'KeyV', altKey: true, shiftKey: true });

    await waitFor(() => expect(screen.getByTestId('raw-diff-compare-json')).toHaveValue('{"a":1}'));
  });

  it('opens the compare editor search with Ctrl+Shift+F', async () => {
    renderEntireApp();

    await userEvent.click(screen.getByTestId('diff'));
    await screen.findByTestId('diff-page');

    fireEvent.keyDown(window, { key: 'f', code: 'KeyF', ctrlKey: true, shiftKey: true });

    await waitFor(() => expect(within(screen.getByTestId('diff-compare-json')).getByText('×')).toBeInTheDocument());
  });
});
