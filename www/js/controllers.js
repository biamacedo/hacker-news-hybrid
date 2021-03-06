angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, $ionicModal, $timeout, $state, externalBrowser, toastProvider, $ionicScrollDelegate) {

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
    $scope.userData.username = "";
    $scope.userModal.show();
  };

  // Perform the user action when the user searchs for a user name
  $scope.goToUserProfile = function() {
    console.log('Going to User Profile', $scope.userData);

    if($scope.userData.username !== ""){
      $state.go('app.user', {'userId': $scope.userData.username});
      $scope.userData.username = "";
      $scope.closeUserSearch();
    } else{
      toastProvider.showToast("Please fill input field!", "short", "center")
    }
  };

  /*-- Search Modal --*/
  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.searchModal = modal;
  });

    // Triggered in the user modal to close it
  $scope.closeSearch = function() {
    $scope.searchModal.hide();
  };

  // Open the user modal
  $scope.search = function() {
    $scope.searchModal.show();
  };

  // Perform the user action when the user searchs for a user name
  $scope.goToSearchResults = function(searchData) {
    console.log('Going to Search Results' + searchData);

    if(searchData.text !== ""){
      $state.go('app.searchResults', {'type': searchData.type, 'text': searchData.text});
      // Resetting Inputs
      searchData.type = "1";
      searchData.text = "";
      $scope.closeSearch();
    } else{
      toastProvider.showToast("Please fill input field!", "short", "center")
    }
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

.controller('TopStoriesCtrl', function($scope, $state, $q, loading, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 500; // Set on Firebase Database by Hacker News
    $scope.viewTitle = "Top Stories"; //Necessary because all lists use the same template
    var storiesIds = [];

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];
    var promisses = [];

    loading.show();
    $q.when(hackerNewsApi.getTopStories()).then(function(result) {
        console.log("List Returned")
        storiesIds = result.data;
        //cconsole.log(storiesIds);

        for (var i = 0; i < $scope.pageSize; i++) {
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
        }

        //cconsole.log(promisses);
        $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //cconsole.log(arrayOfResponses);

            for (var i = 0; i < arrayOfResponses.length; i++) {
              $scope.storyList.push(arrayOfResponses[i].data);
              $scope.totalItemsLoaded++;
            }
            
            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
        });
     });

  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');
    var promisses = [];
    loading.show();

    for (var i = $scope.totalItemsLoaded; i < ($scope.totalItemsLoaded + $scope.pageSize) 
      && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
    };

    //cconsole.log(promisses);
    $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //cconsole.log(arrayOfResponses);

            for (var i = 0; i < arrayOfResponses.length; i++) {
              $scope.storyList.push(arrayOfResponses[i].data);
              $scope.totalItemsLoaded++;
            }

            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
     });
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

.controller('NewStoriesCtrl', function($scope, $state, $q, loading, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 500; // Set on Firebase Database by Hacker News
    $scope.viewTitle = "New Stories"; //Necessary because all lists use the same template
    var storiesIds = [];

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];
    var promisses = [];

    loading.show();
    $q.when(hackerNewsApi.getNewStories()).then(function(result) {
        console.log("List Returned")
        storiesIds = result.data;
        //cconsole.log(storiesIds);

        for (var i = 0; i < $scope.pageSize; i++) {
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
        }

        //cconsole.log(promisses);
        $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //console.log(arrayOfResponses);

            for (var i = 0; i < arrayOfResponses.length; i++) {
              $scope.storyList.push(arrayOfResponses[i].data);
              $scope.totalItemsLoaded++;
            }
            
            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
        });
     });

  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');
    var promisses = [];
    loading.show();

    for (var i = $scope.totalItemsLoaded; i < ($scope.totalItemsLoaded + $scope.pageSize) 
      && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
    };

    console.log(promisses);
    $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //cconsole.log(arrayOfResponses);

            for (var i = 0; i < arrayOfResponses.length; i++) {
              $scope.storyList.push(arrayOfResponses[i].data);
              $scope.totalItemsLoaded++;
            }

            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
     });
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

