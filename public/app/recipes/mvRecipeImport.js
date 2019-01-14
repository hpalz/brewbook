angular.module('app').factory('mvRecipeImport', function($resource) {
  var RecipeResource = $resource('/api/importRecipes/:_id', {_id: "@id"}, {
    update: {method:'PUT', isArray:true}
  });

  return RecipeResource;
});