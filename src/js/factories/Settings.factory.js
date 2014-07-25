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