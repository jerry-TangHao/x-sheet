import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../const/Constant';
import { VerticalLayer } from '../../lib/layer/VerticalLayer';
import { VerticalLayerElement } from '../../lib/layer/VerticalLayerElement';
import { WorkTop } from './WorkTop';
import { WorkBody } from './WorkBody';
import { WorkBottom } from './WorkBottom';

class Work extends Widget {

  constructor(options = {
    body: {},
  }) {
    super(`${cssPrefix}-work`);
    this.options = options.workConfig;
    this.root = null;
    // 布局
    this.topLayer = new VerticalLayerElement();
    this.bodyLayer = new VerticalLayerElement({
      style: {
        flexGrow: 1,
      },
    });
    this.bottomLayer = new VerticalLayerElement();
    this.verticalLayer = new VerticalLayer();
    this.verticalLayer.children(this.topLayer);
    this.verticalLayer.children(this.bodyLayer);
    this.verticalLayer.children(this.bottomLayer);
    this.children(this.verticalLayer);
    // 组件
    this.top = new WorkTop(this);
    this.body = new WorkBody(this, this.options.body);
    this.bottom = new WorkBottom(this);
  }

  onAttach(element) {
    this.root = element;
    const {
      bodyLayer, topLayer, bottomLayer,
    } = this;
    topLayer.attach(this.top);
    bottomLayer.attach(this.bottom);
    bodyLayer.attach(this.body);
    this.bottom.bottomMenu.setSum(0);
    this.bottom.bottomMenu.setAvg(0);
    this.bottom.bottomMenu.setNumber(0);
  }

}

export { Work };
