import { RectRange } from '../../../tablebase/RectRange';
import { XScreenLTPart } from '../../part/XScreenLTPart';
import { XScreenTPart } from '../../part/XScreenTPart';
import { XScreenLPart } from '../../part/XScreenLPart';
import { XScreenBRPart } from '../../part/XScreenBRPart';
import { XScreenViewSizer } from '../viewdisplay/XScreenViewSizer';

const RANGE_OVER_GO = {
  LT: Symbol('lt'),
  T: Symbol('t'),
  BR: Symbol('br'),
  L: Symbol('l'),
  LTT: Symbol('ltt'),
  LTL: Symbol('ltl'),
  BRT: Symbol('brt'),
  BRL: Symbol('brl'),
  ALL: Symbol('all'),
};

class XScreenStyleBorderHandle extends XScreenViewSizer {

  getBorderDisplay(range) {
    const { table } = this;
    const scrollView = table.getScrollView();
    const overGo = this.getOverGo(range);
    const display = {
      bottom: false, left: false, top: false, right: false,
    };
    switch (overGo) {
      case RANGE_OVER_GO.LT:
        display.bottom = true;
        display.top = true;
        display.left = true;
        display.right = true;
        break;
      case RANGE_OVER_GO.T:
        display.bottom = true;
        display.top = true;
        display.left = range.sci >= scrollView.sci && range.sci <= scrollView.eci;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
      case RANGE_OVER_GO.BR:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = range.sri >= scrollView.sri && range.sri <= scrollView.eri;
        display.left = range.sci >= scrollView.sci && range.sci <= scrollView.eci;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
      case RANGE_OVER_GO.L:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = range.sri >= scrollView.sri && range.sri <= scrollView.eri;
        display.left = true;
        display.right = true;
        break;
      case RANGE_OVER_GO.LTT:
        display.bottom = true;
        display.top = true;
        display.left = true;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
      case RANGE_OVER_GO.LTL:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = true;
        display.left = true;
        display.right = true;
        break;
      case RANGE_OVER_GO.BRT:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = true;
        display.left = range.sci >= scrollView.sci && range.sci <= scrollView.eci;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
      case RANGE_OVER_GO.BRL:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = range.sri >= scrollView.sri && range.sri <= scrollView.eri;
        display.left = true;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
      case RANGE_OVER_GO.ALL:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = true;
        display.left = true;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
    }
    return display;
  }