.controller('AskStoriesCtrl', function($scope, $state, $q, loading, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 200; // Set on Firebase Database by Hacker News
    $scope.viewTitle = "Ask HN"; //Necessary because all lists use the same template
    var storiesIds = [];

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];
    var promisses = [];

    loading.show();
    $q.when(hackerNewsApi.getAskStories()).then(function(result) {
        console.log("List Returned")
        storiesIds = result.data;
        //cconsole.log(storiesIds);

        for (var i = 0; i < $scope.pageSize; i++) {
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
        }

        //cconsole.log(promisses);
        $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //cconsole.log(arrayOfResponses);

            for (var i = 0; i < arrayOfResponses.length; i++) {
              $scope.storyList.push(arrayOfResponses[i].data);
              $scope.totalItemsLoaded++;
            }
            
            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
        });
     });

  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');
    var promisses = [];
    loading.show();

    for (var i = $scope.totalItemsLoaded; i < ($scope.totalItemsLoaded + $scope.pageSize) 
      && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
    };

    //console.log(promisses);
    $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //console.log(arrayOfResponses);

            for (var i = 0; i < arrayOfResponses.length; i++) {
              $scope.storyList.push(arrayOfResponses[i].data);
              $scope.totalItemsLoaded++;
            }

            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
     });
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

.controller('ShowStoriesCtrl', function($scope, $state, $q, loading, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 200; // Set on Firebase Database by Hacker News
    $scope.viewTitle = "Show HN"; //Necessary because all lists use the same template
    var storiesIds = [];

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];
    var promisses = [];

    loading.show();
    $q.when(hackerNewsApi.getShowStories()).then(function(result) {
        console.log("List Returned")
        storiesIds = result.data;
        //console.log(storiesIds);

        for (var i = 0; i < $scope.pageSize; i++) {
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
        }

        //console.log(promisses);
        $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //console.log(arrayOfResponses);

            for (var i = 0; i < arrayOfResponses.length; i++) {
              $scope.storyList.push(arrayOfResponses[i].data);
              $scope.totalItemsLoaded++;
            }
            
            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
        });
     });

  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');
    var promisses = [];
    loading.show();

    for (var i = $scope.totalItemsLoaded; i < ($scope.totalItemsLoaded + $scope.pageSize) 
      && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
    };

    //console.log(promisses);
    $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //console.log(arrayOfResponses);

            for (var i = 0; i < arrayOfResponses.length; i++) {
              $scope.storyList.push(arrayOfResponses[i].data);
              $scope.totalItemsLoaded++;
            }

            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
     });
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

.controller('JobStoriesCtrl', function($scope, $state, $q, loading, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 0; // Total Array Size
    $scope.viewTitle = "Jobs"; //Necessary because all lists use the same template
    var storiesIds = [];

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];
    var promisses = [];

    loading.show();
    $q.when(hackerNewsApi.getJobStories()).then(function(result) {
        console.log("List Returned")
        storiesIds = result.data;
        //console.log(storiesIds);

        //Jobs array can have less items than page size
        for (var i = 0; i < $scope.pageSize && i < storiesIds.length; i++) { 
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
        }

        //console.log(promisses);
        $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //console.log(arrayOfResponses);

            for (var i = 0; i < arrayOfResponses.length; i++) {
              $scope.storyList.push(arrayOfResponses[i].data);
              $scope.totalItemsLoaded++;
            }
            
            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
        });
     });

  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');
    var promisses = [];
    loading.show();

    for (var i = $scope.totalItemsLoaded; i < ($scope.totalItemsLoaded + $scope.pageSize) 
      && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
    };

    //console.log(promisses);
    $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //console.log(arrayOfResponses);

            for (var i = 0; i < arrayOfResponses.length; i++) {
              $scope.storyList.push(arrayOfResponses[i].data);
              $scope.totalItemsLoaded++;
            }

            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
     });
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

