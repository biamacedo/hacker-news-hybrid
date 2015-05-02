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

    //https://github.com/apache/cordova-plugin-inappbrowser
  $scope.openBrowser = function(url){
    //_self : WebView
    //_blank : InAppBrowser
    //_system : Externaç Browser
    var ref = window.open(url, '_blank', 'location=yes'); 
    return false;
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
            var fullText ="";
            if(typeof text === 'string'){
                if (text.indexOf("<p>") > -1){
                var subText = text.slice(0, text.indexOf("<p>"));
                var subText = "<p>" + subText + "</p>";
                fullText = subText + text.slice(text.indexOf("<p>"), text.length);
              } else {
                var subText = text
                var subText = "<p>" + subText + "</p>";
                fullText = subText;
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

      var text = story.text;
      var fullText ="";
      if(typeof text === 'string'){
          if (text.indexOf("<p>") > -1){
          var subText = text.slice(0, text.indexOf("<p>"));
          var subText = "<p>" + subText + "</p>";
          fullText = subText + text.slice(text.indexOf("<p>"), text.length);
        } else {
          var subText = text
          var subText = "<p>" + subText + "</p>";
          fullText = subText;
        }
      }

      //Code for asks, to show their description
      var tag = document.createElement('div');
      tag.innerHTML = fullText;
      story.text = tag.innerHTML;

      $scope.$apply(function () {
        $scope.story = story;
      });
      //console.log(story)


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

.controller('SearchCtrl', function($scope, $state) {
  console.log("At least controller correct");

  $scope.goToResults = function(type, data) {
       console.log("Moving to Results");
        $state.go('app.searchResults', {'type': type, 'text': data});
        console.log("did we go?!");
  };

})

.controller('SearchResultsCtrl', function($scope, $stateParams, searchApi) {
    console.log("arrived at results!");
    $scope.type = $stateParams.type;
    console.log($stateParams.type);
    console.log($stateParams.text);

  $scope.getItem = function(itemId) {
    console.log("correct function?");
    searchApi.getItem(itemId)
      .then(function (result) {
        console.log(JSON.stringify(result.data));
        var resultArray = [];
        resultArray.push(result.data);
        $scope.resultsList = resultArray;
      });
  };

  $scope.getUser = function(userName) {
    console.log("correct user?");
    searchApi.getUser(userName)
      .then(function (result) {
        console.log(JSON.stringify(result.data));
        var resultArray = [];
        resultArray.push(result.data);
        $scope.resultsList = resultArray;
      });
  };

  $scope.getFrontPage = function() {
    console.log("correct front page?");
    searchApi.getFrontPage()
      .then(function (result) {
        console.log(JSON.stringify(result.data));
        var resultArray = [];
        resultArray.push(result.data);
        $scope.resultsList = resultArray[0].hits;
      });
  };


    switch($stateParams.type){
      case '1': // Story
        console.log("option 1!");
        $scope.getItem($stateParams.text);
        break;
      case '2': // Comment
        console.log("option 2!");
        $scope.getUser($stateParams.text);
        break;
      case '3': // User
        console.log("option 3!");
        $scope.getUser($stateParams.text);
        break;
      case '4': // Ask
        console.log("option 4!");
        $scope.getUser($stateParams.text);
        break;
      case '5': // Show
        console.log("option 5!");
        $scope.getUser($stateParams.text);
        break;
      case '6': // Poll
        console.log("option 6!");
        $scope.getUser($stateParams.text);
        break;
      case '7': // Front Page
        console.log("option 7!");
        $scope.getFrontPage();
        break;
    };
});

