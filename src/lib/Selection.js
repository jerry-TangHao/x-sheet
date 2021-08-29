/* global window document */
import { h } from './Element';
import { DomUtils } from '../utils/DomUtils';

class CheckNode {

  constructor({
    condition,
    compare,
    prevNode,
    nextNode = prevNode,
  }) {
    this.condition = condition;
    this.compare = compare;
    this.prevNode = prevNode;
    this.nextNode = nextNode;
  }

  checking() {
    let { condition, compare } = this;
    let { prevNode, nextNode } = this;
    let prevStack = [];
    let nextStack = [];
    let prevParent = prevNode.parent();
    let nextParent = nextNode.parent();
    while (condition(prevParent)) {
      prevStack.push(prevParent);
      prevParent = prevParent.parent();
    }
    while (condition(nextParent)) {
      nextStack.push(nextParent);
      nextParent = nextParent.parent();
    }
    for (let prev of prevStack) {
      for (let next of nextStack) {
        if (compare(prev, next)) {
          return prev;
        }
      }
    }
    return null;
  }
}

class SplitNode {

  constructor({
    condition,
    splitPoint,
  }) {
    this.condition = condition;
    this.splitPoint = splitPoint;
  }

  splitting() {
    let { splitPoint } = this;
    let { condition } = this;
    let prevSplit = splitPoint;
    let nextSplit = splitPoint;
    let prevParent = null;
    let nextParent = null;
    while (condition(prevSplit)) {
      let tempParent = prevSplit.parent().clone().empty();
      if (prevParent) tempParent.prepend(prevParent);
      prevParent = tempParent;
      DomUtils.prev(prevSplit).forEach((element) => {
        prevParent.prepend(element.clone());
      });
      prevSplit = prevSplit.parent();
    }
    while (condition(nextSplit)) {
      let tempParent = nextSplit.parent().clone().empty();
      if (nextParent) tempParent.prepend(nextParent);
      nextParent = tempParent;
      DomUtils.next(nextSplit).forEach((element) => {
        nextParent.append(element.clone());
      });
      nextSplit = nextSplit.parent();
    }
    return {
      prevParent, nextParent,
    };
  }
}

class SplitType {

  constructor({
    condition,
    element,
    splitPoint,
  }) {
    this.condition = condition;
    this.element = element;
    this.splitPoint = splitPoint;
  }

  splitting() {
    let { condition } = this;
    let { splitPoint } = this;
    let stack = [];
    let parent = splitPoint.parent();
    while (condition(parent)) {
      stack.push(parent.clone().empty());
      parent = parent.parent();
    }
    let { element } = this;
    let original = element;
    let index = 0;
    while (index < stack.length) {
      let parent = stack[index];
      parent.append(element);
      element = parent;
      index++;
    }
    return {
      newElement: element,
      oldElement: original,
    };
  }
}

class RangeNode {

  constructor() {
    this.range = window.getSelection().rangeCount > 0
      ? window.getSelection().getRangeAt(0)
      : document.createRange();
  }

  selectNodeContents(element) {
    this.range.selectNodeContents(element.get());
  }

  setStart({
    element,
    offset = 0,
  }) {
    this.range.setStart(element.get(), offset);
  }

  setEnd({
    element,
    offset = 0,
  }) {
    this.range.setEnd(element.get(), offset);
  }

  selectTextStartEnd({
    start,
    end,
  }) {
    if (start.equals(end)) {
      this.selectNodeContents(start);
    } else {
      this.setStart({
        element: start,
      });
      this.setEnd({
        element: end, offset: end.text().length,
      });
    }
  }

  collapse(toStart = false) {
    this.range.collapse(toStart);
  }

  deleteContents() {
    this.range.deleteContents();
  }

  cloneContents() {
    return h(this.range.cloneContents());
  }

  insertNode(element) {
    this.range.insertNode(element.get());
  }

  startContainer(element) {
    const { startContainer } = this.range;
    if (element) {
      return h(startContainer).equals(element) ? element.first() : h(startContainer);
    }
    return h(startContainer);
  }

  endContainer(element) {
    const { endContainer } = this.range;
    if (element) {
      return h(endContainer).equals(element) ? element.last() : h(endContainer);
    }
    return h(endContainer);
  }

}

class Selection {

  constructor({
    root,
    front,
    after,
  }) {
    this.root = root;
    this.front = front;
    this.after = after;
    this.ranged = new RangeNode();
  }

  splitPoint() {
    const { ranged } = this;
    const point = h('span').addClass('selection-point');
    ranged.deleteContents();
    ranged.insertNode(point);
    return point;
  }

  getRanged() {
    return this.ranged;
  }

  wrapSelection(container) {
    let cloneContents = this.getRanged().cloneContents();
    let first = cloneContents.firstTextNode();
    let last = cloneContents.lastTextNode();
    this.front(cloneContents);
    container.append(cloneContents);
    this.getRanged().deleteContents();
    this.getRanged().insertNode(container);
    this.after(container);
    this.getRanged().selectTextStartEnd({
      start: first,
      end: last,
    });
  }

  splitSelection({
    checking, container,
  }) {
    let splitElem = this.getRanged().cloneContents();
    let splitPoint = this.splitPoint();
    let splitType = new SplitType({
      condition: node => !node.equals(checking),
      element: splitElem,
      splitPoint,
    });
    let splitNode = new SplitNode({
      condition: node => !node.equals(checking),
      splitPoint,
    });
    let typeSplit = splitType.splitting();
    let nodeSplit = splitNode.splitting();
    let { nextParent } = nodeSplit;
    let { prevParent } = nodeSplit;
    let { newElement } = typeSplit;
    let first = newElement.firstTextNode();
    let last = newElement.lastTextNode();
    this.front(newElement);
    if (container) {
      container.append(newElement);
    } else {
      container = newElement;
    }
    checking.after(nextParent);
    checking.after(container);
    checking.after(prevParent);
    checking.remove();
    this.after(container);
    this.getRanged().selectTextStartEnd({
      start: first,
      end: last,
    });
  }

}

export {
  CheckNode,
  RangeNode,
  SplitNode,
  SplitType,
  Selection,
};
