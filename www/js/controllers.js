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

.controller('TopStoriesCtrl', function($scope, $state, $firebaseArray) { // fireBaseData removed
    var ref = new Firebase("http://hacker-news.firebaseio.com/v0/");
    var itemRef = ref.child('item');
    $scope.pageSize = 20;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 500; // Set on Firebase Database by Hacker News

  $scope.retrieveStoriesID = function(callback){
    $scope.storiesIds = [];

    ref.child('topstories').once('value', function(snapshot) {
      topStories = snapshot.val();
      //console.log(topStories);
      callback(topStories);
      //console.log($scope.storiesIds);

    });
  };

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;

    $scope.retrieveStoriesID( function(storyIDs){

      $scope.topStories = [];
      //console.log(storyIDs);
      // storyIDs.length
      for(var i = 0; i < $scope.pageSize && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
        //console.log(storyIDs[i]);
        itemRef.child(storyIDs[i]).once('value', function(snapshot) {
          var story = snapshot.val();

          //console.log(story);
            // -- Using $apply to get $scope to notice changes happening on topStories array
            //$scope.$apply() takes a function or an Angular expression string, and executes it, 
            //then calls $scope.$digest() to update any bindings or watchers.
            $scope.$apply(function () {
              $scope.topStories.push(story);
              var totalLoaded = $scope.totalItemsLoaded;
              $scope.totalItemsLoaded = totalLoaded +1;
              //console.log($scope.totalItemsLoaded);
            });

          });
      }

      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');
    //$timeout(function() {

    $scope.retrieveStoriesID( function(storyIDs){
      console.log(storyIDs);
      // storyIDs.length
      for(var i = $scope.totalItemsLoaded; i < $scope.pageSize && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
        //console.log(storyIDs[i]);
        itemRef.child(storyIDs[i]).once('value', function(snapshot) {
          var story = snapshot.val();

          //console.log(story);
            // -- Using $apply to get $scope to notice changes happening on topStories array
            //$scope.$apply() takes a function or an Angular expression string, and executes it, 
            //then calls $scope.$digest() to update any bindings or watchers.
            $scope.$apply(function () {
              $scope.topStories.push(story);
              var totalLoaded = $scope.totalItemsLoaded;
              $scope.totalItemsLoaded = totalLoaded +1;
              //console.log($scope.totalItemsLoaded);
            });

          });
      }
      $scope.$apply(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.resize');
      });
    });

  //}, 10000);
  };

  //https://github.com/apache/cordova-plugin-inappbrowser
  $scope.openBrowser = function(url){
    //_self : WebView
    //_blank : InAppBrowser
    //_system : Externaç Browser
    var ref = window.open(url, '_blank', 'location=yes'); 
    return false;
  };

  $scope.goToCommentsPage = function(id){
    $state.go('app.comments', {'storyId': id});
  };

  $scope.share = function(title, url) {
        if (window.plugins && window.plugins.socialsharing) {
            window.plugins.socialsharing.share(title,
                'Hacker News', null, url,
                function() {
                    console.log("Success")
                },
                function (error) {
                    console.log("Share fail " + error)
                });
        }
        else console.log("Share plugin not available");
}

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

.controller('CommentsCtrl', function($scope, $stateParams, $ionicLoading) {
    var show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  var hide = function(){
    $ionicLoading.hide();
  };

    var ref = new Firebase("http://hacker-news.firebaseio.com/v0/");
    var itemRef = ref.child('item');
    $scope.storyComments = [];
    $scope.story = null;

    var searchForComments = function localSearch(storyComments){

    if(typeof storyComments === 'undefined'){
      return;
    }

    for(var i = 0; i < storyComments.length; i++) {
        //console.log(newStories[i]);
        itemRef.child(storyComments[i]).once('value', function(snapshot) {
          var comment = snapshot.val();

          //console.log(comment);
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

          if(typeof comment.kids !== 'undefined'){
              localSearch(comment.kids);
            }
        });
      }
    }
    show();

    itemRef.child($stateParams.storyId).once('value', function(snapshot) {
      story = snapshot.val();

      $scope.$apply(function () {
        $scope.story = story;
      });
      //console.log(story);
      storyComments = story.kids;

      searchForComments(storyComments);
    });
    hide();

})

.controller('SettingsCtrl', function($scope, $localstorage) {
    var theme = 'light';
    var startScreen = "top";
    var externalBrowser = true;
    $scope.theme = theme;
    console.log("themescope: "+$scope.theme);
    console.log("themestg: "+$localstorage.get('theme'));
    $scope.startScreen = startScreen;
    console.log("startScreenscope: "+$scope.startScreen);
    console.log("startScreenstg: "+$localstorage.get('startScreen'));
    $scope.externalBrowser = externalBrowser;
    console.log("externalBrowserscope: "+$scope.externalBrowser);
    console.log("externalBrowserstg: "+$localstorage.get('externalBrowser'));

    if(typeof $localstorage.get('theme') !== 'undefined'){
      theme = $localstorage.get('theme');      
      console.log($localstorage.get('theme'));
    }
    if(typeof $localstorage.get('startScreen') !== 'undefined'){
      startScreen = $localstorage.get('startScreen');
    }
    console.log($localstorage.get('externalBrowser'));
    if(typeof $localstorage.get('externalBrowser') !== 'undefined'){
      externalBrowser = $localstorage.get('externalBrowser');
    console.log("did this");

    }
    
    $scope.theme = theme;
    console.log("themescope: "+$scope.theme);
    console.log("themestg: "+$localstorage.get('theme'));
    $scope.startScreen = startScreen;
    console.log("startScreenscope: "+$scope.startScreen);
    console.log("startScreenstg: "+$localstorage.get('startScreen'));
    $scope.externalBrowser = externalBrowser;
    console.log("externalBrowserscope: "+$scope.externalBrowser);
    console.log("externalBrowserstg: "+$localstorage.get('externalBrowser'));

  $scope.lightButton = function(){
    theme = "light";
    $scope.theme = theme;
   };
  $scope.darkButton = function(){
    theme = "dark";
    $scope.theme = theme;
   };
  $scope.blueButton = function(){
    theme = "blue";
    $scope.theme = theme;
   };
  $scope.startScreenChange = function(value){
    startScreen = value;
    $scope.startScreen = startScreen;
   };
  $scope.externalBrowserChange = function(){


    externalBrowser = $scope.externalBrowser.checked
    $scope.externalBrowser = externalBrowser;
   };
   

  $scope.save = function(){
    console.log("scope: "+$scope.theme);
    console.log("scope: "+$scope.startScreen);
    console.log("scope: "+$scope.externalBrowser);

    $localstorage.set('theme', $scope.theme);
    console.log($localstorage.get('theme'));
    $localstorage.set('startScreen', $scope.startScreen);
    console.log($localstorage.get('startScreen'));
    $localstorage.set('externalBrowser', $scope.externalBrowser);
    console.log($localstorage.get('externalBrowser'));
  };

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

