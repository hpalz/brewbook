angular.module('app').controller('mvMainCtrl', function($scope, mvIdentity, mvCachedRecipes) {
  $scope.identity = mvIdentity;
  if(mvIdentity.isAuthenticated())
  {
    $scope.recipes = mvCachedRecipes.query();
  }
});