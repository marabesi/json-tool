import {FaCoffee} from 'react-icons/fa';

export default function Header({ ...props }: any) {
  return (
    <div className="bg-blue-900 flex justify-between p-5 text-white" {...props}>
      <div className="flex">
        <h2 className="text-yellow-400 font-bold">JSON tool</h2> |
        <a href="https://github.com/marabesi/json-tool" target="_blank" rel="noreferrer">by marabesi</a>
      </div>
      <a className="flex items-center" data-testid="buy-me-a-coffee" href="https://www.buymeacoffee.com/marabesi" target="_blank" rel="noreferrer">
        <FaCoffee className="mr-2"/>
        <span>Buy me a coffee</span>
      </a>
    </div>
  );
}
