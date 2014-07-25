weatherApp.directive('blur', ['$timeout',
	function($timeout) {
		return {
			link: function(scope, element, attrs) {
				scope.$watch(attrs.focus, function(value) {
					if(value === false) {
						element[0].blur();
					}
				});
			}
		};
	}
]);