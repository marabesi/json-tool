import StatCard from '../StatCard';
import { DiffEntry, JsonDiffReport } from '../../../core/jsonDiff';

const tableClasses = 'w-full border-collapse text-left text-sm';
const headerCellClasses = 'border border-blue-900/40 bg-blue-900 px-2 py-1 font-semibold text-white dark:border-gray-500 dark:bg-gray-700';
const bodyCellClasses = 'border border-blue-900/30 px-2 py-1 align-top dark:border-gray-600';
const bodyRowClasses = 'odd:bg-white/30 even:bg-black/5 dark:odd:bg-gray-800/40 dark:even:bg-gray-700/40';
const statusClasses: Record<DiffEntry['status'], string> = {
  added: 'bg-green-700 text-white',
  removed: 'bg-red-700 text-white',
  changed: 'bg-yellow-600 text-white',
};

function formatValue(value: DiffEntry['before'] | DiffEntry['after']): string {
  if (value === undefined) {
    return '—';
  }

  return JSON.stringify(value);
}

function DiffRow({ entry }: { entry: DiffEntry }) {
  return (
    <tr className={bodyRowClasses} data-testid="json-diff-entry" data-status={entry.status}>
      <td className={bodyCellClasses} data-testid="json-diff-entry-path">{entry.path}</td>
      <td className={bodyCellClasses}>
        <span
          className={`rounded px-1 py-0.5 text-xs font-semibold ${statusClasses[entry.status]}`}
          data-testid="json-diff-entry-status"
        >
          {entry.status}
        </span>
      </td>
      <td className={bodyCellClasses} data-testid="json-diff-entry-before">{formatValue(entry.before)}</td>
      <td className={bodyCellClasses} data-testid="json-diff-entry-after">{formatValue(entry.after)}</td>
    </tr>
  );
}

interface Props {
  report: JsonDiffReport;
}

export default function JsonDiff({ report }: Props) {
  const { added, removed, changed, total } = report.summary;

  return (
    <div data-testid="json-diff" className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" data-testid="json-diff-summary">
        <StatCard label="Added" value={added} testId="json-diff-added" />
        <StatCard label="Removed" value={removed} testId="json-diff-removed" />
        <StatCard label="Changed" value={changed} testId="json-diff-changed" />
        <StatCard label="Differences" value={total} testId="json-diff-total" />
      </div>

      {report.identical && (
        <p data-testid="json-diff-identical" className="p-2">
          No differences. Both documents are identical.
        </p>
      )}

      {!report.identical && (
        <table data-testid="json-diff-entries" className={tableClasses}>
          <thead>
            <tr>
              <th className={headerCellClasses}>path</th>
              <th className={headerCellClasses}>status</th>
              <th className={headerCellClasses}>before</th>
              <th className={headerCellClasses}>after</th>
            </tr>
          </thead>
          <tbody>
            {report.entries.map((entry) => (
              <DiffRow key={`${entry.path}-${entry.status}`} entry={entry} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
