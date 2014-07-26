;(function( window, document, undefined ){
  'use strict';

var weatherApp = angular.module('weatherApp', ['ngResource', 'ngAnimate', 'ngTouch']);

weatherApp.constant("errors", {
	geo: {
		unsupported: "Your browser does not support geolocation, try entering an address.",
		permission: "You denied access to your location.",
		unavailable: "Unable to find you.",
		timeout: "Finding your location timed out."
	},
	network: "Could not load the weather. Please check your network connection and try again later.",
	storage: "Your browser does not support local storage. We can't save your settings and the app will not work."
});

weatherApp.factory('GeoLocation', ['$q', '$window', '$rootScope', '$resource', '$filter', '$timeout', 'errors', 'Settings',
	function($q, $window, $rootScope, $resource, $filter, $timeout, errors, Settings) {
		//http://maps.googleapis.com/maps/api/geocode/json
		var resource = $resource("data/google.location-data.json", {} , {
			query: { method:"GET", cache: true },
		})
		//Get the location from the browser
		var browser = function() {
			var deferred = $q.defer();
			//Check for geolocation
			if ($window.navigator && $window.navigator.geolocation) {
				//Get the current location
				$window.navigator.geolocation.getCurrentPosition(function(position) {
					angular.copy(position, request.position);
					$rootScope.$apply(function(){deferred.resolve(position);});
				//On error tell the world
				}, function(error) {
					var message;
					switch (error.code) {
						case 1:
							message = errors.geo.permission;
							break;
						case 2:
							message = errors.geo.unavailable;
							break;
						case 3:
							message = errors.geo.timeout;
							break;
					}
					$rootScope.$apply(function(){deferred.reject(message)});
				});
			//Display error if unsupported
			} else {
				$rootScope.$apply(function(){deferred.reject(errors.geo.unsupported)});
			}
			return deferred.promise;
		}
		//Get location from API
		var api = function(location) {
			var deferred = $q.defer();
			//Get address from Google Geocode API
			resource.query({
				address: location,
				sensor: false
			}, function(response) {
				//Make sure results were returned
				if (response.results.length > 0) {
					//Create object similar to what geolocation creates
					var position = {
						formatted: response.results[0].formatted_address,
						coords: {
							latitude: response.results[0].geometry.location.lat,
							longitude: response.results[0].geometry.location.lng,
						}
					};
					angular.copy(position, request.position);
					//Force to be async
					$timeout(function() {
						$rootScope.$apply(function(){deferred.resolve(position);});
					}, 0);
				} else {
					$timeout(function() {
						$rootScope.$apply(function(){deferred.reject(errors.geo.unavailable)});
					}, 0);
				}
			}, function(error) {
				$timeout(function() {
					$rootScope.$apply(function(){deferred.reject(errors.geo.unavailable)});
				}, 0);
			})
			return deferred.promise;
		}
		//Public functions
		var request = {
			position: {},
			get: function(location) {
				var deferred;
				//Get the current location as set by the user
				if (typeof(location) === "undefined") { var location = Settings.user.currentLocation; }
				//If current, get the current geolocation
				if (location === "Current Location") {
					deferred = browser();
				//If not, get the location from the geocode api
				} else {
					deferred = api(location);
				}
				//Return the final promise object
				return deferred;
			}
		}
		return request;
	}
]);

weatherApp.factory('Settings', ['$rootScope', '$filter', 'errors',
	function($rootScope, $filter, errors) {
		var STORAGE_ID = 'weatherApp';
		//Check for support
		//Default settings
		var defaults = {
			locations: [],
			currentLocation: "Current Location",
			unit: {
				current: "auto",
				options: [ "auto", "us", "si" ]
			}
		}
		var settings = {
			//All the user set settings are in here
			user: {},
			//Helper functions to save settings
			get: function () {
				//Properly updates the view when changed after load
				angular.copy(JSON.parse(localStorage.getItem(STORAGE_ID) || '[]'), this.user);
			},
			put: function(settings) {
				var ordered, error = true;
				//Handle exceptions, should never happen but you never know with these power users
				while (error) {
					try {
						localStorage.setItem(STORAGE_ID, JSON.stringify(settings));
						error = false;
					} catch(e) {
						//Now browser support
						if (!'localStorage' in window) {
							$rootScope.$broadcast("error", errors.storage);
							error = false;
						//Full list
						} else {
							ordered = $filter('orderBy')(settings.user.locations, "-added");
							ordered.pop();
							settings.user.locations = ordered;
							error = true;
						}
					}
				}
			},
			restore: function() {
				this.put(defaults);
				this.get();
			}
		}
		//default settings if app has never loaded before
		if (!(STORAGE_ID in localStorage)) {
			settings.put(defaults);
		}
		//Load on init
		settings.get();
		return settings;
	}
]);

weatherApp.factory('Weather', ['$resource', '$rootScope', 'errors', 'Settings', 'GeoLocation',
	function($resource, $rootScope, errors, Settings, GeoLocation) {
		//Create resource with some default params
		var resource = $resource("data/sample-data.json", {} , {
			query: {method:"GET", params:{ apiKey: "49ab673f7f424c0331500362d11a8460"}}
		})
		//Create return var
		var request = {
			error: false,
			loading: false,
			data: {},
			current: {},
			upcoming: {},
			request: function() {
				request.loading = true;
				//Get location
				GeoLocation.get().then(function(data) {
					resource.query({
						latitude: data.coords.latitude,
						longitude: data.coords.longitude,
						units: Settings.user.unit.current
					}, function(response) {
						//Set variables
						request.loading = false;
						request.data = response;
						request.current = response.currently;
						request.upcoming = response.daily;
					}, function(error) {
						$rootScope.$broadcast("error", errors.network);
					})
				}).catch(function(error) {
					$rootScope.$broadcast("error", error);
				})
			}
		}
		//Load on init
		request.request();
		return request
	}
]);

weatherApp.filter('formatTime', function() {
	return function(unix, format) {
		return moment.unix(unix).format(format);
	}
});

weatherApp.filter("icon", function() {
	//convert weather data object to icon
	return function (current) {
		if (typeof(current) !== "object") return;
		//Create list for icon
		var icon = [];
		//Check precip type and that probability is above 50%
		if (current.precipType && current.precipProbability > 0.5) {
			//GUYS IT'S RAINING
			if (current.precipType === "rain") {
				//Check intensity of the rain
				if (current.precipIntensity >= 0.4) {
					icon.push("downpour");
				} else if (current.precipIntensity >= 0.1) {
					icon.push("rain");
				} else if (current.precipIntensity >= 0.017) {
					icon.push("showers");
				} else {
					icon.push("drizzle");
				}
			//Handle snow
			} else if (current.precipType === "snow") {
				if (current.precipIntensity >= 0.1) {
					icon.push("snow");
				} else {
					icon.push("flurries");
				}
			//If anything else
			} else {
				icon.push(current.precipType);
			}
		//Check for other less important weather things
		} else {
			//fog (in miles)
			//definition https://en.wikipedia.org/wiki/Visibility#Fog.2C_mist.2C_and_haze
			if (current.visibility <= 0.625) {
				icon.push("fog");
			//haze (in miles)
			} else if (current.visiblity <= 3.1) {
				icon.push("haze");
			//Check wind (mph)
			} else if (current.windSpeed >= 25) {
				icon.push("wind");
			}
		}
		//Check if completely cloudy
		if (current.cloudCover >= 0.75) {
			icon.push("cloud");
		} else {
			//Check if partially cloudy
			if (current.cloudCover >= 0.25) {
				icon.push("cloud")
			}
			//Check the time of day
			//Past sunset or before sunrise. Only allow the moon on days that are "today"
			if (moment().diff(current.time, "days") === 0 && (moment().isAfter(current.sunsetTime) || moment().isBefore(current.sunriseTime))) {
				icon.push("moon");
			} else {
				icon.push("sun");
			}
		}
		//Return the list as a string
		return icon.join(" ");
	}
});

weatherApp.filter("join", function() {
	return function (input,delimiter) {
	   return (input || []).join(delimiter || ',');
	};
});

weatherApp.filter('slice', function() {
  return function(arr, start, end) {
    return (arr || []).slice(start, end);
  };
});

weatherApp.directive('blur', ['$timeout',
	function($timeout) {
		return {
			link: function(scope, element, attrs) {
				scope.$watch(attrs.focus, function(value) {
					if(value === false) {
						element[0].blur();
					}
				});
			}
		};
	}
]);

weatherApp.directive('detectDevice', ['$document',
	function($document) {
		return {
			link: function(scope, element, attrs) {
				if ('ontouchstart' in $document) {
					element.addClass("touch");
				}
				if (window.navigator.standalone === true) {
					element.addClass("installed-app");
				}
			}
		};
	}
]);

weatherApp.directive('focus', ['$timeout',
	function($timeout) {
		return {
			link: function(scope, element, attrs) {
				scope.$watch(attrs.focus, function(value) {
					if(value === true) {
						element[0].focus();
					}
				});
			}
		};
	}
]);

weatherApp.directive("noBounce", function() {
	return {
		link: function(scope, element, attrs) {
			//https://github.com/joelambert/ScrollFix
			// Variables to track inputs
			var startY, startTopScroll;
			var elem = angular.element(element)[0];
			// If there is no element, then do nothing
			if(!elem)
				return;
			// Handle the start of interactions
			elem.addEventListener('touchstart', function(event) {
				startY = event.touches[0].pageY;
				startTopScroll = elem.scrollTop;
				if(startTopScroll <= 0)
					elem.scrollTop = 1;
				if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
					elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
				event.preventPropagation();
			}, false);
		}
	}
});

weatherApp.directive("noTouchScroll", function() {
	return {
		link: function(scope, element, attrs) {
			var element = angular.element(element)[0];
			element.addEventListener("touchmove", function(event) {
				event.preventPropagation();
				event.preventDefault();
			})
		}
	}
});

weatherApp.directive("refresh", ['$rootScope', '$timeout', '$document', 'Weather',
	function($rootScope, $timeout, $document, Weather) {
		return {
			restrict: "C",
			scope: {},
			link: function(scope, element, attrs) {
				//Helper function
				scope.refresh = function() {
					//Refresh all the data
					Weather.request();
					//Reset the auto refresh
					scope.then = moment();
				}
				//Refresh when clicking the element
				element.bind("click", function(e) {
					scope.refresh();
					e.preventDefault();
				})
				//wait 15 minutes before allowing auto refreshing
				scope.autoRefreshTime = 15;
				scope.then = moment();
				//Reload data on refocusing page only if the refresh time has passed
				$document.on("visibilitychange", function(status) {
					//Check to see if document has changed to visible and that the current momement is after the previous moment
					if (!document.hidden && moment().isAfter(scope.then.add("m", scope.autoRefreshTime))) {
						scope.refresh();
					}
				})
				$rootScope.$on("refresh", function() {
					scope.refresh();
				})
			}
		}
	}
]);

weatherApp.controller("Message", ['$scope', '$rootScope',
	function($scope, $rootScope, $filter) {
		$scope.show = false;
		$rootScope.$on("error", function(error, msg) {
			$scope.show = true;
			$scope.messageTitle = "Error";
			$scope.messageText = msg;
		})
	}
])

weatherApp.controller("Settings", ['$scope', '$rootScope', '$filter', '$timeout', 'Weather', 'Settings', 'GeoLocation',
	function($scope, $rootScope, $filter, $timeout, Weather, Settings, GeoLocation) {
		var settings = $scope.settings = Settings.user;
		$scope.searchActive = false;
		$scope.settingsModal = false;
		//Locations
		$scope.newLocation = "";
		//Find the length of the default locations
		$scope.addLocation = function() {
			var trimmed = $scope.newLocation.trim();
			//Validate user input
			if (trimmed !== "") {
				//Make request to make sure place exists
				GeoLocation.get(trimmed).then(function() {
					var formatted = GeoLocation.position.formatted;
					//make sure location doesn't exist already
					if ($filter('filter')(settings.locations, {value: formatted}, true).length === 0) {
						settings.locations.push({
							value: formatted,
							added: moment().format("X")
						})
					}
					//Set new location to current
					$scope.setCurrent(formatted);
				})
			}
		}
		$scope.setCurrent = function(location) {
			//Force async change
			$timeout(function() {
				//Reset and hide search
				$scope.newLocation = "";
				$scope.searchActive = false;
				//Allow string and location object inputs
				if (typeof(location) === "object") { var obj = location;	location = location.value; }
				if (settings.currentLocation === location) return;
				settings.currentLocation = location;
				//Set most recently modified as now (moves to top of list)
				if (obj) { obj.added = moment().format("X"); }
				//Load weather for new location
				$rootScope.$broadcast("refresh");
			}, 0);
		}
		//Reset to default settings
		$scope.restore = function() {
			Settings.restore();
		}
		//Save settings locally
		$scope.$watch('settings', function() {
			Settings.put(settings);
		}, true);
	}
]);

weatherApp.controller("WeatherCtrl", ['$scope', '$filter', 'errors', 'Weather', 'Settings', 'GeoLocation',
	function($scope, $filter, errors, Weather, Settings, GeoLocation) {
		//Only dev
		$scope.settings = Settings.user;
		$scope.weather = Weather;
		$scope.location = GeoLocation;
	}
]).controller("Current", ['$scope',
	function($scope) {
		$scope.summary = "It may be hot, but at least it's not raining!";
		//Stuff specific to current weather
	}
]).controller("Upcoming", ['$scope',
	function($scope) {
		//Stuff specific to upcoming
	}
]);

}( window, document ));