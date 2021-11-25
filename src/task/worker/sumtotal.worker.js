import { Cell } from '../../core/table/tablecell/Cell';
import { SheetUtils } from '../../utils/SheetUtils';
import { Cells } from '../../core/table/tablecell/Cells';

addEventListener('message', (event) => {
  const { data } = event;
  const cells = new Cells({
    data
  });
  let total = 0;
  let number = 0;
  cells.each(cell => {
    if (cell) {
      if (cell.hasFormula()) {
        const value = cell.getComputeText();
        if (SheetUtils.isNumber(value)) {
          total += SheetUtils.parseFloat(value);
          number++;
        }
      } else {
        switch (cell.contentType) {
          case Cell.TYPE.NUMBER:
            total += cell.getComputeText();
            number++;
            break;
        }
      }
    }
  });
  postMessage({
    total, number
  });
});
