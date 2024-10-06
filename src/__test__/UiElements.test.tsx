import { render, screen } from '@testing-library/react';
import App from '../App';

describe('UI elements', () => {
  it('error message is hidden by default', () => {
    render(<App />);
    const errorLabel = screen.queryByTestId(/error/);
    expect(errorLabel).toBeNull();
  });

  it('should render buy me a coffee link', () => {
    render(<App />);
    expect(screen.getByTestId(/buy-me-a-coffee/)).toBeInTheDocument();
    expect(screen.queryByTestId(/buy-me-a-coffee/)).toHaveAttribute('href', 'https://www.buymeacoffee.com/marabesi');
    expect(screen.getByText(/Buy me a coffee/)).toBeInTheDocument();
    expect(screen.getByTestId(/buy-me-a-coffee/)).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId(/buy-me-a-coffee/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render license link', () => {
    render(<App />);
    expect(screen.getByText(/CC0 1.0 Universal/)).toBeInTheDocument();
    expect(screen.queryByText(/CC0 1.0 Universal/)).toHaveAttribute('href', 'https://github.com/marabesi/json-tool/blob/main/LICENSE.md');
    expect(screen.getByText(/CC0 1.0 Universal/)).toBeInTheDocument();
    expect(screen.getByText(/CC0 1.0 Universal/)).toHaveAttribute('target', '_blank');
    expect(screen.getByText(/CC0 1.0 Universal/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render found a issue', () => {
    render(<App />);
    expect(screen.getByTestId(/found-issue/)).toBeInTheDocument();
    expect(screen.queryByTestId(/found-issue/)).toHaveAttribute('href', 'https://github.com/marabesi/json-tool/issues');
    expect(screen.getByText(/Found an issue?/)).toBeInTheDocument();
    expect(screen.getByTestId(/found-issue/)).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId(/found-issue/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render settings link', () => {
    render(<App />);
    expect(screen.getByTestId('settings')).toBeInTheDocument();
    expect(screen.getByTestId('settings')).toHaveAttribute('href', expect.stringContaining('/settings'));
  });

  it('should use 12 as font size', () => {
    render(<App/>);

    expect(screen.getByTestId('json')).toHaveAttribute('style', expect.stringContaining('font-size: 12px'));
  });

  it('should render search button for json editor', () => {
    render(<App/>);

    expect(screen.getByTestId('search-json')).toBeInTheDocument();
  });

  it('should render search button for result editor', () => {
    render(<App/>);

    expect(screen.getByTestId('search-result')).toBeInTheDocument();
  });

  it('should render dark mode switcher', () => {
    render(<App/>);

    expect(screen.getByTestId('dark-mode')).toBeInTheDocument();
  });

  it('should have dark mode disabled by default', () => {
    render(<App/>);

    expect(screen.queryByTestId('app-container')).not.toHaveClass('dark');
  });

  it('should render validate json checkbox', () => {
    render(<App/>);

    expect(screen.getByText('validate json')).toBeInTheDocument();
    expect(screen.getByTestId('is-validate-json')).toBeChecked();
  });
});
