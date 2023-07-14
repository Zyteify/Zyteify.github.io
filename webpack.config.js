const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
    devtool: 'source-map',
  entry: './src/copyitem.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        use: ['source-map-loader'],
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false, // Disable variable name minification
        },
      }),
    ],
  },
};
