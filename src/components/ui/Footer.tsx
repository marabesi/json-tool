import { FaBug } from 'react-icons/all';

export default function Footer({ ...props }) {
  return (
    <div className="flex justify-between bg-blue-300 p-5 dark:bg-gray-700" { ...props }>
      <a href="https://github.com/marabesi/json-tool/blob/main/LICENSE.md" target="_blank" rel="noreferrer">
        CC0 1.0 Universal
      </a>
      <a
        data-testid="found-issue"
        href="https://github.com/marabesi/json-tool/issues"
        target="_blank"
        rel="noreferrer"
        className="flex items-center"
      >
        <FaBug className="mr-2" /> Found an issue?
      </a>
    </div>
  );
}
