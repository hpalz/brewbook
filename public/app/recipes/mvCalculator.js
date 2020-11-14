angular.module('app').factory('mvCalculator', function ($q) {
  var currentFermentables = [];
  return {
    calcOG: function () {
      var dfd = $q.defer();
      var returnOG = 0;
      for (var key in currentFermentables) {
        returnOG += currentFermentables[key].curOG;
      }
      dfd.resolve(returnOG);
      return dfd.promise;
    },
    addFerm: function (fermentable, weight, numGal, id) {
      var dfd = $q.defer();
      if(weight > 0 && fermentable != undefined){
        var tempOG = fermentable.ppg * weight / numGal;
        currentFermentables.push({
          id: id,
          curOG: tempOG,
          name: fermentable.fermentableName,
          ppg: fermentable.ppg,
          numGal: numGal,
          weight: weight
        })
        dfd.resolve();
      } else {
        dfd.reject();
      }
      return dfd.promise;
    },
    delFerm: function (id) {
      var dfd = $q.defer();
      var returnOG = 0;
      for (var key in currentFermentables) {
        if(currentFermentables[key].id == id)
        {
          currentFermentables.splice(key,1)
        }
      }
      dfd.resolve();
      return dfd.promise;
    }

  }
});