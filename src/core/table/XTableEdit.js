import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { XEvent } from '../../lib/XEvent';
import { PlainUtils } from '../../utils/PlainUtils';
import { XSelectItem } from './xscreenitems/xselect/XSelectItem';
import { XDraw } from '../../canvas/XDraw';
import { Throttle } from '../../lib/Throttle';
import { BaseFont } from '../../canvas/font/BaseFont';

class XTableEdit extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-edit`);
    this.table = table;
    this.cell = null;
    this.merge = null;
    this.select = null;
    this.throttle = new Throttle({ time: 100 });
    this.attr('contenteditable', true);
    this.html(PlainUtils.EMPTY);
  }

  onAttach() {
    this.bind();
    this.hide();
  }

  editOffset() {
    const { table, cell } = this;
    const {
      xHeightLight, yHeightLight,
    } = table;
    const { fontAttr } = cell;
    const { align } = fontAttr;
    const left = xHeightLight.getLeft() + table.getIndexWidth();
    const top = yHeightLight.getTop() + table.getIndexHeight();
    const height = yHeightLight.getHeight();
    const width = xHeightLight.getWidth();
    switch (align) {
      case BaseFont.ALIGN.left: {
        this.cssRemoveKeys('right');
        const maxHeight = table.visualHeight() - top;
        const maxWidth = table.visualWidth() - left;
        this.css({
          left: `${left}px`,
          top: `${top}px`,
          'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
          'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
          'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
          'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
        });
        break;
      }
      case BaseFont.ALIGN.center: {
        this.cssRemoveKeys('right');
        const box = this.box();
        const maxHeight = table.visualHeight() - top;
        if (box.width > width) {
          const maxWidth = (table.visualWidth() - (left + width)) * 2 + width;
          const realWidth = Math.min(box.width, maxWidth);
          const realLeft = left - (realWidth / 2 - width / 2);
          this.css({
            left: `${realLeft}px`,
            top: `${top}px`,
            'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
            'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
            'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
            'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
          });
        } else {
          const maxWidth = table.visualWidth() - left;
          this.css({
            left: `${left}px`,
            top: `${top}px`,
            'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
            'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
            'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
            'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
          });
        }
        break;
      }
      case BaseFont.ALIGN.right: {
        this.cssRemoveKeys('left');
        const maxWidth = (left + width) - table.getIndexWidth();
        const right = table.visualWidth() - (left + width);
        const maxHeight = table.visualHeight() - top;
        this.css({
          right: `${right}px`,
          top: `${top}px`,
          'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
          'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
          'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
          'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
        });
        break;
      }
    }
  }

  unbind() {
    const { table } = this;
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    XEvent.bind(table);
    XEvent.unbind([
      xSelect.lt,
      xSelect.t,
      xSelect.l,
      xSelect.br,
    ]);
  }

  bind() {
    const { table } = this;
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const merges = table.getTableMerges();
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_WHEEL, (e) => {
      e.stopPropagation();
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      e.stopPropagation();
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.INPUT, () => {
      const { cell } = this;
      const { fontAttr } = cell;
      const { align } = fontAttr;
      if (align === BaseFont.ALIGN.center) {
        this.editOffset();
      }
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.hideEdit();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.hideEdit();
    });
    XEvent.mouseDoubleClick(table, () => {
      const { selectRange } = xSelect;
      const { sri, sci } = selectRange;
      if (!selectRange.multiple() || merges.getFirstIncludes(sri, sci)) {
        this.showEdit();
      }
    });
  }

  showEdit() {
    const { table } = this;
    const merges = table.getTableMerges();
    const cells = table.getTableCells();
    const scrollView = table.getScrollView();
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    if (selectRange && scrollView.intersects(selectRange)) {
      const { sri, sci } = selectRange;
      const merge = merges.getFirstIncludes(sri, sci);
      const cell = cells.getCellOrNew(sri, sci);
      this.merge = merge;
      this.cell = cell;
      this.select = selectRange;
      this.show();
      if (PlainUtils.isBlank(cell.text)) {
        this.html(PlainUtils.EMPTY);
      } else {
        this.html(cell.text);
      }
      this.attr('style', table.getCellCssStyle(sri, sci));
      this.editOffset();
      this.throttle.action(() => {
        PlainUtils.keepLastIndex(this.el);
      });
    }
  }

  hideEdit() {
    const { select } = this;
    const { table } = this;
    const cells = table.getTableCells();
    const { tableDataSnapshot } = table;
    const { cellDataProxy } = tableDataSnapshot;
    if (select) {
      const origin = cells.getCellOrNew(select.sri, select.sci);
      const cell = origin.clone();
      const text = PlainUtils.trim(this.text());
      this.hide();
      if (cell.text !== text) {
        tableDataSnapshot.begin();
        cell.text = text;
        cell.setContentWidth(0);
        cell.setLeftSdistWidth(0);
        cell.setRightSdistWidth(0);
        cellDataProxy.setCell(select.sri, select.sci, cell);
        tableDataSnapshot.end();
        table.render();
      }
      this.select = null;
    }
  }

  show() {
    this.css({
      'min-width': '0px',
      'min-height': '0px',
      'max-width': '0px',
      'max-height': '0px',
    });
    return super.show();
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  XTableEdit,
};
