import { Snapshot } from '../snapshot/Snapshot';
import { Merges } from '../merges/Merges';

/**
 * Protection
 */
class Protection extends Merges {

  /**
   * Protection 保护区域管理
   */
  constructor({
    snapshot = new Snapshot(),
    protections = [],
  } = {}) {
    super({ snapshot, merges: protections });
  }

  /**
   * 获取矩形的json数据
   */
  getData() {
    return {
      protections: this.getAll().map(range => range.toString()),
    };
  }

}

export {
  Protection,
};
