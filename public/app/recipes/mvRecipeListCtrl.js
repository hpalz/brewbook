angular.module('app').controller('mvRecipeListCtrl', function ($scope, mvIdentity, mvCachedRecipes) {
  $scope.recipes = [];
  if(mvIdentity.currentUser != undefined){
    mvCachedRecipes.query().$promise.then(function (collection) {
      collection.forEach(function (recipe) {
        if (recipe.username ===mvIdentity.currentUser.username) {
          $scope.recipes.push(recipe);
          $scope.sortOptions = [{ value: "name", text: "Sort by Name" },
          { value: "created", text: "Sort by Created Date" }];
          $scope.sortOrder = $scope.sortOptions[0].value;
        }
      });
    });
  }
}); 