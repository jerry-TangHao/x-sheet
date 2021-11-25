import { SyncRowsIterator } from './synchronous/SyncRowsIterator';
import { SyncColsIterator } from './synchronous/SyncColsIterator';
import { AsyncRowIterator } from './asynchronous/AsyncRowIterator';
import { AsyncColIterator } from './asynchronous/AsyncColIterator';

class XIteratorBuilder {

  getRowIterator() {
    return SyncRowsIterator.getInstance();
  }

  getColIterator() {
    return SyncColsIterator.getInstance();
  }

  getAsyncRowIterator() {
    return AsyncRowIterator.getInstance();
  }

  getAsyncColIterator() {
    return AsyncColIterator.getInstance();
  }

}

export {
  XIteratorBuilder,
};
