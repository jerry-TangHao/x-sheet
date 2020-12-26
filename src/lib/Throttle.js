class Throttle {

  constructor({
    time = 500,
  } = {}) {
    this.handle = null;
    this.time = time;
  }

  setTime(time) {
    this.time = time;
  }

  action(cb) {
    clearTimeout(this.handle);
    this.handle = setTimeout(() => {
      cb();
    }, this.time);
  }

}

export {
  Throttle,
};
