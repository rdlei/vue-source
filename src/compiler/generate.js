const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs = []) { // {id: 'app', style: {color: 'red', background: 'green'}}
  let str = '';
  for(let i = 0, len = attrs.length; i < len; i++) {
    let attr = attrs[i]; // 取到每一个属性
    if (attr.name === 'style') {
      let formatStyleVal = {}; // color:red;background:green;
      attr.value.split(';').forEach(item => {
        let [key , value] = item.split(':')
        formatStyleVal[key] = value;
      })
      attr.value = formatStyleVal; // 将原来的字符串替换称刚才格式化后的对象
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function gen(node) {
  if (node.type === 1) return generate(node);
  // 文本的处理
  if (node.type === 3) {
    // console.log('node', node);
    let {text} = node;
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`; // _v('helloWorld')
    } else {
      // 有变量 {{ msg }}
      let tokens = []; // 每次正则使用过后 都需要重新指定 lastIndex
      let lastIndex = defaultTagRE.lastIndex = 0;
      let match, index;
      while(match = defaultTagRE.exec(text)) {
        index = match.index;
        tokens.push(JSON.stringify(text.slice(lastIndex, index).trim()));
        tokens.push(`_s(${match[1].trim()})`);
        // 指针
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length){
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      console.log('tokens', tokens);
      return `_v(${tokens.join('+')})`;
    }
    // helloWorld {{ msg }} aa {{bb}} aa => _v('helloWorld')+_s(msg)+'aa'+_s(bb)
  }
}

function genChildren(astElement) { // <div><span></span> hello</div>
  const children = astElement.children;
  if (children && children.length) {
    return children.map(c => gen(c)).join(',');
  }
  return false;
}

export function generate(astElement) {
  // console.log('astElement', astElement);
  let children = genChildren(astElement);
  let code = `_c("${astElement.tag}",${
      astElement.attrs.length ? `${genProps(astElement.attrs)}` : undefined
    }${
      children ? `,${children}` : ''
    })`;
  return code;
}
// 语法级的编译
