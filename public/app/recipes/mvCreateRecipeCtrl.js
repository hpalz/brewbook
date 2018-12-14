angular.module('app').controller('mvCreateRecipeCtrl', function($scope, mvAuthRecipe, mvNotifier, $location) {

  $scope.create = function() {
    var newRecipe = {
      name: $scope.name,
      featured: $scope.featured,
      style: $scope.style
    };

    mvAuthRecipe.createRecipe(newRecipe).then(function() {
      mvNotifier.notify('Recipe created!');
      $location.path('/');
    }, function(reason) {
      mvNotifier.error(reason);
    })
  }
})