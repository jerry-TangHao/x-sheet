import { BaseRuler } from './BaseRuler';

class PlainRuler extends BaseRuler {

  constructor({
    draw, text,
  }) {
    super({ draw });
    this.text = text;
  }

  textBreak() {
    const { text } = this;
    return text.split(/\n/);
  }

  isBlank() {
    const { text } = this;
    return text === null || text === undefined || text.toString().trim() === '';
  }

  hasBreak() {
    const { text } = this;
    return text.indexOf('\n') > -1;
  }

}

export {
  PlainRuler,
};
