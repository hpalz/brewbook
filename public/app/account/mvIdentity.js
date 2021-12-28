angular.module('app').factory('mvIdentity', function($window, mvUser) {
  var currentUser;
  if(!!$window.bootstrappedUserObject) {
    currentUser = new mvUser();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }
  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isOwner: function(user) {
      return this.currentUser.username == user;
    },
    isAuthorized: function(role) {
      return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
    }
  }
})