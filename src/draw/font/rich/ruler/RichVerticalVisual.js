import { RichRuler } from '../RichRuler';
import { BaseFont } from '../../BaseFont';

class RichVerticalVisual extends RichRuler {

  constructor({
    draw, rich,
    verticalAlign, padding,
  }) {
    super({ draw, rich });
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
  RichVerticalVisual,
};
