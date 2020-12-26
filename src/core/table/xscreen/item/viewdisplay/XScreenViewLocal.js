import { XScreenViewEyes } from './XScreenViewEyes';
import { RectRange } from '../../../tablebase/RectRange';

class Local {

  constructor(viewLocal) {
    this.viewLocal = viewLocal;
  }

  setLeft(targetViewRange) {
    const { viewLocal } = this;
    const { table } = viewLocal;
    const { cols } = table;
    const screenView = this.getXScreenViewRange();
    const target = screenView.coincide(targetViewRange);
    const left = target !== RectRange.EMPTY
      ? cols.sectionSumWidth(screenView.sci, target.sci - 1) : 0;
    const part = this.getPart();
    part.offset({ left });
  }

  setTop(targetViewRange) {
    const { viewLocal } = this;
    const { table } = viewLocal;
    const { rows } = table;
    const screenView = this.getXScreenViewRange();
    const target = screenView.coincide(targetViewRange);
    const top = target !== RectRange.EMPTY
      ? rows.sectionSumHeight(screenView.sri, target.sri - 1) : 0;
    const part = this.getPart();
    part.offset({ top });
  }

  setLocal(targetViewRange) {
    this.setTop(targetViewRange);
    this.setLeft(targetViewRange);
  }

  getPart() {
    throw new TypeError('child impl');
  }

  getXScreenViewRange() {
    throw new TypeError('child impl');
  }

}

class LTLocal extends Local {

  setLocal(targetViewRange) {
    const { viewLocal } = this;
    const { table } = viewLocal;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      super.setLocal(targetViewRange);
    }
  }

  getPart() {
    const { viewLocal } = this;
    return viewLocal.lt;
  }

  getXScreenViewRange() {
    const { viewLocal } = this;
    const { table } = viewLocal;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      return xFixedView.getFixedView();
    }
    return RectRange.EMPTY;
  }

}

class TLocal extends Local {

  setLocal(targetViewRange) {
    const { viewLocal } = this;
    const { table } = viewLocal;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop()) {
      super.setLocal(targetViewRange);
    }
  }

  getPart() {
    const { viewLocal } = this;
    return viewLocal.t;
  }

  getXScreenViewRange() {
    const { viewLocal } = this;
    const { table } = viewLocal;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop()) {
      const fixedView = xFixedView.getFixedView();
      const scrollView = table.getScrollView();
      return new RectRange(fixedView.sri, scrollView.sci, fixedView.eri, scrollView.eci);
    }
    return RectRange.EMPTY;
  }

}

class BRLocal extends Local {

  getPart() {
    const { viewLocal } = this;
    return viewLocal.br;
  }

  getXScreenViewRange() {
    const { viewLocal } = this;
    const { table } = viewLocal;
    return table.getScrollView();
  }

}

class LLocal extends Local {

  setLocal(targetViewRange) {
    const { viewLocal } = this;
    const { table } = viewLocal;
    const { xFixedView } = table;
    if (xFixedView.hasFixedLeft()) {
      super.setLocal(targetViewRange);
    }
  }

  getPart() {
    const { viewLocal } = this;
    return viewLocal.l;
  }

  getXScreenViewRange() {
    const { viewLocal } = this;
    const { table } = viewLocal;
    const { xFixedView } = table;
    if (xFixedView.hasFixedLeft()) {
      const fixedView = xFixedView.getFixedView();
      const scrollView = table.getScrollView();
      return new RectRange(scrollView.sri, fixedView.sci, scrollView.eri, fixedView.eci);
    }
    return RectRange.EMPTY;
  }

}

class XScreenViewLocal extends XScreenViewEyes {

  constructor({
    table,
  } = {}) {
    super({ table });
    this.tlLocal = new LTLocal(this);
    this.tLocal = new TLocal(this);
    this.brLocal = new BRLocal(this);
    this.lLocal = new LLocal(this);
  }

  setLocal(view) {
    this.tlLocal.setLocal(view);
    this.tLocal.setLocal(view);
    this.brLocal.setLocal(view);
    this.lLocal.setLocal(view);
  }

}

export {
  XScreenViewLocal,
};
