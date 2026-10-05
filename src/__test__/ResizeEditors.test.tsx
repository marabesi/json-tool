import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderEntireApp } from './__testutilities__/builder';

function mockBoundingClientRect(element: HTMLElement, rect: Partial<DOMRect>) {
  jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  } as DOMRect);
}

describe('Resize editors', () => {
  it('should render a resizer between the editors', () => {
    renderEntireApp();

    expect(screen.getByTestId('editor-resizer')).toBeInTheDocument();
    expect(screen.getByTestId('editor-resizer')).toHaveAttribute('aria-valuenow', '50');
  });

  it('should keep the menus inside their own editor when the pane gets narrow', () => {
    renderEntireApp();

    expect(screen.getByTestId('json-menu')).toHaveClass('flex-wrap');
    expect(screen.getByTestId('result-menu')).toHaveClass('flex-wrap');
    expect(screen.getByTestId('editor-left')).toHaveClass('overflow-hidden');
    expect(screen.getByTestId('editor-right')).toHaveClass('overflow-hidden');
  });

  it('should render the menus with icons only and a title on each action', () => {
    renderEntireApp();

    expect(screen.queryByText('Paste from clipboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete all')).not.toBeInTheDocument();
    expect(screen.queryByText('Clean spaces')).not.toBeInTheDocument();
    expect(screen.queryByText('Clean new lines')).not.toBeInTheDocument();
    expect(screen.queryByText('Clean new lines and spaces')).not.toBeInTheDocument();
    expect(screen.queryByText('Copy json')).not.toBeInTheDocument();
    expect(screen.queryByText('Space tabulation')).not.toBeInTheDocument();

    expect(screen.getByTestId('search-json')).toHaveAttribute('title', 'Search in the json');
    expect(screen.getByTestId('paste-from-clipboard')).toHaveAttribute('title', expect.stringContaining('Paste from clipboard'));
    expect(screen.getByTestId('upload-json-button')).toHaveAttribute('title', 'Upload a json file');
    expect(screen.getByTestId('clean')).toHaveAttribute('title', 'Delete all');
    expect(screen.getByTestId('search-result')).toHaveAttribute('title', 'Search in the result');
    expect(screen.getByTestId('space-size')).toHaveAttribute('title', 'Space tabulation');
    expect(screen.getByTestId('clean-spaces')).toHaveAttribute('title', 'Clean spaces');
    expect(screen.getByTestId('clean-new-lines')).toHaveAttribute('title', 'Clean new lines');
    expect(screen.getByTestId('clean-new-lines-and-spaces')).toHaveAttribute('title', 'Clean new lines and spaces');
    expect(screen.getByTestId('copy-json')).toHaveAttribute('title', expect.stringContaining('Copy json'));
  });

  it.each([
    ['table', 'table-page', 'table-pane'],
    ['schema', 'schema-page', 'schema-pane'],
  ])('should render the resizer and the input menu on the %s page', async (tab, pageTestId, paneTestId) => {
    renderEntireApp();

    await userEvent.click(screen.getByTestId(tab));
    await screen.findByTestId(pageTestId);

    expect(screen.getByTestId('editor-resizer')).toBeInTheDocument();
    expect(screen.getByTestId('editor-left')).toBeInTheDocument();
    expect(screen.getByTestId(paneTestId)).toBeInTheDocument();
    expect(screen.getByTestId('json-menu')).toBeInTheDocument();
    expect(screen.getByTestId('paste-from-clipboard')).toBeInTheDocument();
    expect(screen.getByTestId('upload-json-button')).toBeInTheDocument();
    expect(screen.getByTestId('clean')).toBeInTheDocument();
  });

  it('should resize the editors on the table page', async () => {
    renderEntireApp();

    await userEvent.click(screen.getByTestId('table'));
    await screen.findByTestId('table-page');

    const container = screen.getByTestId('editor-container');
    const resizer = screen.getByTestId('editor-resizer');
    mockBoundingClientRect(container, { width: 1000, left: 0 });
    mockBoundingClientRect(resizer, { width: 48, left: 476 });

    fireEvent.mouseDown(resizer, { clientX: 500 });
    fireEvent.mouseMove(window, { clientX: 700 });
    fireEvent.mouseUp(window);

    await waitFor(() => expect(resizer).toHaveAttribute('aria-valuenow', '71'));
  });

  it('should keep the divider width when navigating between pages', async () => {
    renderEntireApp();

    fireEvent.keyDown(screen.getByTestId('editor-resizer'), { key: 'ArrowLeft' });
    await waitFor(() => expect(screen.getByTestId('editor-resizer')).toHaveAttribute('aria-valuenow', '45'));

    await userEvent.click(screen.getByTestId('table'));
    await screen.findByTestId('table-page');
    expect(screen.getByTestId('editor-resizer')).toHaveAttribute('aria-valuenow', '45');

    await userEvent.click(screen.getByTestId('schema'));
    await screen.findByTestId('schema-page');
    expect(screen.getByTestId('editor-resizer')).toHaveAttribute('aria-valuenow', '45');

    await userEvent.click(screen.getByTestId('to-home'));
    await screen.findByTestId('editors-page');
    expect(screen.getByTestId('editor-resizer')).toHaveAttribute('aria-valuenow', '45');
  });

  it('should resize the editors when dragging the resizer', async () => {
    renderEntireApp();

    const container = screen.getByTestId('editor-container');
    const resizer = screen.getByTestId('editor-resizer');
    mockBoundingClientRect(container, { width: 1000, left: 0 });
    mockBoundingClientRect(resizer, { width: 48, left: 476 });

    fireEvent.mouseDown(resizer, { clientX: 500 });
    fireEvent.mouseMove(window, { clientX: 700 });
    fireEvent.mouseUp(window);

    await waitFor(() => expect(resizer).toHaveAttribute('aria-valuenow', '71'));
    expect(parseFloat(screen.getByTestId('editor-left').style.flexGrow)).toBeCloseTo(71, 1);
    expect(parseFloat(screen.getByTestId('editor-right').style.flexGrow)).toBeCloseTo(29, 1);
  });

  it('should resize the editors using the keyboard', async () => {
    renderEntireApp();

    const resizer = screen.getByTestId('editor-resizer');

    fireEvent.keyDown(resizer, { key: 'ArrowLeft' });
    await waitFor(() => expect(resizer).toHaveAttribute('aria-valuenow', '45'));

    fireEvent.keyDown(resizer, { key: 'ArrowRight' });
    await waitFor(() => expect(resizer).toHaveAttribute('aria-valuenow', '50'));
  });

  it('should keep the editors within the minimum and maximum width', async () => {
    renderEntireApp();

    const resizer = screen.getByTestId('editor-resizer');

    for (let step = 0; step < 20; step += 1) {
      fireEvent.keyDown(resizer, { key: 'ArrowLeft' });
    }
    await waitFor(() => expect(resizer).toHaveAttribute('aria-valuenow', '20'));

    for (let step = 0; step < 40; step += 1) {
      fireEvent.keyDown(resizer, { key: 'ArrowRight' });
    }
    await waitFor(() => expect(resizer).toHaveAttribute('aria-valuenow', '80'));
  });
});
