"use strict";

const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/game.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/build/",
    filename: "project.bundle.js"
  },
  module: {
    rules: [
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: "/node_modules/"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    })
  ],
  devServer: {
    disableHostCheck: true,
  }
};
