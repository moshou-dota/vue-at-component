export default {
  bind(el, binding, vnode) {
    let _config = binding.value
    function documentHandler() {
      let windowHeight = window.innerHeight
      if (windowHeight >= _config.maxLim) {
        el.style.height = _config.maxH + 'px'
      } else if (windowHeight <= _config.minLim) {
        el.style.height = _config.minH + 'px'
      } else {
        el.style.height = windowHeight - _config.minusVal + 'px'
      }
    }
    el.__vueResize__ = documentHandler;
    window.addEventListener('resize', documentHandler);
    if (vnode.context._isMounted) {
      documentHandler()
      return
    }
    vnode.context.$on('hook:mounted', documentHandler)
  },
  unbind(el, binding) {
    window.removeEventListener('resize', el.__vueResize__);
    delete el.__vueResize__
  }
};