import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../const/Constant';
import { VerticalLayer } from '../../lib/layer/VerticalLayer';
import { VerticalLayerElement } from '../../lib/layer/VerticalLayerElement';
import { XWorkHead } from './head/XWorkHead';
import { XWorkBody } from './body/XWorkBody';
import { XWorkFoot } from './foot/XWorkFoot';
import { SheetUtils } from '../../utils/SheetUtils';

const settings = {
  created: new Date(),
  modified: new Date(),
  creator: '',
  lastModifiedBy: '',
  top: {
    option: {
      show: true,
    },
    menu: {
      show: true,
    },
  },
  body: {
    sheets: [{
      tableConfig: {},
    }],
    tabConfig: {},
    sheetConfig: {},
  },
  bottom: {
    show: true,
  },
};

class XWork extends Widget {

  constructor(options) {
    super(`${cssPrefix}-work`);
    this.options = SheetUtils.copy({}, settings, options);
    // 组件
    this.top = new XWorkHead(this, this.options.top);
    this.body = new XWorkBody(this, this.options.body);
    this.bottom = new XWorkFoot(this);
    // 布局
    this.topLayer = new VerticalLayerElement();
    this.bodyLayer = new VerticalLayerElement({
      style: {
        flexGrow: 1,
      },
    });
    this.bottomLayer = new VerticalLayerElement();
    this.verticalLayer = new VerticalLayer();
    this.verticalLayer.attach(this.topLayer);
    this.verticalLayer.attach(this.bodyLayer);
    this.verticalLayer.attach(this.bottomLayer);
    this.attach(this.verticalLayer);
  }

  onAttach() {
    const { options, bodyLayer } = this;
    const { topLayer, bottomLayer } = this;
    topLayer.attach(this.top);
    if (options.bottom.show) {
      bottomLayer.attach(this.bottom);
    }
    bodyLayer.attach(this.body);
    this.bottom.bottomMenu.setSum(0);
    this.bottom.bottomMenu.setAvg(0);
    this.bottom.bottomMenu.setNumber(0);
  }

}

export { XWork };
