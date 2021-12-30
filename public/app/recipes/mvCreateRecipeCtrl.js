var MIN_G = 0;
var MAX_G = 115;
var MIN_ABV = 0;
var MAX_ABV = 20;
var MIN_IBU = 0;
var MAX_IBU = 140;
var MIN_COLOR = 0;
var MAX_COLOR = 55;
var fermCount = 0;
var hopCount = 0;
var yeastCount = 0;
var numGal = 5.5;
var curOG = 0;
var curSRM = 0;
var curFG = 1.0;
var curABV = 0;
var curIBU = 0;
var efficiency = .75;
var boilTime = 60;

angular.module('app').controller('mvCreateRecipeCtrl', function ($scope, $http, mvAuthRecipe, mvNotifier, mvCalculator, mvIdentity, $location) {
  $scope.createNew = function() {
    $location.path("/newRecipe")
  }
  $scope.import = function() {
    $location.path("/importRecipe")
  }
  $scope.identity = mvIdentity;
  var DURATION = 300;
  var vm = this;
  var chosenStyle = null;
  var styleList = null;
  var fermentableList = null;
  var hopList = null;
  var thisFermWeight = 0;
  var thisHopWeight = 0;
  var myLineChart = null;
  var ctx = document.getElementById("canvas");
  if (ctx) {
    ctx = canvas.getContext("2d");
  }
  $scope.value = '30%';
  $scope.addedFermentables = [];
  $scope.addedHops = [];
  $scope.addedYeasts = [];
  $scope.data = [];
  this.route = 'stylesAdvanced';
  $http.get(vm.route).then(function (styleJson) {
    styleList = styleJson.data;
    $scope.styleList = styleJson.data;
  });
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
  $scope.fermUnitList = [{ "fermUnitName": "lbs", "id": 0 }, { "fermUnitName": "oz", "id": 1 }];
  $scope.getFermName = function (string) {
    if(string == undefined){
      string = '';
    }
    $scope.hideFerm = false;
    var output = [];
    angular.forEach($scope.fermentableList, function (fermentable) {
      if (fermentable.fermentableName.toLowerCase().indexOf(string.toLowerCase()) >= 0) {
        output.push(fermentable);
      }
    });
    $scope.filterfermentable = output;
  };
  $scope.fillFermBox = function (string) {
    $scope.fermentable = string;
    $scope.displayFermentable = '';
    $scope.hideFerm = true;
  };
  $scope.fermDelete = function (x) {
    console.log("Removed " + x.newFerm.name)
    mvCalculator.delFerm(x.newFerm.count).then(function (returnFermList) {
      mvCalculator.calcOG().then(function (returnOG) {
        curOG = returnOG;
        updateChart();
        for (var i = $scope.addedFermentables.length - 1; i >= 0; i--) {
          if ($scope.addedFermentables[i].count === x.newFerm.count) {
            $scope.addedFermentables.splice(i, 1)
            break
          }
        }
      });
    })
  }

  $scope.addFermentable = function () {
    //Create an input type dynamically.
    thisFermWeight = 0
    mvCalculator.addFerm($scope.fermentable, $scope.fermWeight, numGal, fermCount).then(function (returnFermList) {
      $scope.addedFermentables.push({
        name: $scope.fermentable.fermentableName,
        amount: $scope.fermWeight,
        display_amount: $scope.fermUnit.fermUnitName,
        count: fermCount
      });
      mvCalculator.calcOG().then(function (returnOG) {
        curOG = returnOG;
        mvCalculator.calcSRM().then(function (returnSRM) {
          curSRM = returnSRM;
          updateChart();
          $scope.fermWeight = ""
          $scope.fermentable = ''
          fermCount++;
        });
      });
    });
  }
  $scope.hopUnitList = [{ "hopUnitName": "oz", "id": 0 }];
  $scope.getHopName = function (string) {
    if(string == undefined){
      string = '';
    }
    $scope.hideHops = false;
    var output = [];
    angular.forEach($scope.hopList, function (hop) {
      if (hop.hopName.toLowerCase().indexOf(string.toLowerCase()) >= 0) {
        output.push(hop);
      }
    });
    $scope.filterhop = output;
  };
  $scope.fillHopBox = function (string) {
    $scope.hop = string;
    $scope.displayHop = '';
    $scope.hideHops = true;
  };
  $scope.hopDelete = function (x) {
    console.log("Removed " + x.newHop.name)
    mvCalculator.delHop(x.newHop.count).then(function (returnHopList) {
      mvCalculator.calcIBU().then(function (returnIBU) {
        curIBU = returnIBU;
        updateChart();
        for (var i = $scope.addedHops.length - 1; i >= 0; i--) {
          if ($scope.addedHops[i].count === x.newHop.count) {
            $scope.addedHops.splice(i, 1)
            break
          }
        }
      });
    })
  }

  $scope.addHop = function () {
    //Create an input type dynamically.
    thisHopWeight = 0
    mvCalculator.addHop($scope.hop, $scope.hopWeight, $scope.hopDuration, numGal, hopCount, (1 + (curOG * efficiency / 1000))).then(function (returnHopList) {
      $scope.addedHops.push({
        name: $scope.hop.hopName,
        amount: $scope.hopWeight,
        display_amount: $scope.hopUnit.hopUnitName,
        time: $scope.hopDuration,
        count: hopCount
      });
      mvCalculator.calcIBU().then(function (returnIBU) {
        curIBU = returnIBU;
        updateChart();
        $scope.hopWeight = ""
        hopCount++;
      });
    });
  }
  $scope.getYeastName = function (string) {
    if(string == undefined){
      string = '';
    }
    $scope.hideYeast = false;
    var output = [];
    angular.forEach($scope.yeastList, function (yeast) {
      if (yeast.yeastName.toLowerCase().indexOf(string.toLowerCase()) >= 0) {
        output.push(yeast);
      }
    });
    $scope.filteryeast = output;
  };
  $scope.fillYeastBox = function (string) {
    $scope.yeast = string;
    $scope.displayYeast = '';
    $scope.hideYeast = true;
  };

  $scope.yeastDelete = function (x) {
    console.log("Removed " + x.newYeast.name)
    mvCalculator.delYeast(x.newYeast.count).then(function () {
      mvCalculator.calcFG().then(function (returnFG) {
        curFG = returnFG;
        updateChart();
        for (var i = $scope.addedYeasts.length - 1; i >= 0; i--) {
          if ($scope.addedYeasts[i].count === x.newYeast.count) {
            $scope.addedYeasts.splice(i, 1)
            break
          }
        }
      });
    })
  }

  $scope.addYeast = function () {
    //Create an input type dynamically.
    thisYeastWeight = 0
    mvCalculator.addYeast($scope.yeast, curOG * numGal, yeastCount).then(function () {
      $scope.addedYeasts.push({
        name: $scope.yeast.yeastName,
        lab: $scope.yeast.lab,
        count: yeastCount
      });
      mvCalculator.calcFG().then(function (returnFG) {
        curFG = returnFG;
        updateChart();
        yeastCount++;
      });
    });
  }
  $scope.updateEff = function () {
    efficiency = $scope.efficiency / 100;
    updateChart();
  }
  $scope.updateBatch = function () {
    numGal = $scope.batch_size;
    updateChart();
  }
  $scope.updateTime = function () {
    boilTime = $scope.boil_Time;
    updateChart();
  }
  $scope.updateStyle = function () {
    // GET THE SELECTED VALUE FROM <select> ELEMENT AND SHOW IT.
    chosenStyle = $scope.style;
    updateChart();
  }
  $scope.create = function () {
    var newRecipe = {
      name: $scope.name,
      fermentables: $scope.addedFermentables,
      hops: $scope.addedHops,
      yeasts: $scope.addedYeasts,
      efficiency: efficiency,
      batch_size: numGal,
      boil_time: boilTime,
      calculated: {
        og: curOG,
        fg: curFG,
        srm: curSRM,
        abv: curABV,
        ibu: curIBU
      },
      actual: {
        og: curOG,
        fg: curFG,
        srm: curSRM,
        abv: curABV,
        ibu: curIBU
      },
      style: chosenStyle,
      featured: false
    };

    mvAuthRecipe.createRecipe(newRecipe).then(function (successRecipe) {
      mvNotifier.notify('Recipe created!');
      $location.path('/recipes/'+successRecipe._id);
    }, function (reason) {
      mvNotifier.error(reason);
    })
  }

  function updateChart() {
    var recipeMinValues = [chosenStyle.OGMin, chosenStyle.FGMin, chosenStyle.IBUMin, chosenStyle.ColorMin, chosenStyle.ABVMin];
    var recipeMaxValues = [chosenStyle.OGMax, chosenStyle.FGMax, chosenStyle.IBUMax, chosenStyle.ColorMax, chosenStyle.ABVMax];
    mvCalculator.calcABV((1 + (curOG * efficiency / 1000)), curFG).then(function (returnABV) {
      curABV = returnABV;
      var recipeValues = [(1 + (curOG * efficiency / 1000)).toFixed(3), curFG.toFixed(3), curIBU.toFixed(0), curSRM.toFixed(0), curABV.toFixed(1)];
      window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
      };
      var color = Chart.helpers.color;
      var horizontalBarChartData = {
        labels: ["OG", "FG", "IBU", "Color", "ABV", ""],
        datasets: [{
          label: 'Dataset 1',
          backgroundColor: '#ecf0f1',
          borderWidth: 0,
          stack: 'Stack 0',
          data: [
            ((chosenStyle.OGMin - 1.0) * 1000) / MAX_G * 100,
            ((chosenStyle.FGMin - 1.0) * 1000) / MAX_G * 100,
            chosenStyle.IBUMin / MAX_IBU * 100,
            chosenStyle.ColorMin / MAX_COLOR * 100,
            chosenStyle.ABVMin / MAX_ABV * 100,
            100
          ]
        }, {
          label: 'Dataset 2',
          backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
          borderColor: window.chartColors.blue,
          stack: 'Stack 0',
          data: [
            ((chosenStyle.OGMax - chosenStyle.OGMin) * 1000),
            ((chosenStyle.FGMax - chosenStyle.FGMin) * 1000),
            (chosenStyle.IBUMax - chosenStyle.IBUMin) / MAX_IBU * 100,
            (chosenStyle.ColorMax - chosenStyle.ColorMin) / MAX_COLOR * 100,
            (chosenStyle.ABVMax - chosenStyle.ABVMin) / MAX_ABV * 100,
            0
          ]
        }, {
          label: 'Dataset 3',
          backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
          borderColor: window.chartColors.blue,
          stack: 'Stack 1',
          data: [
            ((recipeValues[0] - 1.0) * 1000) / MAX_G * 100,
            ((curFG - 1.0) * 1000) / MAX_G * 100,
            (curIBU) / MAX_IBU * 100,
            (curSRM) / MAX_COLOR * 100,
            (curABV) / MAX_ABV * 100,
            0
          ]
        }]

      };
      var config = {
        type: 'horizontalBar',
        data: horizontalBarChartData,
        options: {
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data['labels'][tooltipItem[0]['index']];
              },
              label: function (tooltipItem, data) {
                return "min: " + recipeMinValues[tooltipItem.index] + "\nmax: " + recipeMaxValues[tooltipItem.index];
              },
              afterLabel: function (tooltipItem, data) {
                return "current: " + recipeValues[tooltipItem.index];
              }
            },
            backgroundColor: '#FFF',
            titleFontSize: 16,
            titleFontColor: '#0066ff',
            bodyFontColor: '#000',
            bodyFontSize: 14,
            displayColors: false
          },
          // Elements options apply to all of the options unless overridden in a dataset
          // In this case, we are setting the border of each horizontal bar to be 2px wide
          elements: {
            rectangle: {
              borderWidth: 2,
            }
          },
          responsive: true,
          title: {
            display: false
          }
        }
      };
      if (myLineChart != null) {
        myLineChart.destroy();
      }
      myLineChart = new Chart(ctx, config);
      window.myHorizontalBar = myLineChart;
    });
  }
})