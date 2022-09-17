import { render, screen } from '@testing-library/react';
import Label from '../../components/ui/Label';

describe('label component', () => {

  test.each([
    'random text',
  ])('renders as text', (text: string) => {
    render(<Label>{text}</Label>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test('renders empty label', () => {
    render(<Label data-testid="label" />);
    expect(screen.queryByTestId('label')).toBeInTheDocument();
  });
});
