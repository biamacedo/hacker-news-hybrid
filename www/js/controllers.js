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

.controller('TopStoriesCtrl', function($scope, fireBaseData, $firebase) {  
  //$scope.topStories = $firebase(fireBaseData.refTopStories()).$asArray();
  //var topStoriesIds = 
  /*var topStoriesItems = [];
  for(story in topStoriesIds){
    topStoriesItems.push($firebase(fireBaseData.getItem(story.value())));
  } 

  $scope.topStories = topStoriesItems;*/

  $scope.topStories = [{
    "by" : "franjkovic",
    "descendants" : 19,
    "id" : 9443867,
    "kids" : [ 9444010, 9444114, 9444064, 9443986, 9444012, 9443990, 9443885, 9443981 ],
    "score" : 55,
    "text" : "",
    "time" : 1430095158,
    "title" : "Race conditions on Facebook, DigitalOcean and others (fixed)",
    "type" : "story",
    "url" : "http://josipfranjkovic.blogspot.com/2015/04/race-conditions-on-facebook.html"
  },
  {
    "by" : "deepakprakash",
    "descendants" : 69,
    "id" : 9442254,
    "kids" : [ 9442381, 9442411, 9443318, 9443830, 9443030, 9442522, 9442355, 9443492, 9443970, 9443450, 9442433, 9442728, 9443050, 9443008, 9443104, 9442902, 9443775, 9442493, 9442970, 9442996, 9442738, 9443274, 9442399, 9442880, 9443803, 9443381 ],
    "score" : 439,
    "text" : "",
    "time" : 1430065639,
    "title" : "Docker without Docker",
    "type" : "story",
    "url" : "https://chimeracoder.github.io/docker-without-docker/#1"
  },
  {
    "by" : "subnaught",
    "descendants" : 80,
    "id" : 9443048,
    "kids" : [ 9443321, 9443486, 9444086, 9443465, 9443438, 9443699, 9443907, 9443993, 9444039, 9444061, 9443405, 9443888, 9443856, 9444016, 9443461, 9443513, 9443890, 9443374, 9443781, 9443330, 9443547, 9443913, 9443729, 9443909, 9443944, 9443780, 9443523, 9443716, 9443368, 9443348, 9443493, 9443323, 9443619, 9443365, 9443608 ],
    "score" : 118,
    "time" : 1430078157,
    "title" : "Why can’t we read anymore?",
    "type" : "story",
    "url" : "https://medium.com/@hughmcguire/why-can-t-we-read-anymore-503c38c131fe"
  },
  {
    "by" : "bsbechtel",
    "descendants" : 17,
    "id" : 9443019,
    "kids" : [ 9444055, 9443463, 9443470, 9443758, 9443723, 9443727, 9443441, 9443642 ],
    "score" : 61,
    "text" : "",
    "time" : 1430077587,
    "title" : "Mindfulness therapy as good as medication for chronic depression – study",
    "type" : "story",
    "url" : "http://www.reuters.com/article/2015/04/20/us-health-depression-idUSKBN0NB2KO20150420"
  },
  {
    "by" : "curtis",
    "descendants" : 16,
    "id" : 9443462,
    "kids" : [ 9443766, 9443853, 9443767 ],
    "score" : 51,
    "time" : 1430085803,
    "title" : "How does D improve on C++17?",
    "type" : "story",
    "url" : "http://p0nce.github.io/d-idioms/#How-does-D-improve-on-C++17?"
  },
  {
    "by" : "joelgrus",
    "descendants" : 28,
    "id" : 9442384,
    "kids" : [ 9444084, 9444014, 9443376, 9443021, 9443850, 9442688, 9443538, 9443172, 9443552, 9442912, 9443058, 9443655 ],
    "score" : 148,
    "text" : "",
    "time" : 1430067676,
    "title" : "Data Science from Scratch: First Principles with Python",
    "type" : "story",
    "url" : "http://joelgrus.com/2015/04/26/data-science-from-scratch-first-principles-with-python/"
  },
  {
    "by" : "efbbbf",
    "descendants" : 66,
    "id" : 9441749,
    "kids" : [ 9443097, 9442261, 9442037, 9442357, 9442680, 9442206, 9443227, 9442193, 9443694, 9442299, 9442404, 9442496, 9443520, 9442989, 9443065, 9442020, 9442221, 9442312 ],
    "score" : 216,
    "text" : "",
    "time" : 1430056471,
    "title" : "Pure Python Vim clone",
    "type" : "story",
    "url" : "https://github.com/jonathanslenders/pyvim"
  },
  {
    "by" : "sciurus",
    "descendants" : 11,
    "id" : 9442512,
    "kids" : [ 9443713, 9443660, 9443688, 9443693 ],
    "score" : 72,
    "text" : "",
    "time" : 1430069708,
    "title" : "Next-Generation Cloud: The Rise of the Unikernel",
    "type" : "story",
    "url" : "http://www.xenproject.org/component/allvideoshare/video/latest/next-generation-cloud-the-rise-of-the-unikernel-updated-april-2015.html"
  },
  {
    "by" : "jazzdan",
    "descendants" : 17,
    "id" : 9443241,
    "kids" : [ 9443494, 9443705, 9443854, 9443982, 9443636 ],
    "score" : 40,
    "text" : "",
    "time" : 1430082015,
    "title" : "Comparing the PHP 7 and Hack Type Systems",
    "type" : "story",
    "url" : "http://www.dmiller.io/blog/2015/4/26/comparing-the-php7-and-hack-type-systems"
  },
  {
    "by" : "benbreen",
    "descendants" : 8,
    "id" : 9442660,
    "kids" : [ 9443863, 9443084, 9443412, 9443920, 9443232, 9443228, 9443017 ],
    "score" : 60,
    "text" : "",
    "time" : 1430071738,
    "title" : "The Invented History of 'The Factory Model of Education'",
    "type" : "story",
    "url" : "http://hackeducation.com/2015/04/25/factory-model/"
  },
  {
    "by" : "refp",
    "descendants" : 13,
    "id" : 9442832,
    "kids" : [ 9443633, 9443229, 9443258, 9443168, 9443556, 9443313, 9443312 ],
    "score" : 53,
    "text" : "",
    "time" : 1430074270,
    "title" : "Non-constant constant-expressions in C++",
    "type" : "story",
    "url" : "http://b.atch.se/posts/non-constant-constant-expressions/"
  },
  {
    "by" : "kartikkumar",
    "descendants" : 50,
    "id" : 9442322,
    "kids" : [ 9444110, 9443819, 9442626, 9443953, 9443214, 9442803, 9443357, 9442540, 9443222, 9443276, 9442975, 9442730, 9443265, 9442741, 9443016, 9443666, 9443587, 9443047, 9443291 ],
    "score" : 78,
    "text" : "",
    "time" : 1430066723,
    "title" : "Contrast Rebellion",
    "type" : "story",
    "url" : "http://contrastrebellion.com/"
  }]
})

.controller('NewStoriesCtrl', function($scope, fireBaseData, $firebase) {
  //$scope.newStories = $firebase(fireBaseData.refNewStories()).$asArray();
})

.controller('SettingsCtrl', function($scope) {
  
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
