import { RichFont } from './RichFont';

class RichFonts {

  constructor({
    fonts = [],
  }) {
    this.fonts = fonts.map(font => new RichFont(font));
  }

  clone() {
    const fonts = [];
    this.fonts.forEach((font) => {
      fonts.push(font.clone());
    });
    return new RichFont({
      fonts,
    });
  }

  plain(option) {
    const result = [];
    this.fonts.forEach((font) => {
      result.push(font.plain(option));
    });
    return result;
  }

}

export {
  RichFonts,
};
