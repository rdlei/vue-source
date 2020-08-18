let has = {}; // vue源码里有的时候去重用的是set 有的时候用的是对象来实现的去重
let queue = [];

export function flushSchedulerQueue() {
  for (let i = 0, len = queue.length; i < len; i++) {
    let watcher = queue[i];
    watcher.run && watcher.run();
  }
  queue.length = 0;
  has = {};
}

export function queueWatcher(watcher) {
  const id = watcher.id;

  if (has[id] == null) {
    has[id] = true; //
    queue.push(watcher);
    nextTick(flushSchedulerQueue); // flushSchedulerQueue 调用渲染watcher
  }
}

let callbacks = []; // [flushSchedulerQueue, fn]
let pending = false;
export function flushCallbacksQueue() {
  callbacks.forEach(fn => fn());
  pending = false;
}

export function nextTick(fn) {
  callbacks.push(fn); // 相当于防抖策略
  if (!pending) { // true 事件环的概念 promise mutationObserver setTimeout setImmediate
    setTimeout(() => {
      flushCallbacksQueue();
    }, 0);
    pending = true;
  }

}
