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

export function matchesSearch(value: JsonValue | undefined, search: string): boolean {
  if (search === '') {
    return true;
  }

  return toSearchText(value).toLowerCase().includes(search.toLowerCase());
}

export function filterKeyValueRows(rows: KeyValueRow[], search: string): KeyValueRow[] {
  return rows.filter((row) => matchesSearch(row.key, search) || matchesSearch(row.value, search));
}

export function filterColumnsRows(
  rows: Array<Record<string, JsonValue>>,
  columns: string[],
  search: string,
): Array<Record<string, JsonValue>> {
  return rows.filter((row) => columns.some((column) => matchesSearch(row[column], search)));
}

export function countTableRows(data: JsonValue, search = ''): number {
  const model = toTableModel(data);

  if (model.kind === 'scalar') {
    return matchesSearch(model.value, search) ? 1 : 0;
  }

  if (model.kind === 'keyValue') {
    return filterKeyValueRows(model.rows, search).length;
  }

  return filterColumnsRows(model.rows, model.columns, search).length;
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
