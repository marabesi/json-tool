import { toTableModel } from '../../core/jsonToTable';

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
});
