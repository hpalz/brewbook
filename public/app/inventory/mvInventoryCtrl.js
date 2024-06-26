angular.module('app').controller('mvInventoryCtrl', function ($scope, $http, mvAuthInventory, mvNotifier, $location, mvCachedInventory) {
  var fermCount = 0;
  var hopCount = 0;
  var yeastCount = 0;
  var inventoryID = 0;
  mvCachedInventory.query().$promise.then(function (collection) {
    collection.forEach(function (inventory) {
      inventoryID = inventory._id;
      inventory.fermentables.forEach(function (fermentable) {
        $scope.addedFermentables.push({
          name: fermentable.name,
          weight: fermentable.weight,
          unit: fermentable.unit,
          count: fermCount
        });
        fermCount++;
      });
      inventory.hops.forEach(function (hop) {
        $scope.addedHops.push({
          name: hop.name,
          weight: hop.weight,
          unit: hop.unit,
          count: hopCount
        });
        hopCount++;
      });
      inventory.yeasts.forEach(function (yeast) {
        $scope.addedYeasts.push({
          name: yeast.name,
          count: yeastCount
        });
        yeastCount++;
      });
    })
  })

  var vm = this;
  var thisFermWeight = 0;
  $scope.addedFermentables = [];
  $scope.addedHops = [];
  $scope.addedYeasts = [];
  $scope.data = [];
  this.route = 'fermentables';
  $http.get(vm.route).then(function (fermentableJson) {
    fermentableList = fermentableJson.data;
    $scope.fermentableList = fermentableJson.data;
  });
  this.route = 'hops';
  $http.get(vm.route).then(function (hopJson) {
    hopList = hopJson.data;
    $scope.hopList = hopJson.data;
  });
  this.route = 'yeasts';
  $http.get(vm.route).then(function (yeastJson) {
    yeastList = yeastJson.data;
    $scope.yeastList = yeastJson.data;
  });
  $scope.fermUnitList = [{ "fermUnitName": "lbs", "id": 0 }];
  $scope.fermDelete = function (x) {
    console.log("Removed " + x.newFerm.name)
    for (var i = $scope.addedFermentables.length - 1; i >= 0; i--) {
      if ($scope.addedFermentables[i].count === x.newFerm.count) {
        $scope.addedFermentables.splice(i, 1)
        break
      }
    }
  }

  $scope.addFermentable = function () {
    //Create an input type dynamically.
    thisFermWeight = 0;
    $scope.addedFermentables.push({
      name: $scope.fermentable.fermentableName,
      weight: $scope.fermWeight,
      unit: $scope.fermUnit.fermUnitName,
      count: fermCount
    });
    $scope.fermWeight = ""
    fermCount++;
  }
  $scope.hopUnitList = [{ "hopUnitName": "oz", "id": 0 }];
  $scope.hopDelete = function (x) {
    console.log("Removed " + x.newHop.name)
    for (var i = $scope.addedHops.length - 1; i >= 0; i--) {
      if ($scope.addedHops[i].count === x.newHop.count) {
        $scope.addedHops.splice(i, 1)
        break
      }
    }
  }

  $scope.addHop = function () {
    //Create an input type dynamically.
    thisHopWeight = 0;
    $scope.addedHops.push({
      name: $scope.hop.hopName,
      weight: $scope.hopWeight,
      unit: $scope.hopUnit.hopUnitName,
      count: hopCount
    });
    $scope.hopWeight = ""
    hopCount++;
  }

  $scope.yeastDelete = function (x) {
    console.log("Removed " + x.newYeast.name)
    for (var i = $scope.addedYeasts.length - 1; i >= 0; i--) {
      if ($scope.addedYeasts[i].count === x.newYeast.count) {
        $scope.addedYeasts.splice(i, 1)
        break
      }
    }
  }

  $scope.addYeast = function () {
    //Create an input type dynamically.
    thisYeastWeight = 0
    $scope.addedYeasts.push({
      name: $scope.yeast.yeastName,
      lab: $scope.yeast.lab,
      count: yeastCount
    });
  }
  $scope.create = function () {
    if(inventoryID == 0)
    {
      var newInventory = {
        fermentables: $scope.addedFermentables,
        hops: $scope.addedHops,
        yeasts: $scope.addedYeasts
      };
  
      mvAuthInventory.createInventory(newInventory).then(function () {
        mvNotifier.notify('Inventory created!');
        $location.path('/');
      }, function (reason) {
        mvNotifier.error(reason);
      });
    }
    else{
      var newInventory = {
        fermentables: $scope.addedFermentables,
        hops: $scope.addedHops,
        yeasts: $scope.addedYeasts,
        _id: inventoryID
      };
  
      mvAuthInventory.createInventory(newInventory).then(function () {
        mvNotifier.notify('Inventory updated!');
        $location.path('/');
      }, function (reason) {
        mvNotifier.error(reason);
      });

    }
  }
})