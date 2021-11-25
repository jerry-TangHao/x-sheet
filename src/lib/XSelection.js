import { h } from './Element';
import { DomUtils } from '../utils/DomUtils';
import { SheetUtils } from '../utils/SheetUtils';

const DECORATION = 'text-decoration';

/**
 * XSelection
 */
class XSelection {

  /**
   * XSelection
   * @param root
   */
  constructor(root) {
    this._root = root;
  }

  /**
   * 删除选择节点的样式
   * @param contentNode
   * @param styleName
   * @param styleValue
   * @private
   */
  _removeSelectNodeStyle(contentNode, styleName, styleValue) {
    if (styleName === DECORATION) {
      DomUtils.cssRemoveVal(contentNode, styleName, styleValue);
    } else {
      DomUtils.cssRemoveKeys(contentNode, styleName);
    }
  }

  /**
   * 清理无效的节点
   * @private
   */
  _clearInvalidNode(node = this._root) {
    if (node.hasChildElement()) {
      const children = node.children();
      children.forEach((child) => {
        this._clearInvalidNode(child);
      });
    }
    const attribute = 'style';
    const ignore = ['br'];
    const value = node.attr(attribute);
    const html = node.html();
    const tagName = node.tagName();
    if (SheetUtils.isBlank(value)) {
      if (ignore.includes(tagName)) {
        return;
      }
      node.childrenNodes().forEach((child) => {
        node.before(child);
      });
      node.remove();
    }
    if (SheetUtils.isBlank(html)) {
      if (ignore.includes(tagName)) {
        return;
      }
      node.remove();
    }
  }

  /**
   * 插入节点
   * @param node
   * @return {*}
   * @private
   */
  _insertCoverSelectNode(node) {
    this._getSelectionRange().deleteContents();
    this._getSelectionRange().insertNode(node.get());
    return node;
  }

  /**
   *  插入标记节点
   * @return {*}
   * @private
   */
  _insertPointCoverSelectNode() {
    const point = h('span');
    return this._insertCoverSelectNode(point);
  }

  /**
   * 获取选择的第一个区域
   * @return {Range}
   * @private
   */
  _getSelectionRange() {
    // eslint-disable-next-line no-undef
    return window.getSelection().rangeCount > 0
      // eslint-disable-next-line no-undef
      ? window.getSelection().getRangeAt(0)
      // eslint-disable-next-line no-undef
      : document.createRange();
  }

  /**
   * 获取选择节点区域末尾节点
   * @return {Element}
   * @private
   */
  _getSelectionEndNode() {
    const { endContainer } = this._getSelectionRange();
    return h(endContainer);
  }

  /**
   * 获取选择节点区域开始节点
   * @return {Element}
   * @private
   */
  _getSelectionStartNode() {
    const { startContainer } = this._getSelectionRange();
    return h(startContainer);
  }

  /**
   * 获取用户选择的节点
   * @private
   */
  _getSelectionContentNode() {
    return h(this._getSelectionRange().cloneContents());
  }

  /**
   * 是否存在用户选中的节点
   * @private
   */
  _hasSelectContentNode() {
    return !!this._getSelectionContentNode();
  }

  /**
   * 设置选择边界
   * @param startNode
   * @param endNode
   * @private
   */
  _setSelectTextNode(startNode, endNode) {
    if (startNode && endNode) {
      if (startNode.equals(endNode)) {
        this._getSelectionRange().selectNodeContents(startNode.get());
      } else {
        this._getSelectionRange().setStart(startNode.get(), 0);
        this._getSelectionRange().setEnd(endNode.get(), endNode.text().length);
      }
    } else if (startNode) {
      this._getSelectionRange().selectNodeContents(startNode.get());
    }
  }

  /**
   * 切换选中区域的样式
   * @param styleName
   * @param styleValue
   */
  toggleSelectNodeStyle(styleName, styleValue) {
    if (this._hasSelectContentNode()) {
      // 存在样式就拆分，不存在就包裹
      if (this._selectNodeHasStyle(styleName, styleValue)) {
        // 获取拆分点
        const commonNode = this._searchCommonStyleValueNode(styleName, styleValue);
        if (commonNode.equals(this._root)) {
          this._eraseSelectNodeAction(styleName, styleValue);
        } else {
          this._splitSelectNodeAction(commonNode);
        }
      } else {
        this._wrapSelectNodeAction(styleName, styleValue);
      }
    }
  }

