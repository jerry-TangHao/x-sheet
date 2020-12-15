class Row {

  constructor(row, {
    height = 30,
  } = {}) {
    this.height = height;
    this.row = row;
    this.reCkHasAngle = true;
    this.hasAngelCell = false;
  }

  setHasAngelCell(value) {
    this.hasAngelCell = value;
  }

  setReCkHasAngle(value) {
    this.reCkHasAngle = value;
  }

}

export {
  Row,
};
