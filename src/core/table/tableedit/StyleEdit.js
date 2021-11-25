/* global document */
import { BaseEdit } from './BaseEdit';
import { XSelection } from '../../../lib/XSelection';

class StyleEdit extends BaseEdit {

  constructor(table) {
    super(table);
    this.xselection = new XSelection(this);
  }

  fontSize(size) {
    this.xselection.wrapSelectNodeStyle('font-size', `${size}px`);
  }

  fontFamily(name) {
    this.xselection.wrapSelectNodeStyle('font-family', name);
  }

  fontColor(color) {
    this.xselection.wrapSelectNodeStyle('color', color);
  }

  fontBold() {
    this.xselection.toggleSelectNodeStyle('font-weight', 'bold');
  }

  fontItalic() {
    this.xselection.toggleSelectNodeStyle('font-style', 'italic');
  }

  underLine() {
    this.xselection.toggleSelectNodeStyle('text-decoration', 'underline');
  }

  strikeLine() {
    this.xselection.toggleSelectNodeStyle('text-decoration', 'line-through');
  }

  insertHtml(html) {
    document.execCommand('insertHTML', false, html);
  }

}

export {
  StyleEdit,
};
