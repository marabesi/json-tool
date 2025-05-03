import { FaBug, FaCoffee } from 'react-icons/fa';

export default function Footer({ ...props }) {
  return (
    <div className="flex justify-between bg-blue-300 p-5 dark:bg-gray-700" { ...props }>
      <a href="https://github.com/marabesi/json-tool/blob/main/LICENSE.md" target="_blank" rel="noreferrer">
        CC0 1.0 Universal
      </a>
      <div className="flex">
        <a
          data-testid="found-issue"
          href="https://github.com/marabesi/json-tool/issues"
          target="_blank"
          rel="noreferrer"
          className="flex items-center mr-5"
        >
          <FaBug className="mr-2" /> Found an issue?
        </a>

        <a className="flex items-center" data-testid="buy-me-a-coffee" href="https://www.buymeacoffee.com/marabesi" target="_blank" rel="noreferrer">
          <FaCoffee className="mr-2" />
          <span>Buy me a coffee</span>
        </a>
      </div>
    </div>
  );
}
