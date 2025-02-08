import { resolve } from 'path';
import autoprefixer from 'autoprefixer';
import HtmlPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CnameWebpackPlugin from 'cname-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { CleanWebpackPlugin as CleanPlugin } from 'clean-webpack-plugin';

const dev = process.env.NODE_ENV === 'development';

const plugins = [
  new CnameWebpackPlugin({
    domain: 'coilz.andrewdelisa.com'
  }),
  new CleanPlugin(),

  new MiniCSSExtractPlugin({
    filename: '[name].css'
  }),
  new HtmlPlugin({
    template: './src/index.html'
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

export default {
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval-cheap-module-source-map' : false,
  entry: './src/index.js',
  devServer: {
    compress: dev,
    hot: dev,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [autoprefixer, postcssFlexbugsFixes],
                sourceMap: dev
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                quietDeps: true
              }
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js',
    chunkFilename: '[name].js'
  },
  plugins,
  resolve: {
    extensions: ['.js', '.json'],
    modules: ['node_modules', 'src'],
    alias: {
      components: resolve(__dirname, 'src/components'),
      utils: resolve(__dirname, 'src/utils')
    }
  },
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
  }
};
