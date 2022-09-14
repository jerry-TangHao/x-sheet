import { Animate } from '../animate/Animate';

export class SlideTabItem {
  static midline(item) {
    return (item.getBoundingRect().x + item.getBoundingRect().width / 2);
  }

  static make(nodeList, slideTabBar) {
    let result = [];
    nodeList.forEach((item) => result.push(new SlideTabItem(item, slideTabBar)));
    return result;
  }

  _slideTabItem;

  _animate;

  _midline;

  _translateX;

  _scrollbar;

  _slideTabBar;

  _placeholder;

  constructor(slideTabItem, slideTabBar) {
    this._slideTabItem = slideTabItem;
    this._animate = null;
    this._translateX = 0;
    this._slideTabBar = slideTabBar;
    this._scrollbar = slideTabBar.getScrollbar();
    this.update();
  }

  classList() {
    return this._slideTabItem.classList;
  }

  primeval() {
    return this._slideTabItem;
  }

  translateX(x) {
    this._translateX = x;
    this._slideTabItem.style.transform = `translateX(${x}px)`;
    return this.getTranslateXDirection();
  }

  animate() {
    return {
      translateX: (x) => {
        if (this._translateX !== x) {
          if (this._animate) {
            this._animate.cancel();
            this._animate = null;
          }
          this._animate = new Animate({
            begin: this._translateX,
            end: x,
            receive: (val) => {
              this._slideTabItem.style.transform = `translateX(${val}px)`;
            },
          });
          this._translateX = x;
          this._animate.request();
        }
      },
      cancel: () => {
        if (this._animate) {
          this._animate.cancel();
          this._animate = null;
        }
      },
    };
  }

  after(other) {
    this._slideTabItem.after(other._slideTabItem || other);
  }

  update() {
    this._midline = SlideTabItem.midline(this);
  }

  disableFixed() {
    if (this._placeholder) {
      const slideTabBarPrimeval = this._slideTabBar.primeval();

      this._slideTabItem.style.removeProperty('position');
      this._slideTabItem.style.removeProperty('left');
      this._slideTabItem.style.removeProperty('top');
      this._slideTabItem.style.removeProperty('width');
      this._slideTabItem.style.removeProperty('height');

      this._placeholder.after(this._slideTabItem);

      if (this._placeholder.parentNode === slideTabBarPrimeval) {
        slideTabBarPrimeval.removeChild(this._placeholder);
      }

      this._placeholder = null;
    }
  }

  enableFixed() {
    const placeholder = document.createElement('div');
    const boundingRect = this.getBoundingRect();

    this._placeholder = placeholder;
    this._placeholder.style.width = `${boundingRect.width}px`;
    this._placeholder.style.height = `${boundingRect.height}px`;
    this._placeholder.style.flexShrink = '0';

    this._slideTabItem.style.position = 'fixed';
    this._slideTabItem.style.left = `${boundingRect.x - this.getScrollbar().getScrollX()}px`;
    this._slideTabItem.style.top = `${boundingRect.y}px`;
    this._slideTabItem.style.width = `${boundingRect.width}px`;
    this._slideTabItem.style.height = `${boundingRect.height}px`;

    this._slideTabItem.after(placeholder);
    document.body.appendChild(this._slideTabItem);
  }

  addEventListener(type, action) {
    this._slideTabItem.addEventListener(type, action);
  }

  removeEventListener(type, action) {
    this._slideTabItem.removeEventListener(type, action);
  }

  getScrollbar() {
    return this._scrollbar;
  }

  getMidLine() {
    return this._midline;
  }

  getBoundingRect() {
    const boundingClientRect = this._slideTabItem.getBoundingClientRect();
    boundingClientRect.x += this._scrollbar.getScrollX();
    return boundingClientRect;
  }

  getWidth() {
    return this.getBoundingRect().width;
  }

  getTranslateXDirection() {
    const midline = SlideTabItem.midline(this);
    return midline > this._midline ? 1 : midline < this._midline ? -1 : 0;
  }

  equals(other) {
    return other && (other === this._slideTabItem || other._slideTabItem === this._slideTabItem);
  }
}
