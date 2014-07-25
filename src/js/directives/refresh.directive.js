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