import { XSelectItem } from '../../xtable/xscreenitems/xselect/XSelectItem';
import { XTableEdit } from '../../xtable/XTableEdit';
import { XSelectPath } from '../../xtable/xscreenitems/xselect/XSelectPath';

function enter({ table, body, response }) {
  const { xTableScrollView } = table;
  const { edit, rows, xScreen } = table;
  const merges = table.getTableMerges();
  const xSelect = xScreen.findType(XSelectItem);
  response.push({
    keyCode: keyCode => keyCode === 13,
    handle: (event) => {
      if (edit.mode === XTableEdit.MODE.SHOW) {
        edit.hideEdit(event);
      }
      let scrollView = xTableScrollView.getScrollView();
      let { maxRi } = xTableScrollView.getScrollMaxRiCi();
      let { selectPath, selectRange } = xSelect;
      let rLen = rows.len - 1;
      let clone = selectRange.clone();
      let { sri, sci } = clone;
      selectPath.set({ sri, sci, mode: XSelectPath.MODE.TB });
      // 当前区域是否是合并单元格
      let merge = merges.getFirstIncludes(sri, sci);
      if (merge) {
        sri = merge.eri;
      }
      sri += 1;
      // 是否超过最大行数
      if (sri > rLen) {
        return;
      }
      clone.sci = selectPath.dci;
      clone.eci = selectPath.dci;
      clone.sri = sri;
      clone.eri = sri;
      // 目标区域是否是合并单元格
      merge = merges.getFirstIncludes(clone.sri, clone.sci);
      if (merge) {
        xSelect.setRange(merge);
      } else {
        xSelect.setRange(clone);
      }
      // 是否超过视图区域
      let maxERi = scrollView.eri - 1;
      if (sri > maxERi) {
        let diff = sri - maxERi;
        let next = scrollView.sri + diff;
        let scroll = next > maxRi ? maxRi : next;
        table.scrollRi(scroll);
        body.scrollBarSize();
        body.scrollBarLocal();
      }
      event.preventDefault();
    },
  });
}

function home({ table, response }) {
  const { xScreen } = table;
  const xSelect = xScreen.findType(XSelectItem);
  const merges = table.getTableMerges();
  response.push({
    keyCode: keyCode => keyCode === 36,
    handle: () => {
      let { selectRange } = xSelect;
      let clone = selectRange.clone();
      clone.sci = 0;
      clone.eci = 0;
      // 目标区域是否是合并单元格
      let merge = merges.getFirstIncludes(clone.sri, clone.sci);
      if (merge) {
        xSelect.setRange(merge);
      } else {
        xSelect.setRange(clone);
      }
    },
  });
}

function tab({ table, body, response }) {
  const { xTableScrollView } = table;
  const { cols, rows, xScreen, edit } = table;
  const xSelect = xScreen.findType(XSelectItem);
  const merges = table.getTableMerges();
  response.push({
    keyCode: keyCode => keyCode === 9,
    handle: (event) => {
      edit.hideEdit();
      let scrollView = xTableScrollView.getScrollView();
      let cLen = cols.len - 1;
      let rLen = rows.len - 1;
      let { selectPath, selectRange } = xSelect;
      let clone = selectRange.clone();
      let { sri, sci } = clone;
      selectPath.set({ sri, sci, mode: XSelectPath.MODE.LR });
      // 当前区域是否是合并单元格
      let merge = merges.getFirstIncludes(sri, sci);
      if (merge) {
        sci = merge.eci;
      }
      // 是否超过最大行数列数
      if (sri >= rLen) {
        if (sci >= cLen) {
          return;
        }
      }
      if (sci >= cLen) {
        sri += 1;
        sci = 0;
        selectPath.set({ sri, set: true });
      } else {
        sri = selectPath.dri;
        sci += 1;
      }
      clone.sri = sri;
      clone.sci = sci;
      clone.eri = sri;
      clone.eci = sci;
      // 目标区域是否是合并单元格
      merge = merges.getFirstIncludes(sri, sci);
      if (merge) {
        xSelect.setRange(merge);
      } else {
        xSelect.setRange(clone);
      }
      // 是否超过视图区域
      let minCi = scrollView.sci;
      let minRi = scrollView.sri;
      let maxCi = scrollView.eci - 1;
      let maxRi = scrollView.eri - 1;
      if (sci > maxCi) {
        let diff = sci - maxCi;
        let next = scrollView.sci + diff;
        table.scrollCi(next);
        body.scrollBarSize();
        body.scrollBarLocal();
      }
      if (sri > maxRi) {
        let diff = sri - maxRi;
        let next = scrollView.sri + diff;
        table.scrollRi(next);
        body.scrollBarSize();
        body.scrollBarLocal();
      }
      if (sci < minCi) {
        let diff = minCi - sci;
        let last = scrollView.sci - diff;
        table.scrollCi(last);
        body.scrollBarSize();
        body.scrollBarLocal();
      }
      if (sri < minRi) {
        let diff = minRi - sri;
        let last = scrollView.sri - diff;
        table.scrollRi(last);
        body.scrollBarSize();
        body.scrollBarLocal();
      }
      edit.showEdit();
      event.preventDefault();
    },
  });
}

