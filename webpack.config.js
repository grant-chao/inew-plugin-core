const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

//将相对路径解析为绝对路径，__dirname为当前文件所在的目录下，此处为./webpack文件夹
function resolve(relatedPath) {
    return path.join(__dirname, relatedPath)
}

const webpackConfig = {
    //打包模式:'production' or development'
    mode:'development',
    target: 'web', //必须添加此配置，才能实现浏览器的实时刷新
    devServer: {
        static: true,
        port: 3000,
        // contentBase: resolve('./public'),  //当存在静态资源时，此项必须有。指向开发的静态资源目录，配合url-loader的outPath，匹配文件中的静态资源引用地址
        open: true,    //启动后是否在浏览器自动打开
    },
    //entery为webpack解析的入口（解析各种包依赖关系的入口），而不是项目访问的入口
    //官网描述：指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
    entry: {
        app: [resolve('./src/index.js')],
    },
    //output为项目打包后的输出位置
    //官网描述：告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist
    output: {
        path: resolve('./dist'), //path为打包后的输出文件夹位置，此处为 ./dist文件夹
        filename:'bundle.js'
    },
    //module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                    }
                }
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    isDevelopment ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: 'inew-[local]-[hash:base64:5]',
                            }, // 开启css模块化
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                        },
                    }
                ],
            },
            {
                test: /\.css$/,
                use: [
                    isDevelopment ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader'
                ],
            },
            {
                test: /\.css$/,
                loader: 'postcss-loader',
                exclude: /node_modules/,
                options: {
                    postcssOptions: {
                        plugins: [
                            require('autoprefixer')(), // 给css自动添加前缀
                        ],
                    },
                },
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                type: 'javascript/auto', // webpack 5 需要
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            esModule: false,
                            name: 'assets/[name].[ext]'
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins:[
        //为项目生成一个可以访问的html文件，否则全是.js文件，没有访问的页面入口。默认为index.html,路径是基于根目录的相对路径
        new HtmlWebpackPlugin({
            template: './public/index.html',  //引用模板html文件生成项目的入口文件html
        }),
        new MiniCssExtractPlugin(),
    ],

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'inew-plugin-core': path.resolve(__dirname, 'src/inew')
        }
    }
}

module.exports = webpackConfig
