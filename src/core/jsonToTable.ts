export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface KeyValueRow {
  key: string;
  value: JsonValue;
}

export interface ColumnsTable {
  kind: 'columns';
  columns: string[];
  rows: Array<Record<string, JsonValue>>;
}

export interface KeyValueTable {
  kind: 'keyValue';
  rows: KeyValueRow[];
}

export interface ScalarTable {
  kind: 'scalar';
  value: JsonValue;
}

export type TableModel = ColumnsTable | KeyValueTable | ScalarTable;

export function isPlainObject(value: unknown): value is Record<string, JsonValue> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isPrimitiveArray(value: JsonValue): value is JsonPrimitive[] {
  return Array.isArray(value) && value.every((item) => !Array.isArray(item) && !isPlainObject(item));
}

export function toSearchText(value: JsonValue | undefined): string {
  if (value === undefined || value === null) {
    return value === null ? 'null' : '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

export function fuzzyMatch(target: string, query: string): boolean {
  if (query === '') {
    return true;
  }

  const haystack = target.toLowerCase();
  const needle = query.toLowerCase();
  let position = 0;

  for (const character of needle) {
    const found = haystack.indexOf(character, position);

    if (found === -1) {
      return false;
    }

    position = found + 1;
  }

  return true;
}

export function matchesTerm(target: string, query: string, exact = false): boolean {
  if (query === '') {
    return true;
  }

  if (exact) {
    return target.toLowerCase() === query.toLowerCase();
  }

  return fuzzyMatch(target, query);
}

export interface ParsedSearch {
  column?: string;
  term: string;
}

export function parseSearch(search: string, columns: string[]): ParsedSearch {
  const separator = search.indexOf(':');

  if (separator === -1) {
    return { term: search };
  }

  const columnPart = search.slice(0, separator).trim();

  if (columnPart === '') {
    return { term: search };
  }

  const column = columns.find((candidate) => candidate.toLowerCase() === columnPart.toLowerCase())
    ?? columns.find((candidate) => fuzzyMatch(candidate, columnPart));

  if (column === undefined) {
    return { term: search };
  }

  return { column, term: search.slice(separator + 1).trim() };
}

export function matchesSearch(value: JsonValue | undefined, search: string, exact = false): boolean {
  return matchesTerm(toSearchText(value), search, exact);
}

export function filterKeyValueRows(rows: KeyValueRow[], search: string, exact = false): KeyValueRow[] {
  if (search === '') {
    return rows;
  }

  const parsed = parseSearch(search, ['key', 'value']);

  if (parsed.column === 'key') {
    return rows.filter((row) => matchesTerm(row.key, parsed.term, exact));
  }

  if (parsed.column === 'value') {
    return rows.filter((row) => matchesTerm(toSearchText(row.value), parsed.term, exact));
  }

  return rows.filter((row) => matchesTerm(row.key, parsed.term, exact) || matchesTerm(toSearchText(row.value), parsed.term, exact));
}

export function filterColumnsRows(
  rows: Array<Record<string, JsonValue>>,
  columns: string[],
  search: string,
  exact = false,
): Array<Record<string, JsonValue>> {
  if (search === '') {
    return rows;
  }

  const parsed = parseSearch(search, columns);

  if (parsed.column !== undefined) {
    return rows.filter((row) => matchesTerm(toSearchText(row[parsed.column as string]), parsed.term, exact));
  }

  return rows.filter((row) => columns.some((column) => matchesTerm(toSearchText(row[column]), parsed.term, exact)));
}

export function countTableRows(data: JsonValue, search = '', exact = false): number {
  const model = toTableModel(data);

  if (model.kind === 'scalar') {
    return matchesSearch(model.value, search, exact) ? 1 : 0;
  }

  if (model.kind === 'keyValue') {
    return filterKeyValueRows(model.rows, search, exact).length;
  }

  return filterColumnsRows(model.rows, model.columns, search, exact).length;
}

export function toTableModel(data: JsonValue): TableModel {
  if (Array.isArray(data)) {
    return toColumnsTable(data);
  }

  if (isPlainObject(data)) {
    return {
      kind: 'keyValue',
      rows: Object.entries(data).map(([key, value]) => ({ key, value })),
    };
  }

  return { kind: 'scalar', value: data };
}

function toColumnsTable(data: JsonValue[]): ColumnsTable {
  const isObjectList = data.length > 0 && data.every(isPlainObject);

  if (!isObjectList) {
    return {
      kind: 'columns',
      columns: ['value'],
      rows: data.map((value) => ({ value })),
    };
  }

  const columns: string[] = [];
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (!columns.includes(key)) {
        columns.push(key);
      }
    });
  });

  return { kind: 'columns', columns, rows: data };
}
