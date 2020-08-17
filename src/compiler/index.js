import{parseHTML} from './parser.js';
import{generate} from './generate.js';

export function compileToFunctions(template) {

  // 实现模版的编译

  let ast = parseHTML(template);

  // 代码生成
  // 最终template =》render 函数

  // 核心就是字符串拼接
  let code = generate(ast); // 代码生成 => 拼接字符串

  code = `with(this){return ${code}}`;
  let render = new Function(code); // 相当于给字符串变成了函数

  // 未处理： 注释节点 自闭和标签 事件绑定 @click class slot插槽
  return render;
  // console.log(render);

  // 模版编译原理
  // 1. 先把我们的代码转化成ast语法树 parser 解析（正则）
  // 2. 标记静态树 -》树得遍历标记 markup 只是优化
  // 3. 通过ast产生的语法树 生成 代码 =》render函数 codegen

}
