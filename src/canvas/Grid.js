import { SolidLine } from './Line';

class Grid {

  constructor(draw, attr = {}) {
    this.solidLine = new SolidLine(draw, attr);
  }

  horizonLine(sx, sy, ex, ey) {
    const { solidLine } = this;
    solidLine.horizonLine(sx, sy, ex, ey);
  }

  verticalLine(sx, sy, ex, ey) {
    const { solidLine } = this;
    solidLine.verticalLine(sx, sy, ex, ey);
  }
}

export { Grid };
