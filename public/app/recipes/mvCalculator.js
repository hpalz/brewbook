var ibuGravityLookup = [1.030, 1.040, 1.050, 1.060, 1.070, 1.080, 1.090, 1.100, 1.110, 1.120];
var ibuUtilLookup = [
  [0, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000],
  [5, 0.055, 0.050, 0.046, 0.042, 0.038, 0.035, 0.032, 0.029, 0.027, 0.025],
  [10, 0.100, 0.091, 0.084, 0.076, 0.070, 0.064, 0.058, 0.053, 0.049, 0.045],
  [15, 0.137, 0.125, 0.114, 0.105, 0.096, 0.087, 0.080, 0.073, 0.067, 0.061],
  [20, 0.167, 0.153, 0.140, 0.128, 0.117, 0.107, 0.098, 0.089, 0.081, 0.074],
  [25, 0.192, 0.175, 0.160, 0.147, 0.134, 0.122, 0.112, 0.102, 0.094, 0.085],
  [30, 0.212, 0.194, 0.177, 0.162, 0.148, 0.135, 0.124, 0.113, 0.103, 0.094],
  [35, 0.229, 0.209, 0.191, 0.175, 0.160, 0.146, 0.133, 0.122, 0.111, 0.102],
  [40, 0.242, 0.221, 0.202, 0.185, 0.169, 0.155, 0.141, 0.129, 0.118, 0.108],
  [45, 0.253, 0.232, 0.212, 0.194, 0.177, 0.162, 0.148, 0.135, 0.123, 0.113],
  [50, 0.263, 0.240, 0.219, 0.200, 0.183, 0.168, 0.153, 0.140, 0.128, 0.117],
  [55, 0.270, 0.247, 0.226, 0.206, 0.188, 0.172, 0.157, 0.144, 0.132, 0.120],
  [60, 0.276, 0.252, 0.231, 0.211, 0.193, 0.176, 0.161, 0.147, 0.135, 0.123],
  [70, 0.285, 0.261, 0.238, 0.218, 0.199, 0.182, 0.166, 0.152, 0.139, 0.127], [80, 0.291, 0.266, 0.243, 0.222, 0.203, 0.186, 0.170, 0.155, 0.142, 0.130], [90, 0.295, 0.270, 0.247, 0.226, 0.206, 0.188, 0.172, 0.157, 0.144, 0.132], [100, 0.298, 0.272, 0.249, 0.228, 0.208, 0.190, 0.174, 0.159, 0.145, 0.133], [110, 0.300, 0.274, 0.251, 0.229, 0.209, 0.191, 0.175, 0.160, 0.146, 0.134], [120, 0.301, 0.275, 0.252, 0.230, 0.210, 0.192, 0.176, 0.161, 0.147, 0.134]];
angular.module('app').factory('mvCalculator', function ($q) {
  var currentFermentables = [];
  var currentHops = [];
  var currentYeasts = [];
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
      if (weight > 0 && fermentable != undefined) {
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
        if (currentFermentables[key].id == id) {
          currentFermentables.splice(key, 1)
        }
      }
      dfd.resolve();
      return dfd.promise;
    },
    calcFG: function () {
      var dfd = $q.defer();
      var returnFG = 0;
      for (var key in currentYeasts) {
        returnFG = currentYeasts[key].curFG;
        break;
      }
      dfd.resolve(returnFG);
      return dfd.promise;
    },
    addYeast: function (yeast, totalPoints, id) {
      var dfd = $q.defer();
      if (totalPoints > 0 && yeast != undefined) {
        var tempFG = 1 + ((totalPoints * (100 - yeast.attenuation.replace(/[^\d.-]/g, ''))/100) / 1000);
        currentYeasts.push({
          id: id,
          curFG: tempFG,
          name: yeast.yeastName,
          attenuation: yeast.attenuation
        })
        dfd.resolve();
      } else {
        dfd.reject();
      }
      return dfd.promise;
    },
    delYeast: function (id) {
      var dfd = $q.defer();
      for (var key in currentYeasts) {
        if (currentYeasts[key].id == id) {
          currentYeasts.splice(key, 1)
        }
      }
      dfd.resolve();
      return dfd.promise;
    },
    calcIBU: function () {
      var dfd = $q.defer();
      var returnIBU = 0;
      for (var key in currentHops) {
        returnIBU += currentHops[key].curIBU;
      }
      dfd.resolve(returnIBU);
      return dfd.promise;
    },
    addHop: function (hop, weight, duration, numGal, id, gravity) {
      var dfd = $q.defer();
      if (weight > 0 && hop != undefined) {
        // calculate AAU
        var tempIBU = hop.alphaMin.replace(/[^\d.-]/g, '') * weight
        var curKey = 0;
        for (var i = 0; i < ibuGravityLookup.length - 1; i++)
        {
          if (ibuGravityLookup[i] >= gravity) {
            curKey = i;
            break;
          }
        }
        var utilAmount = 0;
        for (var key in ibuUtilLookup) {
          if (ibuUtilLookup[key][0] >= duration) {
            utilAmount = ibuUtilLookup[key][curKey + 1];
            break;
          }
        }
        // calculate IBU
        tempIBU = tempIBU * utilAmount * 74.89 / numGal;

        currentHops.push({
          id: id,
          curIBU: tempIBU,
          name: hop.hopName,
          duration: duration,
          ppg: hop.ppg,
          numGal: numGal,
          weight: weight
        })
        dfd.resolve();
      } else {
        dfd.reject();
      }
      return dfd.promise;
    },
    delHop: function (id) {
      var dfd = $q.defer();
      for (var key in currentHops) {
        if (currentHops[key].id == id) {
          currentHops.splice(key, 1)
        }
      }
      dfd.resolve();
      return dfd.promise;
    }

  }
});