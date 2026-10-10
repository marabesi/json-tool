import { screen } from '@testing-library/react';
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
});
