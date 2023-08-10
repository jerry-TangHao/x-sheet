export class WidgetUtils {
  static getLeftPadding(widget) {
    let style = getComputedStyle(widget.el, null);
    return parseFloat(style.getPropertyValue('padding-left'));
  }

  static getRightPadding(widget) {
    let style = getComputedStyle(widget.el, null);
    return parseFloat(style.getPropertyValue('padding-right'));
  }

  static getLeftMargin(widget) {
    let style = getComputedStyle(widget.el, null);
    return parseFloat(style.getPropertyValue('margin-left'));
  }

  static getRightMargin(widget) {
    let style = getComputedStyle(widget.el, null);
    return parseFloat(style.getPropertyValue('margin-right'));
  }

  static getLeftBorderWidth(widget) {
    let style = getComputedStyle(widget.el, null);
    return parseFloat(style.getPropertyValue('border-left-width'));
  }

  static getRightBorderWidth(widget) {
    let style = getComputedStyle(widget.el, null);
    return parseFloat(style.getPropertyValue('border-right-width'));
  }
}
