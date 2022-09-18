import InputText from '../io/InputText';
import Button from '../io/Button';
import { FaBackspace, FaRegCopy, FaSearch, FaTerminal, FaUserFriends } from 'react-icons/fa';
import { DetailedHTMLProps } from 'react';

interface Props {
  spacing: DetailedHTMLProps<any, any>;
  updateSpacing: DetailedHTMLProps<any, any>;
  writeToClipboard: DetailedHTMLProps<any, any>;
  cleanWhiteSpaces: DetailedHTMLProps<any, any>;
  cleanNewLines: DetailedHTMLProps<any, any>;
  cleanNewLinesAndSpaces: DetailedHTMLProps<any, any>;
  onSearch: DetailedHTMLProps<any, any>;
}

export default function ResultMenu(
  { spacing, updateSpacing, writeToClipboard, cleanWhiteSpaces, cleanNewLines, cleanNewLinesAndSpaces, onSearch }: Props
) {
  return (
    <div className="flex justify-start items-center m-2 ml-0 h-10">
      <Button data-testid="search-result" onClick={onSearch}>
        <FaSearch className="mr-2" />
      </Button>
      <div className="flex items-center">
        <span className="mr-2">Space tabulation</span>
        <InputText
          data-testid="space-size"
          className="w-10 rounded mr-2"
          value={spacing}
          onChange={eventValue => updateSpacing(eventValue)}
        />
      </div>
      <Button
        onClick={cleanWhiteSpaces}
        data-testid="clean-spaces"
        className="flex items-center"
      >
        <FaBackspace className="mr-2" />
                Clean spaces
      </Button>
      <Button
        onClick={cleanNewLines}
        data-testid="clean-new-lines"
        className="flex items-center"
      >
        <FaTerminal className="mr-2" />
                Clean new lines
      </Button>
      <Button
        onClick={cleanNewLinesAndSpaces}
        data-testid="clean-new-lines-and-spaces"
        className="flex items-center"
      >
        <FaUserFriends className="mr-2" />
                Clean new lines and spaces
      </Button>

      <Button
        data-testid="copy-json"
        onClick={writeToClipboard}
        className="flex items-center"
      >
        <FaRegCopy className="mr-2" />
                Copy json
      </Button>
    </div>
  );
}
