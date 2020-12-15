import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';
import { File } from './options/File';
import { ForMart } from './options/ForMart';
import { Insert } from './options/Insert';
import { Look } from './options/Look';
import { Update } from './options/Update';

class TopOption extends Widget {

  constructor(workTop) {
    super(`${cssPrefix}-option`);

    this.workTop = workTop;
    this.title = `${cssPrefix} 工作簿`;
    this.logoEle = h('div', `${cssPrefix}-option-logo`);
    this.titleEle = h('div', `${cssPrefix}-option-title`);
    this.optionsEle = h('div', `${cssPrefix}-option-box`);
    this.leftEle = h('div', `${cssPrefix}-option-left`);
    this.rightEle = h('div', `${cssPrefix}-option-right`);
    this.leftEle.children(this.logoEle);
    this.rightEle.children(this.titleEle, this.optionsEle);
    this.children(this.leftEle);
    this.children(this.rightEle);
    this.setTitle(this.title);
    this.file = new File();
    this.format = new ForMart();
    this.insert = new Insert();
    this.look = new Look();
    this.update = new Update();
    this.optionsEle.children(this.file);
    this.optionsEle.children(this.format);
    this.optionsEle.children(this.insert);
    this.optionsEle.children(this.look);
    this.optionsEle.children(this.update);
  }

  setTitle(title) {
    this.title = title;
    this.titleEle.text(title);
  }

}

export { TopOption };
