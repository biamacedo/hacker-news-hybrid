angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, $ionicModal, $timeout, $state, externalBrowser, $ionicScrollDelegate) {

/*  // ---- Login Part ---
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
  };*/

  // Form data for the user modal
  $scope.userData = {};

  /*-- User Modal --*/
  $ionicModal.fromTemplateUrl('templates/user-search.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.userModal = modal;
  });

    // Triggered in the user modal to close it
  $scope.closeUserSearch = function() {
    $scope.userModal.hide();
  };

  // Open the user modal
  $scope.userSearch = function() {
    $scope.userModal.show();
  };

  // Perform the user action when the user searchs for a user name
  $scope.goToUserProfile = function() {
    console.log('Going to User Profile', $scope.userData);

    $state.go('app.user', {'userId': $scope.userData.username});

    $scope.closeUserSearch();
  };

    //https://github.com/apache/cordova-plugin-inappbrowser
  $scope.openBrowser = function(url){
    externalBrowser.open(url);
  };

  $scope.scrollExists = function() {
    var template = document.getElementById("scrollList");
    console.log(template);
    if(template === null){
      return false;
    } else {
      return true;
    }
  };

  $scope.scrollTop = function() {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
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

.controller('TopStoriesCtrl', function($scope, $state, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 500; // Set on Firebase Database by Hacker News
    $scope.viewTitle = "Top Stories"; //Necessary because all lists use the same template
    var storiesIds = [];

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];

    hackerNewsApi.getTopStories()
        .then(function (result) {
          storiesIds = result.data;
          console.log(storiesIds);

                for (var i = 0; i < $scope.pageSize; i++) {
                  hackerNewsApi.getItem(storiesIds[i])
                    .then(function (result) {
                      $scope.storyList.push(result.data);
                      $scope.totalItemsLoaded++;
                      //console.log($scope.totalItemsLoaded);
                    });
                };

          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
          console.log("Refresh Done");
        });
  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');

    for (var i = $scope.totalItemsLoaded; i < ($scope.totalItemsLoaded + $scope.pageSize) 
      && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
      hackerNewsApi.getItem(storiesIds[i])
        .then(function (result) {
          $scope.storyList.push(result.data);
          $scope.totalItemsLoaded++;
          //console.log($scope.totalItemsLoaded);
        });
    };

   // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
    console.log("Refresh Done");
  };

  $scope.moreDataCanBeLoaded = function() {
    if($scope.totalItemsLoaded < $scope.totalItemsArray){
      return true;
    } else {
      return false;
    }
  }

  //https://github.com/apache/cordova-plugin-inappbrowser
  $scope.openBrowser = function(url){
    externalBrowser.open(url);
  };

  $scope.goToCommentsPage = function(id){
    $state.go('app.comments', {'storyId': id});
  };

  $scope.share = function(title, url) {
    socialSharing.share(title, url);
  }

})

.controller('NewStoriesCtrl', function($scope, $state, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 500; // Set on Firebase Database by Hacker News
    $scope.viewTitle = "New Stories"; //Necessary because all lists use the same template
    var storiesIds = [];

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];

    hackerNewsApi.getNewStories()
        .then(function (result) {
          storiesIds = result.data;
          console.log(storiesIds);

                for (var i = 0; i < $scope.pageSize; i++) {
                  hackerNewsApi.getItem(storiesIds[i])
                    .then(function (result) {
                      $scope.storyList.push(result.data);
                      $scope.totalItemsLoaded++;
                      //console.log($scope.totalItemsLoaded);
                    });
                };

          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
          console.log("Refresh Done");
        });
  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');

    for (var i = $scope.totalItemsLoaded; i < ($scope.totalItemsLoaded + $scope.pageSize) 
      && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
      hackerNewsApi.getItem(storiesIds[i])
        .then(function (result) {
          $scope.storyList.push(result.data);
          $scope.totalItemsLoaded++;
          //console.log($scope.totalItemsLoaded);
        });
    };

   // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
    console.log("Refresh Done");
  };

  $scope.moreDataCanBeLoaded = function() {
    if($scope.totalItemsLoaded < $scope.totalItemsArray){
      return true;
    } else {
      return false;
    }
  }

  //https://github.com/apache/cordova-plugin-inappbrowser
  $scope.openBrowser = function(url){
    externalBrowser.open(url);
  };

  $scope.goToCommentsPage = function(id){
    $state.go('app.comments', {'storyId': id});
  };

  $scope.share = function(title, url) {
    socialSharing.share(title, url);
  }

})

