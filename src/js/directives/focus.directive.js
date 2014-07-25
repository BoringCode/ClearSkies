weatherApp.directive('focus', ['$timeout',
	function($timeout) {
		return {
			link: function(scope, element, attrs) {
				scope.$watch(attrs.focus, function(value) {
					if(value === true) {
						element[0].focus();
					}
				});
			}
		};
	}
]);