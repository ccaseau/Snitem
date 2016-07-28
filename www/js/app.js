
var app = angular.module('Snitem', ['ionic', 'Snitem.controllers', 'Snitem.services','ionMDRipple'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })

  .state('questions', {
  url: '/questions',
  templateUrl: 'templates/questions.html',
  controller: 'QstCtrl'
})

.state('score', {
url: '/score',
templateUrl: 'templates/score.html',
controller: 'ScoreCtrl'
})

.state('custom', {
url: '/custom',
templateUrl: 'templates/custom.html',
controller: 'CustomCtrl'
})

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});
