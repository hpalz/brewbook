var MIN_G = 0;
var MAX_G = 115;
var MIN_ABV = 0;
var MAX_ABV = 20;
var MIN_IBU = 0;
var MAX_IBU = 140;
var MIN_COLOR = 0;
var MAX_COLOR = 55;
var fermCount = 0;
var numGal = 5.5;
var curOG = 0;
var curFG = 0;
var curColor = 0;
var curABV = 0;
var curIBU = 0;
var efficiency = .75;

angular.module('app').controller('mvCreateRecipeCtrl', function ($scope, $http, mvAuthRecipe, mvNotifier, mvCalculator, $location) {
  var DURATION = 300;
  var vm = this;
  var chosenStyle = null;
  var styleList = null;
  var fermentableList = null;
  var hopList = null;
  var thisFermWeight = 0;
  var myLineChart = null;
  var ctx = document.getElementById("canvas");  
  if(ctx) {  
    ctx = canvas.getContext("2d");  
  }
  $scope.value = '30%';
  $scope.addedFermentables = []
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
  $scope.fermUnitList = [{"fermUnitName":"lbs", "id":0},{"fermUnitName":"oz", "id":1}];
  $scope.fermDelete = function (x) {
    console.log("Removed " + x.newFerm.name)
    mvCalculator.delFerm(x.newFerm.count).then(function(returnFermList){
      mvCalculator.calcOG().then(function(returnOG){
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
      mvCalculator.addFerm($scope.fermentable, $scope.fermWeight, numGal, fermCount).then(function(returnFermList){
          $scope.addedFermentables.push({ name: $scope.fermWeight + $scope.fermUnit.fermUnitName + " " + $scope.fermentable.fermentableName, count: fermCount });
          mvCalculator.calcOG().then(function(returnOG){
            curOG = returnOG;
            updateChart();
            $scope.fermWeight = ""
            fermCount++;
        });
      });
  }
  $scope.addHop = function () {
  }
  $scope.updateEff = function () {
    efficiency = $scope.efficiency/100;
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
      featured: $scope.featured,
      style: $scope.style
    };
    $scope.style = function () {
      styleToCreate = styleList[0].styleName;
    }

    mvAuthRecipe.createRecipe(newRecipe).then(function () {
      mvNotifier.notify('Recipe created!');
      $location.path('/');
    }, function (reason) {
      mvNotifier.error(reason);
    })
  }


  function updateChart() {
    var recipeMinValues = [chosenStyle.OGMin, chosenStyle.FGMin, chosenStyle.IBUMin,chosenStyle.ColorMin, chosenStyle.ABVMin];
    var recipeMaxValues = [chosenStyle.OGMax, chosenStyle.FGMax, chosenStyle.IBUMax,chosenStyle.ColorMax, chosenStyle.ABVMax];
    var recipeValues = [(1+(curOG*efficiency / 1000)).toFixed(3), (1+(curFG / 1000).toFixed(3)), curIBU, curColor, curABV];
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
         ((chosenStyle.OGMax - chosenStyle.OGMin) * 1000) ,
         ((chosenStyle.FGMax - chosenStyle.FGMin) * 1000) ,
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
          ((recipeValues[0]-1.0)*1000) / MAX_G * 100,
          ((curFG) * 1000) / MAX_G * 100,
          (curIBU) / MAX_IBU * 100,
          (curColor) / MAX_COLOR * 100,
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
            title: function(tooltipItem, data) {
              return data['labels'][tooltipItem[0]['index']];
            },
            label: function(tooltipItem, data) {
              return "min: " + recipeMinValues[tooltipItem.index] + "\nmax: " + recipeMaxValues[tooltipItem.index];
            },
            afterLabel: function(tooltipItem, data) {
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
    if( myLineChart != null){
      myLineChart.destroy();
    }
    myLineChart = new Chart(ctx, config);
			window.myHorizontalBar = myLineChart;
  }
})