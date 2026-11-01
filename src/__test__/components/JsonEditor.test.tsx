import { render, screen } from '@testing-library/react';
import JsonEditor from '../../components/ui/editor/JsonEditor';
import { SettingsContextProvider } from '../../settings/SettingsContext';
import { ThemeContextProvider } from '../../DarkModeContext';

jest.mock('@uiw/react-codemirror', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = jest.requireActual('react');
  const MockCodeMirror = React.forwardRef((props: { indentWithTab?: boolean }, ref: unknown) => (
    React.createElement('div', {
      ref,
      'data-testid': 'codemirror',
      'data-indent-with-tab': String(props.indentWithTab),
    })
  ));
  MockCodeMirror.displayName = 'MockCodeMirror';

  return { __esModule: true, default: MockCodeMirror };
});

describe('JsonEditor', () => {
  it('does not capture the Tab key', () => {
    render(
      <ThemeContextProvider>
        <SettingsContextProvider>
          <JsonEditor input="" data-testid="json" contenteditable={true} />
        </SettingsContextProvider>
      </ThemeContextProvider>
    );

    expect(screen.getByTestId('codemirror')).toHaveAttribute('data-indent-with-tab', 'false');
  });
});
