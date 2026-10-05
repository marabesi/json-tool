import { render, screen, within } from '@testing-library/react';
import JsonShapeStatistics from '../../components/ui/schema/JsonShapeStatistics';
import { analyzeShapeReport } from '../../core/jsonToSchema';
import { JsonValue } from '../../core/jsonToTable';

const renderReport = (data: JsonValue) => {
  render(<JsonShapeStatistics report={analyzeShapeReport(data)} />);
};

describe('JsonShapeStatistics', () => {
  it('renders the aggregate counts', () => {
    renderReport([{ product: 'Laptop', inStock: true }, { product: 'Mouse' }]);

    expect(screen.getByTestId('json-shape-objects-value')).toHaveTextContent('2');
    expect(screen.getByTestId('json-shape-arrays-value')).toHaveTextContent('1');
    expect(screen.getByTestId('json-shape-properties-value')).toHaveTextContent('2');
    expect(screen.getByTestId('json-shape-values-value')).toHaveTextContent('5');
    expect(screen.getByTestId('json-shape-filled-value')).toHaveTextContent('5 (100%)');
    expect(screen.getByTestId('json-shape-empty-value')).toHaveTextContent('0 (0%)');
  });

  it('renders the type breakdown', () => {
    renderReport([{ product: 'Laptop', inStock: true }, { product: 'Mouse' }]);

    expect(screen.getByTestId('json-shape-types')).toBeInTheDocument();

    const rows = screen.getAllByTestId('json-shape-type-row').map((row) => row.textContent);
    expect(rows).toEqual(['object240%', 'string240%', 'boolean120%']);
  });

  it('renders the same statistics for each nested shape', () => {
    renderReport({
      slideshows: [{ title: 'a' }, { title: 'b' }],
      author: { name: 'x' },
    });

    const nodes = screen.getAllByTestId('json-shape-node');
    expect(nodes).toHaveLength(2);

    const slideshows = screen.getByText('slideshows').closest('details')!;
    expect(within(slideshows).getByTestId('json-shape-node-objects-value')).toHaveTextContent('2');
    expect(within(slideshows).getByTestId('json-shape-node-properties-value')).toHaveTextContent('1');
    expect(within(slideshows).getByTestId('json-shape-node-values-value')).toHaveTextContent('4');

    const author = screen.getByText('author').closest('details')!;
    expect(within(author).getByTestId('json-shape-node-objects-value')).toHaveTextContent('1');
    expect(within(author).getByTestId('json-shape-node-properties-value')).toHaveTextContent('1');
  });

  it('does not render a line by line field list', () => {
    renderReport({ name: 'Maeve', address: { city: 'Lisbon' } });

    expect(screen.queryByTestId('json-schema-field')).not.toBeInTheDocument();
  });
});