.controller('AskStoriesCtrl', function($scope, $state, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 200; // Set on Firebase Database by Hacker News
    $scope.viewTitle = "Ask HN"; //Necessary because all lists use the same template
    var storiesIds = [];

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];

    hackerNewsApi.getAskStories()
        .then(function (result) {
          storiesIds = result.data;
          console.log(storiesIds);

                for (var i = 0; i < $scope.pageSize; i++) {
                  hackerNewsApi.getItem(storiesIds[i])
                    .then(function (result) {
                      $scope.storyList.push(result.data);
                      $scope.totalItemsLoaded++;
                      //console.log($scope.totalItemsLoaded);
                    });
                };

          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
          console.log("Refresh Done");
        });
  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');

    for (var i = $scope.totalItemsLoaded; i < ($scope.totalItemsLoaded + $scope.pageSize) 
      && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
      hackerNewsApi.getItem(storiesIds[i])
        .then(function (result) {
          $scope.storyList.push(result.data);
          $scope.totalItemsLoaded++;
          //console.log($scope.totalItemsLoaded);
        });
    };

   // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
    console.log("Refresh Done");
  };

  $scope.moreDataCanBeLoaded = function() {
    if($scope.totalItemsLoaded < $scope.totalItemsArray){
      return true;
    } else {
      return false;
    }
  }

  //https://github.com/apache/cordova-plugin-inappbrowser
  $scope.openBrowser = function(url){
    externalBrowser.open(url);
  };

  $scope.goToCommentsPage = function(id){
    $state.go('app.comments', {'storyId': id});
  };

  $scope.share = function(title, url) {
    socialSharing.share(title, url);
  }

})

.controller('ShowStoriesCtrl', function($scope, $state, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 200; // Set on Firebase Database by Hacker News
    $scope.viewTitle = "Show HN"; //Necessary because all lists use the same template
    var storiesIds = [];

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];

    hackerNewsApi.getShowStories()
        .then(function (result) {
          storiesIds = result.data;
          console.log(storiesIds);

                for (var i = 0; i < $scope.pageSize; i++) {
                  hackerNewsApi.getItem(storiesIds[i])
                    .then(function (result) {
                      $scope.storyList.push(result.data);
                      $scope.totalItemsLoaded++;
                      //console.log($scope.totalItemsLoaded);
                    });
                };

          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
          console.log("Refresh Done");
        });
  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');

    for (var i = $scope.totalItemsLoaded; i < ($scope.totalItemsLoaded + $scope.pageSize) 
      && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
      hackerNewsApi.getItem(storiesIds[i])
        .then(function (result) {
          $scope.storyList.push(result.data);
          $scope.totalItemsLoaded++;
          //console.log($scope.totalItemsLoaded);
        });
    };

   // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
    console.log("Refresh Done");
  };

  $scope.moreDataCanBeLoaded = function() {
    if($scope.totalItemsLoaded < $scope.totalItemsArray){
      return true;
    } else {
      return false;
    }
  }

  //https://github.com/apache/cordova-plugin-inappbrowser
  $scope.openBrowser = function(url){
    externalBrowser.open(url);
  };

  $scope.goToCommentsPage = function(id){
    $state.go('app.comments', {'storyId': id});
  };

  $scope.share = function(title, url) {
        socialSharing.share(title, url);
  }

})

