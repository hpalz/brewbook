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
    //shit don't work:
    updateInventory: function(newInventoryData) {
      var dfd = $q.defer();
      var newInventory = new mvInventory(newInventoryData);

      newInventory.$update().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    deleteInventory: function(inventoryData) {
      var dfd = $q.defer();
      var foundInventory;
      mvCachedInventory.query().$promise.then(function(collection) {
        collection.forEach(function(inventory) {
          if(inventory._id === inventoryData.id) {
            //foundInventory = new mvInventory(inventory);

            inventory.$delete(inventoryData).then(function() {
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