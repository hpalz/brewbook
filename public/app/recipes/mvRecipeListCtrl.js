angular.module('app').controller('mvRecipeListCtrl', function($scope, mvCachedRecipes) {
  $scope.recipes = mvCachedRecipes.query();

  $scope.sortOptions = [{value:"name",text: "Sort by Name"},
    {value: "created",text: "Sort by Created Date"}];
  $scope.sortOrder = $scope.sortOptions[0].value;
}); 