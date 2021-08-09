import { RichEdit } from './RichEdit';
import { Constant } from '../../../../const/Constant';

/**
 * ExprEdit
 */
class ExprEdit extends RichEdit {

  /**
   * 公式转html
   */
  formulaTextToHtml() {
    const { activeCell } = this;
    return activeCell.getExpr();
  }

  /**
   * html转公式
   */
  htmlToFormulaText() {
    const { activeCell, selectRange } = this;
    const { table } = this;
    const { sri, sci } = selectRange;
    const cloneCell = activeCell.clone();
    const cells = table.getTableCells();
    const { snapshot } = table;
    const expr = this.text();
    snapshot.open();
    cloneCell.setExpr(expr);
    cells.setCellOrNew(sri, sci, cloneCell);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
    });
    table.render();
  }

  /**
   * 检查输入的是否为公式内容
   */
  checkedFormulaText() {
    const text = this.text();
    return text.startsWith('=');
  }

}

export {
  ExprEdit,
};
