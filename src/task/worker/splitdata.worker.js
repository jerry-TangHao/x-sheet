addEventListener("message" , (event) => {
  let { range, items, group } = event.data;
  let { sri, eri } = range;
  let result = [];
  let splice = [];
  let index = 0;
  while (sri <= eri) {
    if (index > 0) {
      if (index % group === 0) {
        result.push(splice);
        splice = [];
      }
    }
    let row = items[index];
    splice.push(row);
    sri ++;
    index ++;
  }
  if (splice.length) {
    result.push(splice);
  }
  postMessage(result);
});

