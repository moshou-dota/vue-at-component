const getScrollEventTarget = (element) => {
  let currentNode = element
  // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
  while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
    let overflowY = getComputedStyle(currentNode).overflowY
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode
    }
    currentNode = currentNode.parentNode
  }
  return window
}
export default {
  bind(el, binding, vnode) {
    el.__scrollHandler__ = function (e) {
      let {
        top,
        left,
        height,
        width
      } = el.getBoundingClientRect()
      let targetEle = el.children[0]
      if (top < binding.value.limit) {
        el.classList.add(binding.value.cls)
        el.style.height = height + 'px'
        targetEle.style.position = 'fixed'
        targetEle.style.top = binding.value.limit + 'px'
        targetEle.style.left = left + 'px'
        targetEle.style.width = width + 'px'
        targetEle.style.height = height + 'px'
        targetEle.style.zIndex = 90
      } else {
        el.classList.remove(binding.value.cls)
        el.removeAttribute('style')
        targetEle.removeAttribute('style')
      }
    }
  },
  componentUpdated(el, binding, vnode) {
    el.__scrollElement__ = getScrollEventTarget(el)
    el.__scrollElement__.addEventListener('scroll', el.__scrollHandler__)
  },
  unbind(el, binding) {
    if (el.__scrollElement__) {
      el.__scrollElement__.removeEventListener('scroll', el.__scrollHandler__);
      delete el.__scrollHandler__;
      delete el.__scrollElement__
    }
  }
};