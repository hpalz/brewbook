angular.module('app').factory('mvAuthRecipe', function($http, $q, mvIdentity, mvRecipe, mvCachedRecipes, mvRecipeImport, mvNotifier) {
  return {
    createRecipe: function(newRecipeData) {
      var dfd = $q.defer();
      var newRecipe = new mvRecipe(newRecipeData);

      newRecipe.$save().then(function() {
        dfd.resolve(newRecipe);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    updateRecipe: function(newRecipeData) {
      var dfd = $q.defer();
      var newRecipe = new mvRecipe(newRecipeData);

      newRecipe.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    deleteRecipe: function(recipeData) {
      var dfd = $q.defer();
      var foundRecipe;
      mvCachedRecipes.query().$promise.then(function(collection) {
        collection.forEach(function(recipe) {
          if(recipe._id === recipeData.id) {
            //foundRecipe = new mvRecipe(recipe);

            if(mvIdentity.isOwner(recipe.username)) {
              recipe.$delete(recipeData).then(function() {
                dfd.resolve();
              }, function(response) {
                dfd.reject(response.data.reason);
              });
            } else {
              mvNotifier.notify('You are not authorized');
              return $q.reject('not authorized');
            }
          }
        })
      })

      return dfd.promise;
    },
    importXml: function(json) {
      var dfd = $q.defer();
      var newRecipe = new mvRecipeImport(json);

      newRecipe.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }
  }
});