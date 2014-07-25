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