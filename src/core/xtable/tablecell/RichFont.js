class RichFont {

  constructor({
    text, color, name, size, italic, bold, underline, strikethrough, scaleAdapter,
  } = {}) {
    this.text = text;
    this.color = color;
    this.name = name;
    this.size = size;
    this.italic = italic;
    this.bold = bold;
    this.underline = underline;
    this.strikethrough = strikethrough;
    this.scaleAdapter = scaleAdapter;
  }

  clone() {
    const {
      text, color, name, size, italic, bold, underline, strikethrough, scaleAdapter,
    } = this;
    return new RichFont({
      text, color, name, size, italic, bold, underline, strikethrough, scaleAdapter,
    });
  }

  plain(option = v => v) {
    return option(this.clone());
  }

}

export {
  RichFont,
};
