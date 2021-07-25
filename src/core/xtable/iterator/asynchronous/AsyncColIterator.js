import { AsyncBaseIterator } from './AsyncBaseIterator';

class AsyncColIterator extends AsyncBaseIterator {

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
    return new AsyncColIterator();
  }

}

export {
  AsyncColIterator,
};
