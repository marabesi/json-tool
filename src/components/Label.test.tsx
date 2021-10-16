import { render, screen } from '@testing-library/react';
import Label from './Label';

describe('label component', () => {

  test.each([
    'random text',
  ])('renders as text', (text: string) => {
    render(<Label>{text}</Label>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test('renders empty label', () => {
    render(<Label />);
    expect(screen.queryByTestId('label')).toBeInTheDocument();
  });
});
