let tween = {
  easeOutStrong(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  backOut(t, b, c, d, s) {
    if (typeof s === 'undefined') {
      s = 0.7;
    }
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
};

export class Animate {
  _fakeHandle() {
    let times = Date.now() - this._start;
    times = times >= this._opt.duration
      ? this._opt.duration : times;

    let val = tween[this._opt.type](times, this._opt.begin, this._opt.end - this._opt.begin, this._opt.duration, 0.7);
    let fix = val.toFixed(2);

    this._opt.receive(fix);

    if (this._status === 'cancel') {
      this._opt.cancel(fix);
      this._opt.complete(fix);
      return;
    }

    if (times === this._opt.duration) {
      this._opt.success(fix);
      this._opt.complete(fix);
      return;
    }

    this._handle = requestAnimationFrame(this._fakeHandle.bind(this));
  }

  constructor(opt) {
    this._opt = { loop: false,
      begin: 0,
      end: 0,
      duration: 300,
      delay: 0,
      type: 'easeOutStrong',
      receive(v) { /* noop */ },
      success(v) { /* noop */ },
      cancel(v) { /* noop */ },
      complete(v) { /* noop */ },
      ...opt,
    };

    this._opt.begin = parseFloat(this._opt.begin);
    this._opt.end = parseFloat(this._opt.end);
    this._opt.duration = parseFloat(this._opt.duration);
    this._opt.delay = parseFloat(this._opt.delay);

    this._delayHandle = null;

    if (this._opt.loop) {
      this._opt.complete = () => {
        /* noop */
      };
      this._opt.success = () => {
        this.request();
      };
    }
  }

  cancel() {
    this._status = 'cancel';
    if (this._delayHandle) {
      clearTimeout(this._delayHandle);
    }
    cancelAnimationFrame(this._handle);
  }

  request() {
    if (this._opt.delay === 0) {
      this._status = 'request';
      this._start = Date.now();
      this._fakeHandle();
    } else {
      if (this._delayHandle) {
        clearTimeout(this._delayHandle);
      }
      this._delayHandle = setTimeout(() => {
        this._status = 'request';
        this._start = Date.now();
        this._fakeHandle();
      }, this._opt.delay);
    }
  }
}
