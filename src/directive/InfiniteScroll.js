import Vue from 'vue'
const ctx = '@@InfiniteScroll'

const throttle = (fn, delay) => {
  let now, lastExec, timer, context, args //eslint-disable-line

  let execute = () => {
    fn.apply(context, args)
    lastExec = now
  }

  return (...options) => {
    context = this
    args = options

    now = Date.now()

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (lastExec) {
      let diff = delay - (now - lastExec)
      if (diff < 0) {
        execute()
      } else {
        timer = setTimeout(() => {
          execute()
        }, diff)
      }
    } else {
      execute()
    }
  }
}

const getScrollTop = (element) => {
  if (element === window) {
    return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop)
  }

  return element.scrollTop
}

const getComputedStyle = Vue.prototype.$isServer ? {} : document.defaultView.getComputedStyle

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

const getVisibleHeight = (element) => {
  if (element === window) {
    return document.documentElement.clientHeight
  }

  return element.clientHeight
}

const getElementTop = (element) => {
  if (element === window) {
    return getScrollTop(window)
  }
  return element.getBoundingClientRect().top + getScrollTop(window)
}

const isAttached = (element) => {
  let currentNode = element.parentNode
  while (currentNode) {
    if (currentNode.tagName === 'HTML') {
      return true
    }
    if (currentNode.nodeType === 11) {
      return false
    }
    currentNode = currentNode.parentNode
  }
  return false
}

const doBind = function () {
  if (this.binded) return // eslint-disable-line
  this.binded = true

  let directive = this
  let element = directive.el

  directive.scrollEventTarget = getScrollEventTarget(element)
  directive.scrollListener = throttle(doCheck.bind(directive), 200)
  directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener)

  let disabledExpr = element.getAttribute('infinite-scroll-disabled')
  let disabled = false

  if (disabledExpr) {
    this.vm.$watch(disabledExpr, (value) => {
      directive.disabled = value
      if (!value && directive.immediateCheck) {
        doCheck.call(directive)
      }
    })
    disabled = Boolean(directive.vm[disabledExpr])
  }
  directive.disabled = disabled

  let distanceExpr = element.getAttribute('infinite-scroll-distance')
  let distance = 0
  if (distanceExpr) {
    distance = Number(directive.vm[distanceExpr] || distanceExpr)
    if (isNaN(distance)) {
      distance = 0
    }
  }
  directive.distance = distance

  let directionExpr = element.getAttribute('infinite-scroll-direction')
  let direction = undefined
  if(directionExpr){
    direction = 'bottom'
    if (directionExpr) {
      directionExpr = directionExpr.toLowerCase()
      if (directionExpr === 'top') {
        direction = 'top'
      }
    }
  }
  directive.direction = direction

  let immediateCheckExpr = element.getAttribute('infinite-scroll-immediate-check')
  let immediateCheck = true
  if (immediateCheckExpr) {
    immediateCheck = Boolean(directive.vm[immediateCheckExpr])
  }
  directive.immediateCheck = immediateCheck

  if (immediateCheck) {
    doCheck.call(directive)
  }

  var eventName = element.getAttribute('infinite-scroll-listen-for-event')
  if (eventName) {
    directive.vm.$on(eventName, () => {
      doCheck.call(directive)
    })
  }
}

const doCheck = function(force) {
  let scrollEventTarget = this.scrollEventTarget
  let element = this.el
  let distance = this.distance
  let direction = this.direction
  // let elementHeight = element.offsetHeight
  if (force !== true && this.disabled) return //eslint-disable-line
  let viewportScrollTop = getScrollTop(scrollEventTarget)
  let viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget)

  // if (elementHeight > this.preElementHeight && direction === 'top') {
  //   console.log('elementHeight', elementHeight, this.preElementHeight)
  //   scrollEventTarget.scrollTop = elementHeight - this.preElementHeight
  //   this.preElementHeight = elementHeight
  //   return
  // }

  let shouldBottomTrigger = false
  let shouldTopTrigger = false
  
  if(direction){
    
    if (direction === 'bottom') {
      if (scrollEventTarget === element) {
        shouldBottomTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance
      } else {
        let elementBottom = getElementTop(element) - getElementTop(scrollEventTarget) + element.offsetHeight + viewportScrollTop
        shouldBottomTrigger = viewportBottom + distance >= elementBottom
      }
    } else if (direction === 'top') {
      shouldTopTrigger = viewportScrollTop <= distance
    }
    
  }else{
    if (scrollEventTarget === element) {
      shouldBottomTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance
    } else {
      let elementBottom = getElementTop(element) - getElementTop(scrollEventTarget) + element.offsetHeight + viewportScrollTop
      shouldBottomTrigger = viewportBottom + distance >= elementBottom
    }
    shouldTopTrigger = viewportScrollTop <= distance
  }
  
  if (shouldBottomTrigger && this.expression) {
    this.expression('bottom')
  }
  if (shouldTopTrigger && this.expression) {
    this.expression('top')
  }
  
  
}

export default {
  bind (el, binding, vnode) {
    el[ctx] = {
      el,
      vm: vnode.context,
      expression: binding.value,
      preElementHeight: 0
    }
    const args = arguments
    const cb = () => {
      el[ctx].vm.$nextTick(() => {
        if (isAttached(el)) {
          doBind.call(el[ctx], args)
        }

        el[ctx].bindTryCount = 0

        const tryBind = () => {
          if (el[ctx].bindTryCount > 10) return //eslint-disable-line
          el[ctx].bindTryCount++
          if (isAttached(el)) {
            doBind.call(el[ctx], args)
          } else {
            setTimeout(tryBind, 50)
          }
        }
        tryBind()
      })
    }
    if (el[ctx].vm._isMounted) {
      cb()
      return
    }

    el[ctx].vm.$on('hook:mounted', cb)
  },
  unbind (el) {
    if (el[ctx] && el[ctx].scrollEventTarget) {
      el[ctx].scrollEventTarget.removeEventListener('scroll', el[ctx].scrollListener)
    }
  }
}
