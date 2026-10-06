import { maxScrollTop, scrollRatio, scrollTopForRatio } from '../../core/scrollSync';

describe('scrollSync', () => {
  describe('maxScrollTop', () => {
    it('returns the scrollable distance', () => {
      expect(maxScrollTop(1000, 200)).toBe(800);
    });

    it('never returns a negative value', () => {
      expect(maxScrollTop(200, 400)).toBe(0);
    });
  });

  describe('scrollRatio', () => {
    it('returns the position relative to the scrollable distance', () => {
      expect(scrollRatio(400, 1000, 200)).toBe(0.5);
    });

    it('returns 0 when there is nothing to scroll', () => {
      expect(scrollRatio(0, 200, 200)).toBe(0);
    });

    it('clamps values above the scrollable distance', () => {
      expect(scrollRatio(2000, 1000, 200)).toBe(1);
    });

    it('clamps negative values', () => {
      expect(scrollRatio(-50, 1000, 200)).toBe(0);
    });
  });

  describe('scrollTopForRatio', () => {
    it('maps a ratio into the scrollable distance of the target', () => {
      expect(scrollTopForRatio(0.5, 2000, 400)).toBe(800);
    });

    it('returns 0 when the target has nothing to scroll', () => {
      expect(scrollTopForRatio(0.5, 400, 400)).toBe(0);
    });

    it('clamps ratios above 1', () => {
      expect(scrollTopForRatio(2, 2000, 400)).toBe(1600);
    });

    it('clamps negative ratios', () => {
      expect(scrollTopForRatio(-1, 2000, 400)).toBe(0);
    });
  });
});
