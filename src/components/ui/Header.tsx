import { FaCoffee, FaRegSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header({ ...props }: any) {
  return (
    <div className="bg-blue-900 flex justify-between p-5 text-white" {...props}>
      <div className="flex">
        <h2 className="text-yellow-400 font-bold">
          <Link to="/">JSON tool</Link>
        </h2> |
        <a href="https://github.com/marabesi/json-tool" target="_blank" rel="noreferrer">by marabesi</a>
      </div>
      <div className="flex">
        <Link className="flex items-center mr-5" data-testid="settings" to="/settings">
          <FaRegSun />
        </Link>
        <a className="flex items-center" data-testid="buy-me-a-coffee" href="https://www.buymeacoffee.com/marabesi" target="_blank" rel="noreferrer">
          <FaCoffee className="mr-2"/>
          <span>Buy me a coffee</span>
        </a>
      </div>
    </div>
  );
}
