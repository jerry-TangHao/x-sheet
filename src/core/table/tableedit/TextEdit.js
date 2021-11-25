import { XDraw } from '../../../draw/XDraw';
import { BaseFont } from '../../../draw/font/BaseFont';
import { SheetUtils } from '../../../utils/SheetUtils';
import { ExprEdit } from './ExprEdit';
import { Constant } from '../../../const/Constant';
import { Cell } from '../tablecell/Cell';
import { DomUtils } from '../../../utils/DomUtils';
import { CellFont } from '../tablecell/CellFont';

class TextEdit extends ExprEdit {

  /**
   * 文本转html
   */
  cellTextToText() {
    let { activeCell } = this;
    let { table } = this;
    let { scale } = table;
    if (activeCell) {
      let { background, fontAttr } = activeCell;
      let { align, size, color } = fontAttr;
      let { bold, italic, name } = fontAttr;
      let { underline, strikethrough } = fontAttr;
      let fontSize = XDraw.cssPx(scale.goto(size));
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
      let wrap = activeCell.getFormatText()
        .replace(/\n/g, '<br/>')
        .replace(/ /g, '&nbsp;') || '&#xFEFF;';
      if (underline) {
        wrap = `<span style="text-decoration: underline">${wrap}</span>`;
      }
      if (strikethrough) {
        wrap = `<span style="text-decoration: line-through">${wrap}</span>`;
      }
      if (name) {
        wrap = `<span style="font-family: ${name}">${wrap}</span>`;
      }
      if (fontSize) {
        wrap = `<span style="font-size: ${fontSize}px">${wrap}</span>`;
      }
      if (italic) {
        wrap = `<span style="font-style: italic">${wrap}</span>`;
      }
      if (bold) {
        wrap = `<span style="font-weight: bold">${wrap}</span>`;
      }
      if (color) {
        wrap = `<span style="color: ${color}">${wrap}</span>`;
      }
      this.html(wrap);
      this.style(SheetUtils.clearBlank(`
        text-align:${textAlign};
        background:${background};
      `));
    }
  }

  /**
   * html转文本
   */
  textToCellText() {
    let { selectRange } = this;
    let { table } = this;
    let { activeCell } = this;
    if (activeCell) {
      let format = activeCell.getFormatText();
      let handle = (element, style) => {
        if (!element.equals(this)) {
          const fontWeight = element.css('font-weight');
          const fontSize = element.css('font-size');
          const fontFamily = element.css('font-family');
          const fontColor = element.css('color');
          const fontStyle = element.css('font-style');
          const fontDecoration = element.css('text-decoration');
          if (!SheetUtils.isBlank(fontWeight)) {
            style.bold = true;
          }
          if (!SheetUtils.isBlank(fontSize)) {
            style.size = DomUtils.pxToNumber(fontSize);
          }
          if (!SheetUtils.isBlank(fontFamily)) {
            style.name = fontFamily;
          }
          if (!SheetUtils.isBlank(fontColor)) {
            style.color = fontColor;
          }
          if (!SheetUtils.isBlank(fontStyle)) {
            style.italic = true;
          }
          if (!SheetUtils.isBlank(fontDecoration)) {
            if (fontDecoration === 'underline') {
              style.underline = true;
            }
            if (fontDecoration === 'line-through') {
              style.strikethrough = true;
            }
          }
        }
        const childrenNodes = element.childrenNodes();
        for (const child of childrenNodes) {
          handle(child, style);
        }
        return style;
      };
      let text = this.isBlank() ? '' : this.text();
      let { fontAttr } = activeCell;
      let { sri, sci } = selectRange;
      let { snapshot } = table;
      let cells = table.getTableCells();
      let style = handle(this, {});
      let notAllowStyle = fontAttr.like(style);
      let notAllowText = text === format;
      let allowStyle = !notAllowText || !notAllowStyle;
      if (allowStyle) {
        const cloneCell = activeCell.clone();
        const { fontAttr } = cloneCell;
        snapshot.open();
        cloneCell.fontAttr = new CellFont({
          ...fontAttr,
          ...style,
        });
        cloneCell.setText(text);
        cells.setCellOrNew(sri, sci, cloneCell);
        cloneCell.setContentType(Cell.TYPE.STRING);
        snapshot.close({
          type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
        });
        table.render();
      }
    }
  }

}

export {
  TextEdit,
};
