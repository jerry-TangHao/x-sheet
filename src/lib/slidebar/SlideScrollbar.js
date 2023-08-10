export class SlideScrollbar {
  _slideTabBar;

  _scrollX;

  constructor(slideTabBar) {
    this._scrollX = slideTabBar.primeval().scrollLeft;
    this._slideTabBar = slideTabBar;
  }

  scrollXMax() {
    const primeval = this._slideTabBar.primeval();
    primeval.scrollLeft = primeval.scrollWidth;
    this._scrollX = primeval.scrollLeft;
  }

  scrollX(x) {
    const primeval = this._slideTabBar.primeval();
    primeval.scrollLeft = x;
    this._scrollX = primeval.scrollLeft;
  }

  getScrollX() {
    return this._scrollX;
  }
}