  /**
   * 包裹选中区域的样式
   * @param styleName
   * @param styleValue
   */
  wrapSelectNodeStyle(styleName, styleValue) {
    if (this._hasSelectContentNode()) {
      this._wrapSelectNodeAction(styleName, styleValue);
    }
  }

  /**
   * 拷贝选择节点的父节点
   * @param pointNode
   * @param selectNode
   * @param boundaryNode
   * @private
   */
  _copySelectNodeParent(pointNode, selectNode, boundaryNode) {
    let parent = pointNode.parent();
    let stack = [];
    while (!parent.equals(boundaryNode)) {
      stack.push(parent.clone().empty());
      parent = parent.parent();
    }
    let contentNode = selectNode;
    let index = 0;
    while (index < stack.length) {
      let parent = stack[index];
      parent.append(contentNode);
      contentNode = parent;
      index++;
    }
    return contentNode;
  }

  /**
   * 选择的节点中是否包含指定样式
   * @param styleName
   * @param styleValue
   * @private
   */
  _selectNodeHasStyle(styleName, styleValue) {
    let startNode = this._getSelectionStartNode();
    let endNode = this._getSelectionEndNode();
    let contentNode = this._getSelectionContentNode();
    while (!endNode.equals(this._root)) {
      if (endNode.css(styleName) === styleValue) {
        return true;
      }
      endNode = endNode.parent();
    }
    while (!startNode.equals(this._root)) {
      if (startNode.css(styleName) === styleValue) {
        return true;
      }
      startNode = startNode.parent();
    }
    return DomUtils.hasStyle(contentNode, styleName, styleValue);
  }

  /**
   * 搜索开始节点和结束节点的公共父节点
   * @param styleName
   * @param styleValue
   * @private
   */
  _searchCommonStyleValueNode(styleName, styleValue) {
    let prevStack = [];
    let nextStack = [];
    let prevNode = this._getSelectionStartNode().parent();
    let nextNode = this._getSelectionEndNode().parent();
    while (!prevNode.equals(this._root)) {
      prevStack.push(prevNode);
      prevNode = prevNode.parent();
    }
    while (!nextNode.equals(this._root)) {
      nextStack.push(nextNode);
      nextNode = nextNode.parent();
    }
    for (let i = 0; i < prevStack.length; i++) {
      for (let j = 0; j < nextStack.length; j++) {
        if (prevStack[i].equals(nextStack[j])) {
          if (prevStack[i].css(styleName) === styleValue) {
            return prevStack[i];
          }
        }
      }
    }
    return this._root;
  }

  /**
   * 包装节点时搜索开始节点和结束节点的公共父节点
   * @param styleName
   * @private
   */
  _searchCommonStyleNode(styleName) {
    let prevStack = [];
    let nextStack = [];
    let prevNode = this._getSelectionStartNode().parent();
    let nextNode = this._getSelectionEndNode().parent();
    while (!prevNode.equals(this._root)) {
      prevStack.push(prevNode);
      prevNode = prevNode.parent();
    }
    while (!nextNode.equals(this._root)) {
      nextStack.push(nextNode);
      nextNode = nextNode.parent();
    }
    let search = null;
    for (let i = 0; i < prevStack.length; i++) {
      for (let j = 0; j < nextStack.length; j++) {
        if (prevStack[i].equals(nextStack[j])) {
          if (!SheetUtils.isBlank(prevStack[i].css(styleName))) {
            search = prevStack[i];
          }
        }
      }
    }
    return search || this._root;
  }

