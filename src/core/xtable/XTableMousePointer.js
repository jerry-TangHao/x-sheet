import cell from '../../../assets/img/cell.png';
import sResize from '../../../assets/img/s-resize.png';
import eResize from '../../../assets/img/e-resize.png';

class XTableMousePointer {

  constructor(table) {
    this.flag = null;
    this.table = table;
  }

  lock(flag) {
    if (this.flag === null) {
      this.flag = flag;
    }
    return this;
  }

  free(flag) {
    if (this.flag === flag) {
      this.flag = null;
      return true;
    }
    return false;
  }

  set(type, token) {
    if (this.flag !== null) {
      if (this.flag !== token) {
        return;
      }
    }
    const { table } = this;
    switch (type) {
      case 's-resize':
        table.css('cursor', `url(${sResize}) 2.5 7.5,auto`);
        return;
      case 'cell':
        table.css('cursor', `url(${cell}) 7.5 7.5,auto`);
        return;
      case 'e-resize':
        table.css('cursor', `url(${eResize}) 7.5 2.5,auto`);
        return;
    }
    table.css('cursor', type);
  }

}

XTableMousePointer.KEYS = {
  cell: 'cell',
  pointer: 'pointer',
  default: 'default',
  crosshair: 'crosshair',
  eResize: 'e-resize',
  sResize: 's-resize',
  grab: '-webkit-grab',
  rowResize: 'row-resize',
  colResize: 'col-resize',
};

export { XTableMousePointer };
