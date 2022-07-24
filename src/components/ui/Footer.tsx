export default function Footer({ ...props }: any) {
  return (
    <div className="flex bg-gray-300 text-white p-5" { ...props }>
      <a href="https://github.com/marabesi/json-tool/blob/main/LICENSE.md" target="_blank" rel="noreferrer">
                CC0 1.0 Universal
      </a>
    </div>
  );
}
