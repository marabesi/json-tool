import { render, screen, within } from '@testing-library/react';
import JsonDiff from '../../components/ui/diff/JsonDiff';
import { diffJson } from '../../core/jsonDiff';
import { JsonValue } from '../../core/jsonToTable';

const renderDiff = (before: JsonValue, after: JsonValue) => {
  render(<JsonDiff report={diffJson(before, after)} />);
};

describe('JsonDiff', () => {
  it('renders the summary counts', () => {
    renderDiff({ name: 'Ada', age: 36 }, { name: 'Grace', email: 'grace@example.com' });

    expect(screen.getByTestId('json-diff-added-value')).toHaveTextContent('1');
    expect(screen.getByTestId('json-diff-removed-value')).toHaveTextContent('1');
    expect(screen.getByTestId('json-diff-changed-value')).toHaveTextContent('1');
    expect(screen.getByTestId('json-diff-total-value')).toHaveTextContent('3');
  });

  it('renders each difference with its path, status and values', () => {
    renderDiff({ name: 'Ada', age: 36 }, { name: 'Grace', email: 'grace@example.com' });

    const entries = screen.getAllByTestId('json-diff-entry');
    expect(entries).toHaveLength(3);
    expect(entries.map((entry) => entry.getAttribute('data-status'))).toEqual(['changed', 'removed', 'added']);

    const changed = entries[0];
    expect(within(changed).getByTestId('json-diff-entry-path')).toHaveTextContent('$.name');
    expect(within(changed).getByTestId('json-diff-entry-status')).toHaveTextContent('changed');
    expect(within(changed).getByTestId('json-diff-entry-before')).toHaveTextContent('"Ada"');
    expect(within(changed).getByTestId('json-diff-entry-after')).toHaveTextContent('"Grace"');

    const removed = entries[1];
    expect(within(removed).getByTestId('json-diff-entry-path')).toHaveTextContent('$.age');
    expect(within(removed).getByTestId('json-diff-entry-before')).toHaveTextContent('36');
    expect(within(removed).getByTestId('json-diff-entry-after')).toHaveTextContent('—');

    const added = entries[2];
    expect(within(added).getByTestId('json-diff-entry-path')).toHaveTextContent('$.email');
    expect(within(added).getByTestId('json-diff-entry-before')).toHaveTextContent('—');
    expect(within(added).getByTestId('json-diff-entry-after')).toHaveTextContent('"grace@example.com"');
  });

  it('renders a message when both documents are identical', () => {
    renderDiff({ name: 'Ada' }, { name: 'Ada' });

    expect(screen.getByTestId('json-diff-identical')).toHaveTextContent('No differences');
    expect(screen.queryByTestId('json-diff-entries')).not.toBeInTheDocument();
  });
});
