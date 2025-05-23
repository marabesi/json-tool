import { createContext, ReactElement, useContext } from 'react';
import toast from 'react-hot-toast';
import { usePersistenceContext } from './PersistenceContext';

interface ClipboardContextInterface {
  pasteFromClipboard: () => Promise<string>;
  writeToClipboard: () => Promise<void>;
  sendStringToClipboard: (data: string) => Promise<void>;
  isClipboardAvailable: () => boolean;
}

const ClipboardContext = createContext<ClipboardContextInterface | undefined>(undefined);

export const useClipboardContext = () => {
  const context = useContext(ClipboardContext);
  if (context === undefined) {
    throw new Error('useClipboardContext must be used within a ClipboardContextProvider');
  }
  return context;
};

export const ClipboardContextProvider = ({ children }: { children: ReactElement }) => {
  const { resultState } = usePersistenceContext();

  const isClipboardAvailable = () => navigator.clipboard && typeof navigator.clipboard.read === 'function';

  const writeToClipboard = async () => {
    await navigator.clipboard.writeText(resultState);
    toast.success('Copied');
  };

  const sendStringToClipboard= async (data: string) => {
    await navigator.clipboard.writeText(data);
    toast.success('Copied');
  };

  const pasteFromClipboard = async () => {
    const clipboardItems = await navigator.clipboard.read();
    let result = '';
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        const text = await blob.text();
        result += text;
      }
    }

    return result;
  };

  return (
    <ClipboardContext.Provider value={{
      isClipboardAvailable,
      writeToClipboard,
      pasteFromClipboard,
      sendStringToClipboard,
    }}>
      {children}
    </ClipboardContext.Provider>
  );
};