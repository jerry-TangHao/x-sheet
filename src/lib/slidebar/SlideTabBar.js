import { SlideTabItem } from './SlideTabItem';
import { SlideScrollbar } from './SlideScrollbar';

export class SlideTabBar {
  _config;

  _slideTabBar;

  _slideTabItems;

  _downActionX;

  _moveActionX;

  _compareIndex;

  _activeTabItem;

  _activeTabItemIndex;

  _moveAction;

  _upAction;

  _downAction;

  _compareDirection;

  _slideScrollbar;

  _scrollIncremental;

  _autoScrollTime;

  _autoScrollFrame() {
    this._compareDirection = this._activeTabItem.translateX(this._moveActionX);
    switch (this._compareDirection) {
      case 1: {
        this._slideScrollbar.scrollX(this._slideScrollbar.getScrollX() + this._scrollIncremental);
        this._compareRight();
        break;
      }
      case 0: {
        this._slideScrollbar.scrollX(this._slideScrollbar.getScrollX() + this._scrollIncremental);
        this._compareIndex = this._activeTabItemIndex;
        break;
      }
      case -1: {
        this._slideScrollbar.scrollX(this._slideScrollbar.getScrollX() + this._scrollIncremental);
        this._compareLeft();
        break;
      }
    }
    this._autoScrollTime = requestAnimationFrame(() => {
      this._autoScrollFrame();
    });
  }

  _startAutoScroll() {
    if (this._autoScrollTime == null) {
      this._autoScrollFrame();
    }
  }

  _closeAutoScroll() {
    cancelAnimationFrame(this._autoScrollTime);
    this._autoScrollTime = null;
  }

  _scrollLeft(event) {
    const boundingRect = this.getBoundingRect();
    const boundingLine = 10;
    const x = event.pageX - boundingRect.x;
    if (x < boundingLine) {
      this._scrollIncremental = -Math.min(Math.abs(x - boundingLine) * 0.1, 50);
    }
  }

  _scrollRight(event) {
    const boundingRect = this.getBoundingRect();
    const boundingLine = 10;
    const x = event.pageX - boundingRect.x;
    if (x > boundingRect.width - boundingLine) {
      this._scrollIncremental = Math.min(Math.abs(x - (boundingRect.width - boundingLine)) * 0.1, 50);
    }
  }

  _initialize() {
    document.addEventListener('mousemove', this._moveAction);
    document.addEventListener('mouseup', this._upAction);
    this._slideTabBar.addEventListener('wheel', this._wheelAction);
    this._slideTabItems.forEach((item) => {
      item.addEventListener('mousedown', this._downAction);
    });
  }

  _sortedItems() {
    if (this._activeTabItem) {
      this._slideTabItems.splice(this._activeTabItemIndex, 1);
      this._slideTabItems.splice(this._compareIndex, 0, this._activeTabItem);
      for (let i = 0; i < this._slideTabItems.length; i++) {
        let item = this._slideTabItems[i];
        let next = this._slideTabItems[i + 1];
        if (next) {
          item.after(next);
        }
      }
    }
  }

  _updateItems() {
    for (let i = 0; i < this._slideTabItems.length; i++) {
      this._slideTabItems[i].animate().cancel();
      this._slideTabItems[i].translateX(0);
      this._slideTabItems[i].update();
    }
  }

  _compareLeft() {
    let splice = this._slideTabItems.findIndex((item) => item.equals(this._activeTabItem));
    let length = this._slideTabItems.length;
    let collect = [];
    for (let i = 0; i < splice; i++) {
      if (i >= splice) {
        break;
      }
      collect.push(this._slideTabItems[i]);
    }

    for (let i = splice + 1; i < length; i++) {
      this._slideTabItems[i].animate().translateX(0);
    }

    let notFound = true;
    for (let i = collect.length - 1; i >= 0; i--) {
      let item = collect[i];
      if (SlideTabItem.midline(this._activeTabItem) < item.getMidLine()) {
        item.animate().translateX(this._activeTabItem.getWidth());
        this._compareIndex = i;
        notFound = false;
      } else {
        item.animate().translateX(0);
        if (notFound) {
          this._compareIndex = this._activeTabItemIndex;
        }
      }
    }
  }

