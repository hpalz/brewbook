angular.module('app', ['ngResource', 'ngRoute','ngMaterial',"ngAnimate","ngAria"]);

angular.module('app').config(function($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    admin: {auth: function(mvAuth) {
      return mvAuth.authorizeCurrentUserForRoute('admin')
    }},
    user: {auth: function(mvAuth) {
      return mvAuth.authorizeAuthenticatedUserForRoute()
    }}
  }

  $locationProvider.html5Mode({enabled:true,
    requireBase: false});
  $routeProvider
      .when('/', { templateUrl: '/partials/main/main', controller: 'mvMainCtrl'})
      .when('/admin/users', { templateUrl: '/partials/admin/user-list',
        controller: 'mvUserListCtrl', resolve: routeRoleChecks.admin
      })
      .when('/signup', { templateUrl: '/partials/account/signup',
        controller: 'mvSignupCtrl'
      })
      .when('/profile', { templateUrl: '/partials/account/profile',
        controller: 'mvProfileCtrl', resolve: routeRoleChecks.user
      })
      .when('/recipes', { templateUrl: '/partials/recipes/recipe-list',
        controller: 'mvRecipeListCtrl'
      })
      .when('/newRecipe', { templateUrl: '/partials/recipes/newRecipe',
        controller: 'mvCreateRecipeCtrl'
      })
      .when('/inventory', { templateUrl: '/partials/inventory/inventory',
        controller: 'mvInventoryCtrl'
      })
      .when('/importRecipe', { templateUrl: '/partials/recipes/importRecipe',
        controller: 'mvImportXmlRecipe'
      })
      .when('/recipes/:id', { templateUrl: '/partials/recipes/recipe-details',
        controller: 'mvRecipeDetailCtrl'
      })

});

angular.module('app').run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  })
})
