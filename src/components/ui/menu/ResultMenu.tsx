import { FaBackspace, FaRegCopy, FaSearch, FaTerminal, FaUserFriends } from 'react-icons/fa';
import InputText from '../io/InputText';
import Button from '../io/Button';
import { useToolbarContext } from '../../../ToolbarContext';
import { usePersistenceContext } from '../../../PersistenceContext';
import { useClipboardContext } from '../../../ClipboardContext';

interface Props {
  onSearch: () => void;
}

export default function ResultMenu({ onSearch }: Props) {
  const { spacing } = usePersistenceContext();
  const { updateSpacing, cleanWhiteSpaces, cleanNewLinesAndSpaces, cleanNewLines } = useToolbarContext();
  const { writeToClipboard, isClipboardAvailable } = useClipboardContext();

  return (
    <div className="flex flex-wrap justify-start items-center m-2 ml-0 min-h-10 gap-y-1 gap-x-2" data-testid="result-menu">
      <Button data-testid="search-result" onClick={onSearch} title="Search in the result">
        <FaSearch />
      </Button>
      <InputText
        data-testid="space-size"
        className="w-10 rounded"
        title="Space tabulation"
        value={spacing}
        onChange={eventValue => updateSpacing(eventValue)}
      />
      <Button
        onClick={cleanWhiteSpaces}
        data-testid="clean-spaces"
        className="flex items-center"
        title="Clean spaces"
      >
        <FaBackspace />
      </Button>
      <Button
        onClick={cleanNewLines}
        data-testid="clean-new-lines"
        className="flex items-center"
        title="Clean new lines"
      >
        <FaTerminal />
      </Button>
      <Button
        onClick={cleanNewLinesAndSpaces}
        data-testid="clean-new-lines-and-spaces"
        className="flex items-center"
        title="Clean new lines and spaces"
      >
        <FaUserFriends />
      </Button>

      <Button
        data-testid="copy-json"
        onClick={writeToClipboard}
        disabled={!isClipboardAvailable()}
        title={isClipboardAvailable() ? 'Copy json' : 'Copy json is disabled due lack of browser support'}
        className="flex items-center"
      >
        <FaRegCopy />
      </Button>
    </div>
  );
}