  _compareRight() {
    let splice = this._slideTabItems.findIndex((item) => item.equals(this._activeTabItem));
    let length = this._slideTabItems.length;
    let collect = [];
    for (let i = splice + 1; i < length; i++) {
      collect.push(this._slideTabItems[i]);
    }

    for (let i = 0; i < splice; i++) {
      this._slideTabItems[i].animate().translateX(0);
    }

    let notFound = true;
    for (let i = 0; i < collect.length; i++) {
      let item = collect[i];
      if (SlideTabItem.midline(this._activeTabItem) > item.getMidLine()) {
        item.animate().translateX(-this._activeTabItem.getWidth());
        this._compareIndex = splice + i + 1;
        notFound = false;
      } else {
        item.animate().translateX(0);
        if (notFound) {
          this._compareIndex = this._activeTabItemIndex;
        }
      }
    }
  }

  constructor(config) {
    config = {
      slideTabBarClassName: 'slide-tab-bar',
      slideTabItemClassName: 'slide-tab-item',
      slideTabActiveClassName: 'slide-tab-active',
      ...config,
    };
    this._config = config;
    this._activeTabItem = null;
    this._downActionX = 0;
    this._moveActionX = 0;
    this._compareDirection = 0;
    this._compareIndex = 0;
    this._activeTabItemIndex = 0;
    this._slideTabBar = document.querySelector(`.${config.slideTabBarClassName}`);
    this._slideScrollbar = new SlideScrollbar(this);
    this._slideTabItems = SlideTabItem.make(document.querySelectorAll(`.${config.slideTabItemClassName}`), this);
    this._downAction = (event) => {
      const activeTabItemIndex = this._slideTabItems.findIndex((item) => item.equals(event.currentTarget));
      if (activeTabItemIndex > -1) {
        this._compareIndex = activeTabItemIndex;
        this._downActionX = event.pageX;
        this._moveActionX = 0;
        this._scrollIncremental = 0;
        this._activeTabItem = this._slideTabItems[activeTabItemIndex];
        this._activeTabItemIndex = activeTabItemIndex;
        this._slideTabItems.forEach((item) => {
          item.classList().remove(`${config.slideTabActiveClassName}`);
        });
        this._activeTabItem.classList().add(`${config.slideTabActiveClassName}`);
        this._activeTabItem.enableFixed();
        this._startAutoScroll();
      } else {
        this._updateItems();
        this._activeTabItemIndex = 0;
        this._downActionX = 0;
        this._scrollIncremental = 0;
        this._compareIndex = 0;
        this._activeTabItem = null;
      }
    };
    this._upAction = (event) => {
      if (this._activeTabItem) {
        this._closeAutoScroll();
        this._activeTabItem.disableFixed();
        this._sortedItems();
        this._updateItems();

        if (this._config.onSlideEnd && this._activeTabItemIndex !== this._compareIndex) {
          this._config.onSlideEnd(event);
        }

        this._scrollIncremental = 0;
        this._activeTabItemIndex = 0;
        this._downActionX = 0;
        this._moveActionX = 0;
        this._compareIndex = 0;

        // fix bug
        let clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        this._activeTabItem.primeval().dispatchEvent(clickEvent);

        this._activeTabItem = null;
      }
    };
    this._moveAction = (event) => {
      if (this._activeTabItem) {
        this._moveActionX = event.pageX - this._downActionX;
        this._scrollIncremental = 0;
        this._scrollLeft(event);
        this._scrollRight(event);
      }
    };
    this._wheelAction = (event) => {
      if (event.deltaY > 0) {
        this._slideScrollbar.scrollX(this._slideScrollbar.getScrollX() + event.deltaY);
      } else {
        this._slideScrollbar.scrollX(this._slideScrollbar.getScrollX() + event.deltaY);
      }
    };
    this._initialize();
  }

  getScrollbar() {
    return this._slideScrollbar;
  }

  getBoundingRect() {
    return this._slideTabBar.getBoundingClientRect();
  }

  getSlideTabItems() {
    return this._slideTabItems;
  }

  destroy() {
    document.removeEventListener('mousemove', this._moveAction);
    document.removeEventListener('mouseup', this._upAction);
    this._slideTabBar.removeEventListener('wheel', this._wheelAction);
    this._slideTabItems.forEach((item) => {
      item.removeEventListener('mousedown', this._downAction);
    });
  }

  primeval() {
    return this._slideTabBar;
  }
}
