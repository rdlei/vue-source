import{parseHTML} from './parser.js';

export function compileToFunctions(template) {

  // 实现模版的编译

  let ast = parseHTML(template);

  // 模版编译原理
  // 1. 先把我们的代码转化成ast语法树 parser 解析（正则）
  // 2. 标记静态树
  // 3. 通过ast产生的语法树 生成 代码 =》render函数 codegen

}
