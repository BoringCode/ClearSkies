weatherApp.directive("noTouchScroll", function() {
	return {
		link: function(scope, element, attrs) {
			var element = angular.element(element)[0];
			element.addEventListener("touchmove", function(event) {
				event.preventPropagation();
				event.preventDefault();
			})
		}
	}
});