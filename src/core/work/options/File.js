import { Item } from './base/Item';
import { cssPrefix } from '../../../const/Constant';

class File extends Item {

  constructor() {
    super(`${cssPrefix}-tools-file`);
    this.setTitle('文件');
  }

}

export { File };
