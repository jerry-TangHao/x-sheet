/* global document */
import { BaseEdit } from './BaseEdit';

/**
 * StyleEdit
 */
class StyleEdit extends BaseEdit {

  /**
   * 设置用户选择区域的字体颜色
   * @param color
   */
  fontColor(color) {
    document.execCommand('foreColor', false, color);
  }

  /**
   * 设置用户选择区域的字体大小
   * @param size
   */
  fontSize(size) {
    document.execCommand('fontSize', false, size);
  }

  /**
   * 设置用户选择区域的字体名称
   * @param name
   */
  fontFamily(name) {
    document.execCommand('fontName', false, name);
  }

  /**
   * 设置用户选择区域的字体加粗
   */
  fontBold() {
    document.execCommand('bold', false);
  }

  /**
   * 设置用户选择区域的字体斜体
   */
  fontItalic() {
    document.execCommand('italic', false);
  }

  /**
   * 设置用户选择区域的字体下划线
   */
  underLine() {
    document.execCommand('underline', false);
  }

  /**
   * 设置用户选择区域的字体删除线
   */
  strikeLine() {
    document.execCommand('strikeThrough', false);
  }

  /**
   * 插入html
   */
  insertHtml(html) {
    document.execCommand('insertHTML', false, html);
  }

}

export {
  StyleEdit,
};
