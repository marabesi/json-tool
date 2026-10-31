import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';
import { renderEntireApp } from './__testutilities__/builder';

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
});
