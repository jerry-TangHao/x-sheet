import { BaseFont } from '../../BaseFont';
import { RichRuler } from '../RichRuler';

class RichHorizonVisual extends RichRuler {

  constructor({
    draw, rich,
    align, padding,
  }) {
    super({ draw, rich });
    this.align = align;
    this.padding = padding;
  }

  getAlignPadding() {
    const { align, padding } = this;
    switch (align) {
      case BaseFont.ALIGN.center:
        return 0;
    }
    return padding;
  }

}

export {
  RichHorizonVisual,
};
