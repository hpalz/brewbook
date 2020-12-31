var mongoose = require('mongoose');
var Recipe = require('mongoose').model('Recipe');
var parser = require('xml2json');
var xmlImportUtility = require('../utilities/xmlImport');
var auth = require('../config/auth');

exports.getRecipes = function(req, res) {
  var username = auth.username();
  Recipe.find({username:username}).exec(function(err, collection) {
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
  var username = auth.username();
  var newRecipe = new Recipe ({
    _id: new mongoose.Types.ObjectId(),
    created: new Date(),
    style: {
      name: recipeBody.style.Style
    },
    calculated: recipeBody.calculated,
    yeasts: recipeBody.yeasts,
    fermentables: recipeBody.fermentables,
    hops: recipeBody.hops,
    name: recipeBody.name,
    featured: recipeBody.featured,
    username: username
  });
  Recipe.create(newRecipe, function(err, recipe) {
    if(err) {
      // todo
    }
    res.send(recipe);
  })
};

exports.deleteRecipe = function(req, res, next) {
  var recipeId = req.query.id;
  
  Recipe.findByIdAndDelete(recipeId, function(err, recipe) {
    if(err) {
      // todo
    }
    res.send(recipe);
  })
};

exports.importRecipe = function(req, res, next) {
  var recipeBody = req.body.recipes.recipe;
  var i = 0;
  var username = auth.username();
  var newRecipe = new Recipe ({
    _id: new mongoose.Types.ObjectId(),
    created: new Date(),
    style: JSON.parse(JSON.stringify(recipeBody.style)),
    fermentables : JSON.parse(JSON.stringify(recipeBody.fermentables)),
    hops : JSON.parse(JSON.stringify(recipeBody.hops)),
    yeasts : JSON.parse(JSON.stringify(recipeBody.yeasts)),
    name: recipeBody.name,
    grainType: recipeBody.type,
    boil_time: recipeBody.boil_time,
    boil_size: recipeBody.boil_size,
    batch_size: recipeBody.batch_size,
    efficiency: recipeBody.efficiency,
    brewer: recipeBody.brewer,
    featured: true,
    username: username
  });
/*  while(recipeBody.fermentables.fermentable[i])
  {
    newRecipe.fermentables.fermentable[i] = recipeBody.fermentables.fermentable[i];
    i++;
  }
  i = 0;
  while(recipeBody.hops.hop[i])
  {
    newRecipe.hops.hop[i] = recipeBody.hops.hop[i];
    i++;
  }
  i = 0;
  if(recipeBody.yeasts.yeast[i])
  {
    while(recipeBody.yeasts.yeast[i])
    {
      newRecipe.yeasts.yeast[i] = recipeBody.yeasts.yeast[i];
      i++;
    }
  }
  else
  {
    newRecipe.yeasts.yeast[0] = recipeBody.yeasts.yeast;
  }*/
  Recipe.create(newRecipe, function(err, recipe) {
    if(err) {
      // todo
    }
    res.send(recipe);
  })
};