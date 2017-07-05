"use strict"

const webpack = require('webpack');
const path = require('path');

const config = {
    // entry:{
    //     admin_index:'js/admin_index.js' //入口文件由gulp提供
    // },
    output: {//输出路径由gulp提供
        filename: '[name].js'   
    },
    module: {
        loaders: [ 
            {
                test: /\.js$/,
                loader: 'babel-loader',
                /*exclude: path.resolve(__dirname, 'node_modules'), //编译时，不需要编译哪些文件*/
                /*include: path.resolve(__dirname, 'src'),//在config中查看 编译时，需要包含哪些文件*/
                query: {
                    presets: ['latest'] //按照最新的ES6语法规则去转换
                }
            },
            // {
            //     test: /\.(png|jpg|gif|svg)$/,
            //     loader: 'file-loader',
            //     options: {
            //         name: '[name].[ext]?[hash]'
            //     }
            // }, //预处理图片
            { test: /\.vue$/, loader: 'vue' }, //预处理.vue文件  
            // { test: /\.css$/, loader: 'style!css' },//预处理css文件
            // { test: /\.less$/, loader: 'style!css!less' },//预处理less文件
        ]
    },

    resolve: {
        alias: { //整理路径方便webpack打包和使用时引用
            'jquery$': path.resolve('./js/jquery.min.js'),
            'vue$': path.resolve('./js/vue.min.js'),
        }
    },
    // plugins: [ //插件
    //     new webpack.ProvidePlugin({ //自动加载模块，可在模块中直接引用和resolve alias功能一样
    //         $: 'jquery',
    //         jQuery: 'jquery',
    //     }),
    // ],
    // watch: true,  //实时监听 不建议开启，可用gulp来做实时监听
}

module.exports = config;