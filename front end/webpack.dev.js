const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    allowedHosts: ["all"],
    host: "0.0.0.0",
    port: 8000,
    static: path.resolve(__dirname, "dist"),
    open: true,
    compress: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
});
