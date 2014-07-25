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