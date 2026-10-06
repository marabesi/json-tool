import { useEffect } from 'react';
import { EditorView } from '@codemirror/view';
import { scrollRatio, scrollTopForRatio } from '../core/scrollSync';

export const useScrollSync = (leftView?: EditorView, rightView?: EditorView, enabled = true): void => {
  useEffect(() => {
    if (!enabled || !leftView || !rightView) {
      return;
    }

    let syncing = false;

    const sync = (source: EditorView, target: EditorView): void => {
      if (syncing) {
        return;
      }

      syncing = true;

      const ratio = scrollRatio(
        source.scrollDOM.scrollTop,
        source.scrollDOM.scrollHeight,
        source.scrollDOM.clientHeight,
      );

      target.scrollDOM.scrollTop = scrollTopForRatio(
        ratio,
        target.scrollDOM.scrollHeight,
        target.scrollDOM.clientHeight,
      );

      window.requestAnimationFrame(() => {
        syncing = false;
      });
    };

    const onLeftScroll = () => sync(leftView, rightView);
    const onRightScroll = () => sync(rightView, leftView);

    leftView.scrollDOM.addEventListener('scroll', onLeftScroll);
    rightView.scrollDOM.addEventListener('scroll', onRightScroll);

    return () => {
      leftView.scrollDOM.removeEventListener('scroll', onLeftScroll);
      rightView.scrollDOM.removeEventListener('scroll', onRightScroll);
    };
  }, [leftView, rightView, enabled]);
};
