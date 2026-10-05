import { analyzeShapeReport, analyzeShapeStatistics, isEmptyValue, typeNameOf } from '../../core/jsonToSchema';

describe('json to shape statistics', () => {
  describe('typeNameOf', () => {
    it('identifies primitives', () => {
      expect(typeNameOf('a')).toBe('string');
      expect(typeNameOf(1)).toBe('number');
      expect(typeNameOf(true)).toBe('boolean');
      expect(typeNameOf(null)).toBe('null');
    });

    it('identifies objects and arrays', () => {
      expect(typeNameOf({ a: 1 })).toBe('object');
      expect(typeNameOf([1, 2])).toBe('array');
    });
  });

  describe('isEmptyValue', () => {
    it('treats null, empty string, empty array and empty object as empty', () => {
      expect(isEmptyValue(null)).toBe(true);
      expect(isEmptyValue('')).toBe(true);
      expect(isEmptyValue([])).toBe(true);
      expect(isEmptyValue({})).toBe(true);
    });

    it('treats filled values as not empty', () => {
      expect(isEmptyValue('a')).toBe(false);
      expect(isEmptyValue(0)).toBe(false);
      expect(isEmptyValue(false)).toBe(false);
      expect(isEmptyValue([1])).toBe(false);
      expect(isEmptyValue({ a: 1 })).toBe(false);
    });
  });

  describe('analyzeShapeStatistics', () => {
    it('summarizes an array of objects', () => {
      const statistics = analyzeShapeStatistics([
        { product: 'Laptop', inStock: true },
        { product: 'Mouse' },
      ]);

      expect(statistics.objects).toBe(2);
      expect(statistics.arrays).toBe(1);
      expect(statistics.properties).toBe(2);
      expect(statistics.values).toBe(5);
      expect(statistics.filled).toBe(5);
      expect(statistics.empty).toBe(0);
      expect(statistics.averageProperties).toBe(1.5);
      expect(statistics.typeCounts).toEqual([
        { type: 'object', count: 2, percentage: 40 },
        { type: 'string', count: 2, percentage: 40 },
        { type: 'boolean', count: 1, percentage: 20 },
      ]);
    });

    it('counts nested objects and their properties', () => {
      const statistics = analyzeShapeStatistics([
        { address: { city: 'Lisbon' } },
        { address: { city: 'Porto', code: 1 } },
      ]);

      expect(statistics.objects).toBe(4);
      expect(statistics.arrays).toBe(1);
      expect(statistics.properties).toBe(3);
      expect(statistics.values).toBe(7);
      expect(statistics.typeCounts).toEqual([
        { type: 'object', count: 4, percentage: 57 },
        { type: 'string', count: 2, percentage: 29 },
        { type: 'number', count: 1, percentage: 14 },
      ]);
    });

    it('counts array elements as values', () => {
      const statistics = analyzeShapeStatistics({ tags: ['a', 'b', 'c'] });

      expect(statistics.objects).toBe(1);
      expect(statistics.arrays).toBe(1);
      expect(statistics.properties).toBe(1);
      expect(statistics.values).toBe(4);
      expect(statistics.typeCounts).toEqual([
        { type: 'string', count: 3, percentage: 75 },
        { type: 'array', count: 1, percentage: 25 },
      ]);
    });

    it('reports filled and empty values', () => {
      const statistics = analyzeShapeStatistics([
        { name: 'a', note: '' },
        { name: 'b', note: 'hello' },
        { name: 'c', note: null },
      ]);

      expect(statistics.values).toBe(9);
      expect(statistics.filled).toBe(7);
      expect(statistics.empty).toBe(2);
    });

    it('treats empty arrays and objects as empty values', () => {
      const statistics = analyzeShapeStatistics([
        { tags: [], meta: {} },
        { tags: ['x'], meta: { a: 1 } },
      ]);

      expect(statistics.empty).toBe(2);
      expect(statistics.filled).toBe(6);
    });

    it('handles scalars at the root', () => {
      const statistics = analyzeShapeStatistics('hello');

      expect(statistics.objects).toBe(0);
      expect(statistics.arrays).toBe(0);
      expect(statistics.properties).toBe(0);
      expect(statistics.values).toBe(0);
      expect(statistics.typeCounts).toEqual([]);
    });

    it('handles an empty array', () => {
      const statistics = analyzeShapeStatistics([]);

      expect(statistics.objects).toBe(0);
      expect(statistics.arrays).toBe(1);
      expect(statistics.values).toBe(0);
      expect(statistics.typeCounts).toEqual([]);
    });
  });

  describe('analyzeShapeReport', () => {
    it('keeps the high level statistics on the root node', () => {
      const report = analyzeShapeReport({
        slideshows: [{ title: 'a' }, { title: 'b' }],
        author: { name: 'x' },
      });

      expect(report.path).toBe('');
      expect(report.kind).toBe('object');
      expect(report.statistics.objects).toBe(4);
      expect(report.statistics.arrays).toBe(1);
      expect(report.statistics.properties).toBe(4);
    });

    it('creates one node per nested object or array with the same statistics', () => {
      const report = analyzeShapeReport({
        slideshows: [{ title: 'a' }, { title: 'b' }],
        author: { name: 'x' },
      });

      expect(report.children.map((child) => child.path)).toEqual(['slideshows', 'author']);

      const slideshows = report.children.find((child) => child.path === 'slideshows')!;
      expect(slideshows.kind).toBe('array');
      expect(slideshows.count).toBe(1);
      expect(slideshows.statistics.objects).toBe(2);
      expect(slideshows.statistics.arrays).toBe(1);
      expect(slideshows.statistics.properties).toBe(1);
      expect(slideshows.statistics.values).toBe(4);

      const author = report.children.find((child) => child.path === 'author')!;
      expect(author.kind).toBe('object');
      expect(author.count).toBe(1);
      expect(author.statistics.objects).toBe(1);
      expect(author.statistics.properties).toBe(1);
      expect(author.statistics.values).toBe(1);
    });

    it('aggregates repeated nested shapes into a single node', () => {
      const report = analyzeShapeReport([
        { author: { name: 'a' }, tags: ['x'] },
        { author: { name: 'b' }, tags: ['y'] },
        { author: { name: 'c' }, tags: [] },
      ]);

      const author = report.children.find((child) => child.path === 'author')!;
      expect(author.count).toBe(3);
      expect(author.statistics.objects).toBe(3);
      expect(author.statistics.properties).toBe(1);
      expect(author.statistics.values).toBe(3);

      const tags = report.children.find((child) => child.path === 'tags')!;
      expect(tags.kind).toBe('array');
      expect(tags.count).toBe(3);
      expect(tags.statistics.arrays).toBe(3);
      expect(tags.statistics.values).toBe(2);
    });

    it('builds nested children recursively', () => {
      const report = analyzeShapeReport([
        { author: { address: { city: 'Lisbon' } } },
        { author: { address: { city: 'Porto' } } },
      ]);

      const author = report.children.find((child) => child.path === 'author')!;
      const address = author.children.find((child) => child.path === 'author.address')!;

      expect(address.statistics.objects).toBe(2);
      expect(address.statistics.properties).toBe(1);
    });

    it('has no children for a flat array of objects', () => {
      const report = analyzeShapeReport([{ product: 'Laptop' }, { product: 'Mouse' }]);

      expect(report.children).toEqual([]);
    });
  });
});