import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setUpClipboard, tearDownClipboard, writeTextToClipboard } from 'jest-clipboard';
import { renderEntireApp } from './__testutilities__/builder';

const shapeJson = '[{"product":"Laptop","inStock":true},{"product":"Mouse"}]';

describe('JSON shape page', () => {
  beforeEach(() => {
    setUpClipboard();
  });

  afterEach(() => {
    tearDownClipboard();
  });

  const openShapeWith = async (json: string) => {
    renderEntireApp();

    await writeTextToClipboard(json);
    await userEvent.click(screen.getByTestId('paste-from-clipboard'));

    await waitFor(() => {
      expect(screen.getByTestId('raw-json')).toHaveValue(json);
    });

    await userEvent.click(screen.getByTestId('schema'));
    await screen.findByTestId('schema-title');
  };

  it('renders the schema navigation link', () => {
    renderEntireApp();

    expect(screen.getByTestId('schema')).toBeInTheDocument();
  });

  it('shows a placeholder when there is no json', async () => {
    renderEntireApp();

    await userEvent.click(screen.getByTestId('schema'));

    expect(screen.getByTestId('schema-empty')).toBeInTheDocument();
  });

  it('renders aggregate statistics of the json shape', async () => {
    await openShapeWith(shapeJson);

    expect(await screen.findByTestId('json-shape')).toBeInTheDocument();
    expect(screen.getByTestId('json-shape-objects-value')).toHaveTextContent('2');
    expect(screen.getByTestId('json-shape-properties-value')).toHaveTextContent('2');
    expect(screen.getByTestId('json-shape-values-value')).toHaveTextContent('5');
    expect(screen.getByTestId('json-shape-filled-value')).toHaveTextContent('5 (100%)');
    expect(screen.getByTestId('json-shape-types')).toBeInTheDocument();
  });

  it('shows the same statistics for each nested shape', async () => {
    await openShapeWith('{"slideshows":[{"title":"a"},{"title":"b"}],"author":{"name":"x"}}');

    expect(await screen.findByTestId('json-shape-nested')).toBeInTheDocument();
    expect(screen.getAllByTestId('json-shape-node')).toHaveLength(2);
    expect(screen.getByText('slideshows')).toBeInTheDocument();
    expect(screen.getByText('author')).toBeInTheDocument();
  });

  it('shows an error for invalid json', async () => {
    await openShapeWith('{invalid json');

    expect(await screen.findByTestId('schema-error')).toBeInTheDocument();
    expect(screen.getByTestId('schema-error')).toHaveTextContent('invalid json');
  });
});