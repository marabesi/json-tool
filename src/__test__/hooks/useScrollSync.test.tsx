import { fireEvent, render } from '@testing-library/react';
import { EditorView } from '@codemirror/view';
import { useScrollSync } from '../../hooks/useScrollSync';

const createScrollable = (scrollHeight: number, clientHeight: number): HTMLElement => {
  const element = document.createElement('div');
  Object.defineProperty(element, 'scrollHeight', { value: scrollHeight, configurable: true });
  Object.defineProperty(element, 'clientHeight', { value: clientHeight, configurable: true });
  return element;
};

const createView = (scrollDOM: HTMLElement): EditorView => {
  return { scrollDOM } as unknown as EditorView;
};

function ScrollSyncHarness({ leftView, rightView, enabled }: { leftView?: EditorView; rightView?: EditorView; enabled?: boolean }) {
  useScrollSync(leftView, rightView, enabled);
  return null;
}

describe('useScrollSync', () => {
  it('scrolls the right editor proportionally when the left editor scrolls', () => {
    const leftScroll = createScrollable(1000, 200);
    const rightScroll = createScrollable(1800, 200);

    render(
      <ScrollSyncHarness
        leftView={createView(leftScroll)}
        rightView={createView(rightScroll)}
      />
    );

    leftScroll.scrollTop = 400;
    fireEvent.scroll(leftScroll);

    expect(rightScroll.scrollTop).toBe(800);
  });

  it('scrolls the left editor proportionally when the right editor scrolls', () => {
    const leftScroll = createScrollable(1000, 200);
    const rightScroll = createScrollable(1800, 200);

    render(
      <ScrollSyncHarness
        leftView={createView(leftScroll)}
        rightView={createView(rightScroll)}
      />
    );

    rightScroll.scrollTop = 800;
    fireEvent.scroll(rightScroll);

    expect(leftScroll.scrollTop).toBe(400);
  });

  it('does nothing when one of the views is not available', () => {
    const leftScroll = createScrollable(1000, 200);
    const rightScroll = createScrollable(1000, 200);

    render(<ScrollSyncHarness leftView={createView(leftScroll)} />);

    leftScroll.scrollTop = 400;
    fireEvent.scroll(leftScroll);

    expect(rightScroll.scrollTop).toBe(0);
  });

  it('does not sync while disabled', () => {
    const leftScroll = createScrollable(1000, 200);
    const rightScroll = createScrollable(1800, 200);

    render(
      <ScrollSyncHarness
        leftView={createView(leftScroll)}
        rightView={createView(rightScroll)}
        enabled={false}
      />
    );

    leftScroll.scrollTop = 400;
    fireEvent.scroll(leftScroll);

    expect(rightScroll.scrollTop).toBe(0);
  });

  it('starts syncing when it becomes enabled', () => {
    const leftScroll = createScrollable(1000, 200);
    const rightScroll = createScrollable(1800, 200);

    const { rerender } = render(
      <ScrollSyncHarness
        leftView={createView(leftScroll)}
        rightView={createView(rightScroll)}
        enabled={false}
      />
    );

    rerender(
      <ScrollSyncHarness
        leftView={createView(leftScroll)}
        rightView={createView(rightScroll)}
        enabled={true}
      />
    );

    leftScroll.scrollTop = 400;
    fireEvent.scroll(leftScroll);

    expect(rightScroll.scrollTop).toBe(800);
  });

  it('stops listening when the component unmounts', () => {
    const leftScroll = createScrollable(1000, 200);
    const rightScroll = createScrollable(1800, 200);

    const { unmount } = render(
      <ScrollSyncHarness
        leftView={createView(leftScroll)}
        rightView={createView(rightScroll)}
      />
    );

    unmount();

    leftScroll.scrollTop = 400;
    fireEvent.scroll(leftScroll);

    expect(rightScroll.scrollTop).toBe(0);
  });
});
