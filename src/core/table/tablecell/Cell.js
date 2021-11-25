import { SheetUtils } from '../../../utils/SheetUtils';
import { CellFont } from './CellFont';
import { CellBorder } from './CellBorder';
import { XIcon } from '../tableicon/XIcon';
import XTableFormat from '../XTableTextFormat';
import { RichFonts } from './RichFonts';
import { Formula } from '../../../formula/Formula';
import { DateUtils } from '../../../utils/DateUtils';
import { BaseFont } from '../../../draw/font/BaseFont';

/**
 * 单元格
 */
class Cell {

  /**
   * Cell
   * @param borderAttr
   * @param fontAttr
   * @param richText
   * @param formula
   * @param background
   * @param text
   * @param ruler
   * @param contentWidth
   * @param contentHeight
   * @param format
   * @param custom
   * @param icons
   * @param contentType
   */
  constructor({
    borderAttr = SheetUtils.Undef,
    fontAttr = SheetUtils.Undef,
    richText = SheetUtils.Undef,
    formula = SheetUtils.Undef,
    background = SheetUtils.Undef,
    text = SheetUtils.EMPTY,
    custom = {},
    icons = [],
    ruler = SheetUtils.Undef,
    contentWidth = 0,
    contentHeight = 0,
    format = 'default',
    contentType = Cell.TYPE.STRING,
  } = {}) {
    // 背景颜色
    this.background = background;
    // 单元格图标
    this.icons = XIcon.getInstance(icons);
    // 自定义属性
    this.custom = custom;
    // 字体测量尺子
    this.ruler = ruler;
    // 格式化类型
    this.format = format;
    // 单元格公式
    this.formula = Formula.getInstance(formula);
    // 文本内容
    this.text = text;
    // 富文本内容
    this.richText = RichFonts.getInstance(richText);
    // 格式化后的内容
    this.formatText = SheetUtils.EMPTY;
    // 内容的宽度
    this.contentWidth = contentWidth;
    // 内容的高度
    this.contentHeight = contentHeight;
    // 字体属性
    this.fontAttr = CellFont.getInstance(fontAttr);
    // 边框属性
    this.borderAttr = CellBorder.getInstance(borderAttr);
    // 内容类型
    this.setContentType(contentType);
  }

  /**
   * 设置单元格小图标
   * @param icons
   */
  setIcons(icons) {
    this.icons = icons;
    return this;
  }

