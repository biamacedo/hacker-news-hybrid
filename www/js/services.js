angular.module('starter.services', []) 
/**
 * A simple example service that returns some data.
 */
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || null;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

 .factory('fireBaseData', function($firebaseArray, $q) {
  var ref = new Firebase("http://hacker-news.firebaseio.com/v0/");
  var itemRef = ref.child('item');
  var topStoriesIds = [];  // Array that contains the Top Stories ids
  //var topStoriesItems = []; // Array that contains the Top Stories objects, acquired by getting item with the top story id
  var pageSize = 20; // Total of items in a page, supposed to load 20 items at a time

  /*var storyCallback = function(snapshot) {
    var story = snapshot.val();
    topStoriesItems.push(story);
  }

  ref.child('topstories').once('value', function(snapshot) {
    topStoriesIds = snapshot.val();
  });*/

  return {
    getPageSize: function () {
      return pageSize;
    },
    getTotalTopStories: function () {
      return topStoriesIds.length;
    },
    getTopStories: function () {
      return $q(function(resolve, reject) { 
        setTimeout(function() {
          ref.child('topstories').once('value', function(snapshot) {
            topStoriesIds = snapshot.val();
            console.log(topStoriesIds);
            //return topStoriesIds;
          });
          resolve(topStoriesIds);
        }, 1000);
      });
    },
    getItem: function(itemID){
      var story;
      itemRef.child(itemID).once('value', function(snapshot) {
          story = snapshot.val();
        });
      return story;
    },
    getNextPage: function(startIndex){
      return $q(function(resolve, reject) { 
        setTimeout(function() {
                  var topStoriesItems = [];
                  for(var i = startIndex; i < (startIndex+pageSize) && i < topStoriesIds.length; i++) {
                    itemRef.child(topStoriesIds[i]).once('value', function(snapshot) {
                      var story = snapshot.val();
                      topStoriesItems.push(story);
                    });
                  }
                  resolve(topStoriesItems);
        }, 1000);
      });
    }
  };

})


 .factory('searchApi', function($http) {
    var searchRef = "http://hn.algolia.com/api/v1/"
    var itemPath = 'items/';
    var userPath = 'users/';
    var searchPath = 'search?';
    var searchByDatePath = 'search_by_date?';
    var queryPath = 'query=';
    var tagsPath = 'tags=';
    var and = "&";

      function getUrl(path) {
        return searchRef + path;
      };

      function getUrlForId(path, id) {
        return getUrl(path) + id;
      };

      function getUrlForSearch(type, text) {
        return getUrl(searchPath) + type + text;
      };

      function getUrlForSearchByTextAndTag(text, tags) {
        var httpLink = getUrl(searchPath) + queryPath + text + and + tagsPath + tags;
        console.log(httpLink);
        return httpLink;
      };

      function getUrlForSearchByTag(tags) {
        var httpLink =getUrl(searchPath) + tagsPath + tags;
        console.log(httpLink);
        return httpLink;
      };

      function fetchItem(itemId) {
        console.log("Fetch Item");
        var httpLink =  $http.get(getUrlForId(itemPath, itemId));
        console.log(httpLink);
        return httpLink;
      };

      function fetchUser(userId) {
        console.log("Fetch User");
        return $http.get(getUrlForId(userPath, userId));
      };

      function fetchFrontPage() {
        console.log("Fetch Front Page");
        return $http.get(getUrlForSearchByTag("front_page"));
      };

      function fetchStory(text) {
        console.log("Fetch Story");
        return $http.get(getUrlForSearchByTextAndTag(text, "story"));
      };

      function service(){
          console.log("correct service");
          getItem: fetch
      };

      return {
        getItem: function(itemID){
          return fetchItem(itemID);
        },
        getUser: function(userName){
          return fetchUser(userName);
        },        
        getFrontPage: function(){
          return fetchFrontPage();
        }
      };
  });