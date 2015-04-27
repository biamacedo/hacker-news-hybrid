angular.module('starter.services', []) 
/**
 * A simple example service that returns some data.
 */
.factory('fireBaseData', function($firebase, $rootScope) {
    var APIUrl = "https://hacker-news.firebaseio.com/v0/";
    var ref = new Firebase("https://hacker-news.firebaseio.com/v0/"),
    refTopStories = new Firebase("https://hacker-news.firebaseio.com/v0/topstories"),
    refNewStories = new Firebase("https://hacker-news.firebaseio.com/v0/newstories"),
    refItem = new Firebase("https://hacker-news.firebaseio.com/v0/item/");

  return {
    ref: function () {
      return ref;
    },
    refTopStories: function () {
      return refTopStories;
    },
    refNewStories: function () {
      return refNewStories;
    },
    getItem: function(itemID){
      var refItemID = new Firebase("https://hacker-news.firebaseio.com/v0/item/" +itemID);
      return refItemID;
      //var refItemNumber = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + itemValue);
      //return new Firebase(APIUrl).child("item").child(itemID);
      //var itemRef = ref.child('item').child(Number(itemValue));
      /*var item;
      refItemNumber.once('value', function(snapshot) {   
          item = $firebaseObject(
          console.log(item.id);
          console.log(item.title);
          console.log(item.by);
          console.log(item.url);
      });*/
    //var item = {};
    //refItemNumber.on("value", function(snapshot) {
      // This isn't going to show up in the DOM immediately, because
      // Angular does not know we have changed this in memory.
      // $scope.data = snapshot.val();
      // To fix this, we can use $scope.$apply() to notify Angular that a change occurred.

        // item = snapshot.val();
        // console.log(item.id);
        // return item;

    //});
      
      //return refItemNumber;
    }
  }
 
});