/*! ClearSkies JS Build v0.1.0 2014-07-25 */
!function(a){"use strict";var b=angular.module("weatherApp",["ngResource","ngAnimate","ngTouch"]);b.constant("errors",{geo:{unsupported:"Your browser does not support geolocation, try entering an address.",permission:"You denied access to your location.",unavailable:"Unable to find you.",timeout:"Finding your location timed out."},network:"Could not load the weather. Please check your network connection and try again later.",storage:"Your browser does not support local storage. We can't save your settings and the app will not work."}),b.factory("GeoLocation",["$q","$window","$rootScope","$resource","$filter","$timeout","errors","Settings",function(a,b,c,d,e,f,g,h){var i=d("data/google.location-data.json",{},{query:{method:"GET",cache:!0}}),j=function(){var d=a.defer();return b.navigator&&b.navigator.geolocation?b.navigator.geolocation.getCurrentPosition(function(a){angular.copy(a,l.position),c.$apply(function(){d.resolve(a)})},function(a){var b;switch(a.code){case 1:b=g.geo.permission;break;case 2:b=g.geo.unavailable;break;case 3:b=g.geo.timeout}c.$apply(function(){d.reject(b)})}):c.$apply(function(){d.reject(g.geo.unsupported)}),d.promise},k=function(b){var d=a.defer();return i.query({address:b,sensor:!1},function(a){if(a.results.length>0){var b={formatted:a.results[0].formatted_address,coords:{latitude:a.results[0].geometry.location.lat,longitude:a.results[0].geometry.location.lng}};angular.copy(b,l.position),f(function(){c.$apply(function(){d.resolve(b)})},0)}else f(function(){c.$apply(function(){d.reject(g.geo.unavailable)})},0)},function(){f(function(){c.$apply(function(){d.reject(g.geo.unavailable)})},0)}),d.promise},l={position:{},get:function(a){var b;if("undefined"==typeof a)var a=h.user.currentLocation;return b="Current Location"===a?j():k(a)}};return l}]),b.factory("Settings",["$rootScope","$filter","errors",function(b,c,d){var e="weatherApp",f={locations:[],currentLocation:"Current Location",unit:{current:"auto",options:["auto","us","si"]}},g={user:{},get:function(){angular.copy(JSON.parse(localStorage.getItem(e)||"[]"),this.user)},put:function(f){for(var g,h=!0;h;)try{localStorage.setItem(e,JSON.stringify(f)),h=!1}catch(i){!1 in a?(b.$broadcast("error",d.storage),h=!1):(g=c("orderBy")(f.user.locations,"-added"),g.pop(),f.user.locations=g,h=!0)}},restore:function(){this.put(f),this.get()}};return e in localStorage||g.put(f),g.get(),g}]),b.factory("Weather",["$resource","$rootScope","errors","Settings","GeoLocation",function(a,b,c,d,e){var f=a("data/sample-data.json",{},{query:{method:"GET",params:{apiKey:"49ab673f7f424c0331500362d11a8460"}}}),g={error:!1,loading:!1,data:{},current:{},upcoming:{},request:function(){g.loading=!0,e.get().then(function(a){f.query({latitude:a.coords.latitude,longitude:a.coords.longitude,units:d.user.unit.current},function(a){g.loading=!1,g.data=a,g.current=a.currently,g.upcoming=a.daily},function(){b.$broadcast("error",c.network)})}).catch(function(a){b.$broadcast("error",a)})}};return g.request(),g}]),b.filter("formatTime",function(){return function(a,b){return moment.unix(a).format(b)}}),b.filter("icon",function(){return function(a){if("object"==typeof a){var b=[];return a.precipType&&a.precipProbability>.5?b.push("rain"===a.precipType?a.precipIntensity>=.4?"downpour":a.precipIntensity>=.1?"rain":a.precipIntensity>=.017?"showers":"drizzle":"snow"===a.precipType?a.precipIntensity>=.1?"snow":"flurries":a.precipType):a.visibility<=.625?b.push("fog"):a.visiblity<=3.1?b.push("haze"):a.windSpeed>=25&&b.push("wind"),a.cloudCover>=.75?b.push("cloud"):(a.cloudCover>=.25&&b.push("cloud"),b.push(0===moment().diff(a.time,"days")&&(moment().isAfter(a.sunsetTime)||moment().isBefore(a.sunriseTime))?"moon":"sun")),b.join(" ")}}}),b.filter("join",function(){return function(a,b){return(a||[]).join(b||",")}}),b.filter("slice",function(){return function(a,b,c){return(a||[]).slice(b,c)}}),b.directive("blur",["$timeout",function(){return{link:function(a,b,c){a.$watch(c.focus,function(a){a===!1&&b[0].blur()})}}}]),b.directive("detectDevice",["$document",function(b){return{link:function(c,d){"ontouchstart"in b&&d.addClass("touch"),a.navigator.standalone===!0&&d.addClass("installed-app")}}}]),b.directive("focus",["$timeout",function(){return{link:function(a,b,c){a.$watch(c.focus,function(a){a===!0&&b[0].focus()})}}}]),b.directive("noBounce",function(){return{link:function(a,b){var c,d,e=angular.element(b)[0];e&&e.addEventListener("touchstart",function(a){c=a.touches[0].pageY,d=e.scrollTop,0>=d&&(e.scrollTop=1),d+e.offsetHeight>=e.scrollHeight&&(e.scrollTop=e.scrollHeight-e.offsetHeight-1),a.preventPropagation()},!1)}}}),b.directive("noTouchScroll",function(){return{link:function(a,b){var b=angular.element(b)[0];b.addEventListener("touchmove",function(a){a.preventPropagation(),a.preventDefault()})}}}),b.directive("refresh",["$rootScope","$timeout","$document","Weather",function(a,b,c,d){return{restrict:"C",scope:{},link:function(b,e){b.refresh=function(){d.request(),b.then=moment()},e.bind("click",function(a){b.refresh(),a.preventDefault()}),b.autoRefreshTime=15,b.then=moment(),c.on("visibilitychange",function(){!document.hidden&&moment().isAfter(b.then.add("m",b.autoRefreshTime))&&b.refresh()}),a.$on("refresh",function(){b.refresh()})}}}]),b.controller("Message",["$scope","$rootScope",function(a,b){a.show=!1,b.$on("error",function(b,c){a.show=!0,a.messageTitle="Error",a.messageText=c})}]),b.controller("Settings",["$scope","$rootScope","$filter","$timeout","Weather","Settings","GeoLocation",function(a,b,c,d,e,f,g){var h=a.settings=f.user;a.searchActive=!1,a.settingsModal=!1,a.newLocation="",a.addLocation=function(){var b=a.newLocation.trim();""!==b&&g.get(b).then(function(){var b=g.position.formatted;0===c("filter")(h.locations,{value:b},!0).length&&h.locations.push({value:b,added:moment().format("X")}),a.setCurrent(b)})},a.setCurrent=function(c){d(function(){if(a.newLocation="",a.searchActive=!1,"object"==typeof c){var d=c;c=c.value}h.currentLocation!==c&&(h.currentLocation=c,d&&(d.added=moment().format("X")),b.$broadcast("refresh"))},0)},a.restore=function(){f.restore()},a.$watch("settings",function(){f.put(h)},!0)}]),b.controller("WeatherCtrl",["$scope","$filter","errors","Weather","Settings","GeoLocation",function(a,b,c,d,e,f){a.settings=e.user,a.weather=d,a.location=f}]).controller("Current",["$scope",function(a){a.summary="It may be hot, but at least it's not raining!"}]).controller("Upcoming",["$scope",function(){}])}(window);