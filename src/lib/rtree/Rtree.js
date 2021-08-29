import { QSelect } from './Qselect';

function findItem(item, items, equalsFn) {
  if (!equalsFn) {
    return items.indexOf(item);
  }
  for (let i = 0; i < items.length; i++) {
    if (equalsFn(item, items[i])) return i;
  }
  return -1;
}
function extend(a, b) {
  a.minX = Math.min(a.minX, b.minX);
  a.minY = Math.min(a.minY, b.minY);
  a.maxX = Math.max(a.maxX, b.maxX);
  a.maxY = Math.max(a.maxY, b.maxY);
  return a;
}
function compareNodeMinX(a, b) {
  return a.minX - b.minX;
}
function compareNodeMinY(a, b) {
  return a.minY - b.minY;
}
function bboxArea(a) {
  return (a.maxX - a.minX) * (a.maxY - a.minY);
}
function bboxMargin(a) {
  return (a.maxX - a.minX) + (a.maxY - a.minY);
}
function enlargedArea(a, b) {
  return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) * (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
}
function intersectionArea(a, b) {
  const minX = Math.max(a.minX, b.minX);
  const minY = Math.max(a.minY, b.minY);
  const maxX = Math.min(a.maxX, b.maxX);
  const maxY = Math.min(a.maxY, b.maxY);
  return Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
}
function contains(a, b) {
  return a.minX <= b.minX && a.minY <= b.minY && b.maxX <= a.maxX && b.maxY <= a.maxY;
}
function intersects(a, b) {
  return b.minX <= a.maxX && b.minY <= a.maxY && b.maxX >= a.minX && b.maxY >= a.minY;
}
function createNode(childrenNodes) {
  return {
    childrenNodes,
    height: 1,
    leaf: true,
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };
}
function distBBox(node, k, p, toBBox, destNode) {
  // 从 k 到 p-1 的节点子节点的最小边界矩形
  if (!destNode) destNode = createNode(null);
  destNode.minX = Infinity;
  destNode.minY = Infinity;
  destNode.maxX = -Infinity;
  destNode.maxY = -Infinity;
  for (let i = k; i < p; i++) {
    const child = node.childrenNodes[i];
    extend(destNode, node.leaf ? toBBox(child) : child);
  }
  return destNode;
}
function calcBBox(node, toBBox) {
  // 从其子节点的框计算节点框
  distBBox(node, 0, node.childrenNodes.length, toBBox, node);
}
function multiSelect(arr, left, right, n, compare) {
  // 对数组进行排序，以便项目以 n 个未排序项目为一组，各组在彼此之间排序；
  // 将选择算法与二元分治法相结合
  const stack = [left, right];
  while (stack.length) {
    right = stack.pop();
    left = stack.pop();
    if (right - left <= n) continue;
    const mid = left + Math.ceil((right - left) / n / 2) * n;
    QSelect(arr, mid, left, right, compare);
    stack.push(left, mid, mid, right);
  }
}

class Rtree {
  constructor(maxEntries = 9) {
    // 默认情况下，节点中的最大条目数为 9； 最小节点填充为 40% 以获得最佳性能
    this._maxEntries = Math.max(4, maxEntries);
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
    this.clear();
  }

  all() {
    return this._all(this.data, []);
  }

  search(bbox) {
    let node = this.data;
    const result = [];

    if (!intersects(bbox, node)) {
      return result;
    }

    const toBBox = this.toBBox;
    const nodesToSearch = [];

    while (node) {
      for (let i = 0; i < node.childrenNodes.length; i++) {
        const child = node.childrenNodes[i];
        const childBBox = node.leaf ? toBBox(child) : child;
        if (intersects(bbox, childBBox)) {
          if (node.leaf) result.push(child);
          else if (contains(bbox, childBBox)) this._all(child, result);
          else nodesToSearch.push(child);
        }
      }
      node = nodesToSearch.pop();
    }

    return result;
  }

  first(bbox) {
    return this.search(bbox)[0];
  }

  collides(bbox) {
    let node = this.data;

    if (!intersects(bbox, node)) {
      return false;
    }

    const nodesToSearch = [];
    while (node) {
      for (let i = 0; i < node.childrenNodes.length; i++) {
        const child = node.childrenNodes[i];
        const childBBox = node.leaf ? this.toBBox(child) : child;
        if (intersects(bbox, childBBox)) {
          if (node.leaf || contains(bbox, childBBox)) return true;
          nodesToSearch.push(child);
        }
      }
      node = nodesToSearch.pop();
    }

    return false;
  }

