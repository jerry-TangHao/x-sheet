import { XDraw } from '../../../canvas/XDraw';

/**
 * WideUnit
 */
class WideUnit {

  /**
   * WideUnit
   * @param table
   * @param fontName
   * @param fontSize
   * @param fontBold
   * @param fontItalic
   */
  constructor(table, {
    fontName = 'Arial',
    fontSize = 10,
    fontBold = false,
    fontItalic = false,
  } = {}) {
    const { draw, heightUnit } = table;
    // 字体像素
    const devPixel = heightUnit.getPixel(fontSize);
    const cssPixel = XDraw.srcPx(devPixel);
    // 字体样式
    const name = `${fontName}`;
    const size = XDraw.round(cssPixel);
    const bold = `${fontBold ? 'bold' : ''}`;
    const italic = `${fontItalic ? 'italic' : ''}`;
    const style = `${italic} ${bold} ${size}px ${name}`;
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
    this.unit = unit;
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
