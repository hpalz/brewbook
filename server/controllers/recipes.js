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
  var newRecipe = req.body;
  newRecipe.created = new Date();
  newRecipe.style.name = newRecipe.style;
  Recipe.create(newRecipe, function(err, recipe) {
    if(err) {
      // todo
    }
    res.send(recipe);
  })
};