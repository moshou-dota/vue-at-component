import Vue from 'vue'
const pasteUpload = Vue.directive('pasteUpload', {
  bind (el, binding, vnode) {
    el._pasteFn_ = function (event) {
      if (event.clipboardData || event.originalEvent) {
        // not for ie11  某些chrome版本使用的是event.originalEvent
        let clipboardData = (event.clipboardData || event.originalEvent.clipboardData)
        if (clipboardData.items) {
          let items = clipboardData.items
          let len = items.length
          for (let i = 0; i < len; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              event.preventDefault()
              if(clipboardData.files && clipboardData.files){
                uploadImgFromPaste(clipboardData.files, event)
                break
              }
            }
          }
        }
      } else {
        // 目前提示不支持粘贴
        binding.value.pasteHandleError && binding.value.pasteHandleError('当前浏览器不支持粘贴上传功能！')
      }
    }
    function uploadImgFromPaste (files, event) {
      if (binding.value.pasteHandle) {
        binding.value.pasteHandle(files, event)
      } else {
        console.error('没有配置 pasteHandle 方法')
      }
    }
    
    el.addEventListener('paste', el._pasteFn_)
  },
  unbind (el, binding) {
    document.removeEventListener('paste', el._pasteFn_);
    delete el._pasteFn_;
  }
})

export default pasteUpload
