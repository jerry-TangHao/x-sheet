import { AngleBoxRuler } from './AngleBoxRuler';
import { BaseFont } from '../BaseFont';

class AngleBarRuler extends AngleBoxRuler {

  equals(other) {
    if (other === null) {
      return false;
    }
    if (other.constructor !== AngleBarRuler) {
      return false;
    }
    if (other.text !== this.text) {
      return false;
    }
    if (other.size !== this.size) {
      return false;
    }
    if (other.angle !== this.angle) {
      return false;
    }
    if (other.align !== this.align) {
      return false;
    }
    if (other.verticalAlign !== this.verticalAlign) {
      return false;
    }
    if (other.textWrap !== this.textWrap) {
      return false;
    }
    if (other.padding !== this.padding) {
      return false;
    }
    switch (this.textWrap) {
      case BaseFont.TEXT_WRAP.TRUNCATE: {
        const notWidth = other.rect.width !== this.rect.width;
        const notHeight = other.rect.height !== this.rect.height;
        if (notWidth || notHeight) {
          return false;
        }
        break;
      }
      case BaseFont.TEXT_WRAP.OVER_FLOW: {
        const notWidth = other.overflow.width !== this.overflow.width;
        const notHeight = other.overflow.height !== this.overflow.height;
        if (notWidth || notHeight) {
          return false;
        }
        break;
      }
      case BaseFont.TEXT_WRAP.WORD_WRAP: {
        if (other.lineHeight !== this.lineHeight) {
          return false;
        }
        break;
      }
    }
    return true;
  }

}

export {
  AngleBarRuler,
};
