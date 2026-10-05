import { render, screen } from '@testing-library/react';
import JsonTable from '../../components/ui/table/JsonTable';

describe('JsonTable', () => {
  it('renders an array of objects as a column based table', () => {
    render(<JsonTable data={[{ id: 1, product: 'Laptop' }]} />);

    expect(screen.getByText('product')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });

  it('renders a single object as key/value pairs', () => {
    render(<JsonTable data={{ name: 'Maeve' }} />);

    expect(screen.getByText('key')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('Maeve')).toBeInTheDocument();
  });

  it('renders nested objects as sub tables', () => {
    render(<JsonTable data={{ contact: { email: 'maeve@example.com' } }} />);

    expect(screen.getByTestId('json-subtable')).toBeInTheDocument();
    expect(screen.getByText('maeve@example.com')).toBeInTheDocument();
  });

  it('joins arrays of primitives', () => {
    render(<JsonTable data={{ tags: ['a', 'b'] }} />);

    expect(screen.getByText('a, b')).toBeInTheDocument();
  });

  it('filters rows by the search term', () => {
    render(<JsonTable data={[{ product: 'Laptop' }, { product: 'Mouse' }]} search="mouse" />);

    expect(screen.getByText('Mouse')).toBeInTheDocument();
    expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
  });

  it('filters rows by a fuzzy term', () => {
    render(<JsonTable data={[{ product: 'Laptop' }, { product: 'Mouse' }]} search="mse" />);

    expect(screen.getByText('Mouse')).toBeInTheDocument();
    expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
  });

  it('filters a specific column with column:value', () => {
    render(<JsonTable data={[{ product: 'Laptop' }, { product: 'Mouse' }]} search="product:mouse" />);

    expect(screen.getByText('Mouse')).toBeInTheDocument();
    expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
  });

  it('requires the whole value when exact match is set', () => {
    render(<JsonTable data={[{ product: 'Laptop' }, { product: 'Mouse' }]} search="Mou" exact />);

    expect(screen.getByText('No matching data')).toBeInTheDocument();
    expect(screen.queryByText('Mouse')).not.toBeInTheDocument();
  });

  it('matches an exact column value when exact match is set', () => {
    render(<JsonTable data={[{ index: 0 }, { index: 10 }]} search="index:0" exact />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByText('10')).not.toBeInTheDocument();
  });
});
