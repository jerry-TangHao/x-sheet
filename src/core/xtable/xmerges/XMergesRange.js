class XMergesRange {

  constructor(sri, sci, eri, eci, view) {
    this.sri = sri;
    this.sci = sci;
    this.eri = eri;
    this.eci = eci;
    this.view = view;
  }

  getView() {
    this.view.set(this.sri.no, this.sci.no, this.eri.no, this.eci.no);
    return this.view;
  }

}

export {
  XMergesRange,
};
