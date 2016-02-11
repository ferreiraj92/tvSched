var tvSched = angular.module('tvSched', ['ionic', 'ngRoute', 'ngSanitize'])

.run(function($ionicPlatform, $rootScope, $location) {

  $rootScope.goHome = function() {
    $location.path('/list');
  };

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

tvSched.config(['$routeProvider', function($routeProvider) {
  $routeProvider

  .when('/list', {
    controller: 'ListController',
    templateUrl: 'partials/list.html'
  })

  .when('/details/:itemId', {
    controller: 'DetailsController',
    templateUrl: 'partials/details.html'
  })

  .otherwise({redirectTo: '/list'});

}]);

tvSched.controller('ListController', ['$scope', '$http', '$ionicLoading', function($scope, $http, $ionicLoading) {
  $scope.loadShows = function() {
    $ionicLoading.show();
    $http.get('http://api.tvmaze.com/schedule?format=json')
    .success(function(response) {
      console.log(response);
      $scope.shows = response;

      $ionicLoading.hide();
    })
    .finally(function() {
      $scope.broadcast('scroll.refreshComplete');
    });
  };
  $scope.loadShows();

  $scope.startsWith = function (actual, expected) {
    var searchStr = (actual + "").toLowerCase();
    //console.log(searchStr);
    return searchStr.indexOf(expected.toLowerCase()) === 0;
  };

}]);

tvSched.controller('DetailsController', ['$scope', '$http', '$ionicLoading', '$routeParams', function($scope, $http, $ionicLoading, $routeParams) {
  $scope.loadDetails = function() {
    $ionicLoading.show();
    $http.get('http://api.tvmaze.com/schedule?format=json')
    .success(function(response) {
      //console.log(response);
      $scope.title = response[$routeParams.itemId].show.name;
      $scope.genre = response[$routeParams.itemId].show.type;
      $scope.showDetails = response[$routeParams.itemId].show.summary;
      $ionicLoading.hide();
    })
    .finally(function() {
      $scope.broadcast('scroll.refreshComplete');
    });
  };
  $scope.loadDetails();

}]);

