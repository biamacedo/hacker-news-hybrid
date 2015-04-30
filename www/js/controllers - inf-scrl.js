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

.controller('TopStoriesCtrl', function($scope, fireBaseData, $q) { // fireBaseData removed
    $scope.pageSize = 20;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 500; // Set on Firebase Database by Hacker News

  $scope.retrieveStoriesID = function(callback){
      fireBaseData.getTopStories();
  };

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.topStories = [];

  //  $timeout(function() {
      var promise = fireBaseData.getTopStories();
      promise.then(function(test) {
        console.log(test);

        var pageItems = [];
        var promise = fireBaseData.getNextPage($scope.totalItemsLoaded);
        promise.then(function(pageItems) {
          $scope.topStories = pageItems;
          console.log($scope.topStories);
          $scope.totalItemsLoaded = $scope.totalItemsLoaded + fireBaseData.getPageSize();
          console.log($scope.totalItemsLoaded);
        });
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');

      });
  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');

        var pageItems = [];
        var promise = fireBaseData.getNextPage($scope.totalItemsLoaded);
        promise.then(function(pageItems) {
          var storiesArray = $scope.topStories;
          $scope.$apply(function () {
            $scope.topStories = storiesArray.concat(pageItems);
          });
          console.log($scope.topStories);
          $scope.totalItemsLoaded = $scope.totalItemsLoaded + fireBaseData.getPageSize();
          console.log($scope.totalItemsLoaded);
          // Stop the ion-infinite-scroll from spinning
           $scope.$broadcast('scroll.infiniteScrollComplete');
          //$scope.$broadcast('scroll.resize');
        });
  };

  $scope.moreDataCanBeLoaded = function() {
    return $scope.totalItemsLoaded <= fireBaseData.getTotalTopStories() && $scope.totalItemsLoaded >= fireBaseData.getPageSize();
  };

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

.controller('CommentsCtrl', function($scope, $stateParams) {
    var ref = new Firebase("http://hacker-news.firebaseio.com/v0/");
    var itemRef = ref.child('item');
    $scope.storyComments = [];
    $scope.story = null;

    itemRef.child($stateParams.storyId).once('value', function(snapshot) {
      story = snapshot.val();

      $scope.$apply(function () {
        $scope.story = story;
      });

      storyComments = story.kids;

      for(var i = 0; i < storyComments.length; i++) {
        //console.log(newStories[i]);
        itemRef.child(storyComments[i]).once('value', function(snapshot) {
          var comment = snapshot.val();

          //console.log(story);
          // -- Using $apply to get $scope to notice changes happening on newStories array
          //$scope.$apply() takes a function or an Angular expression string, and executes it, 
          //then calls $scope.$digest() to update any bindings or watchers.
          $scope.$apply(function () {
            //Code to format html of comments, because the first paragraph does not contain <p>
            var text = comment.text;
            if(typeof text === 'string'){
                if (text.indexOf("<p>") > -1){
                var subText = text.slice(0, text.indexOf("<p>"));
                var subText = "<p>" + subText + "</p>";
                var fullText = subText + text.slice(text.indexOf("<p>"), text.length);
              } else {
                var subText = text
                var subText = "<p>" + subText + "</p>";
                var fullText = subText;
              }
            }

            var tag = document.createElement('div');
            tag.innerHTML = fullText;
       
            comment.text = tag.innerHTML;

            $scope.storyComments.push(comment);
          });

        });
      }
    });

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
