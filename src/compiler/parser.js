const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // ?:匹配不捕获
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function parseHTML(template) {

  function start(tagName, attrs) {
    console.log(tagName, attrs);
  }

  function end(tagName) {
    console.log(tagName);
  }

  function chars(text) {
    console.log(text);
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
}
