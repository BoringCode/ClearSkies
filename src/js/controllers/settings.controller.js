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