function showEdit({ table, response }) {
  const { edit, xScreen } = table;
  const merges = table.getTableMerges();
  const xSelect = xScreen.findType(XSelectItem);
  response.push({
    keyCode: keyCode => (keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90),
    handle: (event) => {
      if (edit.mode === XTableEdit.MODE.HIDE) {
        let { selectRange } = xSelect;
        if (selectRange) {
          let clone = selectRange.clone();
          let { sri, sci } = clone;
          clone.sri = sri;
          clone.sci = sci;
          clone.eri = sri;
          clone.eci = sci;
          // 目标区域是否是合并单元格
          let merge = merges.getFirstIncludes(clone.sri, clone.sci);
          if (merge) {
            xSelect.setRange(merge);
          } else {
            xSelect.setRange(clone);
          }
          edit.showEdit(event);
        }
      }
    },
  });
}

function hideEdit({ table, response }) {
  const { edit } = table;
  response.push({
    keyCode: keyCode => keyCode === 27,
    handle: (event) => {
      if (edit.mode === XTableEdit.MODE.SHOW) {
        edit.hideEdit(event);
      }
    },
  });
}

function pageDown({ table, body, response }) {
  const { xTableScrollView, xScreen, rows } = table;
  const xSelect = xScreen.findType(XSelectItem);
  const merges = table.getTableMerges();
  response.push({
    keyCode: keyCode => keyCode === 34,
    handle: () => {
      // 滚动到指定行
      let scrollView = xTableScrollView.getScrollView();
      let { maxRi } = xTableScrollView.getScrollMaxRiCi();
      let { eri, sri } = scrollView;
      let curDiff = eri - sri;
      let value = sri + curDiff;
      let scroll = value > maxRi ? maxRi : value;
      table.scrollRi(scroll);
      body.scrollBarSize();
      body.scrollBarLocal();
      // 焦点框跟随
      let newScrollView = xTableScrollView.getScrollView();
      let { selectRange } = xSelect;
      if (selectRange) {
        let diffSri = selectRange.sri - scrollView.sri;
        let clone = selectRange.clone();
        clone.sri = newScrollView.sri + diffSri;
        clone.eri = clone.sri;
        // 最大行高度
        if (clone.sri > rows.len) {
          return;
        }
        // 目标区域是否是合并单元格
        let merge = merges.getFirstIncludes(clone.sri, clone.sci);
        if (merge) {
          xSelect.setRange(merge);
        } else {
          xSelect.setRange(clone);
        }
      }
    },
  });
}

