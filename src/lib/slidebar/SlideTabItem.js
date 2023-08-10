import { Animate } from '../animate/Animate';
import { SheetUtils } from '../../utils/SheetUtils';
import { Throttle } from '../Throttle';

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

  _editMode;

  _translateX;

  _animate;

  _midline;

  _slideTabBar;

  _scrollbar;

  _placeholder;

  _throttle;

  constructor(slideTabItem, slideTabBar) {
    this._slideTabItem = slideTabItem;
    this._animate = null;
    this._translateX = 0;
    this._slideTabBar = slideTabBar;
    this._editMode = false;
    this._scrollbar = slideTabBar.getScrollbar();
    this._throttle = new Throttle({ time: 0 });
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

  editor(callback) {
    this._throttle.action(() => {
      if (!this._editMode) {
        let input = this.primeval().querySelector('span');
        let blurAction = (event) => {
          this._editMode = false;
          if (input) {
            input.removeAttribute('contentEditable');
            input.removeEventListener('blur', blurAction);
            input.removeEventListener('input', inputAction);
          }
          this._slideTabBar.updateItems();
          if (callback) {
            callback(event);
          }
          if (this._slideTabBar.getConfig().onSlideTabChangeName) {
            this._slideTabBar.getConfig().onSlideTabChangeName(this.primeval(), event);
          }
        };
        let inputAction = (event) => {
          if (input) {
            const brs = input.querySelectorAll('br');
            if (brs.length > 0) {
              brs.forEach((br) => {
                if (input) {
                  input.removeChild(br);
                }
              });
              input.blur();
            }
          }
        };
        if (input) {
          input.setAttribute('contentEditable', 'true');
          input.addEventListener('blur', blurAction);
          input.addEventListener('input', inputAction);
          input.focus();
          this._editMode = true;
          SheetUtils.keepLastIndex(input);
        }
      }
    });
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
    const slideTabRootContainer = this._slideTabBar.getSlideTabRootContainer();

    this._placeholder = placeholder;
    this._placeholder.style.width = `${boundingRect.width}px`;
    this._placeholder.style.height = `${boundingRect.height}px`;
    this._placeholder.style.flexShrink = '0';

    this._slideTabItem.style.position = 'fixed';
    this._slideTabItem.style.zIndex = '1';
    this._slideTabItem.style.left = `${boundingRect.x - this.getScrollbar().getScrollX()}px`;
    this._slideTabItem.style.top = `${boundingRect.y}px`;
    this._slideTabItem.style.width = `${boundingRect.width}px`;
    this._slideTabItem.style.height = `${boundingRect.height}px`;

    this._slideTabItem.after(placeholder);
    slideTabRootContainer.appendChild(this._slideTabItem);
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

  isEditMode() {
    return this._editMode;
  }

  getBoundingRect() {
    const boundingClientRect = this._slideTabItem.getBoundingClientRect();
    const slideTabRootContainer = this._slideTabBar.getSlideTabRootContainer();
    boundingClientRect.x -= slideTabRootContainer.getBoundingClientRect().x;
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
