const path = require("path");
const webpack = require("webpack");
const distPath = path.resolve(__dirname, "dist");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const common = require("./webpack.common.config");
module.exports = {
  entry: {
    vendor: [
      "lodash",
      "jquery",
      "vue",
      "vue-router",
      "vuex",
      "axios",
      "element-ui",
      "element-ui/lib/theme-chalk/index.css",
      "@fancyapps/fancybox",
      "@fancyapps/fancybox/dist/jquery.fancybox.css"
    ]
  },
  output: {
    path: distPath,
    filename: "[name].dll.js",
    library: "[name]_library"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
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
    new CleanWebpackPlugin([distPath]),
    new webpack.DllPlugin({
      path: path.resolve(distPath, "[name]-manifest.json"),
      name: "[name]_library"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      _: "lodash"
    })
  ]
};
module.exports.plugins = (module.exports.plugins || []).concat([
  new BundleAnalyzerPlugin({
    analyzerMode: "static",
    reportFilename: "vendor-report.html"
  })
]);
module.exports.devtool = "#eval-source-map";
