import{observe} from './observer/index.js'

export function initState(vm) {
  const opts = vm.$options;

  // if (opts.data) {
  //   initData(vm);
  // }
  opts.data && initData(vm);
}
function proxy(target, property, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[property][key];
    },
    set(newValue) {
      target[property][key] = newValue;
    }
  })
}
function initData(vm) {

  // 数据响应式原理
  let data = vm.$options.data; // 用户传入的数据
  // vm._data 就是监测过的数据了
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;

  // 将数据全部代理到vm的实例上
  for(let key in data) {
    proxy(vm, '_data', key);
  }

  // 观测数据
  observe(data); // 观测这个数据
}
