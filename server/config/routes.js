var auth = require('./auth'),
  users = require('../controllers/users'),
  recipes = require('../controllers/recipes'),
  inventory = require('../controllers/inventory'),
  stylesAdvanced = require('../../data/stylesAdvanced.json'),
  fermentables = require('../../data/fermentables.json'),
  hops = require('../../data/hops.json'),
  yeasts = require('../../data/yeasts.json'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.get('/stylesAdvanced', function (req, res) {
    res.send(stylesAdvanced)
  })
  app.get('/fermentables', function (req, res) {
    res.send(fermentables)
  })
  app.get('/hops', function (req, res) {
    res.send(hops)
  })
  app.get('/yeasts', function (req, res) {
    res.send(yeasts)
  })

  app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
  app.post('/api/users', users.createUser); 
  app.put('/api/users', users.updateUser);

  app.get('/api/inventory', auth.requiresApiLogin, inventory.getInventory);
  app.post('/api/inventory', auth.requiresApiLogin, inventory.createInventory);
  app.put('/api/inventory', inventory.updateInventory);

  app.get('/api/recipes/:id', recipes.getRecipeById);
  app.get('/api/recipes', recipes.getRecipes);
  app.post('/api/recipes', recipes.createRecipe);
  app.delete('/api/recipes', recipes.deleteRecipe);
  app.post('/api/importRecipes', recipes.importRecipe);
  app.get('/api/importRecipes', recipes.getRecipes);

  app.get('/partials/*', function (req, res) {
    res.render('../../public/app/' + req.params[0]);
  });

  app.post('/login', auth.authenticate);

  app.post('/logout', function (req, res) {
    req.logout();
    res.end();
  });

  app.all('/api/*', function (req, res) {
    res.send(404);
  });

  app.get('*', function (req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
}