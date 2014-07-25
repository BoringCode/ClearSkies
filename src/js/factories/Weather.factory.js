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