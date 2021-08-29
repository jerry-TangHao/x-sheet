import { BaseRuler } from '../BaseRuler';

class TextRuler extends BaseRuler {

  constructor({
    draw, text,
  }) {
    super({ draw });
    this.text = text;
    if (this.isBlank()) {
      this.setUsedType(BaseRuler.USED.EMPTY_TEXT);
    }
  }

  isBlank() {
    const { text } = this;
    return text === null || text === undefined || text.toString() === '';
  }

  hasBreak() {
    const { text } = this;
    return text.indexOf('\n') > -1;
  }

  textBreak() {
    const { text } = this;
    return text.split(/\n/);
  }

}

export {
  TextRuler,
};
