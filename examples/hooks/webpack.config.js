const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV;

const isDevelopment = env === 'development';

const webpackConfig = {
    entry: {
        main: './index.js',
        frame: './frame.js',
        home: './home.js',
        demo: './demo.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    mode: env,
    devtool: isDevelopment ? 'inline-source-map' : false,
    resolve: {
        extensions: ['.js', '.json'],
        modules: [path.resolve(__dirname, '.'), 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            chunks: ['main']
        })
    ],
    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'public'),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
    }
};

module.exports = webpackConfig;
