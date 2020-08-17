export function createTextVNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text);
}

export function createElement(tag, data = Object.create(null), ...children) {
  let {key} = data;
  if (key) {
    delete data.key
  }
  // vue中的key 不会作为属性传递给子组件
  return vnode(tag, data, key, children);
}

// 虚拟节点是产生一个对象用来描述dom结构 增加自定义属性
// ast 它是描述 dom语法的
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text,
  }
}
