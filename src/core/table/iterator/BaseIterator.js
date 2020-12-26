class BaseIterator {

  constructor() {
    this.finishCallback = () => {};
    this.loopCallback = () => {};
    this.nextCallback = () => {};
    this.end = 0;
    this.begin = 0;
  }

  execute() {
    const {
      loopCallback, nextCallback,
    } = this;
    const {
      begin, end,
    } = this;
    let i;
    if (begin > end) {
      i = begin;
      for (; i >= end; i -= 1, nextCallback(i)) {
        const res = loopCallback(i);
        if (res === false) {
          break;
        }
      }
    } else {
      i = begin;
      for (; i <= end; i += 1, nextCallback(i)) {
        const res = loopCallback(i);
        if (res === false) {
          break;
        }
      }
    }
    this.finishCallback(i);
    return this;
  }

  setLoop(callback) {
    this.loopCallback = callback;
    return this;
  }

  setNext(callback) {
    this.nextCallback = callback;
    return this;
  }

  setFinish(callback) {
    this.finishCallback = callback;
    return this;
  }

  setEnd(end) {
    this.end = end;
    return this;
  }

  setBegin(begin) {
    this.begin = begin;
    return this;
  }

}

export {
  BaseIterator,
};
