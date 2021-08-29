function Compare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function Swap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

function QStep(arr, k, left, right, compare) {
  while (right > left) {
    if (right - left > 600) {
      let n = right - left + 1;
      let m = k - left + 1;
      let z = Math.log(n);
      let s = 0.5 * Math.exp(2 * z / 3);
      let sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
      let newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
      let newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
      QStep(arr, k, newLeft, newRight, compare);
    }

    let t = arr[k];
    let i = left;
    let j = right;

    Swap(arr, left, k);
    if (compare(arr[right], t) > 0) Swap(arr, left, right);

    while (i < j) {
      Swap(arr, i, j);
      i++;
      j--;
      while (compare(arr[i], t) < 0) i++;
      while (compare(arr[j], t) > 0) j--;
    }

    if (compare(arr[left], t) === 0) Swap(arr, left, j);
    else {
      j++;
      Swap(arr, j, right);
    }

    if (j <= k) left = j + 1;
    if (k <= j) right = j - 1;
  }
}

function QSelect(arr, k, left, right, compare) {
  QStep(arr, k, left || 0, right || (arr.length - 1), compare || Compare);
}

export {
  QSelect,
};
