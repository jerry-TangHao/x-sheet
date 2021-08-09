import { SheetUtils } from '../../../utils/SheetUtils';
import { LineIteratorFilter } from './LineIteratorFilter';

class LineIteratorItem {

  constructor({
    newRow = SheetUtils.noop,
    endRow = SheetUtils.noop,
    jump = SheetUtils.noop,
    exec = SheetUtils.noop,
    filter = LineIteratorFilter.EMPTY,
    newCol = SheetUtils.noop,
    endCol = SheetUtils.noop,
    complete = SheetUtils.noop,
  } = {}) {
    this.newRow = newRow;
    this.endRow = endRow;
    this.filter = filter;
    this.jump = jump;
    this.exec = exec;
    this.newCol = newCol;
    this.endCol = endCol;
    this.complete = complete;
  }

}

LineIteratorItem.EMPTY = new LineIteratorItem();

export {
  LineIteratorItem,
};
