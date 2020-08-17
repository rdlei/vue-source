const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // ?:匹配不捕获
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function parseHTML(template) {
  // ast树 表示 html的语法
  let root = null; // 树根
  let currentParent;
  let stack = []; // 栈型结构用来判断标签是否正常闭合
  // 常见的数据结构 栈 队列 数组 链表 集合 hash表 树
  // 利用常见的数据结构来解析标签 [div, span]
  // <div id="app" class='a'><span>123</span>hello {{msg}} {{age}} </div>
  // vue 2.0 只能有一个根节点 必须是html 元素

  function creatASTElement(tagName, attrs) {
    return {
      tag: tagName,
      attrs,
      children: [],
      parent: null,
      type: 1 // 1 普通元素 3 文本
    }
  }

  // 每次解析开始标签都会执行此方法
  function start(tagName, attrs) {
    let element = creatASTElement(tagName, attrs);
    !root && (root = element); // 只有第一次是根;
    currentParent = element;
    stack.push(element);
  }

  // 结束标签 确立父子关系
  function end(tagName) {
    let element = stack.pop();
    let parent = stack[stack.length - 1];
    if (parent) {
      element.parent = parent;
      parent.children.push(element);
    }
  }

  // 文本
  function chars(text) {
    text = text.replace(/\s/g, '');
    if (text) {
      currentParent.children.push({
        type: 3,
        text,
      })
    }
  }


  // 根据 html 解析成树结构 <div id="app" style="color:red"><span>hello word {{msg}}</span></div>
  while(template) {
    let textStart = template.indexOf('<');
    if (textStart == 0) {
      const startTagMatch = parseStartTag();

      if (startTagMatch) {
        start(startTagMatch['tagName'], startTagMatch['attrs']);
      }

      const endTagMatch = template.match(endTag);
      if (endTagMatch && endTagMatch.length) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
      }
    }

    // 如果不是0 说明是文本
    let text;
    if (textStart > 0) {
      text = template.substring(0, textStart);
    }
    if (text) {
      advance(text.length);
      chars(text);
    }


  }

  function advance(index) {
    template = template.substring(index);
  }

  function parseStartTag() {
    const startArrMatch = template.match(startTagOpen); // 匹配开始标签
    if (startArrMatch && startArrMatch.length) {
      const matchMap = {
        tagName: startArrMatch[1],
        attrs: []
      }
      // console.log('startArrMatch', startArrMatch);
      // console.log(matchMap)
      advance(startArrMatch[0].length);
      let end, attr;
      while(!(end = template.match(startTagClose)) && (attr = template.match(attribute))) {
        advance(attr && attr[0].length);
        matchMap.attrs.push({
          name: attr[1],
          value: (attr[3] || attr[4] || attr[5]),
        })
      };
      if (end) {
        advance(end && end[0].length)
        return matchMap;
      }
    }
  }

  return root;
}
