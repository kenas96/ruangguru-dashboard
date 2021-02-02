const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (mode) => {
  let modules = [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets' },
      { from: 'src/server.js', to: './' }
    ])
  ];

  let envMods = [];
  switch (mode) {
    case 'development':
      envMods = [
        new webpack.HotModuleReplacementPlugin()
      ];
      break;
    default:
      envMods = [
        new MiniCssExtractPlugin({
          filename: 'css/[name].[hash].css',
          chunkFilename: 'css/[id].[hash].css'
        })
      ];
      break;
  }

  modules = modules.concat(envMods);
  return modules;
};
