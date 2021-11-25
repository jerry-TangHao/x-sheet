class AsyncBaseIterator {

  constructor() {
    this.finishCallback = () => {};
    this.loopCallback = () => {};
    this.nextCallback = () => {};
    this.begin = 0;
    this.end = 0;
    this.handle = null;
    this.status = AsyncBaseIterator.STATUS.DEFAULT;
  }

  doWhile(condition, callback, finish) {
    this.handle = setTimeout(() => {
      const result = callback();
      if (result !== false) {
        if (condition()) {
          if (this.handle) {
            this.doWhile(condition, callback, finish);
          }
        } else {
          this.status = AsyncBaseIterator.STATUS.FINISH;
          finish();
        }
      }
    });
  }

  stop() {
    clearTimeout(this.handle);
    this.handle = null;
  }

  setEnd(end) {
    this.end = end;
    return this;
  }

  setBegin(begin) {
    this.begin = begin;
    return this;
  }

  execute() {
    this.status = AsyncBaseIterator.STATUS.DEFAULT;
    const {
      loopCallback, nextCallback,
    } = this;
    const {
      begin, end,
    } = this;
    let i;
    if (begin > end) {
      i = begin;
      this.doWhile(() => i >= end, () => {
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

}

AsyncBaseIterator.STATUS = {
  FINISH: 1,
  DEFAULT: 2,
};

export {
  AsyncBaseIterator,
};
