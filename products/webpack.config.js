const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devServer: {
    port: 8081
  },
  plugins: [
    new HtmlPlugin({
      template: './public/index.html'
    })
  ]
}
