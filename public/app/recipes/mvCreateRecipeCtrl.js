angular.module('app').controller('mvCreateRecipeCtrl', function($scope, $http, mvAuthRecipe, mvNotifier, $location) {
  var MAX_PERCENT = 60;
  var DURATION = 500;
  var groupSpace = 1;
  var AXISY_WIDTH = 150;
  var EXTED_LABEL_WIDTH = 20;
  var rectangle;
  var thisCtrl = this;
  this.route = 'stylesAdvanced';
  var chosenStyle = null;
  var styleList = null;
  $scope.value='30%';
  var styleDropdown = document.getElementById('styleSelect');
  $http.get(thisCtrl.route).then(function(styleJson) {
    styleList = styleJson;    
    for (var i = 0; i < styleList.length; i++) {
        // POPULATE SELECT ELEMENT WITH JSON.
        styleDropdown.innerHTML = styleDropdown.innerHTML +
            '<option value="' + styleList[i]['Style'] + '">' + styleList[i]['Style'] + '</option>';
    }
  });

  $scope.show = function() {
    // GET THE SELECTED VALUE FROM <select> ELEMENT AND SHOW IT.
    chosenStyle = styleList[styleDropdown.selectedIndex - 1];
    
}
  $scope.create = function() {
    var newRecipe = {
      name: $scope.name,
      featured: $scope.featured,
      style: $scope.style
    };
    $scope.style = function(){
      styleToCreate = styleList[0].styleName;
    }

    mvAuthRecipe.createRecipe(newRecipe).then(function() {
      mvNotifier.notify('Recipe created!');
      $location.path('/');
    }, function(reason) {
      mvNotifier.error(reason);
    })
  }
  
  $scope.data = [{
    "key": "Series1",
    "color": "#d62728",
    "values": [{
      "label": "Group A asd sa das d as",
      "value": 3
    }, {
      "label": "Group B",
      "value": 8.0961543492239
    }, {
      "label": "Group C",
      "value": 2.57072943117674
    }, {
      "label": "Group D",
      "value": 2.4174010336624
    }, {
      "label": "Group E",
      "value": 4.72009071426284
    }, {
      "label": "Group F",
      "value": 3.77154485523777
    }, {
      "label": "Group G",
      "value": 11.987
    }, {
      "label": "Group H",
      "value": 6.91445417330854
    }, {
      "label": "Group I",
      "value": 12
    }]
  }, {
    "key": "Series2",
    "color": "#1f77b4",
    "values": [{
      "label": "Group A asd sa das d as",
      "value": 25.307646510375
    }, {
      "label": "Group B",
      "value": 16.756779544553
    }, {
      "label": "Group C",
      "value": 18.451534877007
    }, {
      "label": "Group D",
      "value": 8.6142352811805
    }, {
      "label": "Group E",
      "value": 7.8082472075876
    }, {
      "label": "Group F",
      "value": 5.259101026956
    }, {
      "label": "Group G",
      "value": 9.6
    }, {
      "label": "Group H",
      "value": 23
    }, {
      "label": "Group I",
      "value": 8
    }]
  }]
  var percent = [];
  var maxVal;
  $scope.data[0].values.forEach(function(item, index) {
    var tmp = 0;
    $scope.data.forEach(function(group) {
      tmp += group.values[index].value;
    })
    if (!maxVal || maxVal < tmp) {
      maxVal = parseInt((tmp + 20) / 20) * 20;
    }
    percent.push(tmp.toFixed(2));
  })
  var myChart;
  $scope.options = {
    chart: {
      type: 'multiBarHorizontalChart',
      height: DURATION,
      x: function(d) {
        return d.label;
      },
      y: function(d) {
        return d.value;
      },
      margin: {
        left: AXISY_WIDTH
      },
      showControls: true,
      showValues: true,
      duration: 500,
      stacked: true,
      showLegend: false,
      showControls: false,
      yDomain: [0, maxVal],
      groupSpacing: 0.1,
      xAxis: {
        showMaxMin: false,
        valuePadding: 100
      },
      yAxis: {
        showMaxMin: false,
        axisLabel: 'Values',
        hideTick: true,
        tickFormat: function(d) {
          return d3.format(',.2f')(d);
        }
      },
      callback: function(chart) {
        console.log(123);
        chart.multibar.dispatch.on('elementClick', function(e) {
          console.log('elementClick in callback', e.data);
        });
        chart.dispatch.on('changeState', function(e) {
          console.log('changeState in callback', e.data);
        });
        chart.dispatch.on('renderEnd', function() {
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
            text.textContent = percent[i]+"%";
          }

        });
      }

    }
  };
})