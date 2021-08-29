import { Cell } from '../../core/xtable/tablecell/Cell';
import { XTableDataItems } from '../../core/xtable/XTableDataItems';
import { SheetUtils } from '../../utils/SheetUtils';

addEventListener('message', (event) => {
  const { data } = event;
  const items = new XTableDataItems({
    items: data
  });
  let total = 0;
  let number = 0;
  items.each(item => {
    if (item) {
      const cell = item.getCell();
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
