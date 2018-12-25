angular.module('app').controller('mvDeleteRecipeCtrl', function($scope, mvAuthRecipe, mvNotifier, $location) {

  $scope.delete = function(id) {
    var oldRecipe = {
      id
    };

    mvAuthRecipe.deleteRecipe(oldRecipe).then(function() {
      mvNotifier.notify('Recipe deleted!');
      $location.path('/');
    }, function(reason) {
      mvNotifier.error(reason);
    })
  }
})