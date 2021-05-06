class BaseRuler {

  constructor({ draw }) {
    this.draw = draw;
  }

  // 文本测量性能杀手谨慎使用
  textSize(text) {
    const { draw } = this;
    const metrics = draw.measureText(text);
    const width = metrics.width;
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    return {
      width, height, ascent: metrics.actualBoundingBoxAscent,
    };
  }

  // 文本测量性能杀手谨慎使用
  textWidth(text) {
    const { draw } = this;
    return draw.measureText(text).width;
  }

}
BaseRuler.USED = {
  DEFAULT_INI: 0,
  TRUNCATE: 1,
  OVER_FLOW: 2,
  TEXT_WRAP: 3,
};
export {
  BaseRuler,
};