  load(data) {
    if (!(data && data.length)) {
      return this;
    }

    if (data.length < this._minEntries) {
      for (let i = 0; i < data.length; i++) {
        this.insert(data[i]);
      }
      return this;
    }

    // 使用 OMT 算法从头开始使用给定数据递归构建树
    let node = this._build(data.slice(), 0, data.length - 1, 0);

    if (!this.data.childrenNodes.length) {
      // 如果树为空，则按原样保存
      this.data = node;
    } else if (this.data.height === node.height) {
      // 如果树具有相同的高度，则拆分根
      this._splitRoot(this.data, node);
    } else {
      if (this.data.height < node.height) {
        // 如果插入的树更大，则交换树
        const tmpNode = this.data;
        this.data = node;
        node = tmpNode;
      }
      // 将小树插入大树中适当的层次
      this._insert(node, this.data.height - node.height - 1, true);
    }

    return this;
  }

  insert(item) {
    if (item) {
      this._insert(item, this.data.height - 1);
    }
    return this;
  }

  clear() {
    this.data = createNode([]);
    return this;
  }

  remove(item, equalsFn) {
    if (!item) {
      return this;
    }

    let node = this.data;
    const bbox = this.toBBox(item);
    const path = [];
    const indexes = [];
    let i;
    let parent;
    let goingUp;

    // 深度优先迭代树遍历
    while (node || path.length) {
      if (!node) {
        // 往上
        node = path.pop();
        parent = path[path.length - 1];
        i = indexes.pop();
        goingUp = true;
      }

      if (node.leaf) {
        // 检查当前节点
        const index = findItem(item, node.childrenNodes, equalsFn);
        if (index !== -1) {
          // 找到项目，移除项目并向上压缩树
          node.childrenNodes.splice(index, 1);
          path.push(node);
          this._condense(path);
          return this;
        }
      }

      if (!goingUp && !node.leaf && contains(node, bbox)) {
        // 往下
        path.push(node);
        indexes.push(i);
        i = 0;
        parent = node;
        node = node.childrenNodes[0];
      } else if (parent) {
        // 向右走
        i++;
        node = parent.childrenNodes[i];
        goingUp = false;
      } else {
        // 没有发现
        node = null;
      }
    }

    return this;
  }

  toBBox(item) {
    return item;
  }

  compareMinX(a, b) {
    return a.minX - b.minX;
  }

  compareMinY(a, b) {
    return a.minY - b.minY;
  }

  _all(node, result) {
    const nodesToSearch = [];
    while (node) {
      if (node.leaf) {
        result.push(...node.childrenNodes);
      } else {
        nodesToSearch.push(...node.childrenNodes);
      }
      node = nodesToSearch.pop();
    }
    return result;
  }

  _build(items, left, right, height) {
    const N = right - left + 1;
    let M = this._maxEntries;
    let node;

    if (N <= M) {
      // 达到叶级； 回叶
      node = createNode(items.slice(left, right + 1));
      calcBBox(node, this.toBBox);
      return node;
    }

    if (!height) {
      // 散装树的目标高度
      height = Math.ceil(Math.log(N) / Math.log(M));
      // 目标根条目数以最大限度地提高存储利用率
      M = Math.ceil(N / Math.pow(M, height - 1));
    }

    node = createNode([]);
    node.leaf = false;
    node.height = height;

    // 将项目分成 M 个主要为方形的元素
    const N2 = Math.ceil(N / M);
    const N1 = N2 * Math.ceil(Math.sqrt(M));

    multiSelect(items, left, right, N1, this.compareMinX);

    for (let i = left; i <= right; i += N1) {
      const right2 = Math.min(i + N1 - 1, right);
      multiSelect(items, i, right2, N2, this.compareMinY);
      for (let j = i; j <= right2; j += N2) {
        const right3 = Math.min(j + N2 - 1, right2);
        // 递归地打包每个条目
        node.childrenNodes.push(this._build(items, j, right3, height - 1));
      }
    }

    calcBBox(node, this.toBBox);

    return node;
  }

  _chooseSubtree(bbox, node, level, path) {
    while (true) {
      path.push(node);

      if (node.leaf || path.length - 1 === level) {
        break;
      }

      let minArea = Infinity;
      let minEnlargement = Infinity;
      let targetNode;

      for (let i = 0; i < node.childrenNodes.length; i++) {
        const child = node.childrenNodes[i];
        const area = bboxArea(child);
        const enlargement = enlargedArea(bbox, child) - area;

        // 选择最小面积扩大的入口
        if (enlargement < minEnlargement) {
          minEnlargement = enlargement;
          minArea = area < minArea ? area : minArea;
          targetNode = child;
        } else if (enlargement === minEnlargement) {
          // 否则选择面积最小的一个
          if (area < minArea) {
            minArea = area;
            targetNode = child;
          }
        }
      }

      node = targetNode || node.childrenNodes[0];
    }

    return node;
  }

