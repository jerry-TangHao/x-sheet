import { RichFont } from './RichFont';
import { SheetUtils } from '../../../utils/SheetUtils';

class RichFonts {

  constructor({
    rich = [],
  } = {}) {
    this.rich = rich.map(font => new RichFont(font));
  }

  setRich(rich = []) {
    this.rich = rich;
  }

  getRich() {
    return this.rich;
  }

  clone() {
    const rich = [];
    this.rich.forEach((font) => {
      rich.push(font.clone());
    });
    return new RichFonts({
      rich,
    });
  }

  reset() {
    this.each((i) => {
      i.reset();
    });
  }

  hasLength() {
    return this.rich.length > 0;
  }

  each(cb = () => {}) {
    this.rich.forEach((font) => {
      cb(font);
    });
  }

  plain(option) {
    const result = [];
    this.rich.forEach((font) => {
      result.push(font.plain(option));
    });
    return result;
  }

  equals(other) {
    if (SheetUtils.isUnDef(other)) {
      return false;
    }
    if (other.rich.length !== this.rich.length) {
      return false;
    }
    for (let i = 0; i < this.rich.length; i++) {
      let item1 = this.rich[i];
      let item2 = other.rich[i];
      if (!item1.equals(item2)) {
        return false;
      }
    }
    return true;
  }

}

export {
  RichFonts,
};
