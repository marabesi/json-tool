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
