const path = require('path');

const env = process.env.NODE_ENV;
const isDevelopment = env === 'development';

const analyzer = process.env.ANALYZER;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let babelOptions = require('./babel.config.json');
// babelOptions = require('./babel-without-polyfill.config.json');

const webpackConfig = {
    entry: {
        rapiop: './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].min.js',
        library: 'RAPIOP',
        libraryTarget: 'umd'
    },
    mode: env,
    devtool: isDevelopment ? 'inline-source-map' : 'source-map',
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [path.resolve(__dirname, '.'), 'node_modules']
    },
    plugins: [...(analyzer ? [new BundleAnalyzerPlugin()] : [])],
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions
                },
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        port: process.env.RAPIOP_ROUTER_PORT || 9000,
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
    }
};

module.exports = webpackConfig;
