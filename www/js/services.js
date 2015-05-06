angular.module('starter.services', []) 
/**
 * A simple example service that returns some data.
 */
.service('$localstorage', ['$window', function($window) {
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

.service('socialSharing', function() {
  return{
    share : function(title, url){
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
  };
})

.service('toastProvider', function() {
  return{
    //show(message, duration, position)
    //  duration: 'short', 'long'
    //  position: 'top', 'center', 'bottom'
    showToast : function(text, duration, location){
        if (window.plugins && window.plugins.socialsharing) {
            window.plugins.toast.show(text, duration, location, function(error){
                console.log('Toast Success')
            }, function(b){
              alert('Toast Error: ' + error)
            })
        }
        else console.log("Toast plugin not available");
      }
  };
})

.service('externalBrowser', function($localstorage) {
  return{
    open : function(url){
        var option = $localstorage.get('externalBrowser');
        console.log(option);
        var optionString;
        switch(option){
          case 'true':
            optionString = '_system';
            break;
          default:
            optionString = '_blank';
            break;

        }
        //_self : WebView
        //_blank : InAppBrowser
        //_system : External Browser
        console.log(optionString);
        var ref = window.open(url, optionString, 'location=yes'); 
        return false;
      }
  };
})

.service('commentParser', function() {
  return{
    parse : function(text){
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
      return tag.innerHTML;
    }
  };
})

.service('starterScreen', function($localstorage) {
  return{
    getStartScreenPath : function(){
      var option = $localstorage.get('startScreen')
      var path;
      switch(option){
        case 'top':
          path = "/app/topStories";
          break;
        case 'new':
          path = "/app/newStories";
          break;
        case 'ask':
          path = "/app/askStories";
          break;
        case 'show':
          path = "/app/showStories";
          break;
        case 'poll':
          path = "/app/topStories";
          break;
        case 'jobs':
          path = "/app/jobStories";
          break;
        default:
          path = "/app/topStories";
          break;
      }
      return path;
    }
  };
}) 

.factory('hackerNewsApi', function($http) {
    var ref = "https://hacker-news.firebaseio.com/v0/"
    var itemPath = 'item/';
    var userPath = 'user/';
    var jsonEnd = '.json';
    var topStoriesPath = 'topstories';
    var newStoriesPath = 'newstories';
    var askStoriesPath = 'askstories';
    var showStoriesPath = 'showstories';
    var jobStoriesPath = 'jobstories';


  return {
    getTopStories: function () {
      return $http.get(ref + topStoriesPath + jsonEnd);
    },
    getNewStories: function () {
      return $http.get(ref + newStoriesPath + jsonEnd);
    },
    getAskStories: function () {
      return $http.get(ref + askStoriesPath + jsonEnd);
    },
    getShowStories: function () {
      return $http.get(ref + showStoriesPath + jsonEnd);
    },
    getJobStories: function () {
      return $http.get(ref + jobStoriesPath + jsonEnd);
    },
    getItem: function(itemID){
      return $http.get(ref + itemPath + itemID + jsonEnd);
    },
    getUser: function(userID){
      return $http.get(ref + userPath + userID + jsonEnd);
    }
  };

})

 .factory('pagination', function($http) {
    var pageSize = 20; // Default value, plan to add to settings for user to modify
    var currentPage = 0;
    var pagePath = "page=";
    var hitsPerPagePath = "hitsPerPage=";
    var concatenate = "&";

    function resetPagination(pageSize){
      pageSize = pageSize;
      currentPage = 0;
    };

    function getPageSize(){
      return currentPage;
    };

    function getCurrentPage(){
      return currentPage;
    };

    function getPageUrl(url, page){
      var finalUrl = url + concatenate + pagePath + page + concatenate + hitsPerPagePath + pageSize;
      currentPage++;
      return finalUrl;
    };

    function getNextPageUrl(url){
      var finalUrl = url + concatenate + pagePath + currentPage + concatenate + hitsPerPagePath + pageSize;
      currentPage++;
      return finalUrl;
    };

    function getPagination(){
      return {
        resetPagination : resetPagination,
        getPageSize : getPageSize,
        getCurrentPage : getCurrentPage,
        getPageUrl : getPageUrl,
        getNextPageUrl : getNextPageUrl
      };
    };

    return {
      getPagination : getPagination
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
      
      function getUrlForSearchByTextAndTag(text, tags) {
        var httpLink = getUrl(searchByDatePath) + queryPath + text + and + tagsPath + tags;
        console.log(httpLink);
        return httpLink;
      };

      function fetchStory(text) {
        console.log("Fetch Story");
        return $http.get(getUrlForSearchByTextAndTag(text, "story"));
      };

      function fetchComment(text) {
        console.log("Fetch Story");
        return $http.get(getUrlForSearchByTextAndTag(text, "comment"));
      };

      function fetchAsk(text) {
        console.log("Fetch Story");
        return $http.get(getUrlForSearchByTextAndTag(text, "ask_hn"));
      };

      function fetchShow(text) {
        console.log("Fetch Story");
        return $http.get(getUrlForSearchByTextAndTag(text, "show_hn"));
      };


      return{
            searchStory: function(text){
              return fetchStory(text);
            },
            searchComment: function(text){
              return fetchComment(text);
            }, 
            searchAsk: function(text){
              return fetchAsk(text);
            }, 
            searchShow: function(text){
              return fetchShow(text);
            }
      };
  });