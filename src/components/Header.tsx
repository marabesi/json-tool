export default function Header() {
  return <div className="bg-blue-900 flex justify-between p-5 text-white">
    <div className="flex">
      <h2 className="text-yellow-400 font-bold">JSON tool</h2> |
      <a href="https://github.com/marabesi/json-tool" target="_blank" rel="noreferrer">by marabesi</a>
    </div>
    <a data-testid="buy-me-a-coffee" href="https://www.buymeacoffee.com/marabesi" target="_blank" rel="noreferrer">Buy
      me a coffee</a>
  </div>;
}
