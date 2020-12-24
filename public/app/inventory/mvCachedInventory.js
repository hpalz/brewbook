angular.module('app').factory('mvCachedInventory', function(mvInventory) {
  var inventoryList;

  return {
    query: function() {
      if(!inventoryList) {
        inventoryList = mvInventory.query();
      }

      return inventoryList;
    }
  }
})