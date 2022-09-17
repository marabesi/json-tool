import { render, screen } from '@testing-library/react';
import App from './App';

describe('UI elements', () => {
  it('error message is hidden by default', () => {
    render(<App />);
    const errorLabel = screen.queryByTestId(/error/);
    expect(errorLabel).toBeNull();
  });

  it('should render buy me a coffee link', () => {
    render(<App />);
    expect(screen.queryByTestId(/buy-me-a-coffee/)).toBeInTheDocument();
    expect(screen.queryByTestId(/buy-me-a-coffee/)).toHaveAttribute('href', 'https://www.buymeacoffee.com/marabesi');
    expect(screen.getByText(/Buy me a coffee/)).toBeInTheDocument();
    expect(screen.getByTestId(/buy-me-a-coffee/)).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId(/buy-me-a-coffee/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render github link', () => {
    render(<App />);
    expect(screen.queryByText(/by marabesi/)).toBeInTheDocument();
    expect(screen.queryByText(/by marabesi/)).toHaveAttribute('href', 'https://github.com/marabesi/json-tool');
    expect(screen.getByText(/by marabesi/)).toBeInTheDocument();
    expect(screen.getByText(/by marabesi/)).toHaveAttribute('target', '_blank');
    expect(screen.getByText(/by marabesi/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render license link', () => {
    render(<App />);
    expect(screen.queryByText(/CC0 1.0 Universal/)).toBeInTheDocument();
    expect(screen.queryByText(/CC0 1.0 Universal/)).toHaveAttribute('href', 'https://github.com/marabesi/json-tool/blob/main/LICENSE.md');
    expect(screen.getByText(/CC0 1.0 Universal/)).toBeInTheDocument();
    expect(screen.getByText(/CC0 1.0 Universal/)).toHaveAttribute('target', '_blank');
    expect(screen.getByText(/CC0 1.0 Universal/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render settings link', () => {
    render(<App />);
    expect(screen.getByTestId('settings')).toBeInTheDocument();
    expect(screen.getByTestId('settings')).toHaveAttribute('href', expect.stringContaining('/settings'));
  });

  it('should use 12 as font size', () => {
    const { getByTestId } = render(<App/>);

    expect(getByTestId('json')).toHaveAttribute('style', expect.stringContaining('font-size: 12px'));
  });

  it('should render search button for json editor', () => {
    const { getByTestId } = render(<App/>);

    expect(getByTestId('search-json')).toBeInTheDocument();
  });

  it('should render search button for result editor', () => {
    const { getByTestId } = render(<App/>);

    expect(getByTestId('search-result')).toBeInTheDocument();
  });

  it('should render dark mode switcher', () => {
    const { getByTestId } = render(<App/>);

    expect(getByTestId('dark-mode')).toBeInTheDocument();
  });

  it('should have dark mode disabled by default', () => {
    const { container } = render(<App/>);

    expect(container.querySelector('.dark')).not.toBeInTheDocument();
  });
});
