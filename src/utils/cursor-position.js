const caret = {
  getCursorPosition(element) {
    let cursorPos = 0
    if (document.selection) { // IE
      var selectRange = document.selection.createRange()
      selectRange.moveStart('character', -element.value.length)
      cursorPos = selectRange.text.length
    } else if (element.selectionStart || element.selectionStart == '0') {
      cursorPos = element.selectionStart
    }
    return cursorPos
  },
  setCursorPosition(textDom, pos) {
    if (textDom.setSelectionRange) {
      // IE Support
      textDom.focus();
      textDom.setSelectionRange(pos, pos);
    } else if (textDom.createTextRange) {
      // Firefox support
      var range = textDom.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }
}

export default caret