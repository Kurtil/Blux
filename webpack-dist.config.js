"use strict";

const CopyPlugin = require('copy-webpack-plugin');
const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/game.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/Blux/",
    filename: "project.bundle.js"
  },
  module: {
    rules: [
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
    }),
    new CopyPlugin([
      { from: 'assets/', to: 'assets/' },
      { from: 'index.dist.html', to: 'index.html' },
      { from: '.circleci/', to: '.circleci/' },
    ]),
  ],
};
