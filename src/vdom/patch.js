export function patch(oldVnode, newVnode) {
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 真实dom元素
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode;
    let el = createElm(newVnode);
    // console.log('el', el);
    parentElm.insertBefore(el, oldElm.nextSibling);
    parentElm.removeChild(oldElm);
    return el; // 渲染真实的dom节点
  } else {
    // dom diff 算法

  }
}

function createElm(vnode) { // 需要递归创建
  const {tag, children, data, key, text} = vnode;
  if (typeof tag === 'string') {
    // 元素 将 虚拟节点和真实节点做一个映射关系（后面diff时如果元素相同直接复制老元素）
    vnode.el = document.createElement(tag);

    updateProperties(vnode); // 更新元素属性

    children && children.forEach(child => {
      // 递归渲染子节点 将子节点 渲染到父节点中
      vnode.el.appendChild(createElm(child));
    })
  } else {
    // 普通的文本
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function updateProperties(vnode) {
  let {el} = vnode;
  let newProps = vnode.data || {};
  console.log('el', el, 'newProps', newProps);
  for (let propName in newProps) {
    if (propName === 'style') {
      for (let styleName in newProps[propName]) {// {color: "red"}
        el.style[styleName] = newProps[propName][styleName];
      }

    } else {
      // event slot... 忽略
      el.setAttribute(propName, newProps[propName]);
    }
  }
}
