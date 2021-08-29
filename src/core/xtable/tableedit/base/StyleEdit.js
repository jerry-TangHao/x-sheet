/* global document */
import { DomUtils } from '../../../../utils/DomUtils';
import { BaseEdit } from './BaseEdit';
import { h } from '../../../../lib/Element';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { CheckNode, Selection } from '../../../../lib/Selection';

class StyleFormat extends BaseEdit {

  rmNullQuality(element) {
    const attribute = 'style';
    const ignore = ['br'];
    const value = element.attr(attribute);
    const tagName = element.tagName();
    if (element.hasChildElement()) {
      const children = element.children();
      children.forEach((element) => {
        this.rmNullQuality(element);
      });
    }
    if (SheetUtils.isBlank(value)) {
      if (ignore.includes(tagName)) {
        return;
      }
      const nodes = element.childrenNodes();
      nodes.forEach((item) => {
        element.before(item);
      });
      element.remove();
    }
  }

  rmNullContent(element) {
    const content = element.text();
    const ignore = ['br'];
    const tagName = element.tagName();
    if (element.hasChild()) {
      const children = element.childrenNodes();
      children.forEach((element) => {
        this.rmNullContent(element);
      });
    }
    if (element.isTextNode()) {
      const content = element.nodeValue();
      if (SheetUtils.isBlank(content)) {
        element.remove();
      }
    } else {
      if (ignore.includes(tagName)) {
        return;
      }
      if (SheetUtils.isBlank(content)) {
        element.remove();
      }
    }
  }
}

class StyleWrapUp extends StyleFormat {

  wrapUpStyle(name, value) {
    let cssKeying = name;
    let container = h('span').css(cssKeying, value);
    let selection = new Selection({
      root: this,
      front: (elem) => {
        DomUtils.cssRemoveKeys(elem, cssKeying);
      },
      after: (elem) => {
        this.rmNullContent(this);
        this.rmNullQuality(elem);
      },
    });
    let checkNode = new CheckNode({
      condition: element => !element.equals(this),
      compare: (prev, next) => prev.equals(next) && !SheetUtils.isBlank(prev.css(cssKeying)),
      prevNode: selection.getRanged().startContainer(this),
      nextNode: selection.getRanged().endContainer(this),
    });
    let checking = checkNode.checking();
    if (SheetUtils.isUnDef(checking)) {
      selection.wrapSelection(container);
    } else {
      selection.splitSelection({
        checking, container,
      });
    }
  }

  toggleStyle(name, value) {
    let cssKeying = name;
    let container = h('span').css(cssKeying, value);
    let selection = new Selection({
      root: this,
      front: (elem) => {
        DomUtils.cssRemoveVal(elem, cssKeying, value);
      },
      after: (elem) => {
        this.rmNullContent(this);
        this.rmNullQuality(elem);
      },
    });
    let checkNode = new CheckNode({
      condition: element => !element.equals(this),
      compare: (prev, next) => {
        const css = prev.css(cssKeying);
        return prev.equals(next) && css === value;
      },
      prevNode: selection.getRanged().startContainer(this),
      nextNode: selection.getRanged().endContainer(this),
    });
    let checking = checkNode.checking();
    if (SheetUtils.isUnDef(checking)) {
      selection.wrapSelection(container);
    } else {
      selection.splitSelection({
        checking,
      });
    }
  }
}

class StyleEdit extends StyleWrapUp {

  constructor(table) {
    super(table);
    this.customStyle = false;
  }

  defaultWrap() {
    this.finds('font').forEach((ele) => {
      const color = ele.attr('color');
      const size = ele.attr('size');
      const name = ele.attr('name');
      if (SheetUtils.isDef(size)) {
        ele.after(h('span').css('font-size', `${size}px`).childrenNodesAppend(ele)).remove();
      }
      if (SheetUtils.isDef(name)) {
        ele.after(h('span').css('name', name).childrenNodesAppend(ele)).remove();
      }
      if (SheetUtils.isDef(color)) {
        ele.after(h('span').css('color', color).childrenNodesAppend(ele)).remove();
      }
    });
    this.finds('strike').forEach((ele) => {
      ele.after(h('span').css('text-decoration', 'line-through').childrenNodesAppend(ele)).remove();
    });
    this.finds('u').forEach((ele) => {
      ele.after(h('span').css('text-decoration', 'underline').childrenNodesAppend(ele)).remove();
    });
    this.finds('b').forEach((ele) => {
      ele.after(h('span').css('font-weight', 'bold').childrenNodesAppend(ele)).remove();
    });
    this.finds('i').forEach((ele) => {
      ele.after(h('span').css('font-style', 'italic').childrenNodesAppend(ele)).remove();
    });
  }

  fontSize(size) {
    this.customStyle = true;
    this.wrapUpStyle('font-size', `${size}px`);
  }

  fontFamily(name) {
    this.customStyle = true;
    this.wrapUpStyle('font-family', name);
  }

  fontColor(color) {
    this.customStyle = true;
    this.wrapUpStyle('color', color);
  }

  fontBold() {
    this.customStyle = true;
    this.toggleStyle('font-weight', 'bold');
  }

  fontItalic() {
    this.customStyle = true;
    this.toggleStyle('font-style', 'italic');
  }

  underLine() {
    this.customStyle = true;
    this.toggleStyle('text-decoration', 'underline');
  }

  strikeLine() {
    this.customStyle = true;
    this.toggleStyle('text-decoration', 'line-through');
  }

  insertHtml(html) {
    document.execCommand('insertHTML', false, html);
  }

}

export {
  StyleEdit,
};
