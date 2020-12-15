import { RectRange } from '../../../tablebase/RectRange';
import { XScreenItem } from '../XScreenItem';

class Display {

  constructor(viewEyes) {
    this.viewEyes = viewEyes;
  }

  setDisplay(targetViewRange) {
    const screenView = this.getXScreenViewRange();
    const target = screenView.coincide(targetViewRange);
    const part = this.getPart();
    if (target !== RectRange.EMPTY) {
      part.show();
      return true;
    }
    part.hide();
    return false;
  }

  getPart() {
    throw new TypeError('child impl');
  }

  getXScreenViewRange() {
    throw new TypeError('child impl');
  }

}

class LTDisplay extends Display {

  setDisplay(targetViewRange) {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      return super.setDisplay(targetViewRange);
    }
    return false;
  }

  getPart() {
    const { viewEyes } = this;
    return viewEyes.lt;
  }

  getXScreenViewRange() {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      return xFixedView.getFixedView();
    }
    return RectRange.EMPTY;
  }

}

class TDisplay extends Display {

  setDisplay(targetViewRange) {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop()) {
      return super.setDisplay(targetViewRange);
    }
    return false;
  }

  getPart() {
    const { viewEyes } = this;
    return viewEyes.t;
  }

  getXScreenViewRange() {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop()) {
      const fixedView = xFixedView.getFixedView();
      const scrollView = table.getScrollView();
      return new RectRange(fixedView.sri, scrollView.sci, fixedView.eri, scrollView.eci);
    }
    return RectRange.EMPTY;
  }

}

class BRDisplay extends Display {

  getPart() {
    const { viewEyes } = this;
    return viewEyes.br;
  }

  getXScreenViewRange() {
    const { viewEyes } = this;
    const { table } = viewEyes;
    return table.getScrollView();
  }

}

class LDisplay extends Display {

  setDisplay(targetViewRange) {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedLeft()) {
      super.setDisplay(targetViewRange);
      return true;
    }
    return false;
  }

  getPart() {
    const { viewEyes } = this;
    return viewEyes.l;
  }

  getXScreenViewRange() {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedLeft()) {
      const fixedView = xFixedView.getFixedView();
      const scrollView = table.getScrollView();
      return new RectRange(scrollView.sri, fixedView.sci, scrollView.eri, fixedView.eci);
    }
    return RectRange.EMPTY;
  }

}

class XScreenViewEyes extends XScreenItem {

  constructor({
    table,
  } = {}) {
    super({ table });
    this.ltDisplay = new LTDisplay(this);
    this.tDisplay = new TDisplay(this);
    this.brDisplay = new BRDisplay(this);
    this.lDisplay = new LDisplay(this);
  }

  setDisplay(targetViewRange) {
    const lt = this.ltDisplay.setDisplay(targetViewRange);
    const t = this.tDisplay.setDisplay(targetViewRange);
    const br = this.brDisplay.setDisplay(targetViewRange);
    const l = this.lDisplay.setDisplay(targetViewRange);
    return lt || t || br || l;
  }

  setLocal() {
    throw new TypeError('child impl');
  }

  setSizer() {
    throw new TypeError('child impl');
  }

}

export {
  XScreenViewEyes,
};
