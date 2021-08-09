import { SheetUtils } from '../../utils/SheetUtils';
import { DateUtils } from '../../utils/DateUtils';

class Format {

  eNotation(value) {
    if (SheetUtils.isNumber(value)) {
      const number = SheetUtils.parseFloat(value);
      return number.toExponential(2);
    }
    return value;
  }

  default(value) {
    return value ? value.toString() : '';
  }

  text(value) {
    return value;
  }

  decimal(value) {
    if (SheetUtils.isNumber(value)) {
      const indexOf = value.toString().indexOf('.');
      if (indexOf !== -1) {
        return value.toString().substring(0, indexOf + 3);
      }
      return `${value}.00`;
    }
    return value;
  }

  number(value) {
    if (SheetUtils.isNumber(value)) {
      return SheetUtils.parseFloat(value);
    }
    return value;
  }

  percentage(value) {
    if (SheetUtils.isNumber(value)) {
      return `${value}%`;
    }
    return value;
  }

  fraction(value) {
    if (SheetUtils.isFraction(value)) {
      const left = value.split('/')[0];
      const right = value.split('/')[1];
      return SheetUtils.parseInt(left) / SheetUtils.parseInt(right);
    }
    return value;
  }

  rmb(value) {
    if (SheetUtils.isNumber(value)) {
      return `￥${value}`;
    }
    return value;
  }

  hk(value) {
    if (SheetUtils.isNumber(value)) {
      return `HK${value}`;
    }
    return value;
  }

  time(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('hh:mm:ss', result);
    }
    return value;
  }

  date1(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('yyyy/MM/dd', result);
    }
    return value;
  }

  date2(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('MM月dd日', result);
    }
    return value;
  }

  date3(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('yyyy年MM月', result);
    }
    return value;
  }

  date4(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('yyyy年MM月dd日', result);
    }
    return value;
  }

  date5(value) {
    const result = DateUtils.parse(value);
    if (result) {
      return DateUtils.dateFormat('yyyy/MM/dd hh:mm:ss', result);
    }
    return value;
  }

  dollar(value) {
    if (SheetUtils.isNumber(value)) {
      return `$${value}`;
    }
    return value;
  }

}

const format = new Format();

export default (type, value) => format[type](value);
