const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const webpackPath = __dirname;
const distPath = path.resolve(webpackPath, "dist");
const assetsPath = path.resolve(webpackPath, "assets");
const common = require("./webpack.common.config");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
module.exports = {
  entry: {
    main: path.resolve(webpackPath, "main.js")
  },
  output: {
    path: distPath,
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(png|jpg|gif|svg|woff2?|eot|ttf|otf|xls|xlsx)$/,
        loader: "url-loader",
        options: {
          limit: 8192,
          name: "[name].[ext]?[hash]"
        }
      }
    ]
  },
  resolve: common.resolve,
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(distPath, "vendor-manifest.json"))
    }),
    new HtmlWebpackPlugin({
      filename: "main.html",
      template: path.resolve(webpackPath, "main.html"),
      inject: true,
      chunksSortMode: "dependency"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      _: "lodash"
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest"
    })
  ]
};
module.exports.plugins = (module.exports.plugins || []).concat([
  // new BundleAnalyzerPlugin({
  //   analyzerMode: "static",
  //   reportFilename: "main-report.html"
  // }),
  new HardSourceWebpackPlugin()
]);
module.exports.devtool = "#eval-source-map";
