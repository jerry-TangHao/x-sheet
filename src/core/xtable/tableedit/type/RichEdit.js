import { XDraw } from '../../../../draw/XDraw';
import { StyleEdit } from '../base/StyleEdit';
import { Cell } from '../../tablecell/Cell';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { Constant } from '../../../../const/Constant';
import { BaseFont } from '../../../../draw/font/BaseFont';
import { RichFont } from '../../tablecell/RichFont';
import { RichFonts } from '../../tablecell/RichFonts';

/**
 * RichEdit
 */
class RichEdit extends StyleEdit {

  /**
   * 富文本转Html
   * @constructor
   */
  richTextToHtml() {
    let { activeCell } = this;
    let { background, fontAttr } = activeCell;
    let { align, size, color } = fontAttr;
    let { bold, italic, name } = fontAttr;
    let richFonts = activeCell.getComputeText();
    let textAlign = 'left';
    let fontSize = XDraw.cssPx(size);
    let items = [];
    richFonts.getRich().forEach((font) => {
      let { text, name, size, bold, italic } = font;
      let { color, underline, strikethrough } = font;
      let item = text.replace(/\n/g, '<br/>');
      if (name) {
        item = `<font face="${name}">${item}</font>`;
      }
      if (size) {
        switch (size) {
          case 10: {
            item = `<font size="${1}">${item}</font>`;
            break;
          }
          case 13: {
            item = `<font size="${2}">${item}</font>`;
            break;
          }
          case 16: {
            item = `<font size="${3}">${item}</font>`;
            break;
          }
          case 18: {
            item = `<font size="${4}">${item}</font>`;
            break;
          }
          case 24: {
            item = `<font size="${5}">${item}</font>`;
            break;
          }
          case 32: {
            item = `<font size="${6}">${item}</font>`;
            break;
          }
          case 48: {
            item = `<font size="${7}">${item}</font>`;
            break;
          }
        }
      }
      if (bold) {
        item = `<b>${item}</b>`;
      }
      if (italic) {
        item = `<i>${item}</i>`;
      }
      if (color) {
        item = `<font color="${color}">${item}</font>`;
      }
      if (underline) {
        item = `<u>${item}</u>`;
      }
      if (strikethrough) {
        item = `<strike>${item}</strike>`;
      }
      items.push(item);
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
    let style = SheetUtils.clearBlank(`
      text-align:${textAlign};
      color: ${color};
      background:${background};
      font-style: ${italic ? 'italic' : 'initial'};
      font-weight: ${bold ? 'bold' : 'initial'};
      font-size: ${fontSize}px;
      font-family: ${name};
    `);
    let html = items.join('');
    this.html(html).style(style);
  }

  /**
   * Html转富文本
   * @constructor
   */
  htmlToRichText() {
    const { activeCell } = this;
    const { table } = this;
    const { selectRange } = this;
    const { sri, sci } = selectRange;
    const { snapshot } = table;
    const cloneCell = activeCell.clone();
    const cells = table.getTableCells();
    const collect = [];
    const handle = (element, parent) => {
      const tagName = element.tagName();
      const style = { ...parent };
      if (element.isTextNode()) {
        collect.push(new RichFont({

          text: element.nodeValue(),
          ...style,

        }));
        return;
      }
      if (element.isBreakNode()) {
        collect.push(new RichFont({
          text: '\n',
        }));
        return;
      }
      if (!element.equals(this)) {
        switch (tagName) {
          case 'u': {
            style.underline = true;
            break;
          }
          case 'i': {
            style.italic = true;
            break;
          }
          case 'b': {
            style.bold = true;
            break;
          }
          case 'font': {
            const size = element.attr('size');
            const name = element.attr('name');
            const color = element.attr('color');
            if (size) {
              switch (size) {
                case '1': {
                  style.size = 10;
                  break;
                }
                case '2': {
                  style.size = 13;
                  break;
                }
                case '3': {
                  style.size = 16;
                  break;
                }
                case '4': {
                  style.size = 18;
                  break;
                }
                case '5': {
                  style.size = 24;
                  break;
                }
                case '6': {
                  style.size = 32;
                  break;
                }
                case '7': {
                  style.size = 48;
                  break;
                }
              }
            }
            if (name) {
              style.name = name;
            }
            if (color) {
              style.color = color;
            }
            break;
          }
          case 'strike': {
            style.strikethrough = true;
            break;
          }
        }
      }
      const children = element.children();
      for (const child of children) {
        handle(child, style);
      }
    };
    handle(this, {});
    const rich = new RichFonts({
      rich: collect,
    });
    if (!rich.equals(activeCell.rich)) {
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

  /**
   * 检查输入的是否为富文本
   */
  checkedRichText() {
    const patten = /<i>|<b>|<u>|<font.*>/;
    const html = this.html();
    return patten.test(html);
  }

}

export {
  RichEdit,
};
