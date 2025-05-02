import { FaBackspace, FaRegCopy, FaSearch, FaTerminal, FaUserFriends } from 'react-icons/fa';
import { DetailedHTMLProps } from 'react';
import InputText from '../io/InputText';
import Button from '../io/Button';
import { useToolbarContext } from '../../../ToolbarContext';
import { usePersistenceContext } from '../../../PersistenceContext';

interface Props {
  onSearch: DetailedHTMLProps<any, any>;
}

export default function ResultMenu(
  { onSearch }: Props
) {
  const { spacing } = usePersistenceContext();
  const { writeToClipboard, isClipboardAvailable, updateSpacing, cleanWhiteSpaces, cleanNewLinesAndSpaces, cleanNewLines } = useToolbarContext();

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
        disabled={!isClipboardAvailable()}
        title="Copy json is disabled due lack of browser support"
        className="flex items-center"
      >
        <FaRegCopy className="mr-2" />
                Copy json
      </Button>
    </div>
  );
}
