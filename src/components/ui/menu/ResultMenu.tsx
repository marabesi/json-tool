import { useRef } from 'react';
import { FaBackspace, FaRegCopy, FaSearch, FaTerminal, FaUserFriends } from 'react-icons/fa';
import InputText from '../io/InputText';
import Button from '../io/Button';
import { useToolbarContext } from '../../../ToolbarContext';
import { usePersistenceContext } from '../../../PersistenceContext';
import { useClipboardContext } from '../../../ClipboardContext';
import { useShortcut } from '../../../ShortcutsContext';

interface Props {
  onSearch: () => void;
}

export default function ResultMenu({ onSearch }: Props) {
  const { spacing } = usePersistenceContext();
  const { updateSpacing, cleanWhiteSpaces, cleanNewLines, cleanNewLinesAndSpaces } = useToolbarContext();
  const { writeToClipboard, isClipboardAvailable } = useClipboardContext();
  const spacingReference = useRef<HTMLInputElement>(null);

  const focusSpacing = () => {
    spacingReference.current?.focus();
    spacingReference.current?.select();
  };

  const copyJson = () => {
    if (!isClipboardAvailable()) {
      return;
    }

    void writeToClipboard();
  };

  useShortcut({
    id: 'result-search',
    keys: ['Mod+Shift+F'],
    description: 'Search in the result editor',
    section: 'Result editor',
    handler: onSearch,
  });

  useShortcut({
    id: 'result-spacing',
    keys: ['Alt+Shift+T'],
    description: 'Focus the space tabulation input',
    section: 'Result editor',
    handler: focusSpacing,
  });

  useShortcut({
    id: 'result-clean-spaces',
    keys: ['Alt+Shift+S'],
    description: 'Remove all spaces from the result',
    section: 'Result editor',
    handler: cleanWhiteSpaces,
  });

  useShortcut({
    id: 'result-clean-new-lines',
    keys: ['Alt+Shift+N'],
    description: 'Remove all line breaks from the result',
    section: 'Result editor',
    handler: cleanNewLines,
  });

  useShortcut({
    id: 'result-clean-new-lines-and-spaces',
    keys: ['Alt+Shift+B'],
    description: 'Remove line breaks and spaces from the result',
    section: 'Result editor',
    handler: cleanNewLinesAndSpaces,
  });

  useShortcut({
    id: 'result-copy',
    keys: ['Alt+Shift+C'],
    description: 'Copy the result to the clipboard',
    section: 'Result editor',
    handler: copyJson,
  });

  return (
    <div className="flex flex-wrap justify-start items-center m-2 ml-0 min-h-10 gap-y-1 gap-x-2" data-testid="result-menu">
      <Button data-testid="search-result" onClick={onSearch} title="Search in the result" aria-label="Search in the result">
        <FaSearch />
      </Button>
      <InputText
        ref={spacingReference}
        data-testid="space-size"
        className="w-10 rounded"
        title="Space tabulation"
        aria-label="Space tabulation"
        value={spacing}
        onChange={eventValue => updateSpacing(eventValue)}
      />
      <Button
        onClick={cleanWhiteSpaces}
        data-testid="clean-spaces"
        className="flex items-center"
        title="Clean spaces"
        aria-label="Clean spaces"
      >
        <FaBackspace />
      </Button>
      <Button
        onClick={cleanNewLines}
        data-testid="clean-new-lines"
        className="flex items-center"
        title="Clean new lines"
        aria-label="Clean new lines"
      >
        <FaTerminal />
      </Button>
      <Button
        onClick={cleanNewLinesAndSpaces}
        data-testid="clean-new-lines-and-spaces"
        className="flex items-center"
        title="Clean new lines and spaces"
        aria-label="Clean new lines and spaces"
      >
        <FaUserFriends />
      </Button>

      <Button
        data-testid="copy-json"
        onClick={writeToClipboard}
        disabled={!isClipboardAvailable()}
        title={isClipboardAvailable() ? 'Copy json' : 'Copy json is disabled due lack of browser support'}
        aria-label="Copy json"
        className="flex items-center"
      >
        <FaRegCopy />
      </Button>
    </div>
  );
}
