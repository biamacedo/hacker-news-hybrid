angular.module('starter.services', []) 
/**
 * A simple example service that returns some data.
 */
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

});