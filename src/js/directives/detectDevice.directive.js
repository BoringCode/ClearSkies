weatherApp.directive('detectDevice', ['$document',
	function($document) {
		return {
			link: function(scope, element, attrs) {
				if ('ontouchstart' in $document) {
					element.addClass("touch");
				}
				if (window.navigator.standalone === true) {
					element.addClass("installed-app");
				}
			}
		};
	}
]);