import { PlainUtils } from '../../../utils/PlainUtils';
import { CellFont } from './CellFont';
import { CellBorder } from './CellBorder';
import { XIcon } from '../xicon/XIcon';
import XTableFormat from '../XTableFormat';
import { RichFonts } from './RichFonts';

/**
 * Cell
 * @author jerry
 */
class Cell {

  /**
   * Cell
   * @param text
   * @param readOnly
   * @param background
   * @param format
   * @param ruler
   * @param fontAttr
   * @param borderAttr
   * @param icons
   * @param contentWidth
   * @param contentType
   * @param custom
   */
  constructor({
    text = PlainUtils.EMPTY,
    readOnly = false,
    background = PlainUtils.Nul,
    format = 'default',
    ruler = null,
    fontAttr = {},
    borderAttr = {},
    icons = [],
    contentWidth = 0,
    contentType = Cell.CONTENT_TYPE.STRING,
    custom = {},
  } = {}) {
    this.ruler = ruler;
    this.readOnly = readOnly;
    this.text = text;
    this.background = background;
    this.format = format;
    this.custom = custom;
    this.contentWidth = contentWidth;
    this.contentType = contentType;
    this.icons = XIcon.newInstances(icons);
    this.borderAttr = new CellBorder(borderAttr);
    this.fontAttr = new CellFont(fontAttr);
    this.setContentType(contentType);
    this.setFormat(format);
  }

  setContentWidth(contentWidth) {
    this.contentWidth = contentWidth;
  }

  setFontAttr(fontAttr) {
    this.fontAttr = fontAttr;
  }

  getFormatText() {
    let { format, text, contentType } = this;
    switch (contentType) {
      case Cell.CONTENT_TYPE.RICH_TEXT: {
        return text;
      }
      case Cell.CONTENT_TYPE.DATE: {
        if (format === 'default') {
          format = 'date1';
        }
        return XTableFormat(format, text);
      }
      case Cell.CONTENT_TYPE.STRING: {
        return XTableFormat(format, text);
      }
      case Cell.CONTENT_TYPE.NUMBER: {
        const number = XTableFormat(format, text);
        return number.toString();
      }
    }
    return PlainUtils.EMPTY;
  }

  setIcons(icons) {
    this.icons = icons;
  }

  setContentType(type) {
    this.contentType = type;
    this.convert(this.text);
  }

  convert(text) {
    if (PlainUtils.isBlank(text)) {
      this.contentType = Cell.CONTENT_TYPE.STRING;
      this.format = 'default';
      this.text = PlainUtils.EMPTY;
    } else {
      const { contentType } = this;
      switch (contentType) {
        case Cell.CONTENT_TYPE.NUMBER: {
          this.text = PlainUtils.parseFloat(text);
          break;
        }
        case Cell.CONTENT_TYPE.STRING: {
          this.text = text.toString();
          break;
        }
        case Cell.CONTENT_TYPE.RICH_TEXT: {
          this.text = new RichFonts(text);
          break;
        }
      }
    }
  }

  isEmpty() {
    return PlainUtils.isBlank(this.text);
  }

  isReadOnly() {
    return this.readOnly;
  }

  setText(text) {
    this.convert(text);
    this.setContentWidth(0);
  }

  setRuler(ruler) {
    this.ruler = ruler;
  }

  setFormat(format) {
    this.format = format;
    switch (format) {
      case 'decimal':
      case 'eNotation':
      case 'percentage':
      case 'rmb':
      case 'hk':
      case 'dollar':
      case 'number':
        this.setContentType(Cell.CONTENT_TYPE.NUMBER);
        break;
    }
  }

  setBorderAttr(borderAttr) {
    this.borderAttr = borderAttr;
  }

  clone() {
    const {
      background, format, text, fontAttr,
      borderAttr, contentWidth, icons,
      contentType, custom,
    } = this;
    return new Cell({
      background,
      format,
      text,
      fontAttr,
      borderAttr,
      contentWidth,
      icons,
      contentType,
      custom,
    });
  }

  toString() {
    let { format, text, contentType } = this;
    switch (contentType) {
      case Cell.CONTENT_TYPE.NUMBER:
      case Cell.CONTENT_TYPE.STRING: {
        return text;
      }
      case Cell.CONTENT_TYPE.DATE: {
        if (format === 'default') {
          format = 'date1';
        }
        return XTableFormat(format, text);
      }
      case Cell.CONTENT_TYPE.RICH_TEXT: {
        return PlainUtils.EMPTY;
      }
    }
    return PlainUtils.EMPTY;
  }

  toJSON() {
    const {
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    } = this;
    return {
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    };
  }

}

Cell.CONTENT_TYPE = {
  NUMBER: 0,
  STRING: 1,
  RICH_TEXT: 2,
  DATE: 3,
};

export {
  Cell,
};
