import {
  countTableRows,
  filterColumnsRows,
  fuzzyMatch,
  matchesTerm,
  parseSearch,
  toTableModel,
} from '../../core/jsonToTable';

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

    it('counts only the rows that match a column search', () => {
      expect(countTableRows(data, 'product:laptop')).toBe(1);
      expect(countTableRows(data, 'inStock:false')).toBe(1);
      expect(countTableRows(data, 'product:missing')).toBe(0);
    });

    it('counts only the exact matches when exact is true', () => {
      expect(countTableRows(data, 'product:Laptop', true)).toBe(1);
      expect(countTableRows(data, 'product:Lap', true)).toBe(0);
    });
  });

  describe('matchesTerm', () => {
    it('fuzzy matches by default', () => {
      expect(matchesTerm('Mouse', 'mse')).toBe(true);
    });

    it('requires the value to be exactly the term when exact is true', () => {
      expect(matchesTerm('Mouse', 'Mouse', true)).toBe(true);
      expect(matchesTerm('Mouse', 'mouse', true)).toBe(true);
      expect(matchesTerm('Mouse', 'Mou', true)).toBe(false);
    });

    it('matches everything for an empty query in both modes', () => {
      expect(matchesTerm('Mouse', '')).toBe(true);
      expect(matchesTerm('Mouse', '', true)).toBe(true);
    });
  });

  describe('fuzzyMatch', () => {
    it('matches characters in order, ignoring case', () => {
      expect(fuzzyMatch('Mouse', 'mse')).toBe(true);
      expect(fuzzyMatch('Mouse', 'MOUSE')).toBe(true);
    });

    it('does not match when the characters are out of order or missing', () => {
      expect(fuzzyMatch('Mouse', 'xyz')).toBe(false);
      expect(fuzzyMatch('Mouse', 'eu')).toBe(false);
    });

    it('matches everything for an empty query', () => {
      expect(fuzzyMatch('Mouse', '')).toBe(true);
    });
  });

  describe('parseSearch', () => {
    const columns = ['index', 'product'];

    it('parses a column and its value', () => {
      expect(parseSearch('index:0', columns)).toEqual({ column: 'index', term: '0' });
    });

    it('matches the column name ignoring case and fuzzily', () => {
      expect(parseSearch('INDEX:0', columns)).toEqual({ column: 'index', term: '0' });
      expect(parseSearch('prd:mouse', columns)).toEqual({ column: 'product', term: 'mouse' });
    });

    it('falls back to a global term when no column matches', () => {
      expect(parseSearch('unknown:0', columns)).toEqual({ term: 'unknown:0' });
      expect(parseSearch('Mouse', columns)).toEqual({ term: 'Mouse' });
    });

    it('treats a query that starts with the separator as a global term', () => {
      expect(parseSearch(':0', columns)).toEqual({ term: ':0' });
    });
  });

  describe('filterColumnsRows', () => {
    const rows = [
      { index: 0, product: 'Laptop' },
      { index: 1, product: 'Mouse' },
    ];
    const columns = ['index', 'product'];

    it('keeps only the rows whose column matches the value', () => {
      expect(filterColumnsRows(rows, columns, 'index:0')).toEqual([{ index: 0, product: 'Laptop' }]);
      expect(filterColumnsRows(rows, columns, 'product:mse')).toEqual([{ index: 1, product: 'Mouse' }]);
    });

    it('searches every column when no column is given', () => {
      expect(filterColumnsRows(rows, columns, 'laptop')).toEqual([{ index: 0, product: 'Laptop' }]);
    });

    it('keeps only exact values when exact is true', () => {
      expect(filterColumnsRows(rows, columns, 'index:0', true)).toEqual([{ index: 0, product: 'Laptop' }]);
      expect(filterColumnsRows(rows, columns, 'product:Mouse', true)).toEqual([{ index: 1, product: 'Mouse' }]);
      expect(filterColumnsRows(rows, columns, 'product:Mou', true)).toEqual([]);
    });
  });
});
