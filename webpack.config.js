const webpack = require('webpack');
const path = require("path");
const atl = require('awesome-typescript-loader');
const tsConfigFilePath = path.resolve("./tsconfig.json");
const fs = require('fs');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BUNDLES_ROOT = path.resolve("./Scripts/bundles/");
const OUTPUT_DIR = './wwwroot/dist';
const outputPath = path.resolve(OUTPUT_DIR);
const config = {};
console.log("Webpack started: ");
console.log("Compiling files ");
console.log("Output path:" + outputPath);

config.dev = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: [
        path.resolve(__dirname, "libs", "core.min.js"),
        "whatwg-fetch",
        "url-search-params-polyfill"
    ],
    stats: { modules: false },
    devServer: {
        stats: 'errors-only'
    },
    target: 'web',
    output: {
        path: outputPath,
        filename: '[name].js',
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader?-url", "fast-sass-loader"]
            },
            {
                test: /\.png/,
                use: 'ignore-loader'
            },
            {
                test: /\.ts(x?)$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                }
            },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=100000' },
            { test: /(\.css)$/, loaders: ['style-loader', 'css-loader'] },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
            { test: /\.(woff|woff2)$/, loader: "url-loader?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
        ]
    },
    resolve: {
        plugins: [
            new atl.TsConfigPathsPlugin({ configFileName: tsConfigFilePath })
        ],
        extensions: ['.ts', '.tsx', '.js'],
        modules: [path.resolve(__dirname, "node_modules"), "node_modules"]
    },
    plugins: [
        //new webpack.optimize.ModuleConcatenationPlugin(),
        new atl.CheckerPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({ "process.env": { NODE_ENV: JSON.stringify("development") } })
    ],
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "shared",
                    minChunks: 2,
                    chunks: "all"
                }
            }
        }
    }
};

config.release = Object.assign({}, config.dev, {
    mode: 'production',
    entry: [
        path.resolve(__dirname, "libs", "core.min.js"),
        "whatwg-fetch",
        "url-search-params-polyfill"
    ],
    devtool: 'cheap-module-source-map',
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "shared",
                    minChunks: 2,
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }),
        //new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HashedModuleIdsPlugin()
    ]
});

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

const devEntries = {};
const releaseEntries = {};
getDirectories(BUNDLES_ROOT).map(dirName => {
    devEntries[dirName] = config.dev.entry.concat([path.resolve(BUNDLES_ROOT, dirName, "main.tsx")]);
    releaseEntries[dirName] = config.release.entry.concat([path.resolve(BUNDLES_ROOT, dirName, "main.tsx")]);
});
config.dev.entry = devEntries;
config.release.entry = releaseEntries;
module.exports = (env) => {


    var isDevBuild = !(env && env.prod);

    if (isDevBuild) {
        return [config.dev];
    } else {
        return [config.release];
    }
};