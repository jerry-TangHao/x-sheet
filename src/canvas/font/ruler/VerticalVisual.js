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
    const { verticalAlign, padding } = this;
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.center:
        return 0;
    }
    return padding;
  }

}

export {
  VerticalVisual,
};
