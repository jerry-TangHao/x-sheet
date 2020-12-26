class BaseRuler {

  constructor({ draw }) {
    this.draw = draw;
  }

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
