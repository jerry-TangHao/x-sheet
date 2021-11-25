import { ParserDateTime } from './ParserDateTime';
import { ParserNumeral } from './ParserNumeral';
import { ParserCharacter } from './ParserCharacter';

class Parser {

  constructor() {
    this.dateTimeParse = new ParserDateTime();
    this.numeralParse = new ParserNumeral();
    this.characterParse = new ParserCharacter();
  }

  parse() {
  }

}

Parser.MONTH = [
  ['J', 'Jan', 'January'],
  ['F', 'Feb', 'February'],
  ['M', 'Mar', 'March'],
  ['A', 'Apr', 'April'],
  ['M', 'May', 'May'],
  ['J', 'Jun', 'June'],
  ['J', 'Jul', 'July'],
  ['A', 'Aug', 'August'],
  ['S', 'Sep', 'September'],
  ['O', 'Oct', 'October'],
  ['N', 'Nov', 'November'],
  ['D', 'Dec', 'December'],
];
Parser.DAY = [
  ['Sun', 'Sunday'],
  ['Mon', 'Monday'],
  ['Tue', 'Tuesday'],
  ['Wed', 'Wednesday'],
  ['Thu', 'Thursday'],
  ['Fri', 'Friday'],
  ['Sat', 'Saturday'],
];
Parser.COLOR = [
  'Black',
  'Green',
  'White',
  'Red',
  'Cyan',
  'Blue',
  'Magenta',
  'Yellow',
];
Parser.FORMAT = [
  'General',
  '0',
  '0.00',
  '#,##0',
  '#,##0.00',
  '0%',
  '0.00%',
  '0.00E+00',
  '# ?/?',
  '# ??/??',
  'm/d/yy',
  'd-mmm-yy',
  'd-mmm',
  'mmm-yy',
  'h:mm AM/PM',
  'h:mm:ss AM/PM',
  'h:mm',
  'h:mm:ss',
  'm/d/yy h:mm',
  '#,##0 ,(#,##0)',
  '#,##0 ,[Red](#,##0)',
  '#,##0.00,(#,##0.00)',
  '#,##0.00,[Red](#,##0.00)',
  'mm:ss',
  '[h]:mm:ss',
  'mmss.0',
  '##0.0E+0',
  '@',
  '"上午/下午 "hh"時"mm"分"ss"秒 "',
];

export {
  Parser,
};
