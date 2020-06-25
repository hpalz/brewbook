var mongoose = require('mongoose'),
    userModel = require('../models/User'),
    dictionaryModel = require('../models/Dictionary'),
    recipeModel = require('../models/Recipe');

module.exports = function(config) {
  mongoose.connect(config.db, { useNewUrlParser: true })
  mongoose.set('useCreateIndex', true);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('bruhaus db opened');
    /*UNCOMMENT TO DROP DATABASE
    db.dropDatabase( function (err, result) {

      if (err) {
  
          console.log("error delete collection");
  
      } else {
  
          console.log("delete collection success");
  
      }
  
  });*/
  });


  userModel.createDefaultUsers();
  recipeModel.createDefaultRecipes();
  dictionaryModel.createDefaultFermentables();
  dictionaryModel.createDefaultHops();
  dictionaryModel.createDefaultYeasts();
  dictionaryModel.createDefaultExtras();
  dictionaryModel.createDefaultStyles();

};

