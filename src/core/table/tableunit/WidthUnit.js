/**
 * 宽度单位
 */
class WidthUnit {

  /**
   * 宽度单位
   * @param table
   * @param fontName
   * @param wordSize
   * @param fontBold
   * @param fontItalic
   */
  constructor(table, {
    fontName = 'Arial',
    wordSize = 10,
    fontBold = false,
    fontItalic = false,
  } = {}) {
    const { draw, heightUnit } = table;
    const size = heightUnit.getPixel(wordSize);
    const name = `${fontName}`;
    const italic = `${fontItalic ? 'italic' : ''}`;
    const bold = `${fontBold ? 'bold' : ''}`;
    const fontStyle = `${italic} ${bold} ${size}px ${name}`;
    draw.save();
    draw.attr({
      font: fontStyle.trim(),
    });
    const standard = '0123456789';
    const measure = draw.measureText(standard);
    const standardWidth = measure.width;
    const standardCount = standard.length;
    this.unit = standardWidth / standardCount;
    draw.restore();
  }

  /**
   * 字符数转像素
   * @param nb
   * @return {number}
   */
  getPixel(nb) {
    return nb * this.unit;
  }

  /**
   * 像素转字符数
   * @param px
   * @return {number}
   */
  getNumber(px) {
    return px / this.unit;
  }

}

export {
  WidthUnit,
};
