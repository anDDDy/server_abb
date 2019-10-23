const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require('webpack-node-externals');
const WorkerPlugin = require('worker-plugin');
module.exports = {
  entry: ["./app.js"],
  output: {
    path: path.resolve(__dirname, "./bundle"),
    filename: "app.js"
  },
  target: "node",
  externals: [nodeExternals()],
  node: {
    __filename: true,
    __dirname: true
  },
  module: {
    rules: [{
        test: [/.js$|.ts$/],
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/typescript", {
                "targets": {
                  "node": "12"
                }
              }, "@babel/preset-env"]
            ],
            plugins: [
              ["@babel/plugin-proposal-class-properties"]
            ]
          }
        }
      },
      {
        test: /\.svg$/,
        loader: "svg-url-loader",
        options: {
          noquotes: true
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "assets/"
          }
        }]
      },
      {
        test: [/.css$|.scss$/],
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "../src")],
    extensions: [".js", ".ts"]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "app.css"
    }),
    new HtmlWebpackPlugin({
      title: "Setting up webpack 4",
      template: "index.html",
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6
      }
    }),
    new WorkerPlugin()
  ]
};
