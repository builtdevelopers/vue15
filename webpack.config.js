const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 给vue单组件文件配置的plugin
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // 给webpack配置功能插件
  plugins: [
    new HtmlWebpackPlugin({
      // 设定输出的模板文件(默认是index.html)
      filename: 'index.html',
      // 设定母html模板文件路径名的
      template: path.join(__dirname, './src/index.html')
    }),
    // 请确保给vue单组件文件引入这个插件，
    // 作用是使得js的loader或css的loader作用给vue的script标签或style标签
    new VueLoaderPlugin()
  ],
  module: {
    // 给各种不同的内容设定loader解析器
    rules: [
      // 给element-ui的字体库文件配置loader
      {test: /\.(eot|svg|ttf|woff|woff2)$/, use: 'url-loader'},
      // 给vue结尾的文件配置编译loader
      { test: /\.vue$/, use: 'vue-loader' },
      {
        // 设置babel-loader，使得js中es6等高级语法可以降级为es5标准，兼容各个浏览器
        test: /\.js$/,
        exclude: /node_modules/, // node_modules目录的js文件不要给处理
        use: 'babel-loader' // 调用具体loader
        // 具体preset在其他位置配置，给"根目录"制作.babelrc文件并做配置即可
      },
      {
        // 设置css样式中图片处理的loader
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 图片大小小于等于8192字节，就把图片变为base64字符串格式
              // 大小大于8192,就调用file-loader打包图片到dist目录，形成物理文件，后期通过路径名访问
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.css$/, // css名字结尾文件 处理loader设定
        use: [
          // 以下两个loader有顺序要求，css-loader在后，style-loader在前
          // 它们在执行的时候是先执行css-loader在执行style-loader
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.less$/, // less名字结尾文件 处理loader设定
        // style-loader // creates style nodes from JS strings  把css内容通过style标签嵌入到html文档中
        // css-loader // translates CSS into CommonJS  在index.js中通过模块化方式引入css
        // less-loader // compiles Less to CSS   把less内容变为css内容
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  // 打包模式
  // production:生产，产生优化压缩的打包文件
  // development:开发，产生有注释、空白、回车 可读性好的打包文件
  mode: 'development',
  entry: path.join(__dirname, './src/index.js'), //  修改入口文件
  output: {
    path: path.join(__dirname, './dist'), // 输出目录
    filename: 'bundle.js' // 输出打包文件名字设置
  },

  // 给webpack-dev-server做配置
  devServer: {
    host: '127.0.0.1', // 服务主机ip地址
    port: 1025, // 服务端口号码
    open: true, // 自动打开浏览器访问效果
    compress: true // 启动压缩机制
  },
  // 如果img图片大小超过url-loader的阀值，也不提示警告信息
  performance: {
    hints: false
  }
}
