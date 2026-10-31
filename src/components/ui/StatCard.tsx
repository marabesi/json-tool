const cardClasses = 'rounded border border-blue-900/30 bg-white/40 p-2 dark:border-gray-600 dark:bg-gray-800/40';
const cardLabelClasses = 'text-xs uppercase tracking-wide text-gray-700 dark:text-gray-400';
const cardValueClasses = 'text-lg font-semibold';

interface Props {
  label: string;
  value: string | number;
  testId: string;
}

export default function StatCard({ label, value, testId }: Props) {
  return (
    <div className={cardClasses} data-testid={testId}>
      <div className={cardLabelClasses}>{label}</div>
      <div className={cardValueClasses} data-testid={`${testId}-value`}>{value}</div>
    </div>
  );
}
