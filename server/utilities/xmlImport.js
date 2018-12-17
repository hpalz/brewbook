fs = require('fs');
var parser = require('xml2json');

exports.readXml = function(fileName) {
    return fs.readFile( fileName, function(err, data) {
        var json = parser.toJson(data);
        console.log("to json ->", json);
    });
}