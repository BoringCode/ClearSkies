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
		//Stuff specific to current weather
		$scope.$watchCollection("weather", function() {
			$scope.predicted = $scope.weather.upcoming.data[0];
		})
	}
]).controller("Upcoming", ['$scope',
	function($scope) {
		//Stuff specific to upcoming
	}
]);