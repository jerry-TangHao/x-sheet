/**
 * Character format matching symbol
 * ------------------------------------------------------------------------------------------------
 * format symbol     | description
 * ------------------------------------------------------------------------------------------------
 * @                 | Text placeholder
 * ------------------------------------------------------------------------------------------------
 * ,                 | a comma
 * ------------------------------------------------------------------------------------------------
 * !                 | escape symbol
 * ------------------------------------------------------------------------------------------------
 * "                 | Display any text enclosed in double quotes.
 * ------------------------------------------------------------------------------------------------
 * [red]             | font color
 * ------------------------------------------------------------------------------------------------
 * ;                 | POSITIVE; NEGATIVE; ZERO; TEXT
 * ------------------------------------------------------------------------------------------------
 * _                 | Skips the width of the next character.
 *                   | It's commonly used in combination with
 *                   | parentheses to add left and right indents,
 *                   | _( and _) respectively.
 * ------------------------------------------------------------------------------------------------
 * *                 | Repeats the character that follows it until the width of the cell is filled.
 *                   | It's often used in combination with the space character to change alignment.
 * ------------------------------------------------------------------------------------------------
 * +                 | In addition, the following characters can be included in
 * _                 | Excel custom format codes without the use of backslash
 * ()                | or quotation marks:
 * :                 |
 * ^                 |
 * '                 |
 * {}                |
 * <>                |
 * =                 |
 * /                 |
 * &                 |
 * ~                 |
 * ------------------------------------------------------------------------------------------------
 */
class ParserCharacter {

  constructor({
    value, format,
  }) {
    this.value = value;
    this.format = format;
  }

  symbol() {
    let { format } = this;
    let { length } = format;
    let current = 0;
    while (current < length) {
      let charAt = format.charAt(current);
      switch (charAt) {
        case '+':
        case '-':
        case '(':
        case ')':
        case ':':
        case '{':
        case '}':
        case '<':
        case '>':
        case '/':
        case '&':
        case '~':
        case '^': {
          break;
        }
        case '@': {
          break;
        }
        case ',': {
          break;
        }
        case '!': {
          break;
        }
        case '"': {
          break;
        }
        case '[': {
          break;
        }
        case ']': {
          break;
        }
        case ';': {
          break;
        }
        case '_': {
          break;
        }
        case '*': {
          break;
        }
      }
    }
  }

  patten() {}

}

export {
  ParserCharacter,
};
