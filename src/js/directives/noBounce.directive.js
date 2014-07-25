weatherApp.directive("noBounce", function() {
	return {
		link: function(scope, element, attrs) {
			//https://github.com/joelambert/ScrollFix
			// Variables to track inputs
			var startY, startTopScroll;
			var elem = angular.element(element)[0];
			// If there is no element, then do nothing
			if(!elem)
				return;
			// Handle the start of interactions
			elem.addEventListener('touchstart', function(event) {
				startY = event.touches[0].pageY;
				startTopScroll = elem.scrollTop;
				if(startTopScroll <= 0)
					elem.scrollTop = 1;
				if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
					elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
				event.preventPropagation();
			}, false);
		}
	}
});