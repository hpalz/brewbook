angular.module('app').controller('mvMainCtrl', function($scope, mvCachedRecipes) {
  $scope.recipes = mvCachedRecipes.query();
});