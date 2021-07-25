import { XDraw } from '../../../canvas/XDraw';
import { PlainUtils } from '../../../utils/PlainUtils';

/**
 * WideUnit
 */
class WideUnit {

  /**
   * WideUnit
   * @param table
   * @param unit
   * @param fontName
   * @param fontSize
   * @param fontBold
   * @param fontItalic
   */
  constructor({
    table = null,
    unit = null,
    fontName = 'Arial',
    fontSize = 10,
    fontBold = false,
    fontItalic = false,
  } = {}) {
    if (PlainUtils.isNotUnDef(unit)) {
      this.unit = unit;
    } else {
      const { draw, heightUnit } = table;
      // 字体像素
      const fontPixel = heightUnit.getPixel(fontSize);
      const srcPixel = XDraw.srcPx(fontPixel);
      const sizePixel = XDraw.trunc(srcPixel);
      // 字体样式
      const bold = `${fontBold ? 'bold' : ''}`;
      const italic = `${fontItalic ? 'italic' : ''}`;
      const style = `${italic} ${bold} ${sizePixel}px ${fontName}`;
      // 度量字体
      draw.save();
      draw.attr({
        font: style.trim(),
      });
      let unit = 0;
      for (let i = 0; i < 10; i++) {
        const { width } = draw.measureText(i.toString());
        if (width > unit) {
          unit = width;
        }
      }
      draw.restore();
      this.unit = unit;
      // Firefox 好像不准确😓
      const { type } = PlainUtils.getExplorerInfo();
      switch (type) {
        case 'Firefox':
          this.unit = XDraw.trunc(unit) + 0.22;
          break;
        case 'Chrome':
          this.unit = unit;
          break;
      }
    }
  }

  /**
   * 获取当前测量单位
   * @returns {*}
   */
  getUnit() {
    return this.unit;
  }

  /**
   * 获取字符运行时像素
   * @param nb 字符数
   */
  getNumberPixel(nb) {
    return this.getWidePixel(this.getNumberWide(nb));
  }

  /**
   * 获取宽度运行时像素
   * @param wide 列宽
   * @returns {number}
   * @see https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.column?redirectedfrom=MSDN&view=openxml-2.8.1
   */
  getWidePixel(wide) {
    return XDraw.trunc(((256 * wide + XDraw.trunc(128 / this.unit)) / 256) * this.unit);
  }

  /**
   * 获取字符宽度
   * @param nb 字符数
   * @see https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.column?redirectedfrom=MSDN&view=openxml-2.8.1
   */
  getNumberWide(nb) {
    return XDraw.trunc([nb * this.unit + 5] / this.unit * 256) / 256;
  }

  /**
   * 获取像素对应的字符数
   * @param pixel
   * @returns {number}
   * @see https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.column?redirectedfrom=MSDN&view=openxml-2.8.1
   */
  getPixelNumber(pixel) {
    return XDraw.trunc((pixel - 5) / this.unit * 100 + 0.5) / 100;
  }

}

export {
  WideUnit,
};