.controller('CommentsCtrl', function($scope, $stateParams, $q, loading, hackerNewsApi, commentParser) {
      console.log("Loading Story: " + $stateParams.storyId);
      var storyId = $stateParams.storyId;
      $scope.story = {};
      loading.show();
      $q.when(hackerNewsApi.getItem(storyId)).then(function(result) {
        var story = result.data;
        story.nodes = [];
        story.text = commentParser.parse(story.text);
        console.log(story.id);
        $scope.story = story;
        $scope.loadComments(story.kids);
      });

    $scope.loadComments = function(commentIds){
      loading.show();
      console.log("Loading Comments");
      console.log(commentIds);
      var comments = [];
      var promises =[];
      $scope.commentList = [];

      if(commentIds === undefined){
        loading.hide();
        return;
      }

      for(var i = 0; i < commentIds.length; i++) {
        console.log("Pushing Promise of "+ commentIds[i]);
        promises.push(hackerNewsApi.getItem(commentIds[i]));
      }

      console.log(promises);
      $q.all(promises).then( function(arrayOfResponses) {
        console.log('all set');
        console.log(arrayOfResponses);

        for (var i = 0; i < arrayOfResponses.length; i++) {
          if(arrayOfResponses[i].data.deleted !== true){
            arrayOfResponses[i].data.text=commentParser.parse(arrayOfResponses[i].data.text);
            comments.push(arrayOfResponses[i].data);
          }
        }

        $scope.story.nodes =  comments;
        loading.hide();
      });
    }

    $scope.hasReplies = function(commentObj){
      if(commentObj.kids === undefined){
        return false;
      } else {
        return true;
      }
    }

    $scope.addReplies = function(commentObj){
      loading.show();
      commentObj.showing = true;
      console.log("Loading Kids of "+ commentObj.id);
      commentIds = commentObj.kids;
      console.log(commentIds);
      var comments = [];
      var promises =[];

      for(var i = 0; i < commentIds.length; i++) {
        console.log("Pushing Promise of "+ commentIds[i]);
        promises.push(hackerNewsApi.getItem(commentIds[i]));
      }

      console.log(promises);
      $q.all(promises).then( function(arrayOfResponses) {
        console.log('all set');
        console.log(arrayOfResponses);

        for (var i = 0; i < arrayOfResponses.length; i++) {
          arrayOfResponses[i].data.text=commentParser.parse(arrayOfResponses[i].data.text);
          comments.push(arrayOfResponses[i].data);
        }

        commentObj.nodes = comments;
        loading.hide();
      });
    }

    $scope.removeReplies = function(commentObj){
      commentObj.showing = false;
      commentObj.nodes = [];
    }


    $scope.hasText = function(story){
      if(story.text === undefined || story.text === "<p></p>"){
        return false;
      } else {
        return true;
      }
    }

})

.controller('SettingsCtrl', function($scope, $localstorage, toastProvider) {
    /*var theme = 'light';
    var startScreen = "top";*/
    var externalBrowser = true;
/*
      theme = $localstorage.get('theme');      
      console.log($localstorage.get('theme'));

      startScreen = $localstorage.get('startScreen');
      var radio = document.getElementById( startScreen );
      radio.checked = true;
*/
      if($localstorage.get('externalBrowser') === 'true'){
        document.getElementById( 'externalBrowser' ).checked = true;
      } else {
        document.getElementById( 'externalBrowser' ).checked = false;
      };
/*
  $scope.lightButton = function(){
    theme = "light";
   };
  $scope.darkButton = function(){
    theme = "dark";
   };
  $scope.blueButton = function(){
    theme = "blue";
   };
   
*/
  $scope.save = function(){
/*    var radios = document.getElementsByName( 'startScreen' );
    for( i = 0; i < radios.length; i++ ) {
        if( radios[i].checked ) {
            console.log("found="+radios[i].value)
            startScreen = radios[i].value;
        }
    }*/
    externalBrowser = document.getElementById( 'externalBrowser' ).checked;
/*
    $localstorage.set('theme', theme);
    console.log($localstorage.get('theme'));
    $localstorage.set('startScreen', startScreen);
    console.log($localstorage.get('startScreen'));
    */
    $localstorage.set('externalBrowser', externalBrowser);
    console.log($localstorage.get('externalBrowser'));
    toastProvider.showToast("Settings Saved!", "short", "center")
  };

})

