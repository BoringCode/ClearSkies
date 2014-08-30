weatherApp.controller("WeatherCtrl", ['$scope', '$filter', 'errors', 'units', 'Weather', 'Settings', 'GeoLocation',
	function($scope, $filter, errors, units, Weather, Settings, GeoLocation) {
		//Only dev
		$scope.settings = Settings.user;
		$scope.weather = Weather;
		$scope.location = GeoLocation;
		$scope.units = units;
	}
]).controller("Current", ['$scope', '$filter',
	function($scope, $filter) {
		$scope.summary = "It's hot, but at least it isn't raining. You should put some sunscreen lotion on and go swimming!";
		$scope.rainStatus = "";
		$scope.rainStatusData = {};

		var types = {
			"rain": ["Heavy rain", "Rain", "Rain showers", "Drizzle"],
			"snow": ["Heavy snow", "Snow", "Light snow", "Flurries"]
		}
		$scope.upcomingRain = function() {
			var rain = false;
			var rainStarted = false;
			var started = 0;
			//Default status
			var status = "No rain for the day";
			//Create list of data (60 minutes and then 11 hours after that) 12 hours into the future
			var data = [$scope.minutely, $scope.hourly.splice(1, 11)];
			//Loop through two data sets
			for (var i = 0; i < data.length; i++) {
				//Rain has been detected in previous data set, don't continue
				if (rain) break;
				//Get data set
				var current = data[i];
				for (var y = 0; y < current.length; y++) {
					var dataPoint = current[y];
					//Check to see if rain has started and whether it is likely to rain
					if (rainStarted === false && dataPoint.precipIntensity > 0.017 && dataPoint.precipProbability > 0.5) {
						rain = true;
						status = "";
						//Cloud cover is not included in data point, but is useful for forming the icon (just assume full cloud cover)
						dataPoint.cloudCover = 1;
						$scope.rainStatusData = dataPoint;
						//Get descriptors based upon precip type (rain or snow at this point)
						var descriptors = types[dataPoint.precipType];
						if (dataPoint.precipIntensity >= 0.4) {
							status += descriptors[0];
						} else if (dataPoint.precipIntensity >= 0.1) {
							status += descriptors[1];
						} else if (dataPoint.precipIntensity >= 0.017) {
							status += descriptors[2];
						} else {
							status += descriptors[3];
						}
						started = moment.unix(dataPoint.time);
						status += " " + started.fromNow();
						rainStarted = true;
					//Check if rain has started and whether it stops at this data point
					} else if (rainStarted === true && dataPoint.precipProbability < 0.5) {
						//Create stopping message
						status += ", ending " + moment.unix(dataPoint.time).from(started, true) + " later";
						rainStarted = false;
						break;
					}
				}
			}
			//Set status in scope
			$scope.rainStatus = status;
		}

		//Watch weather data object and update internal objects accordingly
		$scope.$watchCollection("weather", function() {
			if ($scope.weather.loading === false) {
				$scope.predicted = $scope.weather.upcoming.data[0];
				$scope.minutely = $scope.weather.data.minutely.data;
				$scope.hourly = $scope.weather.data.hourly.data;
				$scope.upcomingRain();
			}
		})
	}
]).controller("Upcoming", ['$scope',
	function($scope) {
		//Stuff specific to upcoming
	}
]);