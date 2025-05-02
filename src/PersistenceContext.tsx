import { createContext, ReactElement, useContext, useState, useEffect, useRef } from 'react';
import { useJsonHistoryContext } from './JsonHistoryContext';

interface PersistenceContextInterface {
  jsonState: string;
  resultState: string;
  setJsonState: (result: string) => void;
  setResultState: (result: string) => void;
  isValidateEnabled: boolean;
  setValidateEnabled: (validate: boolean) => void;
  spacing: string;
  setSpacing: (spacing: string) => void;
  inProgress: boolean;
  setInProgress: (inProgress: boolean) => void;
  onChange: (eventValue: string, eventSpacing: string, appendToHistory: boolean) => void;
  error: string;
  setError: (error: string) => void;
}

const code = `
      importScripts('https://unpkg.com/format-to-json@2.1.2/fmt2json.min.js');

      if('function' === typeof importScripts) {
        addEventListener('message', async (event) => {
           if (!event) {
             return;
           }

           const value = event.data.jsonAsString;
           const spacing = event.data.spacing;
           const isValidateEnabled = event.data.isValidateEnabled;

           if (value) {
             // eslint-disable-next-line no-undef
             const format = await fmt2json(value, {
               expand: true,
               escape: false,
               indent: parseInt(spacing)
             });

             try {
               if (isValidateEnabled) {
                 JSON.parse(value);
               }
             } catch (e) {
               console.error('error from worker: ', e);
               postMessage({ error: true, originalJson: value, result: format.result });
               return;
             }

             postMessage({ error: false, originalJson: value, result: format.result });
             return;
           }
           // empty json was given
           postMessage({ error: false, originalJson: value, result: value });
         });
      }
    `;

const PersistenceContext = createContext<PersistenceContextInterface | undefined>(undefined);
const defaultSpacing = '2';

export const usePersistenceContext = () => {
  const context = useContext(PersistenceContext);
  if (context === undefined) {
    throw new Error('usePersistenceContext must be used within a PersistenceContextProvider');
  }
  return context;
};

export const PersistenceContextProvider = ({ children }: { children: ReactElement }) => {
  const worker = useRef<Worker>(undefined);
  const historyContext = useJsonHistoryContext();
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [spacing, setSpacing] = useState<string>(defaultSpacing);
  const [isValidateEnabled, setValidateEnabled] = useState<boolean>(true);
  const [jsonState, setJsonState] = useState<string>('');
  const [resultState, setResultState] = useState<string>('');

  useEffect(() => {
    worker.current = new Worker(URL.createObjectURL(new Blob([code])));
    worker.current.onmessage = (workerSelf: MessageEvent) => {
      setError('');
      if (workerSelf.data.error) {
        setError('invalid json');
      }

      setResultState(workerSelf.data.result);
      setInProgress(false);
    };
  }, [setResultState]);

  const onChange = (eventValue: string, eventSpacing: string, append: boolean) => {
    if (worker.current) {
      worker.current.postMessage({ jsonAsString: eventValue, spacing: eventSpacing, isValidateEnabled });
    }
    setJsonState(eventValue);
    setInProgress(true);

    if (append) {
      historyContext.appendEntry(eventValue);
    }
  };
  
  return (
    <PersistenceContext.Provider value={{
      jsonState,
      resultState,
      isValidateEnabled,
      setValidateEnabled,
      spacing,
      setSpacing,
      setJsonState,
      setResultState,
      inProgress,
      setInProgress,
      onChange,
      error,
      setError,
    }}>
      {children}
    </PersistenceContext.Provider>
  );
};