  /**
   * 设置内容文本
   * @param text
   */
  setText(text) {
    this.formatText = null;
    this.text = text;
    this.formula.setExpr(null);
    this.richText.setRich([]);
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置富文本
   */
  setRichText(rich) {
    this.formatText = null;
    this.text = null;
    this.formula.setExpr(null);
    this.richText.setRich(rich);
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置公式
   */
  setExpr(expr) {
    this.formatText = null;
    this.text = null;
    this.formula.setExpr(expr);
    this.richText.setRich([]);
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 获取公式
   */
  getExpr() {
    return this.formula.getExpr();
  }

  /**
   * 设置格式化类型
   * @param format
   */
  setFormat(format = 'default') {
    this.format = format;
    this.formatText = null;
    this.clearRuler();
    this.setContentWidth(0);
    return this;
  }

  /**
   * 保存测量尺子
   * @param ruler
   */
  setRuler(ruler) {
    this.ruler = ruler;
    return this;
  }

  /**
   * 设置内容类型
   * @param type
   */
  setContentType(type = Cell.TYPE.STRING) {
    const { text } = this;
    switch (type) {
      case Cell.TYPE.STRING: {
        this.contentType = Cell.TYPE.STRING;
        break;
      }
      case Cell.TYPE.NUMBER: {
        this.contentType = type;
        if (SheetUtils.isNumber(text)) {
          this.contentType = Cell.TYPE.NUMBER;
          this.text = SheetUtils.parseFloat(text);
        } else {
          this.contentType = Cell.TYPE.STRING;
          this.text = `${text}`;
        }
        break;
      }
      case Cell.TYPE.DATE_TIME: {
        const parse = DateUtils.parse(text);
        if (SheetUtils.isDate(parse)) {
          this.contentType = Cell.TYPE.DATE_TIME;
          this.text = text;
        } else {
          this.contentType = Cell.TYPE.STRING;
          this.text = `${text}`;
        }
        break;
      }
      case Cell.TYPE.RICH_TEXT: {
        this.contentType = Cell.TYPE.RICH_TEXT;
        break;
      }
    }
    return this;
  }

  /**
   * 单元格是否为空
   * @returns {boolean}
   */
  isEmpty() {
    return SheetUtils.isBlank(this.getComputeText());
  }

  /**
   * 公式是否存在
   */
  hasFormula() {
    return this.formula.hasExpr();
  }

  /**
   * 获取格式后的文本
   * @returns {string|*}
   */
  getFormatText() {
    let {
      text,
      formula,
      format,
    } = this;
    let { formatText } = this;
    let { contentType } = this;
    // 优先获取公式值
    if (formula.hasExpr()) {
      let value = formula.getValue();
      if (value) {
        if (SheetUtils.isBlank(formatText)) {
          formatText = XTableFormat(format, value);
        }
      }
      this.formatText = formatText;
      return formatText;
    }
    // 格式化文本
    switch (contentType) {
      case Cell.TYPE.STRING:
      case Cell.TYPE.NUMBER:
      case Cell.TYPE.DATE_TIME: {
        if (format) {
          if (SheetUtils.isBlank(formatText)) {
            this.formatText = XTableFormat(format, text);
            return this.formatText;
          }
        }
        return formatText;
      }
    }
    // 默认返回
    return SheetUtils.EMPTY;
  }

  /**
   * 获取计算后的文本
   * @returns {string|*}
   */
  getComputeText() {
    let { text, formula } = this;
    let { richText } = this;
    let { contentType } = this;
    // 优先获取公式值
    if (formula.hasExpr()) {
      return formula.getValue();
    }
    // 读取不同类型
    switch (contentType) {
      case Cell.TYPE.STRING:
      case Cell.TYPE.NUMBER:
      case Cell.TYPE.DATE_TIME: {
        return text;
      }
      case Cell.TYPE.RICH_TEXT: {
        return richText;
      }
    }
    // 默认返回
    return SheetUtils.EMPTY;
  }

  /**
   * 字体属性
   * @param attr
   */
  setFontAttr(attr) {
    this.fontAttr = attr;
    return this;
  }

  /**
   * 设置边框类型
   * @param attr
   */
  setBorderAttr(attr) {
    this.borderAttr = attr;
    return this;
  }

  /**
   * 复制单元格
   * @returns {Cell}
   */
  clone() {
    return new Cell(this);
  }

  /**
   * 复制单元格样式
   * @returns {Cell}
   */
  cloneStyle() {
    return new Cell({
      borderAttr: this.borderAttr,
      fontAttr: this.fontAttr,
      background: this.background,
    });
  }

  /**
   * toJSON
   */
  toJSON() {
    const { background, text, format, custom } = this;
    const { icons, contentType, formula } = this;
    const { richText, fontAttr, borderAttr } = this;
    return {
      custom,
      richText,
      formula,
      contentType,
      text,
      icons,
      background,
      format,
      fontAttr,
      borderAttr,
    };
  }

  /**
   * toString
   * @returns {string|*}
   */
  toString() {
    return this.getFormatText();
  }

  /**
   * 内容宽度
   * @param width
   */
  setContentWidth(width) {
    this.contentWidth = width;
    return this;
  }

  /**
   * 内容宽度
   * @param height
   */
  setContentHeight(height) {
    this.contentHeight = height;
    return this;
  }

  /**
   * 设置换行类型
   * @param textWrap
   */
  setTextWrap(textWrap) {
    this.fontAttr.textWrap = textWrap;
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置字体颜色
   * @param color
   */
  setFontColor(color) {
    this.fontAttr.color = color;
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置字体颜色
   * @param color
   */
  setRichFontColor(color) {
    this.richText.each((i) => {
      i.color = color;
    });
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置字体大小
   * @param size
   */
  setFontSize(size) {
    this.fontAttr.size = size;
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置字体大小
   * @param size
   */
  setRichFontSize(size) {
    this.richText.each((i) => {
      i.size = size;
    });
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置字体加粗
   * @param bold
   */
  setFontBold(bold) {
    this.fontAttr.bold = bold;
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置字体加粗
   * @param bold
   */
  setRichFontBold(bold) {
    this.richText.each((i) => {
      i.bold = bold;
    });
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置斜体字
   * @param italic
   */
  setFontItalic(italic) {
    this.fontAttr.italic = italic;
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置斜体字
   * @param italic
   */
  setRichFontItalic(italic) {
    this.richText.each((i) => {
      i.italic = italic;
    });
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置字体名称
   * @param name
   */
  setFontName(name) {
    this.fontAttr.name = name;
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置字体名称
   * @param name
   */
  setRichFontName(name) {
    this.richText.each((i) => {
      i.name = name;
    });
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置下划线
   * @param underline
   */
  setUnderLine(underline) {
    this.fontAttr.underline = underline;
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置下划线
   * @param underline
   */
  setRichUnderLine(underline) {
    this.richText.each((i) => {
      i.underline = underline;
    });
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置删除线
   * @param strikeline
   */
  setStrikeLine(strikeline) {
    this.fontAttr.strikethrough = strikeline;
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置删除线
   * @param strikeline
   */
  setRichStrikeLine(strikeline) {
    this.richText.each((i) => {
      i.strikethrough = strikeline;
    });
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置字体旋转角度
   * @param number
   */
  setFontAngle(number) {
    if (number === 0) {
      this.fontAttr.angle = number;
      this.fontAttr.direction = BaseFont.TEXT_DIRECTION.HORIZONTAL;
    } else {
      this.borderAttr.updateMaxIndex();
      this.fontAttr.angle = number;
      this.fontAttr.direction = BaseFont.TEXT_DIRECTION.ANGLE;
    }
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置字体方向
   * @param direction
   */
  setFontDirection(direction) {
    this.fontAttr.angle = 0;
    this.fontAttr.direction = direction;
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置背景
   */
  setBackground(background) {
    this.background = background;
    return this;
  }

  /**
   * 设置字体水平对齐
   * @param align
   */
  setFontAlign(align) {
    this.fontAttr.align = align;
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

  /**
   * 设置垂直对齐
   * @param verticalAlign
   */
  setFontVerticalAlign(verticalAlign) {
    this.fontAttr.verticalAlign = verticalAlign;
    this.setRuler(null);
    this.setContentWidth(0);
    this.setContentHeight(0);
    return this;
  }

}

/**
 * 单元格类型
 */
Cell.TYPE = {
  // 数字
  NUMBER: 0,
  // 字符
  STRING: 1,
  // 富文本
  RICH_TEXT: 2,
  // 日期
  DATE_TIME: 3,
};

export {
  Cell,
};
