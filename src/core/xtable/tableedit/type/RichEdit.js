import { StyleEdit } from '../base/StyleEdit';
import { Cell } from '../../tablecell/Cell';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { Constant } from '../../../../const/Constant';
import { BaseFont } from '../../../../draw/font/BaseFont';
import { RichFont } from '../../tablecell/RichFont';
import { RichFonts } from '../../tablecell/RichFonts';
import { DomUtils } from '../../../../utils/DomUtils';

class RichEdit extends StyleEdit {

  /**
   * 富文本转Html
   * @constructor
   */
  richTextToHtml() {
    let { activeCell } = this;
    if (activeCell) {
      let { background } = activeCell;
      let { fontAttr } = activeCell;
      let { align } = fontAttr;
      let richFonts = activeCell.getComputeText();
      let textAlign = 'left';
      let items = [];
      let rich = richFonts.getRich();
      if (rich.length === 0) {
        rich = [new RichFont()];
      }
      rich.forEach((font) => {
        let { text, name, size, bold, italic } = font;
        let { color, underline, strikethrough } = font;
        let wrap = text.replace(/\n/g, '<br/>') || '<br/>';
        if (name) {
          wrap = `<span style="font-family: ${name}">${wrap}</span>`;
        }
        if (size) {
          wrap = `<span style="font-size: ${size}px">${wrap}</span>`;
        }
        if (bold) {
          wrap = `<span style="font-weight: bold">${wrap}</span>`;
        }
        if (italic) {
          wrap = `<span style="font-style: italic">${wrap}</span>`;
        }
        if (color) {
          wrap = `<span style="color: ${color}">${wrap}</span>`;
        }
        if (underline) {
          wrap = `<span style="text-decoration: underline">${wrap}</span>`;
        }
        if (strikethrough) {
          wrap = `<span style="text-decoration: line-through">${wrap}</span>`;
        }
        items.push(wrap);
      });
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
      let html = items.join('');
      this.html(html).style(SheetUtils.clearBlank(`
        text-align:${textAlign};
        background:${background};
      `));
    }
  }

  /**
   * Html转富文本
   * @constructor
   */
  htmlToRichText() {
    const { activeCell } = this;
    const handle = (element, parent, collect) => {
      const style = { ...parent };
      if (element.isTextNode()) {
        collect.push(new RichFont({
          text: element.text(),
          ...style,
        }));
        return collect;
      }
      if (element.isBreakNode()) {
        collect.push(new RichFont({
          text: '\n',
        }));
        return collect;
      }
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
          style.fontFamily = fontFamily;
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
        handle(child, style, collect);
      }
      return collect;
    };
    if (activeCell) {
      const { selectRange } = this;
      const { table } = this;
      const { sri, sci } = selectRange;
      const { snapshot } = table;
      const cloneCell = activeCell.clone();
      const cells = table.getTableCells();
      const collect = handle(this, {}, []);
      const richText = new RichFonts({
        rich: collect,
      });
      if (!richText.equals(activeCell.rich)) {
        snapshot.open();
        cloneCell.setContentType(Cell.TYPE.RICH_TEXT);
        cloneCell.setRichText(collect);
        cells.setCellOrNew(sri, sci, cloneCell);
        snapshot.close({
          type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
        });
        table.render();
      }
    }
  }

  /**
   * 检查输入的是否为富文本
   */
  checkedRichText() {
    let count = 0;
    let handle = (ele) => {
      if (ele.hasChild()) {
        ele.childrenNodes().forEach(i => handle(i));
      }
      if (ele.isTextNode()) {
        count++;
      }
    };
    handle(this);
    return count > 1;
  }

}

export {
  RichEdit,
};
