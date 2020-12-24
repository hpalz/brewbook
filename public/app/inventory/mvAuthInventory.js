angular.module('app').factory('mvAuthInventory', function($http, $q, mvInventory, mvCachedInventory) {
  return {
    createInventory: function(newInventoryData) {
      var dfd = $q.defer();
      var newInventory = new mvInventory(newInventoryData);

      newInventory.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    deleteInventory: function(recipeData) {
      var dfd = $q.defer();
      var foundInventory;
      mvCachedInventory.query().$promise.then(function(collection) {
        collection.forEach(function(recipe) {
          if(recipe._id === recipeData.id) {
            //foundInventory = new mvInventory(recipe);

            recipe.$delete(recipeData).then(function() {
              dfd.resolve();
            }, function(response) {
              dfd.reject(response.data.reason);
            });
          }
        })
      })

      return dfd.promise;
    }
  }
});