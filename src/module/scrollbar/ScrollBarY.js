/* global document */
import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { h } from '../../lib/Element';

import { SheetUtils } from '../../utils/SheetUtils';
import { XEvent } from '../../lib/XEvent';

class ScrollBarY extends Widget {

  constructor(option) {
    super(`${cssPrefix}-scroll-bar-y`);
    this.option = SheetUtils.copy({
      style: {},
      last: () => 0,
      next: () => 0,
      scroll: to => to,
    }, option);
    this.lastBut = h('div', `${cssPrefix}-scroll-bar-y-last-but`);
    this.nextBut = h('div', `${cssPrefix}-scroll-bar-y-next-but`);
    this.content = h('div', `${cssPrefix}-scroll-bar-y-content`);
    this.block = h('div', `${cssPrefix}-scroll-bar-y-block`);
    this.content.children(this.block);
    this.children(...[
      this.lastBut,
      this.nextBut,
      this.content,
    ]);
    this.blockTop = 0;
    this.maxBlockTop = 0;
    this.blockHeight = 0;
    this.minBlockHeight = 20;
    this.scrollTo = 0;
    this.contentHeight = 0;
    this.viewPortHeight = 0;
    this.isHide = true;
    this.css(this.option.style);
  }

  unbind() {
    XEvent.unbind(this.nextBut);
    XEvent.unbind(this.lastBut);
    XEvent.unbind(this.block);
    XEvent.unbind(this);
  }

  bind() {
    XEvent.bind(this.content, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      let { y } = this.eventXy(event, this.content);
      let { height } = this.block.box();
      let dir = 'head';
      let { blockTop } = this;
      blockTop += height / 2;
      if (blockTop > y) {
        dir = 'head';
      }
      if (blockTop < y) {
        dir = 'foot';
      }
      XEvent.mouseHold(document, () => {
        let { blockTop } = this;
        blockTop += height / 2;
        if (dir === 'head') {
          if (blockTop > y) {
            this.option.last();
          }
        }
        if (dir === 'foot') {
          if (blockTop < y) {
            this.option.next();
          }
        }
      }, () => {}, 60);
    });
    XEvent.bind(this.block, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      if (event.button !== 0) return;
      const downEventXy = this.eventXy(event, this.block);
      XEvent.mouseMoveUp(h(document), (evt2) => {
        // 计算移动的距离
        const moveEventXy = this.eventXy(evt2, this.content);
        let top = moveEventXy.y - downEventXy.y;
        if (top < 0) top = 0;
        if (top > this.maxBlockTop) top = this.maxBlockTop;
        // 计算滑动的距离
        top = this.computeScrollTo(top);
        this.scrollMove(top);
      });
      event.stopPropagation();
    });
    XEvent.bind(this.nextBut, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      XEvent.mouseHold(document, () => {
        this.option.next();
      });
    });
    XEvent.bind(this.lastBut, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      XEvent.mouseHold(document, () => {
        this.option.last();
      });
    });
  }

  onAttach() {
    this.bind();
  }

  setSize(viewPortHeight, contentHeight) {
    if (viewPortHeight < contentHeight) {
      this.isHide = false;
      this.show();
      // 计算滑块高度
      const contentBox = this.content.box();
      const blockHeight = viewPortHeight / contentHeight * contentBox.height;
      this.blockHeight = blockHeight < this.minBlockHeight ? this.minBlockHeight : blockHeight;
      this.viewPortHeight = viewPortHeight;
      this.contentHeight = contentHeight;
      this.maxBlockTop = contentBox.height - this.blockHeight;
      this.block.css('height', `${this.blockHeight}px`);
      // 计算滑块位置
      const blockTop = (this.scrollTo / (contentHeight - viewPortHeight)) * this.maxBlockTop;
      this.blockTop = blockTop > this.maxBlockTop ? this.maxBlockTop : blockTop;
      this.scrollTo = this.computeScrollTo(this.blockTop);
      this.block.css('top', `${this.blockTop}px`);
    } else {
      this.isHide = true;
      this.hide();
      this.option.scroll(0);
    }
  }

  scrollMove(move) {
    this.setLocal(move);
    this.option.scroll(this.scrollTo);
  }

  setLocal(move) {
    let to = move;
    const maxTo = this.contentHeight - this.viewPortHeight;
    if (to > maxTo) to = maxTo; else if (to < 0) to = 0;
    const blockTop = (to / (this.contentHeight - this.viewPortHeight)) * this.maxBlockTop;
    this.blockTop = blockTop > this.maxBlockTop ? this.maxBlockTop : blockTop;
    if (this.isHide === false) {
      this.scrollTo = to;
      this.block.css('top', `${this.blockTop}px`);
    }
  }

  computeScrollTo(move) {
    return (move / this.maxBlockTop) * (this.contentHeight - this.viewPortHeight);
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { ScrollBarY };
