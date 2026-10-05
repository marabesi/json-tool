import { countTableRows, toTableModel } from '../../core/jsonToTable';

describe('json to table', () => {
  describe('toTableModel', () => {
    it('renders a single object as key/value rows', () => {
      expect(toTableModel({ name: 'Maeve', age: 28 })).toEqual({
        kind: 'keyValue',
        rows: [{ key: 'name', value: 'Maeve' }, { key: 'age', value: 28 }],
      });
    });

    it('renders an array of objects as columns using the union of keys', () => {
      expect(toTableModel([{ id: 1 }, { name: 'a', id: 2 }])).toEqual({
        kind: 'columns',
        columns: ['id', 'name'],
        rows: [{ id: 1 }, { name: 'a', id: 2 }],
      });
    });

    it('renders an array of primitives as a single value column', () => {
      expect(toTableModel([1, 'two', true])).toEqual({
        kind: 'columns',
        columns: ['value'],
        rows: [{ value: 1 }, { value: 'two' }, { value: true }],
      });
    });

    it('renders scalars', () => {
      expect(toTableModel('hello')).toEqual({ kind: 'scalar', value: 'hello' });
    });

    it('renders an empty array with no rows', () => {
      expect(toTableModel([])).toEqual({ kind: 'columns', columns: ['value'], rows: [] });
    });
  });

  describe('countTableRows', () => {
    const data = [
      { product: 'Laptop', inStock: true },
      { product: 'Mouse', inStock: false },
    ];

    it('counts every row when there is no search', () => {
      expect(countTableRows(data)).toBe(2);
    });

    it('counts only the rows that match the search', () => {
      expect(countTableRows(data, 'mouse')).toBe(1);
      expect(countTableRows(data, 'nothing')).toBe(0);
    });

    it('counts the key/value rows of an object', () => {
      expect(countTableRows({ name: 'Maeve', age: 28 })).toBe(2);
      expect(countTableRows({ name: 'Maeve', age: 28 }, 'maeve')).toBe(1);
    });

    it('counts the rows of a primitive array', () => {
      expect(countTableRows([1, 'two', true])).toBe(3);
      expect(countTableRows([1, 'two', true], 'two')).toBe(1);
    });

    it('counts a scalar as a single row only when it matches', () => {
      expect(countTableRows('hello')).toBe(1);
      expect(countTableRows('hello', 'nope')).toBe(0);
    });

    it('counts an empty array as zero rows', () => {
      expect(countTableRows([])).toBe(0);
    });
  });
});
