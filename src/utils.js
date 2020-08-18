// 此处放置所有的工具方法

export const isObject = (obj) => typeof obj === 'object' && obj !== null;

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated'
];

const strats = {};

const mergeHook = (parentVal, childVal) => {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return [childVal];
    }
  } else {
    return parentVal;
  }
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook;
})

// strats.data = function(parent, child) {
//   // 扩展不同属性的策略
// }

export const mergeOptions = (parent, child) => {
  const options = {};

  // 如果父亲和儿子都有一个属性 这个属性不冲突
  for(let key in parent) { // 处理父亲的所有属性
    mergeField(key);
  }

  for(let key in child) { // 处理儿子的所有属性，如果父亲有的值 在第一个循环中就已经处理了
    if(!parent.hasOwnProperty(key)) {
      mergeField(key);
    }

  }

  // console.log(parent, child);
  function mergeField(key) {
    // 写代码时很忌讳 各种 if else if else
    // 策略模式 根据不同的属性 调用不同的策略
    // debugger;
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key]);
    } else if (isObject(parent[key]) && isObject(child[key])) {
      options[key] = {
        ...parent[key],
        ...child[key],
      }
    } else {
      // 用儿子的值 直接覆盖掉 父亲的值
      options[key] = child[key] || parent[key];
    }
  }

  return options;
};
