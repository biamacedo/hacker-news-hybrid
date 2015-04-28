angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
  { title: 'Reggae', id: 1 },
  { title: 'Chill', id: 2 },
  { title: 'Dubstep', id: 3 },
  { title: 'Indie', id: 4 },
  { title: 'Rap', id: 5 },
  { title: 'Cowbell', id: 6 }
  ];
})

.controller('TopStoriesCtrl', function($scope, $firebaseArray) { // fireBaseData removed

  $scope.topStories = [];
  var ref = new Firebase("http://hacker-news.firebaseio.com/v0/");
  var itemRef = ref.child('item');

  ref.child('topstories').once('value', function(snapshot) {
    topStories = snapshot.val();
    
    for(var i = 0; i < topStories.length; i++) {
      //console.log(topStories[i]);
      itemRef.child(topStories[i]).once('value', function(snapshot) {
        var story = snapshot.val();

        //console.log(story);
        // -- Using $apply to get $scope to notice changes happening on topStories array
        //$scope.$apply() takes a function or an Angular expression string, and executes it, 
        //then calls $scope.$digest() to update any bindings or watchers.
        $scope.$apply(function () {
          $scope.topStories.push(story);
        });
          
      });
    }
  });

})

.controller('NewStoriesCtrl', function($scope, $firebaseArray) { // fireBaseData removed
  //$scope.newStories = $firebase(fireBaseData.refNewStories()).$asArray();

  $scope.newStories = [];
  var ref = new Firebase("http://hacker-news.firebaseio.com/v0/");
  var itemRef = ref.child('item');

  ref.child('newstories').once('value', function(snapshot) {
    newStories = snapshot.val();
    
    for(var i = 0; i < newStories.length; i++) {
      //console.log(newStories[i]);
      itemRef.child(newStories[i]).once('value', function(snapshot) {
        var story = snapshot.val();

        //console.log(story);
        // -- Using $apply to get $scope to notice changes happening on newStories array
        //$scope.$apply() takes a function or an Angular expression string, and executes it, 
        //then calls $scope.$digest() to update any bindings or watchers.
        $scope.$apply(function () {
          $scope.newStories.push(story);
        });
          
      });
    }
  });

})

.controller('SettingsCtrl', function($scope) {

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
