import { RowsIterator } from './RowsIterator';
import { ColsIterator } from './ColsIterator';

class XIteratorBuilder {

  getRowIterator() {
    return RowsIterator.getInstance();
  }

  getColIterator() {
    return ColsIterator.getInstance();
  }

}

export {
  XIteratorBuilder,
};
