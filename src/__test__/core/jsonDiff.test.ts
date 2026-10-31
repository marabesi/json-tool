import { diffJson } from '../../core/jsonDiff';

describe('json diff', () => {
  it('reports identical documents as identical', () => {
    const report = diffJson({ name: 'Ada', tags: ['a', 'b'] }, { name: 'Ada', tags: ['a', 'b'] });

    expect(report.identical).toBe(true);
    expect(report.entries).toEqual([]);
    expect(report.summary).toEqual({ added: 0, removed: 0, changed: 0, total: 0 });
  });

  it('reports changed nested values with their json path', () => {
    const report = diffJson(
      { user: { name: 'Ada', age: 36 }, active: true },
      { user: { name: 'Grace', age: 36 }, active: false },
    );

    expect(report.entries).toEqual([
      { path: '$.user.name', status: 'changed', before: 'Ada', after: 'Grace' },
      { path: '$.active', status: 'changed', before: true, after: false },
    ]);
    expect(report.summary).toEqual({ added: 0, removed: 0, changed: 2, total: 2 });
    expect(report.identical).toBe(false);
  });

  it('reports added and removed properties', () => {
    const report = diffJson({ name: 'Ada', age: 36 }, { name: 'Ada', email: 'ada@example.com' });

    expect(report.entries).toEqual([
      { path: '$.age', status: 'removed', before: 36 },
      { path: '$.email', status: 'added', after: 'ada@example.com' },
    ]);
    expect(report.summary).toEqual({ added: 1, removed: 1, changed: 0, total: 2 });
  });

  it('compares array elements by index', () => {
    const report = diffJson([1, 2, 3], [1, 4]);

    expect(report.entries).toEqual([
      { path: '$[1]', status: 'changed', before: 2, after: 4 },
      { path: '$[2]', status: 'removed', before: 3 },
    ]);
    expect(report.summary).toEqual({ added: 0, removed: 1, changed: 1, total: 2 });
  });

  it('reports added array elements as a single entry', () => {
    const report = diffJson([], [{ name: 'Ada' }]);

    expect(report.entries).toEqual([
      { path: '$[0]', status: 'added', after: { name: 'Ada' } },
    ]);
  });

  it('reports nested objects inside arrays', () => {
    const report = diffJson({ users: [{ name: 'Ada' }] }, { users: [{ name: 'Grace' }] });

    expect(report.entries).toEqual([
      { path: '$.users[0].name', status: 'changed', before: 'Ada', after: 'Grace' },
    ]);
  });

  it('reports a whole object as one entry when it is added', () => {
    const report = diffJson({}, { user: { name: 'Ada' } });

    expect(report.entries).toEqual([
      { path: '$.user', status: 'added', after: { name: 'Ada' } },
    ]);
  });

  it('reports a type change at the root', () => {
    const report = diffJson({ value: 1 }, [1]);

    expect(report.entries).toEqual([
      { path: '$', status: 'changed', before: { value: 1 }, after: [1] },
    ]);
  });

  it('reports a type change of a nested value', () => {
    const report = diffJson({ value: { a: 1 } }, { value: [1] });

    expect(report.entries).toEqual([
      { path: '$.value', status: 'changed', before: { a: 1 }, after: [1] },
    ]);
  });
});
