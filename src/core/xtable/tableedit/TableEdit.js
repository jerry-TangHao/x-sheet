import { XSelectItem } from '../screenitems/xselect/XSelectItem';
import { Cell } from '../tablecell/Cell';
import { TextEdit } from './type/TextEdit';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XEvent } from '../../../lib/XEvent';
import { BaseEdit } from './base/BaseEdit';
import { Constant } from '../../../const/Constant';
import { BaseFont } from '../../../draw/font/BaseFont';

class TableEdit extends TextEdit {

  /**
   * TableEdit
   * @param table
   */
  constructor(table) {
    super(table);
    this.openClickHandle = XEvent.WrapFuncion.doubleClick((event) => {
      const { xScreen } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const merges = table.getTableMerges();
      const { selectRange } = xSelect;
      const { sri, sci } = selectRange;
      if (!selectRange.multiple() || merges.getFirstInclude(sri, sci)) {
        this.open(event);
      }
    });
    this.closeClickHandle = (event) => {
      if (this.mode === BaseEdit.MODE.SHOW) {
        this.close(event);
      }
    };
    this.userInputHandle = () => {
      this.defaultWrap();
    };
    this.tableScrollHandle = (event) => {
      if (this.mode === BaseEdit.MODE.SHOW) {
        this.close(event);
      }
    };
    this.enterResponse = {
      keyCode: keyCode => keyCode === 13,
      handle: (event) => {
        const { table } = this;
        const { focusManage } = table;
        const { keyboard } = table;
        focusManage.forward({ target: table });
        keyboard.forward({
          target: table, event,
        });
      },
    };
    this.tabResponse = {
      keyCode: keyCode => keyCode === 9,
      handle: (event) => {
        const { table } = this;
        const { focusManage } = table;
        const { keyboard } = table;
        focusManage.forward({
          target: table,
        });
        keyboard.forward({
          target: table, event,
        });
      },
    };
    this.escResponse = {
      keyCode: keyCode => keyCode === 27,
      handle: (event) => {
        const { table } = this;
        const { focusManage } = table;
        const { keyboard } = table;
        focusManage.forward({
          target: table,
        });
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
    super.bind();
    const { altEnterResponse } = this;
    const { tabResponse } = this;
    const { enterResponse } = this;
    const { escResponse } = this;
    const { openClickHandle } = this;
    const { userInputHandle } = this;
    const { closeClickHandle } = this;
    const { tableScrollHandle } = this;
    const { table } = this;
    const { keyboard } = table;
    const { focusManage } = table;
    keyboard.register({
      target: this,
      response: [
        enterResponse,
        tabResponse,
        altEnterResponse,
        escResponse,
      ],
    });
    focusManage.register({
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
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.INPUT, userInputHandle);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, closeClickHandle);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, openClickHandle);
  }

  /**
   * 解绑事件处理
   */
  unbind() {
    super.unbind();
    const { openClickHandle } = this;
    const { closeClickHandle } = this;
    const { userInputHandle } = this;
    const { tableScrollHandle } = this;
    const { table } = this;
    const { keyboard } = table;
    const { focusManage } = table;
    keyboard.remove(this);
    focusManage.remove(this);
    XEvent.unbind(this);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.INPUT, userInputHandle);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, tableScrollHandle);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, openClickHandle);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, closeClickHandle);
  }

  /**
   * 写内容
   */
  write() {
    if (this.checkedRichText()) {
      this.htmlToRichText();
      return;
    }
    if (this.checkedFormulaText()) {
      this.htmlToFormulaText();
      return;
    }
    this.textToCellText();
  }

  /**
   * 打开编辑器
   * @returns {BaseEdit}
   */
  open(event) {
    let { throttle, table } = this;
    let cells = table.getTableCells();
    let { xScreen } = table;
    if (table.isProtection()) {
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
    this.write();
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
    this.unbind();
    super.destroy();
  }

}

export {
  TableEdit,
};