.controller('SearchResultsCtrl', function($scope, $state, $stateParams, loading, searchApi, socialSharing, commentParser) {
    console.log("arrived at results!");
    $scope.type = $stateParams.type;
    console.log($stateParams.type);
    console.log($stateParams.text);
    $scope.resultsList = [];

  $scope.getStory = function(text) {
    //console.log("correct story function?");
    searchApi.searchStory(text)
      .then(function (result) {
        //console.log(JSON.stringify(result.data));
        $scope.resultsList = result.data.hits;  
        //console.log(result.data.hits);
      });
  };

  $scope.getComment = function(text) {
    //console.log("correct story function?");
    searchApi.searchComment(text)
      .then(function (result) {
        //console.log(JSON.stringify(result.data));
        $scope.resultsList = result.data.hits;  
        //console.log(result.data.hits);
      });
  };
  
  $scope.getAsk = function(text) {
    //console.log("correct story function?");
    searchApi.searchAsk(text)
      .then(function (result) {
        //console.log(JSON.stringify(result.data));
        $scope.resultsList = result.data.hits;  
        //console.log(result.data.hits);
      });
  };  

  $scope.getShow = function(text) {
    //console.log("correct story function?");
    searchApi.searchShow(text)
      .then(function (result) {
        //console.log(JSON.stringify(result.data));
        $scope.resultsList = result.data.hits;  
        //console.log(result.data.hits);
      });
  };

    switch($stateParams.type){
      case '1': // Story
        console.log("option 1!");
        loading.show();
        $scope.getStory($stateParams.text);
        loading.hide();
        break;
      case '2': // Comment
        console.log("option 2!");
        loading.show();
        $scope.getComment($stateParams.text);
        loading.hide();
        break;
      case '3': // Ask
        console.log("option 3!");
        loading.show();
        $scope.getAsk($stateParams.text);
        loading.hide();
        break;
      case '4': // Show
        console.log("option 4!");
        loading.show();
        $scope.getShow($stateParams.text);
        loading.hide();
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

  $scope.parseComment = function(text) {
    return commentParser.parse(text);
  }
})

.controller('UserCtrl', function($scope, $stateParams, hackerNewsApi) {
  hackerNewsApi.getUser($stateParams.userId)
    .error(function (result) {
      console.log(result.error);
    })
    .then(function (result) {
      //console.log(result);
      var user = result.data;
      console.log(user);
      if(user === null){
        $scope.error = 'error';
      } else{
        $scope.user = user;
        $scope.error = 'no-error';
      }
    });

})

.controller('UserCommentsCtrl', function($scope, $state, $stateParams, $q, loading, hackerNewsApi, searchApi, commentParser) {
  $scope.storyComments = [];

  loading.show();
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
              //console.log(comment);
              comment.text = commentParser.parse(comment.text)
              $scope.storyComments.push(comment);
            }
          });

      };
      loading.hide();
    });


    $scope.goToCommentStoryPage = function(commentId){
      var commentItem;
      var storyId;
      loading.show();

      searchApi.searchItem(commentId)
        .error(function (result) {
          loading.hide();
          console.log("error");
        })
        .then(function (result) {
          //console.log(JSON.stringify(result.data));
          commentItem = result.data;  
          //console.log(result.data.hits);
          storyId = commentItem.story_id;

          loading.hide();
          $state.go('app.comments', {'storyId': storyId});
      });
  };

})

.controller('UserStoriesCtrl', function($scope, $state, $stateParams, $q, loading, hackerNewsApi, socialSharing, externalBrowser) {
    $scope.pageSize = 30;
    $scope.totalItemsLoaded = 0;
    $scope.totalItemsArray = 0; // Total Array Size
    $scope.viewTitle = "User Threads"; //Necessary because all lists use the same template
    var storiesIds = [];
    //$stateParams.userId

  $scope.doRefresh = function() {
    $scope.totalItemsLoaded = 0;
    $scope.storyList = [];
    var promisses = [];

    loading.show();
    $q.when(hackerNewsApi.getUser($stateParams.userId)).then(function(result) {
        console.log("List Returned")
        storiesIds = result.data.submitted;
        //cconsole.log(storiesIds);

        for (var i = 0; i < $scope.pageSize; i++) {
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
        }

        //cconsole.log(promisses);
        $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //cconsole.log(arrayOfResponses);
            for (var i = 0; i < arrayOfResponses.length; i++) {
              if(arrayOfResponses[i].data.deleted !== true && arrayOfResponses[i].data.type === "story"){
                $scope.storyList.push(arrayOfResponses[i].data);
                $scope.totalItemsLoaded++;
              }
            }
            
            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
        });
     });

  };

  $scope.loadMoreData = function() {
    console.log('Loading more data!');
    var promisses = [];
    loading.show();

    for (var i = $scope.totalItemsLoaded; i < ($scope.totalItemsLoaded + $scope.pageSize) 
      && $scope.totalItemsLoaded <= $scope.totalItemsArray; i++) {
          promisses.push(hackerNewsApi.getItem(storiesIds[i]));
    };

    //cconsole.log(promisses);
    $q.all(promisses).then( function(arrayOfResponses) {
            console.log('all set');
            //cconsole.log(arrayOfResponses);

            for (var i = 0; i < arrayOfResponses.length; i++) {
              if(arrayOfResponses[i].data.deleted !== true && arrayOfResponses[i].data.type === "story"){
                $scope.storyList.push(arrayOfResponses[i].data);
                $scope.totalItemsLoaded++;
              }
            }

            loading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            console.log("Refresh Done");
     });
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


.controller('AboutCtrl', function($scope, externalBrowser) {
    //https://github.com/apache/cordova-plugin-inappbrowser
  $scope.openBrowser = function(url){
    externalBrowser.open(url);
  };

});

