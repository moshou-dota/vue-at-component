import Vue from 'vue'

const dropDragUpload = Vue.directive('dropDragUpload', {
  bind (el, binding, vnode) {
    var maxLength = binding.value.max || 10
    el._dropFn_ = function (event) {
      event.preventDefault()
      if (event.dataTransfer) {
        let dataTransfer = event.dataTransfer
        if (dataTransfer.files && dataTransfer.files.length > 0) {
          if (dataTransfer.files.length > maxLength) {
            if (binding.value.outMaxHandle) {
              binding.value.outMaxHandle(event)
            } else {
              alert('不能同时拖拽上传超过' + maxLength + '个文件')
            }
          } else {
            uploadImgFromDrop(dataTransfer.files, event)
          }
        }
      } else {
        if (binding.value.dropHandleError) {
          binding.value.dropHandleError('当前浏览器不支持过拽上传功能！')
        }
      }
    }
    el._dragOverFn_ = function (event) {
      event.preventDefault()
      if (binding.value.dragOverHandle) {
        binding.value.dragOverHandle(event)
      }
    }
    el._dragLeaveFn_ = function (event) {
      event.preventDefault()
      if (binding.value.dragLeaveHandle) {
        binding.value.dragLeaveHandle(event)
      }
    }
    
    el.addEventListener('dragover', el._dragOverFn_)
    el.addEventListener('dragleave', el._dragLeaveFn_)
    el.addEventListener('drop', el._dropFn_)
    
    function uploadImgFromDrop (files, event) {
      if (binding.value.dropHandle) {
        binding.value.dropHandle(files, event)
      } else {
        console.error('没有配置 dropHandle 方法')
      }
    }
  },
  unbind (el, binding) {
    document.removeEventListener('drop', el._dropFn_)
    document.removeEventListener('dragleave', el._dragLeaveFn_)
    document.removeEventListener('dragover', el._dragOverFn_)
    delete el._dropFn_
    delete el._dragLeaveFn_
    delete el._dragOverFn_
  }
})

export default dropDragUpload
