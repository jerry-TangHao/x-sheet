import { XScreenViewLocal } from './XScreenViewLocal';
import { RectRange } from '../../../tablebase/RectRange';
import { XDraw } from '../../../../../canvas/XDraw';

class Sizer {

  constructor(viewSizer) {
    this.viewSizer = viewSizer;
  }

  setSizer(targetViewRange) {
    const { viewSizer } = this;
    const { table } = viewSizer;
    const { cols, rows } = table;
    const screenView = this.getXScreenViewRange();
    const target = screenView.coincide(targetViewRange);
    const width = cols.rectRangeSumWidth(target);
    const height = rows.rectRangeSumHeight(target);
    const part = this.getPart();
    part.offset({
      width: XDraw.offsetToLineInside(width),
      height: XDraw.offsetToLineInside(height),
    });
  }

  getPart() {
    throw new TypeError('child impl');
  }

  getXScreenViewRange() {
    throw new TypeError('child impl');
  }

}

class LTSizer extends Sizer {

  setSizer(targetViewRange) {
    const { viewSizer } = this;
    const { table } = viewSizer;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      super.setSizer(targetViewRange);
    }
  }

  getPart() {
    const { viewSizer } = this;
    return viewSizer.lt;
  }

  getXScreenViewRange() {
    const { viewSizer } = this;
    const { table } = viewSizer;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      return xFixedView.getFixedView();
    }
    return RectRange.EMPTY;
  }

}

class TSizer extends Sizer {

  setSizer(targetViewRange) {
    const { viewSizer } = this;
    const { table } = viewSizer;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop()) {
      super.setSizer(targetViewRange);
    }
  }

  getPart() {
    const { viewSizer } = this;
    return viewSizer.t;
  }

  getXScreenViewRange() {
    const { viewSizer } = this;
    const { table } = viewSizer;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop()) {
      const fixedView = xFixedView.getFixedView();
      const scrollView = table.getScrollView();
      return new RectRange(fixedView.sri, scrollView.sci, fixedView.eri, scrollView.eci);
    }
    return RectRange.EMPTY;
  }

}

class BRSizer extends Sizer {

  getPart() {
    const { viewSizer } = this;
    return viewSizer.br;
  }

  getXScreenViewRange() {
    const { viewSizer } = this;
    const { table } = viewSizer;
    return table.getScrollView();
  }

}

class LSizer extends Sizer {

  setSizer(targetViewRange) {
    const { viewSizer } = this;
    const { table } = viewSizer;
    const { xFixedView } = table;
    if (xFixedView.hasFixedLeft()) {
      super.setSizer(targetViewRange);
    }
  }

  getPart() {
    const { viewSizer } = this;
    return viewSizer.l;
  }

  getXScreenViewRange() {
    const { viewSizer } = this;
    const { table } = viewSizer;
    const { xFixedView } = table;
    if (xFixedView.hasFixedLeft()) {
      const fixedView = xFixedView.getFixedView();
      const scrollView = table.getScrollView();
      return new RectRange(scrollView.sri, fixedView.sci, scrollView.eri, fixedView.eci);
    }
    return RectRange.EMPTY;
  }

}

class XScreenViewSizer extends XScreenViewLocal {

  constructor({
    table,
  } = {}) {
    super({ table });
    this.ltSizer = new LTSizer(this);
    this.tSizer = new TSizer(this);
    this.brSizer = new BRSizer(this);
    this.lSizer = new LSizer(this);
  }

  setSizer(view) {
    this.ltSizer.setSizer(view);
    this.tSizer.setSizer(view);
    this.brSizer.setSizer(view);
    this.lSizer.setSizer(view);
  }

}

export {
  XScreenViewSizer,
};
