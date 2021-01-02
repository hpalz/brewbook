angular.module('app').controller('mvCloneRecipeCtrl', function($scope, mvAuthRecipe, mvNotifier, $location) {

  $scope.delete = function(id) {
    var oldRecipe = {
      id
    };

    mvAuthRecipe.deleteRecipe(oldRecipe).then(function() {
      mvNotifier.notify('Recipe cloned!');
      $location.path('/');
    }, function(reason) {
      mvNotifier.error(reason);
    })
  }
})