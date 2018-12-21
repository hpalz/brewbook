fs = require('fs');
var parser = require('xml2json');
var FileReader = require('filereader');

exports.readXml = function(file) {
    var reader = new FileReader();
    var blob = file.slice(0,20);
    return reader.readAsBinaryString(blob);
   /* return fs.readFile( fileName, function(err, data) {
        var json = parser.toJson(data);
        console.log("to json ->", json);
    });*/
}