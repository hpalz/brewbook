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
    updateInventory: function(recipeData) {
      var dfd = $q.defer();
      var foundInventory;
      mvCachedInventory.query().$promise.then(function(collection) {
        collection.forEach(function(inventory) {
          if(inventory.username === recipeData.username) {
            // this is where we update the inventory based on the recipe
            recipeData.fermentables.forEach(function (fermentable) {
              if(inventory.fermentables.some(ferm => ferm.name === fermentable.name)){
                let num = inventory.fermentables.findIndex(ferm => ferm.name === fermentable.name);
                inventory.fermentables[num].weight = Number(inventory.fermentables[num].weight) - Number(fermentable.amount);
                if( inventory.fermentables[num].weight < 0){
                  inventory.fermentables[num].weight = 0;
                }
                inventory.fermentables[num].weight.toString()
              }
            });
            
            recipeData.hops.forEach(function (hop) {
              if(inventory.hops.some(ferm => ferm.name === hop.name)){
                let num = inventory.hops.findIndex(ferm => ferm.name === hop.name);
                inventory.hops[num].weight = Number(inventory.hops[num].weight) - Number(hop.amount);
                if( inventory.hops[num].weight < 0){
                  inventory.hops[num].weight = 0;
                }
                inventory.hops[num].weight.toString()
              }
            });
            recipeData.yeasts.forEach(function (hop) {
              if(inventory.yeasts.some(ferm => ferm.name === hop.name)){
                let num = inventory.yeasts.findIndex(ferm => ferm.name === hop.name);
                inventory.yeasts.splice(num,1);
              }
            });

            inventory.$save().then(function() {
              dfd.resolve();
            }, function(response) {
              dfd.reject(response.data.reason);
            });
          }
        })
      })

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