import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../const/Constant';
import { h } from '../../../../lib/Element';

class DropRowFixed extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-drop-row-fixed-bar`);
    this.block = h('div', `${cssPrefix}-table-drop-row-fixed-block`);
    this.childrenNodes(this.block);
    this.table = table;
  }

  onAttach() {
    this.setSize();
    this.hide();
  }

  setSize() {
    const { table, block } = this;
    const width = table.visualWidth();
    const height = table.settings.xFixedBar.height;
    block.offset({
      width: table.getIndexWidth(), height,
    });
    this.offset({
      height, width, left: 0,
    });
  }

}

export {
  DropRowFixed,
};
