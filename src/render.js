import {createTextVNode, createElement } from './vdom/create-element.js'

export function renderMixin(Vue) {
  Vue.prototype._render = function () {
    // 调用我们自己实现的render方法
    const vm = this;
    const {
      render
    } = vm.$options;

    Vue.prototype._v = function(text) {
      // 创建文本的虚拟节点
      return createTextVNode(text)
    }
    Vue.prototype._c = function() {
      return createElement(...arguments);
    }
    Vue.prototype._s = function(val) {
      // 判断当前这个值是不是对象，如果是对象，直接转换成字符串，防止页面出现[object Object];
      return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val);
    }
    let vnode = render.call(vm);
    return vnode;
  }
}
