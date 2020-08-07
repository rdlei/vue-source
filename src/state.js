import{observe} from './observe/index.js'

export function initState(vm) {
  const opts = vm.$options;

  // if (opts.data) {
  //   initData(vm);
  // }
  opts.data && initData(vm);
}

function initData(vm) {

  // 数据响应式原理
  let data = vm.$options.data; // 用户传入的数据
  // vm._data 就是监测过的数据了
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;

  // 观测数据
  observe(data); // 观测这个数据
}
