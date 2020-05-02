const path = require("path");
const webpack = require("webpack");


module.exports = {
   target: "electron-renderer",
   devServer: {
      port: 3000,
      historyApiFallback: {
         index: `${path.resolve(__dirname, "./dist")}/index.html`
      }
   },
   entry: "./app/index.tsx",
   mode: "development",
   output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "react.js"
   },
   resolve: {
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx", ".css"]
   },
   loader: {
      test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
      loader: "url-loader"
   },
   module: {
      rules: [
         {
            test: /\.(ts|tsx)$/,
            loader: "ts-loader",
            exclude: "/scripts/",
         },
         {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
         },
      ],
   },
   plugins: [
      new webpack.HotModuleReplacementPlugin(),
   ],
};
