import { fireEvent, screen } from '@testing-library/react';
import { renderEntireApp } from './__testutilities__/builder';

describe('Documentation link', () => {
  it('renders the docs link in the header', () => {
    renderEntireApp();

    const docs = screen.getByTestId('docs');

    expect(docs).toBeInTheDocument();
    expect(docs).toHaveAttribute('href', './docs/');
    expect(docs).toHaveAttribute('target', '_blank');
    expect(docs).toHaveAttribute('rel', 'noreferrer');
    expect(docs).toHaveTextContent('Docs');
  });

  it('opens the documentation with Alt+D', () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);

    renderEntireApp();

    fireEvent.keyDown(window, { key: 'd', code: 'KeyD', altKey: true });

    expect(open).toHaveBeenCalledWith('./docs/', '_blank', 'noopener,noreferrer');
    open.mockRestore();
  });

  it('opens the documentation with Alt+Shift+D', () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);

    renderEntireApp();

    fireEvent.keyDown(window, { key: 'd', code: 'KeyD', altKey: true, shiftKey: true });

    expect(open).toHaveBeenCalledWith('./docs/', '_blank', 'noopener,noreferrer');
    open.mockRestore();
  });
});
