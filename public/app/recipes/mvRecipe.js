angular.module('app').factory('mvRecipe', function($resource) {
  var CourseResource = $resource('/api/recipes/:_id', {_id: "@id"}, {
    update: {method:'PUT', isArray:false}
  });

  return CourseResource;
});