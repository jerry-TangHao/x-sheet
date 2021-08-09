import { SheetUtils } from '../../../utils/SheetUtils';

class RichFont {

  constructor({
    text, color, name, size,
    italic, bold, underline,
    strikethrough, scaleAdapter,
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
