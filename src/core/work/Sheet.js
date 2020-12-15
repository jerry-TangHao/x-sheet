import { Widget } from '../../lib/Widget';
import { XTableDimensions } from '../table/XTableDimensions';
import { cssPrefix } from '../../const/Constant';

class Sheet extends Widget {

  constructor(options = {
    tableConfig: {
      data: [],
    },
  }) {
    super(`${cssPrefix}-sheet`);
    this.options = options;
    this.table = new XTableDimensions({
      settings: this.options.tableConfig,
    });
  }

  onAttach() {
    const { table } = this;
    this.attach(table);
  }

}

export { Sheet };
