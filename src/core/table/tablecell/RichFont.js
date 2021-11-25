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
    this.color = color;
    this.text = `${text}`;
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

  like(other) {
    let ignore = ['scaleAdapter'];
    let keys1 = Object.keys(this);
    let keys2 = Object.keys(other);
    for (let key of keys2) {
      if (ignore.includes(key)) {
        continue;
      }
      if (!keys1.includes(key)) {
        return false;
      }
    }
    for (let key of keys2) {
      if (ignore.includes(key)) {
        continue;
      }
      let src = this[key];
      let val = other[key];
      switch (key) {
        case 'color': {
          src = SheetUtils.clearBlank(src);
          val = SheetUtils.clearBlank(val);
          break;
        }
      }
      if (src !== val) {
        return false;
      }
    }
    return true;
  }

  equals(other) {
    let ignore = ['scaleAdapter'];
    let keys1 = Object.keys(this);
    let keys2 = Object.keys(other);
    for (let key of keys1) {
      if (ignore.includes(key)) {
        continue;
      }
      if (!keys2.includes(key)) {
        return false;
      }
    }
    for (let key of keys1) {
      if (ignore.includes(key)) {
        continue;
      }
      let src = this[key];
      let val = other[key];
      switch (key) {
        case 'color': {
          src = SheetUtils.clearBlank(src);
          val = SheetUtils.clearBlank(val);
          break;
        }
      }
      if (src !== val) {
        return false;
      }
    }
    return true;
  }

}

export {
  RichFont,
};
