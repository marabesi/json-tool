import { render } from '@testing-library/react';
import App from '../App';

describe('UI elements', () => {
  it('error message is hidden by default', () => {
    const { queryByTestId } = render(<App />);
    const errorLabel = queryByTestId(/error/);
    expect(errorLabel).toBeNull();
  });

  it('should render buy me a coffee link', () => {
    const { queryByTestId, getByText, getByTestId } = render(<App />);
    expect(queryByTestId(/buy-me-a-coffee/)).toBeInTheDocument();
    expect(queryByTestId(/buy-me-a-coffee/)).toHaveAttribute('href', 'https://www.buymeacoffee.com/marabesi');
    expect(getByText(/Buy me a coffee/)).toBeInTheDocument();
    expect(getByTestId(/buy-me-a-coffee/)).toHaveAttribute('target', '_blank');
    expect(getByTestId(/buy-me-a-coffee/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render github link', () => {
    const { queryByText, getByText } = render(<App />);
    expect(queryByText(/by marabesi/)).toBeInTheDocument();
    expect(queryByText(/by marabesi/)).toHaveAttribute('href', 'https://github.com/marabesi/json-tool');
    expect(getByText(/by marabesi/)).toBeInTheDocument();
    expect(getByText(/by marabesi/)).toHaveAttribute('target', '_blank');
    expect(getByText(/by marabesi/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render license link', () => {
    const { queryByText, getByText } =  render(<App />);
    expect(queryByText(/CC0 1.0 Universal/)).toBeInTheDocument();
    expect(queryByText(/CC0 1.0 Universal/)).toHaveAttribute('href', 'https://github.com/marabesi/json-tool/blob/main/LICENSE.md');
    expect(getByText(/CC0 1.0 Universal/)).toBeInTheDocument();
    expect(getByText(/CC0 1.0 Universal/)).toHaveAttribute('target', '_blank');
    expect(getByText(/CC0 1.0 Universal/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render found a issue', () => {
    const { queryByTestId, getByTestId, getByText } =  render(<App />);
    expect(queryByTestId(/found-issue/)).toBeInTheDocument();
    expect(queryByTestId(/found-issue/)).toHaveAttribute('href', 'https://github.com/marabesi/json-tool/issues');
    expect(getByText(/Found an issue?/)).toBeInTheDocument();
    expect(getByTestId(/found-issue/)).toHaveAttribute('target', '_blank');
    expect(getByTestId(/found-issue/)).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render settings link', () => {
    const { getByTestId } =  render(<App />);
    expect(getByTestId('settings')).toBeInTheDocument();
    expect(getByTestId('settings')).toHaveAttribute('href', expect.stringContaining('/settings'));
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
