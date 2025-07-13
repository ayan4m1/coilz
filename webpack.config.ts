import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import autoprefixer from 'autoprefixer';
import HtmlPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CnameWebpackPlugin from 'cname-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { type Configuration, type WebpackPluginInstance } from 'webpack';
import { CleanWebpackPlugin as CleanPlugin } from 'clean-webpack-plugin';

import 'webpack-dev-server';

const dev = process.env.NODE_ENV === 'development';

const plugins: WebpackPluginInstance[] = [
  new CleanPlugin(),
  new HtmlPlugin({
    template: './src/index.html'
  }),
  new MiniCssExtractPlugin(),
  new CnameWebpackPlugin({
    domain: 'coilz.andrewdelisa.com'
  })
];

if (dev) {
  plugins.push(
    new StylelintPlugin({
      configFile: '.stylelintrc',
      context: 'src',
      files: '**/*.scss',
      failOnError: true,
      quiet: false,
      customSyntax: 'postcss-scss'
    }),
    new ESLintPlugin({
      configType: 'flat'
    })
  );
}

const config: Configuration = {
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval-cheap-module-source-map' : false,
  entry: './src/index.js',
  devServer: {
    open: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: ['babel-loader'], exclude: /node_modules/ },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [autoprefixer, postcssFlexbugsFixes]
              },
              sourceMap: dev
            }
          },
          {
            loader: 'sass-loader',
            options: { sassOptions: { quietDeps: true } }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [{ loader: 'html-loader', options: { minimize: true } }]
      }
    ]
  },
  output: {
    path: resolve(dirname(fileURLToPath(import.meta.url)), 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    modules: ['node_modules', 'src']
  },
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
  },
  ignoreWarnings: [/import rules are/]
};

export default config;
