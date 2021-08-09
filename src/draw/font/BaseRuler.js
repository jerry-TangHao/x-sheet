class BaseRuler {

  constructor({ draw }) {
    this.draw = draw;
    this.used = BaseRuler.USED.DEFAULT_INI;
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

  // 标记已经使用
  setUsedType(type) {
    this.used = type;
    this.draw = null;
  }

}

BaseRuler.USED = {
  DEFAULT_INI: 0,
  TRUNCATE: 1,
  OVER_FLOW: 2,
  TEXT_WRAP: 3,
  EMPTY_TEXT: 4,
};

export {
  BaseRuler,
};
