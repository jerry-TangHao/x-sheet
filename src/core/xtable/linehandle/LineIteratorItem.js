import { PlainUtils } from '../../../utils/PlainUtils';
import { LineIteratorFilter } from './LineIteratorFilter';

class LineIteratorItem {

  constructor({
    newRow = PlainUtils.noop,
    endRow = PlainUtils.noop,
    jump = PlainUtils.noop,
    exec = PlainUtils.noop,
    filter = LineIteratorFilter.EMPTY,
    newCol = PlainUtils.noop,
    endCol = PlainUtils.noop,
    complete = PlainUtils.noop,
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
