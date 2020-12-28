var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/brewbook',
    rootPath: rootPath,
    port: process.env.PORT || 3030,
    corsOptions : {
      origin: '*',
      optionsSuccessStatus: 200
    }
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://jeames:brewbook@ds053178.mongolab.com:53178/brewbook',
    port: process.env.PORT || 80,
    corsOptions : {
      origin: '*',
      optionsSuccessStatus: 200
    }
  }
}