angular.module('starter.services', []) 
/**
 * A simple example service that returns some data.
 */
 .factory('fireBaseData', function($firebaseArray) {
  //var APIUrl = "https://hacker-news.firebaseio.com/v0/";
  /*var ref = new Firebase("https://hacker-news.firebaseio.com/v0/"),
  refTopStories = new Firebase("https://hacker-news.firebaseio.com/v0/topstories"),
  refNewStories = new Firebase("https://hacker-news.firebaseio.com/v0/newstories"),
  refItem = new Firebase("https://hacker-news.firebaseio.com/v0/item/");*/

  /*var ref = new Firebase("http://hacker-news.firebaseio.com/v0/");
  var itemRef = ref.child('item');
  var topStories = [];
  var topStoriesItens = [];

  var storyCallback = function(snapshot) {
    var story = snapshot.val();
    topStoriesItens.push(story);
  }


  ref.child('topstories').limitToFirst(10).once('value', function(snapshot) {
    topStories = snapshot.val();
    
    for(var i = 0; i < topStories.length; i++) {
      itemRef.child(topStories[i]).on('value', storyCallback);
    }
  });

  return {
    ref: function () {
      return ref;
    },
    refTopStories: function () {
      return topStoriesItens;
    },
    refNewStories: function () {
      return refNewStories;
    },
    getItem: function(itemID){
      var refItemID = new Firebase("https://hacker-news.firebaseio.com/v0/item/" +itemID);
      return refItemID;
    },
    getAllItensInArray: function(itemArray){
      var refItens = [];
      for(itemID in itemArray){
        var refItemID = new Firebase("https://hacker-news.firebaseio.com/v0/item/" +itemID);
        refItens.push(refItemID);
      }
      return refItens;
    }
  }*/

});