.controller('JobStoriesCtrl', function($scope, $state, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 0; // Total Array Size
    $scope.viewTitle = "Jobs"; //Necessary because all lists use the same template
    var storiesIds = [];

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];

    hackerNewsApi.getJobStories()
        .then(function (result) {
          storiesIds = result.data;
          //console.log(storiesIds);
          $scope.totalItemsArray = storiesIds.length;
                for (var i = 0; i < $scope.pageSize 
                    && i < $scope.totalItemsArray; i++) { // Only list that can have less items then the Page Size
                  hackerNewsApi.getItem(storiesIds[i])
                    .then(function (result) {
                      $scope.storyList.push(result.data);
                      $scope.totalItemsLoaded++;
                    });
                };

          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
          console.log("Refresh Done");
        });
  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');

    for (var i = $scope.totalItemsLoaded; i < ($scope.totalItemsLoaded + $scope.pageSize) 
      && $scope.totalItemsLoaded < $scope.totalItemsArray; i++) {
      hackerNewsApi.getItem(storiesIds[i])
        .then(function (result) {
          $scope.storyList.push(result.data);
          $scope.totalItemsLoaded++;
        });
    };

   // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
    console.log("Refresh Done");
  };

  $scope.moreDataCanBeLoaded = function() {
    if($scope.totalItemsLoaded < $scope.totalItemsArray){
      return true;
    } else {
      return false;
    }
  }

  //https://github.com/apache/cordova-plugin-inappbrowser
  $scope.openBrowser = function(url){
    externalBrowser.open(url);
  };

  $scope.goToCommentsPage = function(id){
    $state.go('app.comments', {'storyId': id});
  };

  $scope.share = function(title, url){
    socialSharing.share(title, url);
  }

})

.controller('CommentsCtrl', function($scope, $stateParams, hackerNewsApi, commentParser) {
    $scope.storyComments = [];
    $scope.story = null;

    var getReplyComments = function localSearch(storyComments){
      for(var i = 0; i < storyComments.length; i++) {
        hackerNewsApi.getItem(storyComments[i])
          .then(function (result) {
            var comment = result.data;
            if(comment.kids){
              console.log("Going to "+comment.by+ " kids");
              localSearch(comment.kids);
            }
            if(comment.deleted !== true){ // some comments can be deleted by HN / marked as [flagged]
              console.log(comment.by);
              comment.text = commentParser.parse(comment.text)
              $scope.storyComments.push(comment);
            }
          });

      };
    };

    hackerNewsApi.getItem($stateParams.storyId)
      .then(function (result) {
        var story = result.data;
        console.log(story.id);
        $scope.story = story;
        if(story.descendants){
          storyComments = story.kids;
          getReplyComments(storyComments);
        }
      });
})

