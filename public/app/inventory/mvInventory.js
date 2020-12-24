angular.module('app').factory('mvInventory', function($resource) {
  var InventoryResource = $resource('/api/inventory/:_id', {_id: "@id"}, {
    update: {method:'PUT', isArray:false}
  });

  return InventoryResource;
});