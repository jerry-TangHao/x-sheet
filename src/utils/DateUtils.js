class DateUtils {

  static parserToDate(dateText, format) {
    if (!dateText) {
      return null;
    }
    const defaultVal = new Date('1970/01/01 00:00:00');
    const o = [{
      reg: 'y+',
    }, {
      reg: 'M+',
    }, {
      reg: 'd+',
    }, {
      reg: 'h+',
    }, {
      reg: 'm+',
    }, {
      reg: 's+',
    }, {
      reg: 'S',
    }];
    let year = defaultVal.getFullYear();
    let month = defaultVal.getMonth() + 1;
    let day = defaultVal.getDate();
    let hours = defaultVal.getHours();
    let minutes = defaultVal.getMinutes();
    let seconds = defaultVal.getSeconds();
    let milliseconds = defaultVal.getMilliseconds();
    let index = 1;
    for (let j = 0; j < format.length; j += 1) {
      const oneChar = format[j];
      for (let i = 0; i < o.length; i += 1) {
        const onePart = o[i];
        const onePartReg = onePart.reg;
        if (onePartReg[0] === oneChar) {
          if (!onePart.index) {
            onePart.index = index;
            index += 1;
          }
          break;
        }
      }
    }
    for (let i = 0; i < o.length; i += 1) {
      const onePart = o[i];
      const onePartReg = onePart.reg;
      const re = new RegExp(`(${onePartReg})`);
      const res = re.exec(format);
      if (res) {
        const formatPart = res[0];
        const replaceVal = `([0-9]{1,${formatPart.length}})`;
        // eslint-disable-next-line no-param-reassign
        format = format.replace(formatPart, replaceVal);
      }
    }
    const dataInfo = {};
    const re = new RegExp(format);
    const res = re.exec(dateText);
    if (res) {
      for (let i = 1; i < res.length; i += 1) {
        dataInfo[i] = res[i];
      }
    } else {
      return null;
    }
    if (o[0].index) {
      const { index } = o[0];
      year = dataInfo[index];
    }
    if (o[1].index) {
      const { index } = o[1];
      month = dataInfo[index];
    }
    if (o[2].index) {
      const { index } = o[2];
      day = dataInfo[index];
    }
    if (o[3].index) {
      const { index } = o[3];
      hours = dataInfo[index];
    }
    if (o[4].index) {
      const { index } = o[4];
      minutes = dataInfo[index];
    }
    if (o[5].index) {
      const { index } = o[5];
      seconds = dataInfo[index];
    }
    if (o[6].index) {
      const { index } = o[6];
      milliseconds = dataInfo[index];
    }
    return new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
  }

  static dateFormat(fmt, date) {
    if (!(date instanceof Date)) {
      return date;
    }
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds(),
    };
    const reYear = /(y+)/;
    const resultYear = reYear.exec(fmt);
    if (resultYear) {
      const yearFormatPart = resultYear[0];
      const yearVal = (date.getFullYear().toString()).substr(4 - yearFormatPart.length);
      fmt = fmt.replace(yearFormatPart, yearVal);
    }
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const k in o) {
      const re = new RegExp(`(${k})`);
      const res = re.exec(fmt);
      if (res) {
        const Val = o[k].toString();
        const formatPart = res[0];
        const replaceVal = (formatPart.length === 1) ? (Val) : ((`00${Val}`).substr(Val.length));
        fmt = fmt.replace(formatPart, replaceVal);
      }
    }
    return fmt;
  }

}

export { DateUtils };
