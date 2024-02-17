var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
const uri = process.env.MONGODB_URI;

module.exports = {
  development: {
    db: 'mongodb://localhost/brewbook',//mongodb+srv://zarfus:IkrENkBqUsKKuqBD@brewbook0.vxtwa.mongodb.net/brewbook
    rootPath: rootPath,
    port: process.env.PORT || 3030,
    corsOptions : {
      origin: '*',
      optionsSuccessStatus: 200
    }
  },
  production: {
    rootPath: rootPath,
    db:uri,
    port: process.env.PORT || 80,
    corsOptions : {
      origin: '*',
      optionsSuccessStatus: 200
    }
  }
}