function pageUp({ table, body, response }) {
  const { xTableScrollView, xScreen } = table;
  const xSelect = xScreen.findType(XSelectItem);
  const merges = table.getTableMerges();
  response.push({
    keyCode: keyCode => keyCode === 33,
    handle: () => {
      // 滚动到指定行
      let scrollView = xTableScrollView.getScrollView();
      let { eri, sri } = scrollView;
      let curDiff = eri - sri;
      let value = sri - curDiff;
      let minDiff = 0;
      let scroll = value <= minDiff ? minDiff : value;
      table.scrollRi(scroll);
      body.scrollBarSize();
      body.scrollBarLocal();
      // 焦点框跟随
      let newScrollView = xTableScrollView.getScrollView();
      let { selectRange } = xSelect;
      if (selectRange) {
        let diffSri = selectRange.sri - scrollView.sri;
        let clone = selectRange.clone();
        clone.sri = newScrollView.sri + diffSri;
        clone.eri = clone.sri;
        // 目标区域是否是合并单元格
        let merge = merges.getFirstIncludes(clone.sri, clone.sci);
        if (merge) {
          xSelect.setRange(merge);
        } else {
          xSelect.setRange(clone);
        }
      }
    },
  });
}

function arrowDown({ table, body, response }) {
  const { xTableScrollView } = table;
  const { edit, rows, xScreen } = table;
  const merges = table.getTableMerges();
  const xSelect = xScreen.findType(XSelectItem);
  response.push({
    keyCode: keyCode => keyCode === 40,
    handle: () => {
      if (edit.mode === XTableEdit.MODE.SHOW) {
        return;
      }
      let scrollView = xTableScrollView.getScrollView();
      let { maxRi } = xTableScrollView.getScrollMaxRiCi();
      let { selectPath, selectRange } = xSelect;
      let rLen = rows.len - 1;
      let clone = selectRange.clone();
      let { sri, sci } = clone;
      selectPath.set({ sri, sci, mode: XSelectPath.MODE.TB });
      // 当前区域是否是合并单元格
      let merge = merges.getFirstIncludes(sri, sci);
      if (merge) {
        sri = merge.eri;
      }
      sri += 1;
      // 是否超过最大行数
      if (sri > rLen) {
        return;
      }
      clone.sci = selectPath.dci;
      clone.eci = selectPath.dci;
      clone.sri = sri;
      clone.eri = sri;
      // 目标区域是否是合并单元格
      merge = merges.getFirstIncludes(clone.sri, clone.sci);
      if (merge) {
        xSelect.setRange(merge);
      } else {
        xSelect.setRange(clone);
      }
      // 是否超过视图区域
      let maxERi = scrollView.eri - 1;
      if (sri > maxERi) {
        let diff = sri - maxERi;
        let next = scrollView.sri + diff;
        let scroll = next > maxRi ? maxRi : next;
        table.scrollRi(scroll);
        body.scrollBarSize();
        body.scrollBarLocal();
      }
    },
  });
}

function arrowUp({ table, body, response }) {
  const { xTableScrollView } = table;
  const { edit, xScreen } = table;
  const merges = table.getTableMerges();
  const xSelect = xScreen.findType(XSelectItem);
  response.push({
    keyCode: keyCode => keyCode === 38,
    handle: () => {
      if (edit.mode === XTableEdit.MODE.SHOW) {
        return;
      }
      let scrollView = xTableScrollView.getScrollView();
      let { selectPath, selectRange } = xSelect;
      let clone = selectRange.clone();
      let { sri, sci } = clone;
      selectPath.set({ sri, sci, mode: XSelectPath.MODE.TB });
      sri -= 1;
      // 是否超过最小行数
      if (sri < 0) {
        return;
      }
      clone.sci = selectPath.dci;
      clone.eci = selectPath.dci;
      clone.sri = sri;
      clone.eri = sri;
      // 目标区域是否是合并单元格
      let merge = merges.getFirstIncludes(clone.sri, clone.sci);
      if (merge) {
        xSelect.setRange(merge);
      } else {
        xSelect.setRange(clone);
      }
      // 是否超过视图区域
      let minRi = scrollView.sri;
      if (sri < minRi) {
        let diff = minRi - sri;
        let last = scrollView.sri - diff;
        table.scrollRi(last);
        body.scrollBarSize();
        body.scrollBarLocal();
      }
    },
  });
}

