import {isObject} from '../utils';
import {arrayMethods} from "./array";
import Dep from './dep';

class Observer{
  constructor(data) {
    // 对数组索引进行拦截 性能差而且直接更改索引的方式并不多
    Object.defineProperty(data, '__ob__', { // __ob__ 是一个响应式的标识 对象数组都有
      enumerable: false, // 不可枚举
      configurable: false,
      value: this,
    })
    // data.__ob__ = this; // 相当于在数据上可以获取到__ob__这个属性 指代的是Observer这个实例

    if(Array.isArray(data)) {
      // vue 如何对数组进行处理呢？数组用的是重写数组的方法 函数劫持
      // 改变数组本身的方法就可以监控到了
      data.__proto__ = arrayMethods; // 通过原型链 向上查找的方式
      // [{a: 1}] => arr[0].a = 100
      // this.observeArray(data);
    } else {
      this.walk(data); // 可以对数据一步一步的处理
    }
  }

  observeArray(data) {
    for(let i = 0,len = data.length; i < len; i++) {
      observe(data[i]); // 监测数组的对象类型
    }
  }

  walk(data) {
    // 对象的循环
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key]);// 定义响应式的数据变化
    })
  }
}

// vue2 的性能 递归重写get和set vue3 proxy
function defineReactive(data, key, value) {
  observe(value); // 如果传入的值还是一个对象的话 就做递归循环检测
  let dep = new Dep(); // msg.dep = [watcher] age.dep = [watcher] // 渲染watcher中.deps [msg.dep, age.dep]
  Object.defineProperty(data, key, {
    get() {
      // 这里会有取值操作，给每一个属性增加一个dep属性，这个dep 要和刚才我放的dep.target上的watcher 做一个对应关系

      if (Dep.target) {
        dep.depend(Dep.target); // 让这个dep 去收集watcher
        // console.log(key, dep);
      }
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      observe(newValue); // 监控当前设置的值，有可能用户给了一个新值是个对象
      value = newValue;

      // 当我们更新数据后 要把当前自己dep对应的watcher 去重新执行下
      dep.notify();
    }
  })
}

export function observe(data) {
  // 对象就是使用defineProperty 来实现响应式原理

  // 如果这个数据不是对象 或者是 null 那就不监控了 return
  if (!isObject(data)) return;

  if (data.__ob__ instanceof Observer) return; // 防止对象被重复监控

  // 对数据进行defineProperty

  return new Observer(data); // 可以看到当前数据是否被观测过
}
