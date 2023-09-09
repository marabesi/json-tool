import { render, screen } from '@testing-library/react';
import Button from '../../components/ui/io/Button';
import userEvent from '@testing-library/user-event';

describe('button component', () => {

  test.each([
    'paste from clipboard',
    'another button'
  ])('renders button with different text', (text: string) => {
    render(<Button>{text}</Button>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test('fires the on click button', async () => {
    const buttonCallback = jest.fn();

    render(<Button onClick={buttonCallback}>paste from clipboard</Button>);

    await userEvent.click(screen.getByText('paste from clipboard'));

    expect(buttonCallback).toHaveBeenCalled();
  });

  test('should do nothing when callback is provided for on click', async () => {
    render(<Button>paste from clipboard</Button>);

    await userEvent.click(screen.getByText('paste from clipboard'));
  });
});
