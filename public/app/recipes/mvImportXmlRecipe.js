angular.module('app').controller('mvImportXmlRecipe', function($scope, mvAuthRecipe, mvNotifier, $location) {
    var fileToUpload = null;
    var reader = new FileReader();
    $scope.addFiles = function() {
      reader.readAsText(fileToUpload);
    };
    reader.onload = function(e) {
      var json = xml2json.parser(reader.result);
      mvAuthRecipe.importXml(json).then(function() {
        mvNotifier.notify('Recipe created!');
        $location.path('/');
      }, function(reason) {
        mvNotifier.error(reason);
      });
    }
    $scope.uploadFile = function(){
        fileToUpload = event.target.files[0];
    };
});

angular.module('app').directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeFunc);
    }
  };
});