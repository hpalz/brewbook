angular.module('app').factory('mvAuthRecipe', function($http, $q, mvRecipe) {
  return {
    createRecipe: function(newRecipeData) {
      var dfd = $q.defer();
      var newRecipe = new mvRecipe(newRecipeData);

      newRecipe.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }
  }
});