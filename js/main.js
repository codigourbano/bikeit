!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(){"use strict";angular.module("bikeit.auth",[]).factory("AuthService",["nonce",function(a){return{getNonce:function(){return a},setNonce:function(b){a=b}}}]).factory("authInterceptor",["$rootScope","$q","AuthService",function(a,b,c){return jQuery.ajaxSetup({beforeSend:function(a){c.getNonce()&&a.setRequestHeader("X-WP-Nonce",c.getNonce())}}),{request:function(a){return a.headers=a.headers||{},c.getNonce()&&(a.headers["X-WP-Nonce"]=c.getNonce()),a||b.when(a)}}}]).config(["$httpProvider",function(a){a.interceptors.push("authInterceptor")}]).controller("LoginForm",["$scope","$http","apiUrl","AuthService",function(a){a.login=function(){}}])},{}],2:[function(){"use strict";angular.module("bikeit.home",["ui.router"]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("home",{url:"/",controller:"HomeController",templateUrl:window.bikeit.templateUri.split(window.location.origin)[1]+"/views/home.html",resolve:{HomeData:["WPService",function(a){return a.query({type:"place"})}]}})}]).controller("HomeController",["HomeData","$scope",function(a,b){b.posts=a.data}])},{}],3:[function(a){a("./auth"),a("./user"),a("./map"),a("./home"),a("./place"),a("./review"),angular.module("bikeit",["ngDialog","ui.router","bikeit.auth","bikeit.user","bikeit.map","bikeit.home","bikeit.place","bikeit.review","leaflet-directive"]).constant("apiUrl",window.bikeit.apiUrl).constant("nonce",window.bikeit.nonce).constant("baseUrl",window.bikeit.url.split(window.location.origin)[1]).constant("templatePath",window.bikeit.templateUri.split(window.location.origin)[1]).constant("siteName",window.bikeit.name).constant("labels",window.bikeit.labels).config(["$locationProvider",function(a){a.html5Mode(!1),a.hashPrefix("!")}]).factory("WPService",a("./service")).directive("tooltip",function(){return{restrict:"A",link:function(a,b,c){c.tooltip&&(b.addClass("has-tooltip"),b.append('<div class="tooltip"><span>'+c.tooltip+"</span></div>"))}}}).directive("backImg",function(){return function(a,b,c){var d=c.backImg;b.css({"background-image":"url("+d+")","background-size":"cover"})}}).factory("Labels",["labels",function(a){return function(b){return"undefined"==typeof b?"":a[b]?a[b]:b}}]).controller("SiteController",["$state","Labels","$scope",function(a,b,c){c.labels=b,c.logoutUrl=window.bikeit.logoutUrl,c.goHome=function(){a.go("home")}}]).controller("SearchController",["$scope","WPService","$http",function(a,b,c){a.searchResults=[],a.addressResults=[];var d=_.debounce(function(d){if(d&&"undefined"!=typeof d){b.query({filter:{s:d},type:a.searchType||"place"}).then(function(b){a.searchResults=b.data});var e=window.bikeit.city.boundingbox;c.get("http://nominatim.openstreetmap.org/search",{params:{format:"json",q:d,bounded:1,viewbox:e[2]+","+e[1]+","+e[3]+","+e[0]}}).success(function(b){a.addressResults=b})}else a.searchResults=[],a.addressResults=[]},200);a.$watch("searchText",function(b){b&&"undefined"!=typeof b?d(b):(a.searchResults=[],a.addressResults=[])})}]),jQuery(document).ready(function(){console.log(bikeit),angular.bootstrap(document,["bikeit"])})},{"./auth":1,"./home":2,"./map":4,"./place":5,"./review":6,"./service":7,"./user":8}],4:[function(){"use strict";L.Icon.Default.imagePath=window.bikeit.templateUri+"/css/images",angular.module("bikeit.map",["leaflet-directive"]).controller("MapController",["$state","leafletData","leafletEvents","$scope",function(a,b,c,d){d.mapDefaults={scrollWheelZoom:!1},d.$on("leafletDirectiveMarker.mouseover",function(a,b){b.leafletEvent.target.openPopup(),b.leafletEvent.target.setZIndexOffset(1e3)}),d.$on("leafletDirectiveMarker.mouseout",function(a,b){b.leafletEvent.target.closePopup(),b.leafletEvent.target.setZIndexOffset(0)}),d.$on("leafletDirectiveMarker.click",function(b,c){a.go("placesSingle",{placeId:c.markerName})}),d.$watch("markers",function(a){if(a&&!_.isEmpty(a)){var c=[];_.each(a,function(a){c.push([a.lat,a.lng])});var d=L.latLngBounds(c);b.getMap().then(function(a){a.fitBounds(d,{reset:!0})})}})}]).factory("MapMarkers",["$window",function(a){var b={};return _.each(a.bikeit.placeCategories,function(a){var c=["default","approved","unapproved"];_.each(c,function(c){var d,e=a.markers[c],f=a.markers.position;"center"==f?(f=[e.width/2,e.height/2],d=[0,-e.height/2-10]):"bottom_center"==f?(f=[e.width/2,e.height],d=[0,-e.height-10]):"bottom_left"==f?(f=[0,e.height],d=[e.width/2,-e.height-10]):"bottom_right"==f&&(f=[e.width,e.height],d=[-e.width/2,-e.height-10]),b["place-category-"+a.term_id+"-"+c]={iconUrl:e.url,shadowUrl:!1,shadowSize:[0,0],iconSize:[e.width,e.height],iconAnchor:f,popupAnchor:d}})}),b}])},{}],5:[function(){"use strict";angular.module("bikeit.place",[]).config(["$stateProvider",function(a){a.state("places",{url:"/places/",controller:"PlaceIndexController",templateUrl:window.bikeit.templateUri.split(window.location.origin)[1]+"/views/place/index.html"}).state("placesSingle",{url:"/places/:placeId/",controller:"PlaceSingleController",templateUrl:window.bikeit.templateUri.split(window.location.origin)[1]+"/views/place/single.html",resolve:{PlaceData:["$q","$stateParams","WPService",function(a,b,c){var d=a.defer(),e={};return c.getPost(b.placeId).then(function(a){e.place=a,c.query({filter:{place_reviews:a.ID}}).then(function(a){e.reviews=a,d.resolve(e)})}),d.promise}]}})}]).controller("PlaceController",["$state","$scope",function(a,b){b.accessPlace=function(b){a.go("placesSingle",{placeId:b.ID})}}]).controller("PlaceSingleController",["PlaceData","$scope",function(a,b){b.place=a.place,b.reviews=a.reviews.data,console.log(b.reviews)}]).directive("placeListItem",["Labels","templatePath",function(a,b){return{restrict:"E",scope:{place:"=",style:"@"},templateUrl:b+"/views/place/partials/list-item.html",link:function(b){b.labels=a,b.style||(b.style="row"),b.sanitizeAddress=function(a){return a.location.address}}}}]).directive("placeIcon",function(){return{restrict:"E",scope:{place:"="},template:'<img class="place-icon" title="{{place.terms[\'place-category\'][0].name}}" alt="{{place.terms[\'place-category\'][0].name}}" ng-show="{{place.terms[\'place-category\'].length}}" ng-src="{{getPlaceIcon(place)}}" />',link:function(a){a.getPlaceIcon=function(a){var b="default";return b=parseFloat(a.scores.approved)>=.5?"approved":"unapproved",a.terms["place-category"]?a.terms["place-category"][0].markers[b]:""}}}}).directive("mapFilters",["templatePath","$window",function(a,b){return{restrict:"E",templateUrl:a+"/views/place/partials/map-filters.html",link:function(a){a.categoryId=!1,a.categories=b.bikeit.placeCategories,a.filter=function(b){a.categoryId=b?b.term_id:!1}}}}]).filter("placeToMarker",["leafletData","MapMarkers",function(a,b){return _.memoize(function(a){if(a.length){var c={};return _.each(a,function(a){var d="default";d=parseFloat(a.scores.approved)>=.5?"approved":"unapproved";var e={};if(a.terms["place-category"]){var f=a.terms["place-category"][0].ID;e=b["place-category-"+f+"-"+d]}c[a.ID]={lat:a.location.lat,lng:a.location.lng,icon:e,message:"<h2>"+a.title+"</h2><p>"+a.location.address+"</p>"}}),c}return{}},function(){return JSON.stringify(arguments)})}]).filter("placeCategory",function(){return function(a,b){return b?_.filter(a,function(a){return a.terms["place-category"]&&parseInt(a.terms["place-category"][0].ID)==parseInt(b)}):a}})},{}],6:[function(){"use strict";angular.module("bikeit.review",[]).factory("ReviewService",["$http","$q","apiUrl",function(a,b,c){return{vote:function(b,d){return a.post(c+"/posts/"+b+"/vote",{vote:d})},unvote:function(b){return a["delete"](c+"/posts/"+b+"/vote")}}}]).controller("SubmitReviewCtrl",["templatePath","ngDialog","$scope","WPService",function(a,b,c,d){c.newReview=function(d){c.place=d||!1,b.open({template:a+"/views/review/new.html",scope:c})},c.submit=function(a){d.post({title:" ",content_raw:a.content,type:"review",status:"publish",review_meta:{approved:a.approved,kindness:a.kindness,structure:a.structure,stampable:a.stampable?1:0,notify:a.notify?1:0,place:c.place.ID}}).then(function(a){console.log(a)})}}]).directive("reviewListItem",["templatePath","Labels","$sce","WPService","ReviewService",function(a,b,c,d,e){return{restrict:"E",scope:{review:"="},templateUrl:a+"/views/review/partials/list-item.html",link:function(a){var f=a.review;a.labels=b,a.getReviewDate=function(){return moment(f.date).format("L")},a.getReviewContent=function(){return c.trustAsHtml(f.content)},a.getReviewApproval=function(){return b(parseInt(f.rating.approved)?"Approved":"Failed")},a.vote=function(a){f.userVote==a?e.unvote(f.ID).success(function(){f.votes[f.userVote]--,f.userVote=!1}):e.vote(f.ID,a).success(function(){f.userVote!==a&&f.votes[f.userVote]--,f.votes[a]++,f.userVote=a})},a.toggleComments=function(){a.comments||d.getPostComments(f.ID).then(function(b){a.comments=b}),a.displayComments=a.displayComments?!1:!0},a.getCommentContent=function(a){return c.trustAsHtml(a.content)}}}}]).directive("ratings",[function(){return{restrict:"E",scope:{type:"@",rating:"@",editable:"@",model:"="},template:'<span class="rating rating-{{type}} clearfix" title="{{rating | number:2}}/5"><span ng-repeat="i in range(5) track by $index" class="rating-item rating-{{$index+1}}" ng-click="setRating($index+1)" ng-mouseover="hoverRating($index+1)" ng-mouseleave="getRating()"><span class="rating-filled" style="width:{{filledAmount($index+1)}}%">&nbsp;</span></span></span>',link:function(a){a.rating=parseFloat(a.rating),a.range=function(a){return new Array(a)},a.setRating=function(b){a.editable&&(a.rating=b,a.model=b)},a.hoverRating=function(b){a.editable&&(a.rating=b)},a.getRating=function(){a.editable&&(a.rating=a.model)},a.filledAmount=function(b){var c=0;return b<=a.rating?c=100:b==Math.ceil(a.rating)&&(c=100*(a.rating-b+1)),c}}}}])},{}],7:[function(a,b){"use strict";b.exports=["$rootScope","$http","$q","$window","apiUrl",function(a,b,c,d,e){var f,g=e+"/posts",h=function(b,c){b=b||{},b=_.extend({page:1,filter:{posts_per_page:10}},b),jQuery.ajax({url:g,data:b,dataType:"json",cache:!0,success:function(b,d,e){a.$apply(function(){c(b,e.getResponseHeader("x-wp-total"),e.getResponseHeader("x-wp-totalpages"))})}})},i=function(a){var b,d,e,f=c.defer();return h(a,function(g,i,j){b=i,d=j,e=a.page,f.resolve({data:g,totalPosts:function(){return parseInt(b)},totalPages:function(){return parseInt(d)},currentPage:function(){return parseInt(e)},nextPage:function(){var b=c.defer();return e==d?b.resolve(!1):h(_.extend(a,{page:e+1}),function(a){e++,b.resolve(a)}),b.promise},prevPage:function(){var b=c.defer();return 1==e?b.resolve(!1):h(_.extend(a,{page:e-1}),function(a){e--,b.resolve(a)}),b.promise}})}),f.promise};return{query:i,get:function(a,b){return b=b||1,a=a||f,f=a,i({page:b,filter:{posts_per_page:a}})},search:function(a,b,c){return c=c||1,b=b||f,i({page:c,filter:{s:a,posts_per_page:b}})},getUser:function(a){a=a||"me";var b=c.defer();return jQuery.ajax({url:e+"/users/"+a,dataType:"json",cache:!0,success:function(a){b.resolve(a)},error:function(a,c){b.reject(c)}}),b.promise},getPost:function(a){var b=c.defer();return jQuery.ajax({url:g+"/"+a,dataType:"json",cache:!0,success:function(a){b.resolve(a)},error:function(a,c){b.reject(c)}}),b.promise},getPostComments:function(a){var b=c.defer();return jQuery.ajax({url:g+"/"+a+"/comments",dataType:"json",cache:!0,success:function(a){b.resolve(a)},error:function(a,c){b.reject(c)}}),b.promise},post:function(a){var b=c.defer();return console.log(a),jQuery.ajax({url:g,dataType:"json",type:"POST",data:{data:a},success:function(a){b.resolve(a)},error:function(a,c){b.reject(c)}}),b.promise}}}]},{}],8:[function(){"use strict";angular.module("bikeit.user",[]).controller("UserController",["WPService","$scope",function(a,b){b.loadedUser=!1,b.getUser=function(){a.getUser().then(function(a){b.loadedUser=!0,b.user=a},function(){b.loadedUser=!0})}}])},{}]},{},[3]);