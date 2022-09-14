import { getLocale, parseLocale, addLocale } from './Locale';
import round from './Round';
import dec2frac from './Dec2frac';
import options from './Options';
import codeToLocale from './CodeToLocale';
import { parsePattern, parseCatch } from './ParsePattern';
import { dateToSerial, dateFromSerial } from './SerialDate';
import { color, isDate, isPercent, isText, formatNumber } from './FormatNumber';
import { parseNumber, parseDate, parseTime, parseBool, parseValue } from './ParseValue';

const _cache = {};

function getFormatter(parseData, initOpts) {
  const { pattern, partitions, locale } = parseData;

  const getRuntimeOptions = (opts) => {
    const runOpts = { ...options(), ...initOpts, ...opts };
    if (locale) {
      runOpts.locale = locale;
    }
    return runOpts;
  };

  const formatter = (value, opts) => {
    const o = getRuntimeOptions(opts);
    return formatNumber(dateToSerial(value, o), partitions, o);
  };
  formatter.color = (value, opts) => {
    const o = getRuntimeOptions(opts);
    return color(dateToSerial(value, o), partitions);
  };
  formatter.isPercent = () => isPercent(partitions);
  formatter.isDate = () => isDate(partitions);
  formatter.isText = () => isText(partitions);
  formatter.pattern = pattern;
  if (parseData.error) {
    formatter.error = parseData.error;
  }
  formatter.options = getRuntimeOptions;
  formatter.locale = locale || (initOpts && initOpts.locale) || '';
  return Object.freeze(formatter);
}

function numfmt(pattern, opts) {
  if (!pattern) {
    pattern = 'General';
  }
  let parseData = null;
  if (_cache[pattern]) {
    parseData = _cache[pattern];
  } else {
    const constructOpts = { ...options(), ...opts };
    parseData = constructOpts.throws
      ? parsePattern(pattern)
      : parseCatch(pattern);
    if (!parseData.error) {
      _cache[pattern] = parseData;
    }
  }
  return getFormatter(parseData, opts);
}

numfmt.isDate = (d) => numfmt(d, { throws: false }).isDate();
numfmt.isPercent = (d) => numfmt(d, { throws: false }).isPercent();
numfmt.isText = (d) => numfmt(d, { throws: false }).isText();
numfmt.dateToSerial = dateToSerial;
numfmt.dateFromSerial = dateFromSerial;
numfmt.options = options;
numfmt.dec2frac = dec2frac;
numfmt.round = round;

numfmt.codeToLocale = codeToLocale;
numfmt.parseLocale = parseLocale;
numfmt.getLocale = getLocale;
numfmt.addLocale = (options, l4e) => {
  const c = parseLocale(l4e);
  // when locale is changed, expire all cached patterns
  delete _cache[c.lang];
  delete _cache[c.language];
  return addLocale(options, c);
};

// SSF interface compatibility
function format(pattern, value, l4e, noThrows = false) {
  const opts = (l4e && typeof l4e === 'object') ? l4e : { locale: l4e, throws: !noThrows };
  return numfmt(pattern, opts)(dateToSerial(value, opts), opts);
}
numfmt.format = format;
numfmt.is_date = numfmt.isDate;

numfmt.parseNumber = parseNumber;
numfmt.parseDate = parseDate;
numfmt.parseTime = parseTime;
numfmt.parseBool = parseBool;
numfmt.parseValue = parseValue;

export default numfmt;
