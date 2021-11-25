import { SyncBaseIterator } from './SyncBaseIterator';

class SyncColsIterator extends SyncBaseIterator {

  nextRow() {
    const { begin } = this;
    let ci = -1;
    this.setLoop((i) => {
      if (i !== begin) {
        ci = i;
        return false;
      }
      return true;
    }).execute();
    return ci;
  }

  static getInstance() {
    return new SyncColsIterator();
  }

}

export {
  SyncColsIterator,
};
