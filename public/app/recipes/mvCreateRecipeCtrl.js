var MIN_G = 0
var MAX_G = 115
var MIN_ABV = 0
var MAX_ABV = 20
var MIN_IBU = 0
var MAX_IBU = 140
var MIN_COLOR = 0
var MAX_COLOR = 55
var fermCount = 0

angular.module('app').controller('mvCreateRecipeCtrl', function ($scope, $http, mvAuthRecipe, mvNotifier, $location) {
  var DURATION = 300;
  var vm = this;
  var chosenStyle = null;
  var styleList = null;
  var fermentableList = null;
  var hopList = null;
  var thisFermWeight = 0;
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
  $scope.unitList = [{"unitName":"lbs", "id":0},{"unitName":"oz", "id":1}];
  $scope.fermCalc = function () {

  }
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
    $scope.addedFermentables.push({ name: $scope.fermWeight + $scope.unit.unitName + " " + $scope.fermentable.fermentableName, count: fermCount });
    fermCount++;
    thisFermWeight = 0
    $scope.fermWeight = ""
    /* var linebreak = document.createElement("br");
     var foo = document.getElementById("addedFermentables");
     var fermElement = document.createElement("label");
     var fermlbs2 = document.createElement("input");
 
     //Assign different attributes to the fermlbs.
     var fermlbs = angular.element('<input type="text" ng-change="calc(this)" ng-model="weightInput" + '+fermCount+'" />')
 
     //Assign different attributes to the element2.
     fermlbs2.setAttribute("type", "text");
     fermlbs2.setAttribute("value", "lbs");
 
     //Assign different attributes to the element.
     var t = document.createTextNode($scope.fermentable.fermentableName);
     fermElement.setAttribute("for", "weightInput" + fermCount);
     fermElement.appendChild(t);
 
     //Append the element in page (in span).
     foo.appendChild(linebreak);
     foo.appendChild(fermlbs);
     foo.appendChild(fermlbs2);
     foo.appendChild(fermElement);*/
  }
  $scope.addHop = function () {
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

    $scope.data = [{
      "key": "Min",
      "color": "#ecf0f1",
      "values": [{
        "label": "OG",
        "value": ((chosenStyle.OGMin - 1.0) * 1000) / MAX_G * 100
      }, {
        "label": "FG",
        "value": ((chosenStyle.FGMin - 1.0) * 1000) / MAX_G * 100
      }, {
        "label": "IBU",
        "value": chosenStyle.IBUMin / MAX_IBU * 100
      }, {
        "label": "Color",
        "value": chosenStyle.ColorMin / MAX_COLOR * 100
      }, {
        "label": "ABV",
        "value": chosenStyle.ABVMin / MAX_ABV * 100
      }, {
        "label": "",
        "value": 100
      }]
    }, {
      "key": "Max",
      "color": "#d62728",
      "values": [{
        "label": "OG",
        "value": ((chosenStyle.OGMax - 1.0) * 1000) / MAX_G * 100
      }, {
        "label": "FG",
        "value": ((chosenStyle.FGMax - 1.0) * 1000) / MAX_G * 100
      }, {
        "label": "IBU",
        "value": chosenStyle.IBUMax / MAX_IBU * 100
      }, {
        "label": "Color",
        "value": chosenStyle.ColorMax / MAX_COLOR * 100
      }, {
        "label": "ABV",
        "value": chosenStyle.ABVMax / MAX_ABV * 100
      }, {
        "label": "",
        "value": 0
      }
      ]
    }]
    $scope.options = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: DURATION,
        x: function (d) {
          return d.label;
        },
        y: function (d) {
          return d.value;
        },
        margin: {
          left: 100
        },
        showControls: true,
        showValues: true,
        duration: 300,
        stacked: true,
        showLegend: false,
        showControls: false,
        yDomain: [0, 100],
        groupSpacing: 0.1,
        xAxis: {
          showMaxMin: false,
          hideTick: true,
          valuePadding: 100
        },
        yAxis: {
          showMaxMin: false,
          showValues: false,
          hideTick: true,
          tickFormat: function (d) {
            return d3.format(',.2f')(d);
          }
        },
        callback: function (chart) {
          console.log(123);
          chart.multibar.dispatch.on('elementClick', function (e) {
            console.log('elementClick in callback', e.data);
          });
          chart.dispatch.on('changeState', function (e) {
            console.log('changeState in callback', e.data);
          });
          chart.dispatch.on('renderEnd', function () {
            console.log('render complete');
            var grap = d3.selectAll('.nv-multibarHorizontal');
            var groups = grap.selectAll('.nv-group')[0];
            var lastGroup = groups[groups.length - 1];
            var children = lastGroup.children;
            for (var i = 0; i < children.length; i++) {
              var g = children[i];
              var text = g.getElementsByTagName('text')[0];
              var rect = g.getElementsByTagName('rect')[0];
              text.setAttribute('x', parseFloat(rect.getAttribute('width')) + 5);
              text.setAttribute('y', parseFloat(rect.getAttribute('height')) / 2);
              text.setAttribute("text-anchor", "start");
              text.setAttribute("dy", ".32em");
              text.textContent = percent[i] + "%";
            }

          });
        }

      }
    };
  }
})