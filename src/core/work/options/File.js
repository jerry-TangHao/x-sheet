import { Item } from './base/Item';
import { cssPrefix } from '../../../const/Constant';
import { FileContextMenu } from './contextmenu/file/FileContextMenu';

class File extends Item {

  constructor(options = { contextMenu: {} }) {
    super(`${cssPrefix}-tools-file`);
    this.options = options;
    this.setTitle('文件');
    this.fileContextMenu = new FileContextMenu({
      el: this,
      ...this.options.contextMenu,
    });
  }

  destroy() {
    super.destroy();
    this.fileContextMenu.destroy();
  }

}

export { File };
