!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(){"use strict";angular.module("bikeit.auth",[]).factory("authInterceptor",["$rootScope","$q","nonce",function(a,b,c){return jQuery.ajaxSetup({beforeSend:function(a){a.setRequestHeader("X-WP-Nonce",c)}}),{request:function(a){return a.headers=a.headers||{},a.headers["X-WP-Nonce"]=c,a||b.when(a)}}}]).config(["$httpProvider",function(a){a.interceptors.push("authInterceptor")}])},{}],2:[function(){"use strict";angular.module("bikeit.home",["ui.router"]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("home",{url:"/",controller:"HomeController",templateUrl:window.bikeit.templateUri.split(window.location.origin)[1]+"/views/home.html",resolve:{HomeData:["WPService",function(a){return a.query({type:"place"})}]}})}]).controller("HomeController",["labels","HomeData","$scope",function(a,b,c){c.labels=a,c.posts=b.data}])},{}],3:[function(a){a("./auth"),a("./user"),a("./map"),a("./home"),a("./place"),angular.module("bikeit",["ngDialog","ui.router","bikeit.auth","bikeit.user","bikeit.map","bikeit.home","bikeit.place","leaflet-directive"]).constant("apiUrl",window.bikeit.apiUrl).constant("nonce",window.bikeit.nonce).constant("baseUrl",window.bikeit.url.split(window.location.origin)[1]).constant("templatePath",window.bikeit.templateUri.split(window.location.origin)[1]).constant("siteName",window.bikeit.name).constant("macroLocation",window.bikeit.macroLocation).constant("labels",window.bikeit.labels).config(["$locationProvider",function(a){a.html5Mode(!1),a.hashPrefix("!")}]).factory("WPService",a("./service")),jQuery(document).ready(function(){console.log(window.bikeit),angular.bootstrap(document,["bikeit"])})},{"./auth":1,"./home":2,"./map":4,"./place":5,"./service":6,"./user":7}],4:[function(){"use strict";L.Icon.Default.imagePath=window.bikeit.templateUri+"/css/images",angular.module("bikeit.map",["leaflet-directive"]).controller("MapController",["labels","leafletData","$scope",function(a,b,c){c.mapDefaults={scrollWheelZoom:!1},c.$watch("markers",function(a){if(a&&!_.isEmpty(a)){var c=[];_.each(a,function(a){c.push([a.lat,a.lng])});var d=L.latLngBounds(c);b.getMap().then(function(a){a.fitBounds(d,{reset:!0})})}})}]).factory("MapMarkers",["$window",function(a){var b={};return _.each(a.bikeit.placeCategories,function(a){var c,d=a.markers.approved,e=a.markers.position;"center"==e?(e=[d.width/2,d.height/2],c=[0,-d.height/2-10]):"bottom_center"==e?(e=[d.width/2,d.height],c=[0,-d.height-10]):"bottom_left"==e?(e=[0,d.height],c=[d.width/2,-d.height-10]):"bottom_right"==e&&(e=[d.width,d.height],c=[-d.width/2,-d.height-10]),b["place-category-"+a.term_id]={iconUrl:d.url,shadowUrl:!1,shadowSize:[0,0],iconSize:[d.width,d.height],iconAnchor:e,popupAnchor:c}}),console.log(b),b}])},{}],5:[function(){"use strict";angular.module("bikeit.place",[]).directive("placeListItem",["templatePath","macroLocation",function(a,b){return{restrict:"E",scope:{place:"="},templateUrl:a+"/views/place/partials/place-list-item.html",link:function(a){a.sanitizeAddress=function(a){return a.location.address.split(", "+b)[0]}}}}]).directive("placeIcon",function(){return{restrict:"E",scope:{place:"="},template:'<img class="place-icon" ng-show="{{place.terms[\'place-category\'].length}}" ng-src="{{getPlaceIcon(place)}}" />',link:function(a){a.getPlaceIcon=function(a){return a.terms["place-category"]?a.terms["place-category"][0].markers.approved:""}}}}).directive("mapFilters",["templatePath","$window",function(a,b){return{restrict:"E",templateUrl:a+"/views/place/partials/map-filters.html",link:function(a){a.categoryId=!1,a.categories=b.bikeit.placeCategories,a.filter=function(b){a.categoryId=b?b.term_id:!1}}}}]).filter("placeToMarker",["leafletData","MapMarkers",function(a,b){return _.memoize(function(a){if(a.length){var c={};return _.each(a,function(a){var d={};if(a.terms["place-category"]){var e=a.terms["place-category"][0].ID;d=b["place-category-"+e]}c[a.ID]={lat:a.location.lat,lng:a.location.lng,icon:d,message:a.title}}),c}return{}})}]).filter("placeCategory",function(){return function(a,b){return b?_.filter(a,function(a){return a.terms["place-category"]&&parseInt(a.terms["place-category"][0].ID)==parseInt(b)}):a}})},{}],6:[function(a,b){"use strict";b.exports=["$rootScope","$http","$q","$window","apiUrl",function(a,b,c,d,e){var f,g=e+"/posts",h=function(b,c){b=b||{page:1,filter:{posts_per_page:10}},jQuery.ajax({url:g,data:b,dataType:"json",cache:!0,success:function(b,d,e){a.$apply(function(){c(b,e.getResponseHeader("x-wp-total"),e.getResponseHeader("x-wp-totalpages"))})}})},i=function(a){var b,d,e,f=c.defer();return h(a,function(g,i,j){b=i,d=j,e=a.page,f.resolve({data:g,totalPosts:function(){return parseInt(b)},totalPages:function(){return parseInt(d)},currentPage:function(){return parseInt(e)},nextPage:function(){var b=c.defer();return e==d?b.resolve(!1):h(_.extend(a,{page:e+1}),function(a){e++,b.resolve(a)}),b.promise},prevPage:function(){var b=c.defer();return 1==e?b.resolve(!1):h(_.extend(a,{page:e-1}),function(a){e--,b.resolve(a)}),b.promise}})}),f.promise};return{query:i,get:function(a,b){return b=b||1,a=a||f,f=a,i({page:b,filter:{posts_per_page:a}})},search:function(a,b,c){return c=c||1,b=b||f,i({page:c,filter:{s:a,posts_per_page:b}})},getUser:function(a){a=a||"me";var b=c.defer();return jQuery.ajax({url:e+"/users/"+a,dataType:"json",cache:!0,success:function(a){b.resolve(a)},error:function(a,c){b.reject(c)}}),b.promise},getPost:function(a){var b=c.defer();return jQuery.ajax({url:g+"/"+a,dataType:"json",cache:!0,success:function(a){b.resolve(a)},error:function(a,c){b.reject(c)}}),b.promise}}}]},{}],7:[function(){"use strict";angular.module("bikeit.user",[]).controller("UserController",["WPService","$scope",function(a,b){b.loadedUser=!1,b.getUser=function(){a.getUser().then(function(a){b.loadedUser=!0,b.user=a},function(){b.loadedUser=!0})}}])},{}]},{},[3]);