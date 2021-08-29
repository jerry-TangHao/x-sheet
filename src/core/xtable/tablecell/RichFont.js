import { SheetUtils } from '../../../utils/SheetUtils';
import { ColorArray } from '../../../module/colorpicker/colorarray/ColorArray';

class RichFont {

  constructor({
    text = '',
    color = ColorArray.BLACK,
    name = 'Arial',
    size = 14,
    bold = false,
    italic = false,
    strikethrough = false,
    underline = false,
    scaleAdapter,
  } = {}) {
    this.text = text;
    this.color = color;
    this.name = name;
    this.size = size;
    this.italic = italic;
    this.bold = bold;
    this.strikethrough = strikethrough;
    this.underline = underline;
    this.scaleAdapter = scaleAdapter;
  }

  clone() {
    const { text, color, name, size } = this;
    const { italic, bold, underline } = this;
    const { strikethrough, scaleAdapter } = this;
    return new RichFont({
      text, color, name, size, italic, bold, underline, strikethrough, scaleAdapter,
    });
  }

  reset() {
    this.color = ColorArray.BLACK;
    this.name = 'Arial';
    this.size = 14;
    this.bold = false;
    this.italic = false;
    this.strikethrough = false;
    this.underline = false;
  }

  plain(option = v => v) {
    return option(this.clone());
  }

  equals(other) {
    if (SheetUtils.isUnDef(other)) {
      return false;
    }
    if (other.text !== this.text) {
      return false;
    }
    if (other.color !== this.color) {
      return false;
    }
    if (other.name !== this.name) {
      return false;
    }
    if (other.size !== this.size) {
      return false;
    }
    if (other.italic !== this.italic) {
      return false;
    }
    if (other.bold !== this.bold) {
      return false;
    }
    if (other.strikethrough !== this.strikethrough) {
      return false;
    }
    return other.underline === this.underline;
  }

}

export {
  RichFont,
};
