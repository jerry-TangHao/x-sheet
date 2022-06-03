// http://homepage.smc.edu/kennedy_john/DEC2FRAC.PDF
const PRECISION = 1e-10;

export default function dec2frac(val, maxdigits_num, maxdigits_de) {
  const sign = (val < 0) ? -1 : 1;
  const maxdigits_n = 10 ** (maxdigits_num || 2);
  const maxdigits_d = 10 ** (maxdigits_de || 2);
  let z = Math.abs(val);
  let last_d = 0;
  let last_n = 0;
  let curr_n = 0;
  let curr_d = 1;
  let tmp;
  let r;
  val = z;
  if (val % 1 === 0) {
    // handles exact integers including 0
    r = [val * sign, 1];
  } else if (val < 1e-19) {
    r = [sign, 1e+19];
  } else if (val > 1e+19) {
    r = [1e+19 * sign, 1];
  } else {
    do {
      z = 1 / (z - Math.floor(z));
      tmp = curr_d;
      curr_d = (curr_d * Math.floor(z)) + last_d;
      last_d = tmp;
      last_n = curr_n;
      curr_n = Math.floor(val * curr_d + 0.5); // round
      if (curr_n >= maxdigits_n || curr_d >= maxdigits_d) {
        return [sign * last_n, last_d];
      }
    }
    while (Math.abs(val - (curr_n / curr_d)) >= PRECISION && z !== Math.floor(z));
    r = [sign * curr_n, curr_d];
  }
  return r;
}
