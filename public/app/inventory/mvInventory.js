angular.module('app').factory('mvInventory', function($resource) {
  var InventoryResource = $resource('/api/inventory', {
    query: {method:'GET',isArray:true}
  });

  return InventoryResource;
});