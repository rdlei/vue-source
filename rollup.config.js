import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/index.js',
  output: {
    format: 'umd', // amd commonjs规范 默认将打包后的结果挂载到window上
    file: 'dist/vue-bundle.js', // 打包出的vue.js文件
    name: 'Vue',
    sourcemap: true,
  },
  plugins: [
    // 解析es6 -> es5
    babel({
      exclude: 'node_module/**' // 排除node_module 下的任意文件夹文件
    }),
    // 开启本地serve服务
    serve({
      open: true,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: '',
    })
  ]
}
