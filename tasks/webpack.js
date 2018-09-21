const webpack = require("webpack");
const fs = require("fs");
var ts = require("typescript");
var args = require("../helpers/args");
const path = require('path')
const release = args["--release"] || args["release"];
let config = {};

if (release) {
    console.log("Building release");
    config = require("../webpack.config.js").release
} else {
    console.log("Building dev");
    config = require("../webpack.config.js").dev
}

if (args["publicPath"]) {
    config.output.publicPath = args["publicPath"];
}

webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.error(stats.compilation.errors);
        console.warn("################# END Webpack Stats & Errors #################");
    } else {
        console.log("Webpack & TS compiled");
    }

    fs.writeFile(path.resolve(config.output.path, "stats.json"), JSON.stringify(stats.toJson()), (err) => {

        if (err) throw err;

        console.log(path.resolve(config.output.path, "stats.json") + ' has been saved!');

    });
});