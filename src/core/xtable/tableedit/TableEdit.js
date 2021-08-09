import { XSelectItem } from '../xscreenitems/xselect/XSelectItem';
import { Cell } from '../tablecell/Cell';
import { TextEdit } from './type/TextEdit';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XEvent } from '../../../lib/XEvent';
import { BaseEdit } from './base/BaseEdit';
import { Constant } from '../../../const/Constant';
import { BaseFont } from '../../../draw/font/BaseFont';

/**
 * TableEdit
 */
class TableEdit extends TextEdit {

  /**
   * TableEdit
   * @param table
   */
  constructor(table) {
    super(table);
    this.closeClickHandle = XEvent.WrapFuncion.mouseClick((event) => {
      if (this.mode === BaseEdit.MODE.SHOW) {
        this.close(event);
      }
    });
    this.openClickHandle = XEvent.WrapFuncion.doubleClick((event) => {
      const { xScreen } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const merges = table.getTableMerges();
      const { selectRange } = xSelect;
      const { sri, sci } = selectRange;
      if (!selectRange.multiple() || merges.getFirstIncludes(sri, sci)) {
        this.open(event);
      }
    });
    this.tableScrollHandle = XEvent.WrapFuncion.mouseClick((event) => {
      if (this.mode === BaseEdit.MODE.SHOW) {
        this.close(event);
      }
    });
    this.enterResponse = {
      keyCode: keyCode => keyCode === 13,
      handle: (event) => {
        const { table } = this;
        const { widgetFocus } = table;
        const { keyboard } = table;
        widgetFocus.forward({ target: table });
        keyboard.forward({
          target: table, event,
        });
      },
    };
    this.altEnterResponse = {
      keyCode: keyCode => keyCode === 1813,
      handle: () => {
        this.insertHtml('<br />');
      },
    };
    this.bind();
    this.hide();
  }

  /**
   * 绑定事件处理
   */
  bind() {
    const { altEnterResponse } = this;
    const { enterResponse } = this;
    const { openClickHandle } = this;
    const { closeClickHandle } = this;
    const { tableScrollHandle } = this;
    const { table } = this;
    const { keyboard } = table;
    const { widgetFocus } = table;
    keyboard.register({
      target: this,
      response: [
        enterResponse,
        altEnterResponse,
      ],
    });
    widgetFocus.register({
      target: this,
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      event.stopPropagation();
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.INPUT, (event) => {
      const { mode, activeCell } = this;
      if (mode === BaseEdit.MODE.SHOW) {
        const { fontAttr } = activeCell;
        const { align } = fontAttr;
        if (align === BaseFont.ALIGN.center) {
          this.local();
        }
        table.trigger(Constant.TABLE_EVENT_TYPE.EDIT_INPUT, {
          native: event, table, edit: this,
        });
      }
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_WHEEL, (event) => {
      event.stopPropagation();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, tableScrollHandle);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, closeClickHandle);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, openClickHandle);
  }

  /**
   * 解绑事件处理
   */
  unbind() {
    const { openClickHandle } = this;
    const { closeClickHandle } = this;
    const { tableScrollHandle } = this;
    const { table } = this;
    const { keyboard } = table;
    const { widgetFocus } = table;
    keyboard.remove(this);
    widgetFocus.remove(this);
    XEvent.unbind(this);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, tableScrollHandle);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, openClickHandle);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, closeClickHandle);
  }

  /**
   * 打开编辑器
   * @returns {BaseEdit}
   */
  open(event) {
    let { throttle, table } = this;
    let cells = table.getTableCells();
    let { xScreen } = table;
    if (table.isReadOnly()) {
      return this;
    }
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let { sri, sci } = selectRange;
    let activeCell = cells.getCellOrNew(sri, sci);
    this.activeCell = activeCell;
    this.selectRange = selectRange;
    if (activeCell.hasFormula()) {
      this.formulaTextToHtml();
    } else {
      let { contentType } = activeCell;
      switch (contentType) {
        case Cell.TYPE.STRING:
        case Cell.TYPE.NUMBER:
        case Cell.TYPE.DATE_TIME: {
          this.cellTextToText();
          break;
        }
        case Cell.TYPE.RICH_TEXT: {
          this.richTextToHtml();
          break;
        }
      }
    }
    super.open({
      edit: this, table, native: event,
    });
    throttle.action(() => {
      this.focus();
      SheetUtils.keepLastIndex(this.el);
    });
    return this;
  }

  /**
   * 关闭编辑器
   * @returns {BaseEdit}
   */
  close(event) {
    let { table } = this;
    if (this.checkedFormulaText()) {
      this.htmlToFormulaText();
    } else if (this.checkedRichText()) {
      this.htmlToRichText();
    } else {
      this.textToCellText();
    }
    this.blur();
    super.close({
      edit: this, table, native: event,
    });
    this.activeCell = null;
    this.selectRange = null;
    return this;
  }

  /**
   * 销毁编辑器
   */
  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  TableEdit,
};
