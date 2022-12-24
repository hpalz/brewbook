var mongoose = require('mongoose'),
    userModel = require('../models/User'),
    inventoryModel = require('../models/Inventory'),
    recipeModel = require('../models/Recipe');

module.exports = function(config) {
  mongoose.connect(config.db, { useNewUrlParser: true })
  //mongoose.set('useCreateIndex', true);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('brewbook db opened');
    /*UNCOMMENT TO DROP DATABASE
    db.dropDatabase( function (err, result) {

      if (err) {
  
          console.log("error delete collection");
  
      } else {
  
          console.log("delete collection success");
  
      }
  
  });*/
  });

/*
Uncomment to init db
  userModel.createDefaultUsers();
  recipeModel.createDefaultRecipes();
  inventoryModel.createDefaultInventory();
*/
};

