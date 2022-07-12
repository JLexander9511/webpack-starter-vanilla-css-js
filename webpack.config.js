const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

const imgRules = {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',   
}
const rulesJS = {
    test: /\.m?js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ['@babel/preset-env']
      }
    }
}

const styleLoader = {
    test: /\.css$/,
    exclude: /styles\.css$/,
    use: ['style-loader', 'css-loader']
    }

const styleExtract = {
    test: /styles\.css$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader']
}

const imgLoader = {
    test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: 'assets/[name].[ext]'
                        }
                    }
                ]
}

const rules = [
    rulesJS,
    styleLoader,
    styleExtract,
    imgRules,
    imgLoader
]

module.exports = (env, argv) => {
    const {mode} = argv;
    const isProduction = mode == 'production';
    return{ 
        entry: './src/index.js',
        output: {
          filename: isProduction ? '[name].[fullhash].js' 
                                 : 'main.js',
          path: path.resolve(__dirname, 'dist'),
          clean: true
        },
        module:{
          rules
        },
        plugins: [
          new HtmlWebpackPlugin({
            title: 'index.html',
            template: 'src/index.html',
          }),
          new MiniCssExtractPlugin({
            filename: isProduction ? '[name].[fullhash].css' 
                                 : 'styles.css',
            ignoreOrder: false
          }),
          new CopyPlugin({
            patterns: [
              { from: "src/assets", to: "assets/" },
            ],
          }),
        ],
        devServer: {
          open:true
        },
        optimization: {
            minimize: isProduction ? true 
            : false,
            minimizer: [
              new CssMinimizerPlugin({}),
            ],
          },
    }
};