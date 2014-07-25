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