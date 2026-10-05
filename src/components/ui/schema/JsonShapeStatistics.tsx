import { ShapeNode, ShapeStatistics } from '../../../core/jsonToSchema';

const cardClasses = 'rounded border border-blue-900/30 bg-white/40 p-2 dark:border-gray-600 dark:bg-gray-800/40';
const cardLabelClasses = 'text-xs uppercase tracking-wide text-gray-700 dark:text-gray-400';
const cardValueClasses = 'text-lg font-semibold';
const headerCellClasses = 'border border-blue-900/40 bg-blue-900 px-2 py-1 font-semibold text-white dark:border-gray-500 dark:bg-gray-700';
const bodyCellClasses = 'border border-blue-900/30 px-2 py-1 dark:border-gray-600';
const bodyRowClasses = 'odd:bg-white/30 even:bg-black/5 dark:odd:bg-gray-800/40 dark:even:bg-gray-700/40';

function toPercentage(count: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((count / total) * 100);
}

interface CardProps {
  label: string;
  value: string | number;
  testId: string;
}

function StatCard({ label, value, testId }: CardProps) {
  return (
    <div className={cardClasses} data-testid={testId}>
      <div className={cardLabelClasses}>{label}</div>
      <div className={cardValueClasses} data-testid={`${testId}-value`}>{value}</div>
    </div>
  );
}

interface PanelProps {
  statistics: ShapeStatistics;
  testIdPrefix: string;
}

function StatisticsPanel({ statistics, testIdPrefix }: PanelProps) {
  const { objects, arrays, properties, values, filled, empty, averageProperties, typeCounts } = statistics;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard label="Objects" value={objects} testId={`${testIdPrefix}-objects`} />
        <StatCard label="Arrays" value={arrays} testId={`${testIdPrefix}-arrays`} />
        <StatCard label="Properties" value={properties} testId={`${testIdPrefix}-properties`} />
        <StatCard label="Values" value={values} testId={`${testIdPrefix}-values`} />
        <StatCard label="Avg properties / object" value={averageProperties} testId={`${testIdPrefix}-average-properties`} />
        <StatCard label="Filled" value={`${filled} (${toPercentage(filled, values)}%)`} testId={`${testIdPrefix}-filled`} />
        <StatCard label="Empty" value={`${empty} (${toPercentage(empty, values)}%)`} testId={`${testIdPrefix}-empty`} />
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold">Type breakdown</h3>
        <table data-testid={`${testIdPrefix}-types`} className="w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className={headerCellClasses}>type</th>
              <th className={headerCellClasses}>count</th>
              <th className={headerCellClasses}>%</th>
            </tr>
          </thead>
          <tbody>
            {typeCounts.map(({ type, count, percentage }) => (
              <tr key={type} className={bodyRowClasses} data-testid={`${testIdPrefix}-type-row`}>
                <td className={bodyCellClasses}>{type}</td>
                <td className={bodyCellClasses}>{count}</td>
                <td className={bodyCellClasses}>{percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface NodeProps {
  node: ShapeNode;
}

function ShapeNodeView({ node }: NodeProps) {
  return (
    <details data-testid="json-shape-node" className="rounded border border-blue-900/30 dark:border-gray-600" open>
      <summary data-testid="json-shape-node-summary" className="cursor-pointer p-2 text-sm">
        <span className="font-semibold" data-testid="json-shape-node-path">{node.path}</span>
        <span className="ml-2 rounded bg-blue-900 px-1 py-0.5 text-xs font-semibold text-white dark:bg-gray-600" data-testid="json-shape-node-type">
          {node.typeName}
        </span>
        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400" data-testid="json-shape-node-count">
          {node.count} instance{node.count === 1 ? '' : 's'}
        </span>
      </summary>
      <div className="p-2">
        <StatisticsPanel statistics={node.statistics} testIdPrefix="json-shape-node" />
        {node.children.length > 0 && (
          <div className="mt-2 flex flex-col gap-2 pl-3" data-testid="json-shape-node-children">
            {node.children.map((child) => (
              <ShapeNodeView key={child.path} node={child} />
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

interface Props {
  report: ShapeNode;
}

export default function JsonShapeStatistics({ report }: Props) {
  return (
    <div data-testid="json-shape" className="flex flex-col gap-3">
      <StatisticsPanel statistics={report.statistics} testIdPrefix="json-shape" />
      {report.children.length > 0 && (
        <div className="flex flex-col gap-2" data-testid="json-shape-nested">
          <h2 className="text-sm font-semibold">Nested shapes</h2>
          {report.children.map((child) => (
            <ShapeNodeView key={child.path} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}