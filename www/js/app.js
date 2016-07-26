
var app = angular.module('Snitem', ['ionic', 'Snitem.controllers', 'Snitem.services'])

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

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});
