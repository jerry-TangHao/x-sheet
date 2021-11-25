import { SheetUtils } from '../../utils/SheetUtils';
import { DateUtils } from '../../utils/DateUtils';

class Format {

  default(value) {
    return this.text(value);
  }

  text(value) {
    return value ? `${value}` : '';
  }

  // =============================数字==============================

  number(value) {
    return this.text(value);
  }

  fraction(value) {
    if (SheetUtils.isFraction(value)) {
      const left = value.split('/')[0];
      const right = value.split('/')[1];
      return this.text(SheetUtils.parseInt(left) / SheetUtils.parseInt(right));
    }
    return this.text(value);
  }

  eNotation(value) {
    if (SheetUtils.isNumber(value)) {
      const number = SheetUtils.parseFloat(value);
      return number.toExponential(2);
    }
    return this.text(value);
  }

  decimal(value) {
    if (SheetUtils.isNumber(value)) {
      const indexOf = value.toString().indexOf('.');
      if (indexOf !== -1) {
        return value.toString().substring(0, indexOf + 3);
      }
      return `${value}.00`;
    }
    return this.text(value);
  }

  percentage(value) {
    if (SheetUtils.isNumber(value)) {
      return `${value}%`;
    }
    return this.text(value);
  }

  // =============================货币==============================

  rmb(value) {
    if (SheetUtils.isNumber(value)) {
      return `￥${value}`;
    }
    return this.text(value);
  }

  hk(value) {
    if (SheetUtils.isNumber(value)) {
      return `HK${value}`;
    }
    return this.text(value);
  }

  dollar(value) {
    if (SheetUtils.isNumber(value)) {
      return `$${value}`;
    }
    return this.text(value);
  }

  // =============================日期==============================

  time(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('hh:mm:ss', result);
    }
    return this.text(value);
  }

  date1(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('yyyy/MM/dd', result);
    }
    return this.text(value);
  }

  date2(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('MM月dd日', result);
    }
    return this.text(value);
  }

  date3(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('yyyy年MM月', result);
    }
    return this.text(value);
  }

  date4(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('yyyy年MM月dd日', result);
    }
    return this.text(value);
  }

  date5(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('yyyy/MM/dd hh:mm:ss', result);
    }
    return this.text(value);
  }

}

const format = new Format();

export default (type, value) => format[type](value);
