class DrawResult {

  constructor({
    width = 0,
    rightSdist = 0,
    leftSdist = 0,
  } = {}) {
    this.width = width;
    this.rightSdist = rightSdist;
    this.leftSdist = leftSdist;
  }

}

export {
  DrawResult,
};
