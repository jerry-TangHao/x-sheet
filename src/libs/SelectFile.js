import { Element } from './Element';
import { cssPrefix } from '../const/Constant';
import { XEvent } from './XEvent';

class SelectFile extends Element {

  constructor({
    multiple = false,
    accept = '*',
  }) {
    super('input', `${cssPrefix}-select-file`);
    this.attr('type', 'file');
    this.attr('accept', accept);
    if (multiple) {
      this.attr('multiple', 'multiple');
    }
    this.accept = accept;
    this.multiple = multiple;
  }

  async choose() {
    XEvent.unbind(this, 'change');
    this.val('');
    return new Promise((resolve) => {
      XEvent.bind(this, 'change', () => {
        const files = this.el.files;
        if (files.length) {
          if (this.multiple) {
            resolve(files);
          } else {
            resolve(files[0]);
          }
        } else {
          resolve(null);
        }
      }).trigger('click');
    });
  }

}

SelectFile.ACCEPT = {
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  CVS: '.csv',
  TXT: 'text/plain',
  IMAGE: 'image/*',
};

export {
  SelectFile,
};