  getOverGo(range) {
    const { table } = this;
    const { cols, rows } = table;
    const {
      xFixedView,
    } = table;
    const rowsLen = rows.len - 1;
    const colsLen = cols.len - 1;
    const fixedView = xFixedView.getFixedView();
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      const lt = fixedView;
      const t = new RectRange(fixedView.sri, fixedView.eci + 1, fixedView.eri, colsLen);
      const l = new RectRange(fixedView.eri + 1, fixedView.sci, rowsLen, fixedView.eci);
      const br = new RectRange(fixedView.eri + 1, fixedView.eci + 1, rowsLen, colsLen);
      if (lt.contains(range)) {
        return RANGE_OVER_GO.LT;
      }
      if (t.contains(range)) {
        return RANGE_OVER_GO.T;
      }
      if (br.contains(range)) {
        return RANGE_OVER_GO.BR;
      }
      if (l.contains(range)) {
        return RANGE_OVER_GO.L;
      }
      const ltt = new RectRange(fixedView.sri, fixedView.sci, fixedView.eri, colsLen);
      const ltl = new RectRange(fixedView.sri, fixedView.sci, rowsLen, fixedView.eci);
      const brt = new RectRange(fixedView.sri, fixedView.eci + 1, rowsLen, colsLen);
      const brl = new RectRange(fixedView.eri + 1, fixedView.sci, rowsLen, colsLen);
      if (ltt.contains(range)) {
        return RANGE_OVER_GO.LTT;
      }
      if (ltl.contains(range)) {
        return RANGE_OVER_GO.LTL;
      }
      if (brt.contains(range)) {
        return RANGE_OVER_GO.BRT;
      }
      if (brl.contains(range)) {
        return RANGE_OVER_GO.BRL;
      }
      return RANGE_OVER_GO.ALL;
    } if (xFixedView.hasFixedTop()) {
      const t = new RectRange(fixedView.sri, fixedView.eci, fixedView.eri, colsLen);
      const br = new RectRange(fixedView.eri + 1, fixedView.eci + 1, rowsLen, colsLen);
      if (t.contains(range)) {
        return RANGE_OVER_GO.T;
      }
      if (br.contains(range)) {
        return RANGE_OVER_GO.BR;
      }
      return RANGE_OVER_GO.BRT;
    } if (xFixedView.hasFixedLeft()) {
      const l = new RectRange(fixedView.eri, fixedView.sci, rowsLen, fixedView.eci);
      const br = new RectRange(fixedView.eri + 1, fixedView.eci + 1, rowsLen, colsLen);
      if (l.contains(range)) {
        return RANGE_OVER_GO.L;
      }
      if (br.contains(range)) {
        return RANGE_OVER_GO.BR;
      }
      return RANGE_OVER_GO.BRL;
    }
    return RANGE_OVER_GO.BR;
  }

  showBBorder(overGo, display) {
    switch (overGo) {
      case RANGE_OVER_GO.LT:
        this.blt.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.L:
        this.bl.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.T:
        this.bt.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.BR:
        if (display.bottom) this.bbr.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.LTT:
        this.blt.addClass('show-bottom-border');
        this.bt.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.LTL:
        if (display.bottom) this.bl.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.BRT:
        if (display.bottom) this.bbr.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.ALL:
      case RANGE_OVER_GO.BRL:
        if (display.bottom) {
          this.bl.addClass('show-bottom-border');
          this.bbr.addClass('show-bottom-border');
        }
        break;
    }
  }

  showTBorder(overGo, display) {
    switch (overGo) {
      case RANGE_OVER_GO.LT:
        this.blt.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.L:
        this.bl.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.T:
        this.bt.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.BR:
        if (display.top) this.bbr.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.LTT:
        this.blt.addClass('show-top-border');
        this.bt.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.LTL:
        this.blt.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.BRT:
        this.bt.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.BRL:
        if (display.top) {
          this.bl.addClass('show-top-border');
          this.bbr.addClass('show-top-border');
        }
        break;
      case RANGE_OVER_GO.ALL:
        this.blt.addClass('show-top-border');
        this.bt.addClass('show-top-border');
        break;
    }
  }

  showLBorder(overGo, display) {
    switch (overGo) {
      case RANGE_OVER_GO.LT:
        this.blt.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.L:
        this.bl.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.T:
        if (display.left) this.bt.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.BR:
        if (display.left) this.bbr.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.LTT:
        this.blt.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.LTL:
        this.blt.addClass('show-left-border');
        this.bl.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.BRT:
        if (display.left) {
          this.bt.addClass('show-left-border');
          this.bbr.addClass('show-left-border');
        }
        break;
      case RANGE_OVER_GO.BRL:
        this.bl.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.ALL:
        this.blt.addClass('show-left-border');
        this.bl.addClass('show-left-border');
        break;
    }
  }

  showRBorder(overGo, display) {
    switch (overGo) {
      case RANGE_OVER_GO.LT:
        this.blt.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.L:
        this.bl.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.T:
        if (display.right) this.bt.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.BR:
        if (display.right) this.bbr.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.LTT:
        if (display.right) this.bt.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.LTL:
        this.blt.addClass('show-right-border');
        this.bl.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.BRT:
        if (display.right) {
          this.bt.addClass('show-right-border');
          this.bbr.addClass('show-right-border');
        }
        break;
      case RANGE_OVER_GO.BRL:
        if (display.right) this.bbr.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.ALL:
        if (display.right) {
          this.bt.addClass('show-right-border');
          this.bbr.addClass('show-right-border');
        }
        break;
    }
  }

}

class XScreenStyleBorderItem extends XScreenStyleBorderHandle {

  constructor({ table }, className = '') {
    super({ table });
    this.blt = new XScreenLTPart(className);
    this.bt = new XScreenTPart(className);
    this.bl = new XScreenLPart(className);
    this.bbr = new XScreenBRPart(className);
    this.lt.attach(this.blt);
    this.t.attach(this.bt);
    this.l.attach(this.bl);
    this.br.attach(this.bbr);
  }

  hideBorder() {
    [this.bbr, this.bt, this.bl, this.blt].forEach((item) => {
      item.removeClass('show-bottom-border');
      item.removeClass('show-top-border');
      item.removeClass('show-right-border');
      item.removeClass('show-left-border');
    });
  }

  showBorder(range) {
    const overGo = this.getOverGo(range);
    const display = this.getBorderDisplay(range);
    this.showBBorder(overGo, display);
    this.showTBorder(overGo, display);
    this.showLBorder(overGo, display);
    this.showRBorder(overGo, display);
    return display;
  }

}

export {
  XScreenStyleBorderItem, RANGE_OVER_GO,
};
