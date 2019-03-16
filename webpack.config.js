"use strict";

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
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          configurations: require('./tslint.json'),
        }
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
  devServer: {
    disableHostCheck: true,
  }
};
