// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

// Custom Filter to show only domain of url
.filter( 'domain', function () {
  return function ( input ) {
    var link = document.createElement("a");
    link.href = input;
    return link.hostname;
  };
})

// Custom Filter to display how much time has passed from date
.filter( 'timeAgo', function () {
  return function( input ) {
    return moment(input).fromNow()
  }
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.topStories', {
    url: "/topStories",
    views: {
      'menuContent': {
        templateUrl: "templates/top-stories.html",
        controller: 'TopStoriesCtrl'
      }
    }
  })

  .state('app.comments', {
    url: "/comments/:storyId",
    views: {
      'menuContent': {
        templateUrl: "templates/comments.html",
        controller: 'CommentsCtrl'
      }
    }
  })

  .state('app.newStories', {
    url: "/newStories",
    views: {
      'menuContent': {
        templateUrl: "templates/new-stories.html",
        controller: 'NewStoriesCtrl'
      }
    }
  })
  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: 'SearchCtrl'
      }
    }
  })
  .state('app.searchResults', {
    url: "/searchResults/:type/:text",
    views: {
      'menuContent': {
        templateUrl: "templates/search-results.html",
        controller: 'SearchResultsCtrl'
      }
    }
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html",
        controller: 'SettingsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/topStories');
});
