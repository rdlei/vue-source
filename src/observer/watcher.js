import { pushTarget, popTarget } from "./dep";
import { queueWatcher } from "./scheduler";

let id = 0; // 做一个watcher 的id 每次创建watcher时 都有一个序号
// 目前写到这里 只有一个watcher 渲染watcher，只要视图中使用到了这个属性，而且属性属性变化了就要更新视图

class Watcher{
  constructor(vm, exprOrFn, cb, options) { // exprOrFn 可能是一个函数 可能是一个表达式
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.options = options;

    this.deps = []; // 这个watcher会存放所有的dep
    this.depsId = new Set();

    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn;
    }

    this.id = id++;
    this.get();

  }

  run() {
    this.get(); // 重新渲染
  }

  get() {
    // 1. 是先把渲染watcher 放到了 Dep.target上
    // 2. this.getter() 是去页面取值渲染 就是调用defineProperty的取值操作
    // 3. 我就获取当前Dep.target, 每个属性都有一个dep 取值是将Dep.target 保留到当前的dep中
    // 4. 数据变化 dep 通知 watcher更新

    pushTarget(this); // 在取值之前 将watcher先保存起来
    this.getter(); // 这个方法就实现了视图的渲染 => 操作是取值
    popTarget(); // 删掉watcher
  }

  addDep (dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this); // 让当前dep 订阅这个watcher
    }
  }
  update() { // 更新原理
    queueWatcher(this); // 将watcher存储起来
    // this.get(); // 以前调用get方法是直接更新视图
  }
}

export default Watcher;
