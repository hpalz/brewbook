var mongoose = require('mongoose');

var recipeSchema = mongoose.Schema({
  name: {type:String, required:'{PATH} is required!'},
  featured: {type:Boolean, required:'{PATH} is required!'},
  style: {type:String, required:'{PATH} is required!'},
  created: {type:Date, required:'{PATH} is required!'}
});
var Recipe = mongoose.model('Recipe', recipeSchema);

function createDefaultRecipes() {
  Recipe.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      Recipe.create({name: 'test', featured: true, style: 'IPA', created: new Date('10/5/2013')});
    }
  })
}

exports.createDefaultRecipes = createDefaultRecipes;