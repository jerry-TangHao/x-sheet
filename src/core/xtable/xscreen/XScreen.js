import { Widget } from '../../../libs/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
import { XScreenBRZone } from './zone/XScreenBRZone';
import { XScreenLTZone } from './zone/XScreenLTZone';
import { XScreenLZone } from './zone/XScreenLZone';
import { XScreenTZone } from './zone/XScreenTZone';
import { XEvent } from '../../../libs/XEvent';
import { XDraw } from '../../../canvas/XDraw';

const DISPLAY_AREA = {
  BRT: Symbol('BRT'),
  BRL: Symbol('BRL'),
  BR: Symbol('br'),
  ALL: Symbol('ALL'),
};

class XScreen extends Widget {

  constructor(table) {
    super(`${cssPrefix}-x-screen`);
    this.pool = [];
    this.table = table;
    this.displayArea = DISPLAY_AREA.BR;
    this.ltZone = new XScreenLTZone();
    this.tZone = new XScreenTZone();
    this.brZone = new XScreenBRZone();
    this.lZone = new XScreenLZone();
    this.children(this.ltZone);
    this.children(this.tZone);
    this.children(this.brZone);
    this.children(this.lZone);
  }

  onAttach() {
    this.bind();
    this.setZone();
  }

  unbind() {
    const { table } = this;
    XEvent.unbind(table);
  }

  bind() {
    const { table } = this;
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.SCALE_CHANGE, () => {
      this.setZone();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT, () => {
      this.setZone();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH, () => {
      this.setZone();
    });
  }

  addItem(item) {
    this.pool.push(item);
    this.ltZone.attach(item.lt);
    this.tZone.attach(item.t);
    this.lZone.attach(item.l);
    this.brZone.attach(item.br);
    item.setXScreen(this);
    item.onAdd(this);
  }

  setZone() {
    const { table } = this;
    const { index } = table;
    const fixedHeight = table.getFixedHeight();
    const fixedWidth = table.getFixedWidth();
    const brTop = index.getHeight() + fixedHeight;
    const brLeft = index.getWidth() + fixedWidth;
    this.brZone.offset({ left: brLeft, top: brTop });
    const ltDisplay = fixedWidth > 0 && fixedHeight > 0;
    const tDisplay = fixedHeight > 0;
    const lDisplay = fixedWidth > 0;
    this.ltZone.hide();
    this.lZone.hide();
    this.tZone.hide();
    const width = XDraw.dpr();
    if (ltDisplay) {
      this.displayArea = DISPLAY_AREA.ALL;
      this.ltZone.offset({
        left: index.getWidth(), top: index.getHeight(), width: fixedWidth, height: fixedHeight,
      }).show();
      this.ltZone.css('border-width', `${width}px`);
      this.lZone.offset({
        left: index.getWidth(),
        top: brTop,
        width: fixedWidth,
        height: table.visualHeight() - index.getHeight() - fixedHeight,
      }).show();
      this.lZone.css('border-width', `${width}px`);
      this.tZone.offset({
        left: brLeft,
        top: index.getHeight(),
        width: table.visualWidth() - index.getWidth() - fixedWidth,
        height: fixedHeight,
      }).show();
      this.tZone.css('border-width', `${width}px`);
    } else if (lDisplay) {
      this.displayArea = DISPLAY_AREA.BRL;
      this.lZone.offset({
        left: index.getWidth(),
        top: brTop,
        width: fixedWidth,
        height: table.visualHeight() - index.getHeight() - fixedHeight,
      }).show();
      this.lZone.css('border-width', `${width}px`);
    } else if (tDisplay) {
      this.displayArea = DISPLAY_AREA.BRL;
      this.tZone.offset({
        left: brLeft,
        top: index.getHeight(),
        width: table.visualWidth() - index.getWidth() - fixedWidth,
        height: fixedHeight,
      }).show();
      this.tZone.css('border-width', `${width}px`);
    } else {
      this.displayArea = DISPLAY_AREA.BR;
    }
  }

  findType(type) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.pool) {
      if (item instanceof type) {
        return item;
      }
    }
    return null;
  }

  destroy() {
    super.destroy();
    this.unbind();
    this.pool.forEach((item) => {
      item.destroy();
    });
  }

}

export {
  XScreen, DISPLAY_AREA,
};