  _insert(item, level, isNode) {
    const bbox = isNode ? item : this.toBBox(item);
    const insertPath = [];

    // 找到容纳物品的最佳节点，同时保存路径上的所有节点
    const node = this._chooseSubtree(bbox, this.data, level, insertPath);

    // 将项目放入节点
    node.childrenNodes.push(item);
    extend(node, bbox);

    // 节点溢出时分裂； 必要时向上传播
    while (level >= 0) {
      if (insertPath[level].childrenNodes.length > this._maxEntries) {
        this._split(insertPath, level);
        level--;
      } else {
        break;
      }
    }

    // 沿插入路径调整 bboxes
    this._adjustParentBBoxes(bbox, insertPath, level);
  }

  // 将溢出的节点一分为二
  _split(insertPath, level) {
    const node = insertPath[level];
    const M = node.childrenNodes.length;
    const m = this._minEntries;

    this._chooseSplitAxis(node, m, M);

    const splitIndex = this._chooseSplitIndex(node, m, M);

    const newNode = createNode(node.childrenNodes.splice(splitIndex, node.childrenNodes.length - splitIndex));
    newNode.height = node.height;
    newNode.leaf = node.leaf;

    calcBBox(node, this.toBBox);
    calcBBox(newNode, this.toBBox);

    if (level) {
      insertPath[level - 1].childrenNodes.push(newNode);
    } else {
      this._splitRoot(node, newNode);
    }
  }

  _splitRoot(node, newNode) {
    // 分裂根节点
    this.data = createNode([node, newNode]);
    this.data.height = node.height + 1;
    this.data.leaf = false;
    calcBBox(this.data, this.toBBox);
  }

  _chooseSplitIndex(node, m, M) {
    let index;
    let minOverlap = Infinity;
    let minArea = Infinity;

    for (let i = m; i <= M - m; i++) {
      const bbox1 = distBBox(node, 0, i, this.toBBox);
      const bbox2 = distBBox(node, i, M, this.toBBox);

      const overlap = intersectionArea(bbox1, bbox2);
      const area = bboxArea(bbox1) + bboxArea(bbox2);

      // 选择重叠最小的分布
      if (overlap < minOverlap) {
        minOverlap = overlap;
        index = i;
        minArea = area < minArea ? area : minArea;
      } else if (overlap === minOverlap) {
        // 否则选择面积最小的分布
        if (area < minArea) {
          minArea = area;
          index = i;
        }
      }
    }

    return index || M - m;
  }

  // 按最佳轴对节点子节点进行排序以进行拆分
  _chooseSplitAxis(node, m, M) {
    const compareMinX = node.leaf ? this.compareMinX : compareNodeMinX;
    const compareMinY = node.leaf ? this.compareMinY : compareNodeMinY;
    const xMargin = this._allDistMargin(node, m, M, compareMinX);
    const yMargin = this._allDistMargin(node, m, M, compareMinY);
    // 如果 x 的总分配边际值最小，则按 minX 排序,
    // 否则它已经按 minY 排序
    if (xMargin < yMargin) {
      node.childrenNodes.sort(compareMinX);
    }
  }

  // 所有可能的分割分布的总边际，其中每个节点至少是 m 满
  _allDistMargin(node, m, M, compare) {
    node.childrenNodes.sort(compare);

    const toBBox = this.toBBox;
    const leftBBox = distBBox(node, 0, m, toBBox);
    const rightBBox = distBBox(node, M - m, M, toBBox);
    let margin = bboxMargin(leftBBox) + bboxMargin(rightBBox);

    for (let i = m; i < M - m; i++) {
      const child = node.childrenNodes[i];
      extend(leftBBox, node.leaf ? toBBox(child) : child);
      margin += bboxMargin(leftBBox);
    }

    for (let i = M - m - 1; i >= m; i--) {
      const child = node.childrenNodes[i];
      extend(rightBBox, node.leaf ? toBBox(child) : child);
      margin += bboxMargin(rightBBox);
    }

    return margin;
  }

  _adjustParentBBoxes(bbox, path, level) {
    // 沿给定的树路径调整 bbox
    for (let i = level; i >= 0; i--) {
      extend(path[i], bbox);
    }
  }

  _condense(path) {
    // 遍历路径，删除空节点并更新 bboxes
    for (let i = path.length - 1, siblings; i >= 0; i--) {
      if (path[i].childrenNodes.length === 0) {
        if (i > 0) {
          siblings = path[i - 1].childrenNodes;
          siblings.splice(siblings.indexOf(path[i]), 1);
        } else {
          this.clear();
        }
      } else {
        calcBBox(path[i], this.toBBox);
      }
    }
  }
}

export {
  Rtree,
};
