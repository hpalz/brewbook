var calcEff = 80;
var calcABV = 0;
var calcOG = 0;
var calcFG = 0;
var notes = "";
angular.module('app').controller('mvRecipeDetailCtrl', function ($scope, mvCachedRecipes, mvIdentity,mvNotifier, mvAuthInventory, mvAuthRecipe,$routeParams) {
  $scope.identity = mvIdentity;
  var currentRecipe;
  mvCachedRecipes.query().$promise.then(function (collection) {
    collection.forEach(function (recipe) {
      if (recipe._id === $routeParams.id) {
        currentRecipe = recipe;
        $scope.recipe = recipe;
        var chosenStyle = recipe.style;
        if(recipe.calculated){
          var curOG = recipe.calculated.og;
          var curFG = recipe.calculated.fg;
          var curSRM = recipe.calculated.srm;
          var curABV = recipe.calculated.abv;
          var curIBU = recipe.calculated.ibu;
        }
        else{
          var curOG = 0;
          var curFG = 0;
          var curSRM = 0;
          var curABV = 0;
          var curIBU = 0;
        }
        if(recipe.actual){
          calcOG = recipe.actual.og;
          calcFG = recipe.actual.fg;
          calcEff = recipe.actual.efficiency;
          calcABV = recipe.actual.abv;
          $scope.notes = recipe.actual.notes;
        }
        else
        {
          calcOG = curOG;
          calcFG = curFG;
          calcEff = 0;
          calcABV = curABV;
          $scope.notes = "";
        }
        $scope.recordedOG = calcOG;
        $scope.recordedFG = calcFG;
        $scope.calculatedABV = calcABV.toFixed(1);
        $scope.calculatedEfficiency = calcEff;
        var myLineChart = null;
        var ctx = document.getElementById("canvas");
        if (ctx) {
          ctx = canvas.getContext("2d");
        }

        var recipeMinValues = [chosenStyle.og_min, chosenStyle.fg_min, chosenStyle.ibu_min, chosenStyle.color_min, chosenStyle.abv_min];
        var recipeMaxValues = [chosenStyle.og_max, chosenStyle.fg_max, chosenStyle.ibu_max, chosenStyle.color_max, chosenStyle.abv_max];
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
          labels: ["OG " + recipeValues[0], "FG " + recipeValues[1], "IBU " + recipeValues[2], "Color " + recipeValues[3], "ABV " + recipeValues[4], ""],
          datasets: [{
            label: 'Dataset 1',
            backgroundColor: '#ecf0f1',
            borderWidth: 0,
            stack: 'Stack 0',
            data: [
              ((chosenStyle.og_min - 1.0) * 1000) / MAX_G * 100,
              ((chosenStyle.fg_min - 1.0) * 1000) / MAX_G * 100,
              chosenStyle.ibu_min / MAX_IBU * 100,
              chosenStyle.color_min / MAX_COLOR * 100,
              chosenStyle.abv_min / MAX_ABV * 100,
              100
            ]
          }, {
            label: 'Dataset 2',
            backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
            borderColor: window.chartColors.blue,
            stack: 'Stack 0',
            data: [
              ((chosenStyle.og_max - chosenStyle.og_min) * 1000),
              ((chosenStyle.fg_max - chosenStyle.fg_min) * 1000),
              (chosenStyle.ibu_max - chosenStyle.ibu_min) / MAX_IBU * 100,
              (chosenStyle.color_max - chosenStyle.color_min) / MAX_COLOR * 100,
              (chosenStyle.abv_max - chosenStyle.abv_min) / MAX_ABV * 100,
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
      }
    })
  })
  $scope.save = function () {
    currentRecipe.actual = {
      og: calcOG,
      fg: calcFG,
      efficiency: calcEff,
      abv: calcABV,
      notes: notes
    }
    //Once ingredients removed from inventory, never do it again
    let removeFromInventory = false;
    if($scope.deductIngredients){
      if(currentRecipe.featured == false)
        removeFromInventory = true;
      currentRecipe.featured = $scope.deductIngredients;
    }

    mvAuthRecipe.updateRecipe(currentRecipe).then(function () {
      if(removeFromInventory)
      {
        mvAuthInventory.updateInventory(currentRecipe).then(function () {
          mvNotifier.notify('Inventory updated!');
        }, function (reason) {
          mvNotifier.error(reason);
        })
      }
      else
      {
        mvNotifier.notify('Recipe updated!');
      }
      //$location.path('/');
    }, function (reason) {
      mvNotifier.error(reason);
    })
  }
  $scope.updateOG = function() {
    calcOG = parseFloat($scope.recordedOG);
    if (calcFG != 0)
    {
      calcABV =  (calcOG - calcFG) * 131.25;
      $scope.calculatedABV = calcABV.toFixed(1);
      $scope.calculatedEfficiency = "Feature not supported yet"
    }
  }
  $scope.updateFG = function() {
    calcFG = parseFloat($scope.recordedFG);
    if (calcOG != 0)
    {
      calcABV =  (calcOG - calcFG) * 131.25;
      $scope.calculatedABV = calcABV.toFixed(1);
      $scope.calculatedEfficiency = "Feature not supported yet"
    }
  }
  $scope.updateNotes = function() {
    notes = $scope.notes;
  }
});