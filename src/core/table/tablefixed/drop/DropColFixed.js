import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../const/Constant';
import { h } from '../../../../lib/Element';

class DropColFixed extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-drop-col-fixed-bar`);
    this.block = h('div', `${cssPrefix}-table-drop-col-fixed-block`);
    this.childrenNodes(this.block);
    this.table = table;
  }

  onAttach() {
    this.setSize();
    this.hide();
  }

  setSize() {
    const { table, block } = this;
    const height = table.visualHeight();
    const width = 6;
    block.offset({
      height: table.getIndexHeight(), width,
    });
    this.offset({
      height, width, top: 0,
    });
  }

}

export {
  DropColFixed,
};
