import { JsonValue, isPlainObject } from './jsonToTable';

export type DiffStatus = 'added' | 'removed' | 'changed';

export interface DiffEntry {
  path: string;
  status: DiffStatus;
  before?: JsonValue;
  after?: JsonValue;
}

export interface DiffSummary {
  added: number;
  removed: number;
  changed: number;
  total: number;
}

export interface JsonDiffReport {
  entries: DiffEntry[];
  summary: DiffSummary;
  identical: boolean;
}

const ROOT_PATH = '$';

function propertyPath(path: string, key: string): string {
  return `${path}.${key}`;
}

function indexPath(path: string, index: number): string {
  return `${path}[${index}]`;
}

function sameValue(before: JsonValue, after: JsonValue): boolean {
  return JSON.stringify(before) === JSON.stringify(after);
}

function compareObjects(
  path: string,
  before: Record<string, JsonValue>,
  after: Record<string, JsonValue>,
  entries: DiffEntry[],
): void {
  const keys = [
    ...Object.keys(before),
    ...Object.keys(after).filter((key) => !Object.prototype.hasOwnProperty.call(before, key)),
  ];

  keys.forEach((key) => {
    const childPath = propertyPath(path, key);
    const beforeHasKey = Object.prototype.hasOwnProperty.call(before, key);
    const afterHasKey = Object.prototype.hasOwnProperty.call(after, key);

    if (!beforeHasKey) {
      entries.push({ path: childPath, status: 'added', after: after[key] });
      return;
    }

    if (!afterHasKey) {
      entries.push({ path: childPath, status: 'removed', before: before[key] });
      return;
    }

    compareValues(childPath, before[key], after[key], entries);
  });
}

function compareArrays(path: string, before: JsonValue[], after: JsonValue[], entries: DiffEntry[]): void {
  const length = Math.max(before.length, after.length);

  for (let index = 0; index < length; index += 1) {
    const childPath = indexPath(path, index);

    if (index >= before.length) {
      entries.push({ path: childPath, status: 'added', after: after[index] });
      continue;
    }

    if (index >= after.length) {
      entries.push({ path: childPath, status: 'removed', before: before[index] });
      continue;
    }

    compareValues(childPath, before[index], after[index], entries);
  }
}

function compareValues(path: string, before: JsonValue, after: JsonValue, entries: DiffEntry[]): void {
  if (isPlainObject(before) && isPlainObject(after)) {
    compareObjects(path, before, after, entries);
    return;
  }

  if (Array.isArray(before) && Array.isArray(after)) {
    compareArrays(path, before, after, entries);
    return;
  }

  if (!sameValue(before, after)) {
    entries.push({ path, status: 'changed', before, after });
  }
}

function summarize(entries: DiffEntry[]): DiffSummary {
  return entries.reduce<DiffSummary>((summary, entry) => {
    summary[entry.status] += 1;
    summary.total += 1;
    return summary;
  }, { added: 0, removed: 0, changed: 0, total: 0 });
}

export function diffJson(before: JsonValue, after: JsonValue): JsonDiffReport {
  const entries: DiffEntry[] = [];

  compareValues(ROOT_PATH, before, after, entries);

  return {
    entries,
    summary: summarize(entries),
    identical: entries.length === 0,
  };
}
