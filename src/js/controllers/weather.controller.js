weatherApp.controller("WeatherCtrl", ['$scope', '$filter', 'errors', 'units', 'Weather', 'Settings', 'GeoLocation',
	function($scope, $filter, errors, units, Weather, Settings, GeoLocation) {
		//Only dev
		$scope.settings = Settings.user;
		$scope.weather = Weather;
		$scope.location = GeoLocation;
		$scope.units = units;
	}
]).controller("Current", ['$scope',
	function($scope) {
		$scope.summary = "It's hot, but at least it isn't raining. You should put some sunscreen lotion on and go swimming!";
		$scope.rainStatus = "No rain for the day";

		$scope.minutelyStatus = function() {
			var data = $scope.weather.data.minutely.data;
			for (var i = 0; i < data.length; i++) {
				var dataPoint = data[i];
				if (dataPoint.precipIntensity > 0 && dataPoint.precipProbability > 0.5) {
					break;
				}
			}
			console.log(dataPoint);
		}

		//Stuff specific to current weather
		$scope.$watchCollection("weather", function() {
			if ($scope.weather.loading === false) {
				$scope.predicted = $scope.weather.upcoming.data[0];

				$scope.minutelyStatus();
			}
		})
	}
]).controller("Upcoming", ['$scope',
	function($scope) {
		//Stuff specific to upcoming
	}
]);