.controller('SettingsCtrl', function($scope, $localstorage, toastProvider) {
    var theme = 'light';
    var startScreen = "top";
    var externalBrowser = true;

      theme = $localstorage.get('theme');      
      console.log($localstorage.get('theme'));

      startScreen = $localstorage.get('startScreen');
      var radio = document.getElementById( startScreen );
      radio.checked = true;

      if($localstorage.get('externalBrowser') === 'true'){
        document.getElementById( 'externalBrowser' ).checked = true;
      } else {
        document.getElementById( 'externalBrowser' ).checked = false;
      };

  $scope.lightButton = function(){
    theme = "light";
   };
  $scope.darkButton = function(){
    theme = "dark";
   };
  $scope.blueButton = function(){
    theme = "blue";
   };
   

  $scope.save = function(){
    var radios = document.getElementsByName( 'startScreen' );
    for( i = 0; i < radios.length; i++ ) {
        if( radios[i].checked ) {
            console.log("found="+radios[i].value)
            startScreen = radios[i].value;
        }
    }
    externalBrowser = document.getElementById( 'externalBrowser' ).checked;

    $localstorage.set('theme', theme);
    console.log($localstorage.get('theme'));
    $localstorage.set('startScreen', startScreen);
    console.log($localstorage.get('startScreen'));
    $localstorage.set('externalBrowser', externalBrowser);
    console.log($localstorage.get('externalBrowser'));
    toastProvider.showToast("Settings Saved!", "short", "center")
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
    $scope.resultsList = [];

  $scope.getStory = function(text) {
    console.log("correct story function?");
    searchApi.searchStory(text)
      .then(function (result) {
        console.log(JSON.stringify(result.data));
        $scope.resultsList = result.data.hits;  
        console.log(result.data.hits);
      });
  };

  $scope.getComment = function(text) {
    console.log("correct story function?");
    searchApi.searchComment(text)
      .then(function (result) {
        console.log(JSON.stringify(result.data));
        $scope.resultsList = result.data.hits;  
        console.log(result.data.hits);
      });
  };
  
  $scope.getAsk = function(text) {
    console.log("correct story function?");
    searchApi.searchAsk(text)
      .then(function (result) {
        console.log(JSON.stringify(result.data));
        $scope.resultsList = result.data.hits;  
        console.log(result.data.hits);
      });
  };  

  $scope.getShow = function(text) {
    console.log("correct story function?");
    searchApi.searchShow(text)
      .then(function (result) {
        console.log(JSON.stringify(result.data));
        $scope.resultsList = result.data.hits;  
        console.log(result.data.hits);
      });
  };

    switch($stateParams.type){
      case '1': // Story
        console.log("option 1!");
        $scope.getStory($stateParams.text);
        break;
      case '2': // Comment
        console.log("option 2!");
        $scope.getComment($stateParams.text);
        break;
      case '3': // Ask
        console.log("option 3!");
        $scope.getAsk($stateParams.text);
        break;
      case '4': // Show
        console.log("option 4!");
        $scope.getShow($stateParams.text);
        break;
     /* default: // All
        console.log("default!");
        $scope.getItem($stateParams.text);
        break;*/
     /*case '5': // Poll
        console.log("option 5!");
        $scope.getItem($stateParams.text);
        break;*/
    };
})

.controller('UserCtrl', function($scope, $stateParams, hackerNewsApi) {
  
  hackerNewsApi.getUser($stateParams.userId)
    .error(function (result) {
      console.log(result.error);
    })
    .then(function (result) {
      //console.log(result);
      var user = result.data;
      //console.log(user.id);
      $scope.user = user;
    });

})

.controller('UserCommentsCtrl', function($scope, $stateParams, hackerNewsApi, commentParser) {
  $scope.storyComments = [];

  hackerNewsApi.getUser($stateParams.userId)
    .error(function (result) {
      console.log(result.error);
    })
    .then(function (result) {

      //console.log(result);
      var user = result.data;
      //console.log(user.id);
      $scope.user = user;

      for(var i = 0; i < user.submitted.length; i++) {
        hackerNewsApi.getItem(user.submitted[i])
          .then(function (result) {
            var comment = result.data;


            if(comment.deleted !== true && comment.type === "comment"){ // some comments can be deleted by HN / marked as [flagged]
              //console.log(comment.by);
              comment.text = commentParser.parse(comment.text)
              $scope.storyComments.push(comment);
            }
          });

      };
    });

})

.controller('UserStoriesCtrl', function($scope, $state,$stateParams, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 0; // Total Array Size
    $scope.viewTitle = "User Threads"; //Necessary because all lists use the same template
    var storiesIds = [];

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];

    hackerNewsApi.getUser($stateParams.userId)
        .error(function (result) {
          console.log(result.error);
        })
        .then(function (result) {
          //console.log(result);
          var user = result.data;
          //console.log(user.id);
          $scope.user = user;
          storiesIds = user.submitted;
          $scope.totalItemsArray = user.submitted.length;

          for(var i = 0; i < $scope.totalItemsArray && i < $scope.pageSize; i++) {
            hackerNewsApi.getItem(storiesIds[i])
              .then(function (result) {
                var story = result.data;

                if(story.deleted !== true && story.type === "story"){ // some comments can be deleted by HN / marked as [flagged]
                  console.log(story);
                  $scope.storyList.push(result.data);
                  $scope.totalItemsLoaded++;
                  console.log($scope.totalItemsLoaded);
                }
              });

          };
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
          console.log("Refresh Done");
        });

  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');

    var initialTotalItems = $scope.totalItemsLoaded;
    for (var i = initialTotalItems; i < (initialTotalItems + $scope.pageSize) 
      && $scope.totalItemsLoaded < $scope.totalItemsArray; i++) {
      hackerNewsApi.getItem(storiesIds[i])
        .then(function (result) {
          $scope.storyList.push(result.data);
          $scope.totalItemsLoaded++;
        });
    };

   // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
    console.log("Refresh Done");
  };

  $scope.moreDataCanBeLoaded = function() {
    if($scope.totalItemsLoaded < $scope.totalItemsArray){
      return true;
    } else {
      return false;
    }
  }

  //https://github.com/apache/cordova-plugin-inappbrowser
  $scope.openBrowser = function(url){
    externalBrowser.open(url);
  };

  $scope.goToCommentsPage = function(id){
    $state.go('app.comments', {'storyId': id});
  };

  $scope.share = function(title, url){
    socialSharing.share(title, url);
  }

})


.controller('AboutCtrl', function($scope) {
});

