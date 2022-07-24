import { render, screen } from '@testing-library/react';
import InputText from './InputText';

describe('input text component', () => {

  test('renders input text', () => {
    render(<InputText data-testid="text"/>);
    expect(screen.queryByTestId('text')).toBeInTheDocument();
  });

  test('renders input text with custom class', () => {
    const className = 'randomclass';
    render(<InputText data-testid="text" className={className}/>);
    expect(screen.queryByTestId('text')).toHaveAttribute('class', expect.stringContaining(className));
  });
});
