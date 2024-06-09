import { render, screen } from '@testing-library/react';
import InputText from '../../components/ui/io/InputText';

describe('input text component', () => {

  test('renders input text', () => {
    render(<InputText data-testid="text"/>);
    expect(screen.getByTestId('text')).toBeInTheDocument();
  });

  test('renders input text with custom class', () => {
    const className = 'randomclass';
    render(<InputText data-testid="text" className={className}/>);
    expect(screen.getByTestId('text')).toHaveAttribute('class', expect.stringContaining(className));
  });
});
