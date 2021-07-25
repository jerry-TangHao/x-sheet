import { Widget } from '../../../../libs/Widget';
import { XTableDimensions } from '../../../xtable/XTableDimensions';
import { cssPrefix } from '../../../../const/Constant';
import { PlainUtils } from '../../../../utils/PlainUtils';

const settings = {
  tableConfig: {
    data: [],
  },
};

class XWorkSheet extends Widget {

  constructor(tab, options) {
    super(`${cssPrefix}-sheet`);
    this.tab = tab;
    this.options = PlainUtils.copy({}, settings, options);
    this.table = new XTableDimensions(this.options.tableConfig);
  }

  onAttach() {
    const { table } = this;
    this.attach(table);
  }

}

export { XWorkSheet };
