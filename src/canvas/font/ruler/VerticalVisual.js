import { PlainRuler } from '../PlainRuler';
import { BaseFont } from '../BaseFont';

class VerticalVisual extends PlainRuler {

  constructor({
    draw, text, verticalAlign, padding,
  }) {
    super({ draw, text });
    this.verticalAlign = verticalAlign;
    this.padding = padding;
  }

  getVerticalAlignPadding() {
    if (this.verticalAlign === BaseFont.VERTICAL_ALIGN.center) {
      return 0;
    }
    return this.padding;
  }

}

export {
  VerticalVisual,
};
