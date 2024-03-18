const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    // Đặt đầu ra của tệp bundle.js vào thư mục 'static/dist' trong dự án Flask
    path: path.resolve(__dirname, 'static/dist'), 
  },
  module: {
    rules: [
      // Rule cho JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // Thêm rule cho TypeScript
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // Thêm .ts vào mảng extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'templates/index.html'), // Đường dẫn đến template
      filename: path.resolve(__dirname, 'templates/index.html'), // Đặt đầu ra tại thư mục 'templates' của Flask
    })
  ],
  mode: 'development',
};
