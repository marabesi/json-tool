import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';
import { renderEntireApp } from './__testutilities__/builder';

const tableJson = '[{"product":"Laptop","inStock":true},{"product":"Mouse","inStock":false}]';

describe('JSON as a table page', () => {
  beforeEach(() => {
    setUpClipboard();
  });

  afterEach(() => {
    tearDownClipboard();
  });

  const openTableWith = async (json: string) => {
    renderEntireApp();

    await writeTextToClipboard(json);
    await userEvent.click(screen.getByTestId('paste-from-clipboard'));

    await waitFor(() => {
      expect(screen.getByTestId('raw-json')).toHaveValue(json);
    });

    await userEvent.click(screen.getByTestId('table'));
    await screen.findByTestId('table-title');
  };

  it('renders the table navigation link', () => {
    renderEntireApp();

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('shows a placeholder when there is no json', async () => {
    renderEntireApp();

    await userEvent.click(screen.getByTestId('table'));

    expect(screen.getByTestId('table-empty')).toBeInTheDocument();
  });

  it('renders json as a table', async () => {
    await openTableWith(tableJson);

    expect(await screen.findByTestId('json-table')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
  });

  it('filters rows using the search box', async () => {
    await openTableWith(tableJson);

    await userEvent.type(screen.getByTestId('table-search'), 'Mouse');

    expect(await screen.findByText('Mouse')).toBeInTheDocument();
    expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
  });

  it('expands the table to full screen and back', async () => {
    await openTableWith(tableJson);

    expect(screen.getByTestId('table-pane')).toHaveAttribute('data-fullscreen', 'false');

    await userEvent.click(screen.getByTestId('toggle-fullscreen'));

    expect(screen.getByTestId('table-pane')).toHaveAttribute('data-fullscreen', 'true');
    expect(screen.getByText('Exit full screen')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('toggle-fullscreen'));

    expect(screen.getByTestId('table-pane')).toHaveAttribute('data-fullscreen', 'false');
    expect(screen.getByText('Full screen')).toBeInTheDocument();
  });
});
