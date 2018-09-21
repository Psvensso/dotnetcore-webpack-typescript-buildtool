var path = require("path");
var args = require("../helpers/args");

var exec = require('child_process').execFile;
console.log(args);
var fun = function() {
    const exePath = path.resolve(__dirname, "../typings/TypeScriptTypesGen.exe");
    exec(exePath, [args["assembly"], args["output"]], function(err, data) {
        console.log(err)
        console.log(data.toString());
    });
}
fun();