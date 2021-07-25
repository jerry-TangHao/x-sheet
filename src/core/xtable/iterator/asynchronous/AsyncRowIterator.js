import { AsyncBaseIterator } from './AsyncBaseIterator';

let fold = [];

class AsyncRowIterator extends AsyncBaseIterator {

  static getInstance() {
    return new AsyncRowIterator();
  }

  static setFold(value) {
    fold = value;
  }

  constructor() {
    super();
    this.skipCallback = () => {};
    this.useFold = true;
  }

  setSkip(callback) {
    this.skipCallback = callback;
    return this;
  }

  hasFold() {
    let find = false;
    this.setLoop((i) => {
      if (fold[i]) {
        find = true;
        return false;
      }
      return true;
    }).foldOnOff(false).execute();
    return find;
  }

  execute() {
    this.status = AsyncBaseIterator.STATUS.DEFAULT;
    const {
      loopCallback, nextCallback, skipCallback,
    } = this;
    const {
      begin, end, useFold,
    } = this;
    let i;
    if (begin > end) {
      i = begin;
      this.doWhile(() => i >= end, () => {
        if (useFold && fold[i]) {
          skipCallback(i);
          return true;
        }
        const result = loopCallback(i);
        nextCallback(i);
        i -= 1;
        return result;
      }, () => {
        this.finishCallback(i);
      });
    } else {
      i = begin;
      this.doWhile(() => i <= end, () => {
        if (useFold && fold[i]) {
          skipCallback(i);
          return false;
        }
        const result = loopCallback(i);
        nextCallback(i);
        i += 1;
        return result;
      }, () => {
        this.finishCallback(i);
      });
    }
    return this;
  }

  nextRow() {
    const { begin } = this;
    let ri = -1;
    this.setLoop((i) => {
      if (i !== begin) {
        ri = i;
        return false;
      }
      return true;
    }).execute();
    return ri;
  }

  foldOnOff(onOff) {
    this.useFold = onOff;
    return this;
  }

}

export {
  AsyncRowIterator,
};
