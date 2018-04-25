const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        'list-view': path.resolve(__dirname, 'src/list-view'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'umd'),
        libraryTarget: 'umd',
        library: 'listView',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['env'],
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            }
        ],
    },
    plugins: [

    ],
};