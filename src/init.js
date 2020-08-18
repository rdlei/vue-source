import {initState} from './state';
import {compileToFunctions} from './compiler/index';
import {mountComponent, callHook} from './lifecycle.js';
import {mergeOptions} from './utils';

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    // Vue的内部 $options 就是用户传入的所有参数

    const vm = this;

    // 这个options 包含了用户创建实例时传入的所有属性
    vm.$options = mergeOptions(vm.constructor.options, options); // 用户传入的参数
    console.log('vm.$options', vm.$options);

    // 初始化之前调用beforeCreate
    callHook(vm, 'beforeCreate');

    initState(vm); // 初始化状态

    // 初始化之后调用created
    callHook(vm, 'created');

    // 需要通过模版进行渲染
    if (vm.$options.el) { // 用户传入了el属性
      vm.$mount(vm.$options.el);
    }

  }

  Vue.prototype.$mount = function(el) { // 可能是字符串 也可以传入一个dom对象
    const vm = this;
    el = vm.$el = document.querySelector(el); // 获取el属性

    // 如果同时传入了 template 和 render 默认会产用render 抛弃template，如果都没有传就是用id=“app”中的模版
    const opts = vm.$options;
    if (!opts.render) {
      let template = opts.template;

      if (!template && el) { // 应该使用外部的模版
        template = el.outerHTML;
      }

      const render = compileToFunctions(template);
      opts.render = render;
    }
    // 走到这里说明不需要编译了，因为用户传入的就是一个 render 函数

    mountComponent(vm, el);
  }
}
