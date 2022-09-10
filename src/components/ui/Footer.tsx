export default function Footer({ ...props }) {
  return (
    <div className="flex bg-gray-300 p-5 dark:bg-gray-700" { ...props }>
      <a href="https://github.com/marabesi/json-tool/blob/main/LICENSE.md" target="_blank" rel="noreferrer">
        CC0 1.0 Universal
      </a>
    </div>
  );
}
