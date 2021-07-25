class Scale {

  constructor() {
    this.value = 1;
  }

  back(origin) {
    return origin / this.value;
  }

  goto(origin) {
    return this.value * origin;
  }

  setValue(value) {
    this.value = value;
  }

}

class ScaleAdapter {

  constructor({
    goto = v => v,
    back = v => v,
  } = {}) {
    this.goto = goto;
    this.back = back;
  }

}

export {
  Scale, ScaleAdapter,
};
