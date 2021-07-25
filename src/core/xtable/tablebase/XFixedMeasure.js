class XFixedMeasure {

  constructor({
    rows,
    cols,
    fixedView,
  }) {
    this.fixedView = fixedView;
    this.cols = cols;
    this.rows = rows;
  }

  getHeight() {
    return this.rows.rectRangeSumHeight(this.fixedView.getFixedView());
  }

  getWidth() {
    return this.cols.rectRangeSumWidth(this.fixedView.getFixedView());
  }

}

export {
  XFixedMeasure,
};
