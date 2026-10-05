import { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode, useCallback, useRef } from 'react';
import EditorContainer from './EditorContainer';
import { useEditorLayoutContext } from '../../../EditorLayoutContext';

const MIN_WIDTH = 20;
const MAX_WIDTH = 80;
const KEYBOARD_STEP = 5;

const clamp = (value: number) => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value));

interface Props {
  left: ReactNode;
  right: ReactNode;
  indicator?: ReactNode;
  rightTestId?: string;
  rightClassName?: string;
  rightFullscreen?: boolean;
}

export default function ResizableEditors({
  left,
  right,
  indicator,
  rightTestId = 'editor-right',
  rightClassName = '',
  rightFullscreen,
}: Props) {
  const containerReference = useRef<HTMLDivElement>(null);
  const resizerReference = useRef<HTMLDivElement>(null);
  const { leftWidth, setLeftWidth } = useEditorLayoutContext();

  const resizeTo = useCallback((clientX: number) => {
    const container = containerReference.current;
    if (!container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const resizerWidth = resizerReference.current?.getBoundingClientRect().width ?? 0;
    const available = containerRect.width - resizerWidth;

    if (available <= 0) {
      return;
    }

    const leftPixels = clientX - containerRect.left - resizerWidth / 2;
    setLeftWidth(clamp((leftPixels / available) * 100));
  }, [setLeftWidth]);

  const startResizing = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const stopResizing = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };

    const handleMouseMove = (moveEvent: MouseEvent) => resizeTo(moveEvent.clientX);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopResizing);
  };

  const resizeWithKeyboard = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      setLeftWidth((current) => clamp(current - KEYBOARD_STEP));
    } else if (event.key === 'ArrowRight') {
      setLeftWidth((current) => clamp(current + KEYBOARD_STEP));
    } else {
      return;
    }

    event.preventDefault();
  };

  return (
    <div ref={containerReference} className="flex flex-1 h-full min-w-0 justify-center p-1 pt-0" data-testid="editor-container">
      <EditorContainer style={{ flexGrow: leftWidth, flexBasis: 0, minWidth: 0 }} data-testid="editor-left">
        {left}
      </EditorContainer>
      <div
        ref={resizerReference}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize editors"
        aria-valuenow={Math.round(leftWidth)}
        aria-valuemin={MIN_WIDTH}
        aria-valuemax={MAX_WIDTH}
        tabIndex={0}
        onMouseDown={startResizing}
        onKeyDown={resizeWithKeyboard}
        className="w-12 shrink-0 flex justify-center items-center cursor-col-resize select-none outline-none focus:bg-blue-300 dark:focus:bg-gray-500"
        data-testid="editor-resizer"
      >
        {indicator ?? <div className="h-8 w-1 rounded bg-blue-900/40 dark:bg-gray-300/40" data-testid="editor-resizer-grip" />}
      </div>
      <EditorContainer
        className={rightClassName}
        style={{ flexGrow: 100 - leftWidth, flexBasis: 0, minWidth: 0 }}
        data-testid={rightTestId}
        data-fullscreen={rightFullscreen}
      >
        {right}
      </EditorContainer>
    </div>
  );
}
