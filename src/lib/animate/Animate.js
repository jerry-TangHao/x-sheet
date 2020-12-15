
// eslint-disable-next-line max-len
/* global requestAnimationFrame webkitRequestAnimationFrame cancelAnimationFrame webkitCancelAnimationFrame */

import { PlainUtils } from '../../utils/PlainUtils';

const REQUEST = requestAnimationFrame || webkitRequestAnimationFrame;
const CANCEL = cancelAnimationFrame || webkitCancelAnimationFrame;
const TWEEN = {
  easeOutStrong(t, b, c, d) {
    // eslint-disable-next-line no-return-assign,no-param-reassign
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  backOut(t, b, c, d, s) {
    if (typeof s === 'undefined') {
      // eslint-disable-next-line no-param-reassign
      s = 0.7;
    }
    // eslint-disable-next-line no-param-reassign,no-return-assign
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
};

class Animate {
  constructor(option) {
    this.option = PlainUtils.mergeDeep({
      loop: false,
      begin: 0,
      end: 0,
      duration: 300,
      delay: 0,
      type: 'easeOutStrong',
      receive: () => {},
      success: () => {},
      cancel: () => {},
      complete: () => {},
    }, option);
    this.option.begin = parseFloat(this.option.begin);
    this.option.end = parseFloat(this.option.end);
    this.option.duration = parseFloat(this.option.duration);
    this.option.delay = parseFloat(this.option.delay);
    this.delayHandle = null;
    if (this.option.loop) {
      this.option.complete = () => {};
      this.option.success = () => {
        this.request();
      };
    }
  }

  request() {
    if (this.option.delay === 0) {
      this.status = 'request';
      this.start = Date.now();
      this.fakeHandle();
    } else {
      // eslint-disable-next-line no-unused-expressions
      this.delayHandle && clearTimeout(this.delayHandle);
      this.delayHandle = setTimeout(() => {
        this.status = 'request';
        this.start = Date.now();
        this.fakeHandle();
      }, this.option.delay);
    }
  }

  cancel() {
    this.status = 'cancel';
    // eslint-disable-next-line no-unused-expressions
    this.delayHandle && clearTimeout(this.delayHandle);
    CANCEL(this.handle);
  }

  fakeHandle() {
    let times = Date.now() - this.start;
    times = times >= this.option.duration ? this.option.duration : times;
    const val = TWEEN[this.option.type](times, this.option.begin,
      this.option.end - this.option.begin, this.option.duration, 0.7);
    this.option.receive(val.toFixed(2));
    if (this.status === 'cancel') {
      this.option.cancel();
      this.option.complete();
      return;
    }
    if (times === this.option.duration) {
      this.option.success();
      this.option.complete();
      return;
    }
    this.handle = REQUEST(() => {
      this.fakeHandle();
    });
  }

  static success() {
    // eslint-disable-next-line prefer-rest-params
    const animates = arguments;
    let successNumber = 0;
    return new Promise(((resolve) => {
      for (let i = 0; i < animates.length; i += 1) {
        const animate = animates[i];
        if (animate.option.loop) continue;
        // eslint-disable-next-line no-loop-func,func-names
        (function (animate) {
          const { success } = animate.option;
          animate.option.success = () => {
            successNumber += 1;
            success.apply(animate);
            if (successNumber === animates.length) {
              resolve();
            }
          };
        }(animate));
      }
    }));
  }
}

export { Animate };
