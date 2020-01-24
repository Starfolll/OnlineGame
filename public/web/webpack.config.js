const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   devServer: {
      port: 3000,
      historyApiFallback: {
         index: `${path.resolve(__dirname, './dist')}/index.html`
      }
   },
   entry: "./app/index.tsx",
   mode: "development",
   output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'index.js'
   },
   resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', ".css"]
   },
   module: {
      rules: [
         {
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader'
         },
         {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
         },
      ]
   },
   plugins: [
      new HtmlWebpackPlugin({template: "./app/index.html"}),
      new webpack.HotModuleReplacementPlugin()
   ]
};