weatherApp.filter("join", function() {
	return function (input,delimiter) {
	   return (input || []).join(delimiter || ',');
	};
});