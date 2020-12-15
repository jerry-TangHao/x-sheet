
const SCROLL_TYPE = {
  H_LEFT: Symbol('水平方向左边滚动条'),
  H_RIGHT: Symbol('水平方向向右边滚动'),
  V_TOP: Symbol('垂直方向向上滚动'),
  V_BOTTOM: Symbol('垂直方向下滚动'),
  UN: Symbol('未知'),
};

class Scroll {

  constructor({
    xFixedView,
  }) {
    const fixedView = xFixedView.getFixedView();
    this.ri = fixedView.eri + 1;
    this.ci = fixedView.eci + 1;
    this.x = 0;
    this.y = 0;
    this.type = SCROLL_TYPE.UN;
  }
}

export {
  Scroll, SCROLL_TYPE,
};
