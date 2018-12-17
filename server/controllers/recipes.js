var mongoose = require('mongoose');
var Recipe = require('mongoose').model('Recipe');

exports.getRecipes = function(req, res) {
  Recipe.find({}).exec(function(err, collection) {
    res.send(collection);
  })
};

exports.getRecipeById = function(req, res) {
  Recipe.findOne({_id:req.params.id}).exec(function(err, recipe) {
    res.send(recipe);
  })
};

exports.createRecipe = function(req, res, next) {
  var recipeBody = req.body;
  var newRecipe = new Recipe ({
    _id: new mongoose.Types.ObjectId(),
    created: new Date(),
    style: {
      name: recipeBody.style
    },
    name: recipeBody.name,
    featured: recipeBody.featured
  });
  Recipe.create(newRecipe, function(err, recipe) {
    if(err) {
      // todo
    }
    res.send(recipe);
  })
};