// 参照 iview ui 的输出格式
import AtComponent from './components/at'

const Components = {
  AtComponent
}

const install = function (vue) {
  Object.keys(Components).forEach(key => {
    vue.component(key, Components[key])
  })
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const API = {
  install
}

module.exports.default = module.exports = API;   // eslint-disable-line no-undef