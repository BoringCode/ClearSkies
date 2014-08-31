/*! ClearSkies JS Build v0.1.0 2014-08-31 */
!function(a,b){"use strict";var c=angular.module("weatherApp",["ngResource","ngTouch"]);c.config(["$httpProvider",function(a){a.defaults.useXDomain=!0,delete a.defaults.headers.common["Content-type"],delete a.defaults.headers.common["X-Requested-With"]}]),c.constant("errors",{geo:{unsupported:"Your browser does not support geolocation, try entering an address.",permission:"You denied access to your location.",unavailable:"Unable to find you.",timeout:"Finding your location timed out."},network:"Could not load the weather. Please check your network connection and try again later.",storage:"Your browser does not support local storage. We can't save your settings and the app will not work."}),c.constant("units",{us:{speed:"mph",distance:"miles",temperature:"Fahrenheit"},si:{speed:"kph",distance:"kilometers",temperature:"Celsius"}}),c.factory("GeoLocation",["$q","$window","$rootScope","$resource","$filter","$timeout","errors","Settings",function(a,b,c,d,e,f,g,h){var i=d("http://maps.googleapis.com/maps/api/geocode/json",{},{query:{method:"GET",cache:!0}}),j=function(){var d=a.defer();return b.navigator&&b.navigator.geolocation?b.navigator.geolocation.getCurrentPosition(function(a){angular.copy(a,l.position),c.$apply(function(){d.resolve(a)})},function(a){var b;switch(a.code){case 1:b=g.geo.permission;break;case 2:b=g.geo.unavailable;break;case 3:b=g.geo.timeout}c.$apply(function(){d.reject(b)})}):c.$apply(function(){d.reject(g.geo.unsupported)}),d.promise},k=function(b){var d=a.defer();return i.query({address:b,sensor:!1},function(a){if(a.results.length>0){var b={formatted:a.results[0].formatted_address,coords:{latitude:a.results[0].geometry.location.lat,longitude:a.results[0].geometry.location.lng}};angular.copy(b,l.position),f(function(){c.$apply(function(){d.resolve(b)})},0)}else f(function(){c.$apply(function(){d.reject(g.geo.unavailable)})},0)},function(){f(function(){c.$apply(function(){d.reject(g.geo.unavailable)})},0)}),d.promise},l={position:{},get:function(a){var b;if("undefined"==typeof a)var a=h.user.currentLocation;return b="Current Location"===a?j():k(a)}};return l}]),c.factory("Settings",["$rootScope","$filter","errors",function(b,c,d){var e="weatherApp",f={locations:[],currentLocation:"Current Location",unit:{current:"auto",options:["auto","us","si"]}},g={user:{},get:function(){angular.copy(JSON.parse(localStorage.getItem(e)||"[]"),this.user)},put:function(f){for(var g,h=!0;h;)try{localStorage.setItem(e,JSON.stringify(f)),h=!1}catch(i){!1 in a?(b.$broadcast("error",d.storage),h=!1):(g=c("orderBy")(f.user.locations,"-added"),g.pop(),f.user.locations=g,h=!0)}},restore:function(){this.put(f),this.get()}};return e in localStorage||g.put(f),g.get(),g}]),c.factory("Weather",["$resource","$rootScope","errors","Settings","GeoLocation",function(a,b,c,d,e){var f=a("https://api.forecast.io/forecast/:apiKey/:latitude,:longitude",{apiKey:"49ab673f7f424c0331500362d11a8460",callback:"JSON_CALLBACK"},{query:{method:"jsonp",isArray:!1}}),g={error:!1,loading:!0,data:{},current:{},upcoming:{},request:function(){g.loading=!0,e.get().then(function(a){f.query({latitude:a.coords.latitude,longitude:a.coords.longitude,units:d.user.unit.current},function(a){g.loading=!1,g.data=a,g.current=a.currently,g.upcoming=a.daily},function(){b.$broadcast("error",c.network)})}).catch(function(a){b.$broadcast("error",a)})}};return g.request(),g}]),c.filter("cardinalDirection",function(){return function(a){var b=360,c=0;if(a>b&&c>a)return"";var d,e={N:[348.75,11.25],NNE:[11.25,33.75],NE:[33.75,56.25],ENE:[56.25,78.75],E:[78.75,101.25],ESE:[101.25,123.75],SE:[123.75,146.25],SSE:[146.25,168.75],S:[168.75,191.25],SSW:[191.25,213.75],SW:[213.75,236.25],WSW:[236.25,258.75],W:[258.75,281.25],WNW:[281.25,303.75],NW:[303.75,326.25],NNW:[326.25,348.75]};for(var f in e){var g=e[f][0],h=e[f][1];if(g>h){if(h>=a||a>=g){d=f;break}}else if(h>=a&&a>=g){d=f;break}}return d}}),c.filter("formatTime",function(){return function(a,b){return moment.unix(a).format(b)}}),c.filter("icon",function(){return function(a){if("object"==typeof a){if(a==={})return"sun";var b=[];return a.precipType&&a.precipProbability>.5?b.push("rain"===a.precipType?a.precipIntensity>=.4?"downpour":a.precipIntensity>=.1?"rain":a.precipIntensity>=.017?"showers":"drizzle":"snow"===a.precipType?a.precipIntensity>=.1?"snow":"flurries":a.precipType):a.visibility<=.625?b.push("fog"):a.visiblity<=3.1?b.push("haze"):a.windSpeed>=25&&b.push("wind"),a.cloudCover>=.75?b.push("cloud"):(a.cloudCover>=.25&&b.push("cloud"),b.push(0===moment().diff(a.time,"days")&&(moment().isAfter(a.sunsetTime)||moment().isBefore(a.sunriseTime))?"moon":"sun")),b.join(" ")}}}),c.filter("join",function(){return function(a,b){return(a||[]).join(b||",")}}),c.filter("slice",function(){return function(a,b,c){return(a||[]).slice(b,c)}}),c.directive("blur",["$timeout",function(){return{link:function(a,b,c){a.$watch(c.focus,function(a){a===!1&&b[0].blur()})}}}]),c.directive("detectDevice",["$document",function(b){return{link:function(c,d){"ontouchstart"in b&&d.addClass("touch"),a.navigator.standalone===!0&&d.addClass("installed-app")}}}]),c.directive("focus",["$timeout",function(){return{link:function(a,b,c){a.$watch(c.focus,function(a){a===!0&&b[0].focus()})}}}]),c.directive("noBounce",function(){return{link:function(a,b){var c,d,e=angular.element(b)[0];e&&e.addEventListener("touchstart",function(a){c=a.touches[0].pageY,d=e.scrollTop,0>=d&&(e.scrollTop=1),d+e.offsetHeight>=e.scrollHeight&&(e.scrollTop=e.scrollHeight-e.offsetHeight-1),a.preventPropagation()},!1)}}}),c.directive("noTouchScroll",function(){return{link:function(a,b){var b=angular.element(b)[0];b.addEventListener("touchmove",function(a){a.preventPropagation(),a.preventDefault()})}}}),c.directive("refresh",["$rootScope","$timeout","$document","Weather",function(a,c,d,e){return{restrict:"C",scope:{},link:function(c,f){c.refresh=function(){e.request(),c.then=moment()},f.bind("click",function(a){c.refresh(),a.preventDefault()}),c.autoRefreshTime=15,c.then=moment(),d.on("visibilitychange",function(){!b.hidden&&moment().isAfter(c.then.add("m",c.autoRefreshTime))&&c.refresh()}),a.$on("refresh",function(){c.refresh()})}}}]),c.controller("Message",["$scope","$rootScope",function(a,b){a.show=!1,b.$on("error",function(b,c){a.show=!0,a.messageTitle="Error",a.messageText=c})}]),c.controller("Settings",["$scope","$rootScope","$filter","$timeout","Weather","Settings","GeoLocation",function(a,b,c,d,e,f,g){var h=a.settings=f.user;a.searchActive=!1,a.settingsModal=!1,a.newLocation="",a.addLocation=function(){var b=a.newLocation.trim();""!==b&&g.get(b).then(function(){var b=g.position.formatted;0===c("filter")(h.locations,{value:b},!0).length&&h.locations.push({value:b,added:moment().format("X")}),a.setCurrent(b)})},a.setCurrent=function(c){d(function(){if(a.newLocation="",a.searchActive=!1,"object"==typeof c){var d=c;c=c.value}h.currentLocation!==c&&(h.currentLocation=c,d&&(d.added=moment().format("X")),b.$broadcast("refresh"))},0)},a.restore=function(){f.restore()},a.$watch("settings",function(){f.put(h)},!0)}]),c.controller("WeatherCtrl",["$scope","$filter","errors","units","Weather","Settings","GeoLocation",function(a,b,c,d,e,f,g){a.settings=f.user,a.weather=e,a.location=g,a.units=d}]).controller("Current",["$scope",function(a){a.rainStatus="",a.rainStatusData={};var b={rain:["Heavy rain","Rain","Rain showers","Drizzle"],snow:["Heavy snow","Snow","Light snow","Flurries"],sleet:["Heavy sleet","Sleet","Light sleet","Slight sleet"],hail:["Heavy hail","Hail","Light Hail","Slight hail"]},c=function(){var c=!1,d=!1,e=0,f="No rain for the day";a.rainStatusData={};for(var g=[a.minutely,a.hourly.splice(1,11)],h=0;h<g.length&&!c;h++)for(var i=g[h],j=0;j<i.length;j++){var k=i[j];if(d===!1&&k.precipIntensity>.017&&k.precipProbability>.5){c=!0,f="",k.cloudCover=1,a.rainStatusData=k;var l=b[k.precipType];f+=k.precipIntensity>=.4?l[0]:k.precipIntensity>=.1?l[1]:k.precipIntensity>=.017?l[2]:l[3],e=moment.unix(k.time),f+=" "+e.fromNow(),d=!0}else if(d===!0&&k.precipProbability<.5){f+=", ending "+moment.unix(k.time).from(e,!0)+" later",d=!1;break}}a.rainStatus=f};a.$watchCollection("weather",function(){a.weather.loading===!1&&(a.predicted=a.weather.upcoming.data[0],a.minutely=a.weather.data.minutely.data,a.hourly=a.weather.data.hourly.data,c())})}])}(window,document);