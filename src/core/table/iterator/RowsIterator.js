import { BaseIterator } from './BaseIterator';

let fold = [];

class RowsIterator extends BaseIterator {

  static getInstance() {
    return new RowsIterator();
  }

  static setFold(value) {
    fold = value;
  }

  constructor() {
    super();
    this.skipCallback = () => {};
    this.useFold = true;
  }

  execute() {
    const {
      loopCallback, nextCallback, skipCallback,
    } = this;
    const {
      begin, end, useFold,
    } = this;
    let i;
    if (begin > end) {
      i = begin;
      for (; i >= end; i -= 1, nextCallback(i)) {
        if (useFold && fold[i]) {
          skipCallback(i);
          continue;
        }
        const res = loopCallback(i);
        if (res === false) {
          break;
        }
      }
    } else {
      i = begin;
      for (; i <= end; i += 1, nextCallback(i)) {
        if (useFold && fold[i]) {
          skipCallback(i);
          continue;
        }
        const res = loopCallback(i);
        if (res === false) {
          break;
        }
      }
    }
    this.finishCallback(i);
    return this;
  }

  setSkip(callback) {
    this.skipCallback = callback;
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

  foldOnOff(onOff) {
    this.useFold = onOff;
    return this;
  }

}

export {
  RowsIterator,
};
