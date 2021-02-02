const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PATHS = require('./webpack-paths');
const plugins = require('./webpack-plugins');
const modules = require('./webpack-modules');

module.exports = (env, options) => {
  return {
    entry: {
      main: `${PATHS.src}/index.js`
    },
    output: {
      path: PATHS.build,
      publicPath: '/',
      filename: 'js/[name].bundle.js'
    },
    module: modules(options.mode),
    resolve: {
      extensions: ['*', '.js', '.jsx']
    },
    plugins: plugins(options.mode),
    devServer: {
      contentBase: PATHS.build,
      hot: true,
      port: 8000,
      open: true,
      historyApiFallback: true
    },
    optimization: {
      minimizer: [
        // we specify a custom UglifyJsPlugin here to get source maps in production
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          uglifyOptions: {
            compress: false,
            ecma: 6,
            mangle: true
          },
          sourceMap: false
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      splitChunks: {
        // include all types of chunks
        chunks: 'all'
      }
    }
  };
};