function arrowLeft({ table, body, response }) {
  const { xTableScrollView } = table;
  const { edit, xScreen } = table;
  const merges = table.getTableMerges();
  const xSelect = xScreen.findType(XSelectItem);
  response.push({
    keyCode: keyCode => keyCode === 37,
    handle: () => {
      if (edit.mode === XTableEdit.MODE.SHOW) {
        return;
      }
      let scrollView = xTableScrollView.getScrollView();
      let { selectPath, selectRange } = xSelect;
      let clone = selectRange.clone();
      let { sri, sci } = clone;
      selectPath.set({ sri, sci, mode: XSelectPath.MODE.LR });
      sci -= 1;
      // 是否超过最小列数
      if (sci < 0) {
        return;
      }
      clone.sri = selectPath.dri;
      clone.eri = selectPath.dri;
      clone.sci = sci;
      clone.eci = sci;
      // 目标区域是否是合并单元格
      let merge = merges.getFirstIncludes(clone.sri, clone.sci);
      if (merge) {
        xSelect.setRange(merge);
      } else {
        xSelect.setRange(clone);
      }
      // 是否超过视图区域
      let minCi = scrollView.sci;
      if (sci < minCi) {
        let diff = minCi - sci;
        let last = scrollView.sci - diff;
        table.scrollCi(last);
        body.scrollBarSize();
        body.scrollBarLocal();
      }
    },
  });
}

function arrowRight({ table, body, response }) {
  const { xTableScrollView } = table;
  const { edit, cols, xScreen } = table;
  const merges = table.getTableMerges();
  const xSelect = xScreen.findType(XSelectItem);
  response.push({
    keyCode: keyCode => keyCode === 39,
    handle: () => {
      if (edit.mode === XTableEdit.MODE.SHOW) {
        return;
      }
      let scrollView = xTableScrollView.getScrollView();
      let { maxCi } = xTableScrollView.getScrollMaxRiCi();
      let { selectPath, selectRange } = xSelect;
      let clone = selectRange.clone();
      let cLen = cols.len - 1;
      let { sci, sri } = clone;
      selectPath.set({ sri, sci, mode: XSelectPath.MODE.LR });
      // 当前区域是否是合并单元格
      let merge = merges.getFirstIncludes(sri, sci);
      if (merge) {
        sci = merge.eci;
      }
      sci += 1;
      // 是否超过最大列数
      if (sci > cLen) {
        return;
      }
      clone.sri = selectPath.dri;
      clone.eri = selectPath.dri;
      clone.sci = sci;
      clone.eci = sci;
      // 目标区域是否是合并单元格
      merge = merges.getFirstIncludes(clone.sri, clone.sci);
      if (merge) {
        xSelect.setRange(merge);
      } else {
        xSelect.setRange(clone);
      }
      // 是否超过视图区域
      let maxECi = scrollView.eci - 1;
      if (sci > maxECi) {
        let diff = sci - maxECi;
        let next = scrollView.sci + diff;
        let scroll = next > maxCi ? maxCi : next;
        table.scrollCi(scroll);
        body.scrollBarSize();
        body.scrollBarLocal();
      }
    },
  });
}

class XWorkBodyKeyHandle {

  static register({ table, body }) {
    const { keyboard } = table;
    const response = [];
    home({ table, body, response });
    enter({ table, body, response });
    tab({ table, body, response });
    showEdit({ table, body, response });
    hideEdit({ table, body, response });
    pageUp({ table, body, response });
    pageDown({ table, body, response });
    arrowUp({ table, body, response });
    arrowDown({ table, body, response });
    arrowLeft({ table, body, response });
    arrowRight({ table, body, response });
    keyboard.register({
      target: table, response,
    });
  }

}

export {
  XWorkBodyKeyHandle,
};