  /**
   * 拷贝选择节点两边的节点树
   * @param pointNode
   * @param boundaryNode
   * @private
   */
  _copySelectNodeBothNode(pointNode, boundaryNode) {
    let prevSplit = pointNode;
    let nextSplit = pointNode;
    let prevParent = null;
    let nextParent = null;
    while (!prevSplit.equals(boundaryNode)) {
      let tempParent = prevSplit.parent().clone().empty();
      if (prevParent) tempParent.prepend(prevParent);
      prevParent = tempParent;
      DomUtils.prev(prevSplit).forEach((element) => {
        prevParent.prepend(element.clone());
      });
      prevSplit = prevSplit.parent();
    }
    while (!nextSplit.equals(boundaryNode)) {
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

  /**
   * 选中的文本添加包围节点
   * @param selectNode
   * @param wrappingNode
   * @private
   */
  _textNodeWrappingAction(selectNode, wrappingNode) {
    if (selectNode.hasChild()) {
      selectNode.childrenNodes().forEach((ele) => {
        this._textNodeWrappingAction(ele, wrappingNode);
      });
    }
    if (selectNode.isTextNode()) {
      const clone = wrappingNode.clone();
      selectNode.after(clone);
      clone.append(selectNode);
    }
    return selectNode;
  }

  /**
   * 拆分选择的节点
   * @param boundaryNode
   * @private
   */
  _splitSelectNodeAction(boundaryNode) {
    let contentNode = this._getSelectionContentNode();
    let pointNode = this._insertPointCoverSelectNode();
    let middleNode = this._copySelectNodeParent(pointNode, contentNode, boundaryNode);
    let bothNode = this._copySelectNodeBothNode(pointNode, boundaryNode);
    let startNode = middleNode.firstTextNode();
    let endNode = middleNode.lastTextNode();
    boundaryNode.after(bothNode.nextParent);
    boundaryNode.after(middleNode);
    boundaryNode.after(bothNode.prevParent);
    boundaryNode.remove();
    this._clearInvalidNode();
    this._setSelectTextNode(startNode, endNode);
  }

  /**
   * 擦除选择节点的指定样式
   * @param styleName
   * @param styleValue
   * @private
   */
  _eraseSelectNodeAction(styleName, styleValue) {
    const contentNode = this._getSelectionContentNode();
    this._removeSelectNodeStyle(contentNode, styleName, styleValue);
    let startNode = contentNode.firstTextNode();
    let endNode = contentNode.lastTextNode();
    this._insertCoverSelectNode(contentNode);
    this._clearInvalidNode();
    this._setSelectTextNode(startNode, endNode);
  }

  /**
   * 包装节点时拆分下划线节点
   * @param contentNode
   * @param wrappingNode
   * @param boundaryNode
   * @private
   */
  _wrapSplitContentNode(contentNode, wrappingNode, boundaryNode) {
    let pointNode = this._insertPointCoverSelectNode();
    let middleNode = this._copySelectNodeParent(pointNode, contentNode, boundaryNode);
    let bothNode = this._copySelectNodeBothNode(pointNode, boundaryNode);
    wrappingNode.append(boundaryNode.clone().empty().append(middleNode));
    let endNode = wrappingNode.lastTextNode();
    let startNode = wrappingNode.firstTextNode();
    boundaryNode.after(bothNode.nextParent);
    boundaryNode.after(wrappingNode);
    boundaryNode.after(bothNode.prevParent);
    boundaryNode.remove();
    this._clearInvalidNode();
    this._setSelectTextNode(startNode, endNode);
  }

  /**
   * 包装选择的节点的指定样式
   * @param styleName
   * @param styleValue
   * @private
   */
  _wrapSelectNodeAction(styleName, styleValue) {
    const wrappingNode = h('span').css(styleName, styleValue);
    const contentNode = this._getSelectionContentNode();
    if (styleName === DECORATION) {
      this._textNodeWrappingAction(contentNode, wrappingNode);
      let startNode = contentNode.firstTextNode();
      let endNode = contentNode.lastTextNode();
      this._insertCoverSelectNode(contentNode);
      this._clearInvalidNode();
      this._setSelectTextNode(startNode, endNode);
    } else {
      const commonNode = this._searchCommonStyleNode(DECORATION);
      if (!commonNode.equals(this._root)) {
        this._removeSelectNodeStyle(contentNode, styleName, styleValue);
        this._wrapSplitContentNode(contentNode, wrappingNode, commonNode);
      } else {
        this._removeSelectNodeStyle(contentNode, styleName, styleValue);
        wrappingNode.append(contentNode);
        let startNode = wrappingNode.firstTextNode();
        let endNode = wrappingNode.lastTextNode();
        this._insertCoverSelectNode(wrappingNode);
        this._clearInvalidNode();
        this._setSelectTextNode(startNode, endNode);
      }
    }
  }
}

export {
  XSelection,
};
