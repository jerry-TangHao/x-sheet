import { BaseFont } from '../BaseFont';

class BaseText extends BaseFont {

  isBlank(text) {
    return text === null || text === undefined || text.toString().trim() === '';
  }

  hasBreak(text) {
    return text.indexOf('\n') > -1;
  }

}

export {
  BaseText,
};
