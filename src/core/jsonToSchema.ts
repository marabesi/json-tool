import { JsonValue, isPlainObject } from './jsonToTable';

export interface TypeStat {
  type: string;
  count: number;
  percentage: number;
}

export interface ShapeStatistics {
  objects: number;
  arrays: number;
  properties: number;
  values: number;
  filled: number;
  empty: number;
  averageProperties: number;
  typeCounts: TypeStat[];
}

export interface ShapeNode {
  path: string;
  kind: 'object' | 'array' | 'scalar';
  typeName: string;
  count: number;
  statistics: ShapeStatistics;
  children: ShapeNode[];
}

export function typeNameOf(value: JsonValue): string {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  if (isPlainObject(value)) {
    return 'object';
  }

  return typeof value;
}

export function isEmptyValue(value: JsonValue): boolean {
  if (value === null) {
    return true;
  }

  if (typeof value === 'string') {
    return value.length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (isPlainObject(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
}

function toPercentage(count: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((count / total) * 100);
}

interface Accumulator {
  objects: number;
  arrays: number;
  propertyValues: number;
  arrayElements: number;
  filled: number;
  empty: number;
  propertyNames: Set<string>;
  typeCounts: Map<string, number>;
}

function createAccumulator(): Accumulator {
  return {
    objects: 0,
    arrays: 0,
    propertyValues: 0,
    arrayElements: 0,
    filled: 0,
    empty: 0,
    propertyNames: new Set<string>(),
    typeCounts: new Map<string, number>(),
  };
}

function countValue(node: JsonValue, accumulator: Accumulator): void {
  const type = typeNameOf(node);
  accumulator.typeCounts.set(type, (accumulator.typeCounts.get(type) ?? 0) + 1);

  if (isEmptyValue(node)) {
    accumulator.empty += 1;
  } else {
    accumulator.filled += 1;
  }
}

function visit(value: JsonValue, accumulator: Accumulator): void {
  if (isPlainObject(value)) {
    accumulator.objects += 1;

    Object.keys(value).forEach((key) => {
      accumulator.propertyNames.add(key);
      accumulator.propertyValues += 1;

      const child = value[key];
      countValue(child, accumulator);
      visit(child, accumulator);
    });

    return;
  }

  if (Array.isArray(value)) {
    accumulator.arrays += 1;

    value.forEach((item) => {
      accumulator.arrayElements += 1;
      countValue(item, accumulator);
      visit(item, accumulator);
    });
  }
}

function aggregate(values: JsonValue[]): ShapeStatistics {
  const accumulator = createAccumulator();
  values.forEach((value) => visit(value, accumulator));

  const totalValues = accumulator.propertyValues + accumulator.arrayElements;

  const typeCounts = Array.from(accumulator.typeCounts.entries())
    .map(([type, count]) => ({ type, count, percentage: toPercentage(count, totalValues) }))
    .sort((a, b) => b.count - a.count);

  return {
    objects: accumulator.objects,
    arrays: accumulator.arrays,
    properties: accumulator.propertyNames.size,
    values: totalValues,
    filled: accumulator.filled,
    empty: accumulator.empty,
    averageProperties: accumulator.objects === 0
      ? 0
      : Math.round((accumulator.propertyValues / accumulator.objects) * 10) / 10,
    typeCounts,
  };
}

export function analyzeShapeStatistics(value: JsonValue): ShapeStatistics {
  return aggregate([value]);
}

function addInstance(map: Map<string, JsonValue[]>, path: string, value: JsonValue): void {
  const instances = map.get(path);

  if (instances === undefined) {
    map.set(path, [value]);
    return;
  }

  instances.push(value);
}

function joinPath(path: string, key: string): string {
  return path === '' ? key : `${path}.${key}`;
}

function collectNestedShape(map: Map<string, JsonValue[]>, path: string, key: string, child: JsonValue): void {
  if (isPlainObject(child) || Array.isArray(child)) {
    addInstance(map, joinPath(path, key), child);
  }
}

function collectNestedProperties(map: Map<string, JsonValue[]>, path: string, value: Record<string, JsonValue>): void {
  Object.keys(value).forEach((key) => {
    collectNestedShape(map, path, key, value[key]);
  });
}

function collectImmediate(instances: JsonValue[], path: string, map: Map<string, JsonValue[]>): void {
  instances.forEach((instance) => {
    if (isPlainObject(instance)) {
      collectNestedProperties(map, path, instance);
      return;
    }

    if (Array.isArray(instance)) {
      instance.forEach((item) => {
        if (isPlainObject(item)) {
          collectNestedProperties(map, path, item);
        } else if (Array.isArray(item)) {
          collectImmediate([item], path, map);
        }
      });
    }
  });
}

function typeNameForInstances(instances: JsonValue[]): string {
  if (instances.length === 0) {
    return 'empty';
  }

  const types = new Set(instances.map((value) => typeNameOf(value)));

  if (types.size === 1) {
    return typeNameOf(instances[0]);
  }

  return 'mixed';
}

function buildNode(path: string, instances: JsonValue[]): ShapeNode {
  const typeName = typeNameForInstances(instances);
  const kind = typeName === 'object' || typeName === 'array' ? typeName : 'scalar';

  const nested = new Map<string, JsonValue[]>();
  collectImmediate(instances, path, nested);

  const children = Array.from(nested.entries()).map(([childPath, childInstances]) =>
    buildNode(childPath, childInstances)
  );

  return {
    path,
    kind,
    typeName,
    count: instances.length,
    statistics: aggregate(instances),
    children,
  };
}

export function analyzeShapeReport(value: JsonValue): ShapeNode {
  return buildNode('', [value]);
}