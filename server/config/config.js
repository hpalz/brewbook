var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/bruhaus',
    rootPath: rootPath,
    port: process.env.PORT || 3030
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://jeames:bruhaus@ds053178.mongolab.com:53178/bruhaus',
    port: process.env.PORT || 80
  }
}