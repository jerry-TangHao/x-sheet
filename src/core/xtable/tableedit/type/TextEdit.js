import { XDraw } from '../../../../draw/XDraw';
import { BaseFont } from '../../../../draw/font/BaseFont';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { ExprEdit } from './ExprEdit';
import { Constant } from '../../../../const/Constant';

class TextEdit extends ExprEdit {

  /**
   * 文本转html
   */
  cellTextToText() {
    const { activeCell } = this;
    let { background, fontAttr } = activeCell;
    let { align, size, color } = fontAttr;
    let { bold, italic, name } = fontAttr;
    let fontSize = XDraw.cssPx(size);
    let textAlign = 'left';
    switch (align) {
      case BaseFont.ALIGN.left:
        textAlign = 'left';
        break;
      case BaseFont.ALIGN.center:
        textAlign = 'center';
        break;
      case BaseFont.ALIGN.right:
        textAlign = 'right';
        break;
    }
    let text = activeCell.getFormatText();
    let style = SheetUtils.clearBlank(`
      text-align:${textAlign};
      color: ${color};
      background:${background};
      font-style: ${italic ? 'italic' : 'initial'};
      font-weight: ${bold ? 'bold' : 'initial'};
      font-size: ${fontSize}px;
      font-family: ${name};
    `);
    this.text(text).style(style);
  }

  /**
   * html转文本
   */
  textToCellText() {
    let { activeCell, selectRange } = this;
    let { contentType } = activeCell;
    let { table } = this;
    let { sri, sci } = selectRange;
    let { snapshot } = table;
    let cells = table.getTableCells();
    let text = this.text();
    if (text !== activeCell.getFormatText()) {
      const cloneCell = activeCell.clone();
      snapshot.open();
      cloneCell.setText(text);
      cloneCell.setContentType(contentType);
      cells.setCellOrNew(sri, sci, cloneCell);
      snapshot.close({
        type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
      });
      table.render();
    }
  }

}

export {
  TextEdit,
};
