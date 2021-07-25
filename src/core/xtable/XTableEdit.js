/* global document */
import { Widget } from '../../libs/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { XEvent } from '../../libs/XEvent';
import { PlainUtils } from '../../utils/PlainUtils';
import { XSelectItem } from './xscreenitems/xselect/XSelectItem';
import { XDraw } from '../../canvas/XDraw';
import { Throttle } from '../../libs/Throttle';
import { BaseFont } from '../../canvas/font/BaseFont';
import { Cell } from './tablecell/Cell';

class XTableEdit extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-edit`);
    this.table = table;
    this.select = null;
    this.cell = null;
    this.merge = null;
    this.mode = XTableEdit.MODE.HIDE;
    this.throttle = new Throttle({
      time: 100,
    });
    this.attr('contenteditable', true);
    this.html(PlainUtils.EMPTY);
  }

  onAttach() {
    const { table } = this;
    this.bind();
    this.hide();
    table.focus.register({ target: this });
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
    const { keyboard, xScreen } = table;
    const merges = table.getTableMerges();
    const xSelect = xScreen.findType(XSelectItem);
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_WHEEL, (event) => {
      event.stopPropagation();
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.INPUT, (event) => {
      const { cell } = this;
      const { fontAttr } = cell;
      const { align } = fontAttr;
      if (align === BaseFont.ALIGN.center) {
        this.editOffset();
      }
      table.trigger(Constant.TABLE_EVENT_TYPE.EDIT_INPUT, {
        event,
        table,
        edit: this,
      });
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      event.stopPropagation();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.hideEdit();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      if (this.mode === XTableEdit.MODE.SHOW) {
        this.hideEdit(event);
      }
    });
    XEvent.mouseDoubleDown(table, (event) => {
      const { selectRange } = xSelect;
      const { sri, sci } = selectRange;
      if (!selectRange.multiple() || merges.getFirstIncludes(sri, sci)) {
        this.showEdit(event);
      }
    });
    keyboard.register({
      target: this,
      response: [{
        keyCode: keyCode => keyCode === 1813,
        handle: () => {
          this.insertLineBreak();
        },
      }],
    });
  }

  hideEdit(event) {
    const { select } = this;
    const { table } = this;
    const { snapshot } = table;
    const cells = table.getTableCells();
    if (select) {
      const origin = cells.getCellOrNew(select.sri, select.sci);
      const cell = origin.clone();
      const text = this.text();
      this.mode = XTableEdit.MODE.HIDE;
      this.hide();
      if (cell.toString() !== text) {
        snapshot.open();
        cell.setText(text);
        cells.setCellOrNew(select.sri, select.sci, cell);
        snapshot.close({
          type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
        });
        table.render();
      }
      this.select = null;
      table.trigger(Constant.TABLE_EVENT_TYPE.EDIT_FINISH, {
        event,
        table,
        edit: this,
      });
    }
  }

  showEdit(event) {
    const { table } = this;
    if (!table.isReadOnly()) {
      const merges = table.getTableMerges();
      const cells = table.getTableCells();
      const { xScreen } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      if (selectRange) {
        const { sri, sci } = selectRange;
        const merge = merges.getFirstIncludes(sri, sci);
        const cell = cells.getCellOrNew(sri, sci);
        this.merge = merge;
        this.cell = cell;
        this.select = selectRange;
        this.mode = XTableEdit.MODE.SHOW;
        if (cell.isEmpty()) {
          this.text(PlainUtils.EMPTY);
        } else {
          const { contentType } = cell;
          switch (contentType) {
            case Cell.CONTENT_TYPE.RICH_TEXT: {
              // TODO ...
              //
              this.text(PlainUtils.EMPTY);
              this.show();
              break;
            }
            case Cell.CONTENT_TYPE.DATE:
            case Cell.CONTENT_TYPE.NUMBER:
            case Cell.CONTENT_TYPE.STRING: {
              const text = cell.toString();
              this.text(text);
              this.attr('style', table.getCellCssStyle(sri, sci));
              this.show();
              break;
            }
          }
        }
        this.editOffset();
        this.throttle.action(() => {
          this.focus();
          PlainUtils.keepLastIndex(this.el);
        });
        table.trigger(Constant.TABLE_EVENT_TYPE.EDIT_START, {
          event,
          table,
          edit: this,
        });
      }
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

  insertLineBreak() {
    const { cell } = this;
    const { contentType } = cell;
    switch (contentType) {
      case Cell.CONTENT_TYPE.RICH_TEXT: {
        break;
      }
      case Cell.CONTENT_TYPE.DATE:
      case Cell.CONTENT_TYPE.NUMBER:
      case Cell.CONTENT_TYPE.STRING: {
        document.execCommand('insertHTML', false, '<br>');
        break;
      }
    }
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

XTableEdit.MODE = {
  SHOW: Symbol('显示'),
  HIDE: Symbol('隐藏'),
};

export {
  XTableEdit,
};
