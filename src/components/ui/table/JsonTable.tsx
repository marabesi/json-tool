import { memo, useMemo } from 'react';
import {
  JsonPrimitive,
  JsonValue,
  filterColumnsRows,
  filterKeyValueRows,
  isPlainObject,
  isPrimitiveArray,
  matchesSearch,
  toSearchText,
  toTableModel,
} from '../../../core/jsonToTable';

const tableClasses = 'w-full border-collapse text-left text-sm';
const headerCellClasses = 'border border-blue-900/40 bg-blue-900 px-2 py-1 font-semibold text-white dark:border-gray-500 dark:bg-gray-700';
const bodyCellClasses = 'border border-blue-900/30 px-2 py-1 align-top dark:border-gray-600';
const bodyRowClasses = 'odd:bg-white/30 even:bg-black/5 dark:odd:bg-gray-800/40 dark:even:bg-gray-700/40';

interface CellProps {
  value: JsonValue | undefined;
  search: string;
  exact: boolean;
}

function Cell({ value, search, exact }: CellProps) {
  if (Array.isArray(value) && isPrimitiveArray(value)) {
    return <>{value.map((item: JsonPrimitive) => toSearchText(item)).join(', ')}</>;
  }

  if (value !== undefined && (Array.isArray(value) || isPlainObject(value))) {
    return (
      <div className="inline-block min-w-full rounded border border-blue-900/30 dark:border-gray-500">
        <JsonTable data={value} search={search} exact={exact} nested />
      </div>
    );
  }

  return <>{toSearchText(value)}</>;
}

function NoMatch() {
  return <p data-testid="json-table-no-match" className="p-2 text-sm">No matching data</p>;
}

interface Props {
  data: JsonValue;
  search?: string;
  exact?: boolean;
  nested?: boolean;
}

const JsonTable = memo(function JsonTableComponent({ data, search = '', exact = false, nested = false }: Props) {
  const model = useMemo(() => toTableModel(data), [data]);
  const testId = nested ? 'json-subtable' : 'json-table';

  if (model.kind === 'scalar') {
    if (!matchesSearch(model.value, search, exact)) {
      return <NoMatch />;
    }

    return (
      <div data-testid="json-table-scalar" className="p-1">
        <Cell value={model.value} search={search} exact={exact} />
      </div>
    );
  }

  if (model.kind === 'keyValue') {
    if (model.rows.length === 0) {
      return <code data-testid="json-table-object" className="text-sm">{'{}'}</code>;
    }

    const rows = filterKeyValueRows(model.rows, search, exact);

    if (rows.length === 0) {
      return <NoMatch />;
    }

    return (
      <table data-testid={testId} className={tableClasses}>
        <thead>
          <tr>
            <th className={headerCellClasses}>key</th>
            <th className={headerCellClasses}>value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.key}-${index}`} className={bodyRowClasses}>
              <td className={bodyCellClasses}>{row.key}</td>
              <td className={bodyCellClasses}>
                <Cell value={row.value} search={search} exact={exact} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (model.columns.length === 0 || model.rows.length === 0) {
    return <code data-testid="json-table-array" className="text-sm">[]</code>;
  }

  const rows = filterColumnsRows(model.rows, model.columns, search, exact);

  if (rows.length === 0) {
    return <NoMatch />;
  }

  return (
    <table data-testid={testId} className={tableClasses}>
      <thead>
        <tr>
          {model.columns.map((column) => (
            <th key={column} className={headerCellClasses}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className={bodyRowClasses}>
            {model.columns.map((column) => (
              <td key={column} className={bodyCellClasses}>
                <Cell value={row[column]} search={search} exact={exact} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default JsonTable;
