import { RectRange } from './RectRange';

class XFixedView {

  constructor({
    fixedView = new RectRange(0, 0, -1, -1),
    fxLeft = -1,
    fxTop = -1,
  }) {
    this.fixedView = fixedView;
    if (fxLeft > -1) {
      this.fixedView.eci = fxLeft;
    }
    if (fxTop > -1) {
      this.fixedView.eri = fxTop;
    }
  }

  setFixedView(fixedView) {
    this.fixedView = fixedView.clone();
  }

  getFixedView() {
    return this.fixedView.clone();
  }

  hasFixedLeft() {
    return this.fixedView.eci > -1;
  }

  hasFixedTop() {
    return this.fixedView.eri > -1;
  }

}

export {
  XFixedView,
};
