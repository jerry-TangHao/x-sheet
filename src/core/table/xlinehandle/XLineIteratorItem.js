import { PlainUtils } from '../../../utils/PlainUtils';
import { XLineIteratorFilter } from './XLineIteratorFilter';

class XLineIteratorItem {

  constructor({
    newRow = PlainUtils.noop,
    endRow = PlainUtils.noop,
    filter = XLineIteratorFilter.EMPTY,
    newCol = PlainUtils.noop,
    endCol = PlainUtils.noop,
    jump = PlainUtils.noop,
    exec = PlainUtils.noop,
    complete = PlainUtils.noop,
  } = {}) {
    this.newRow = newRow;
    this.endRow = endRow;
    this.filter = filter;
    this.newCol = newCol;
    this.endCol = endCol;
    this.jump = jump;
    this.exec = exec;
    this.complete = complete;
  }

  getFilter() {
    return this.filter;
  }

}

XLineIteratorItem.EMPTY = new XLineIteratorItem();

export {
  XLineIteratorItem,
};
