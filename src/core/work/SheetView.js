import { Widget } from '../../libs/Widget';
import { cssPrefix } from '../../const/Constant';

class SheetView extends Widget {

  constructor() {
    super(`${cssPrefix}-sheet-view`);
    this.sheetList = [];
    this.activeIndex = -1;
  }

  setActiveSheet(index) {
    const { sheetList } = this;
    if (sheetList[index]) {
      this.activeIndex = index;
      return this.setActive(sheetList[index]);
    }
    return null;
  }

  attach(sheet) {
    this.sheetList.push(sheet);
    super.attach(sheet);
    sheet.hide();
  }

  getActiveSheet() {
    return this.sheetList[this.activeIndex];
  }

  setActive(sheet) {
    sheet.show();
    sheet.sibling().forEach((item) => {
      item.hide();
    });
    return sheet;
  }

  getLastIndex() {
    return this.sheetList.length - 1;
  }

}

export { SheetView };
