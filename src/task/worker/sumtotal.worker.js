import { Cell } from '../../core/xtable/tablecell/Cell';

addEventListener('message', (event) => {
  const { data } = event;
  let total = 0;
  let number = 0;
  for (let i = 0, len = data.length; i < len; i++) {
    let row = data[i];
    if (row) {
      for (let j = 0, len = row.length; j < len; j++) {
        let item = row[j];
        if (item) {
          let { cell } = item;
          if (cell) {
            switch (cell.contentType) {
              // 数字类型
              case Cell.TYPE.NUMBER:
                total += cell.text;
                number++;
                break;
            }
          }
        }
      }
    }
  }
  postMessage({ total, number });
});
