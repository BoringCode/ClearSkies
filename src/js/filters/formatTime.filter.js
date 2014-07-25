weatherApp.filter('formatTime', function() {
	return function(unix, format) {
		return moment.unix(unix).format(format);
	}
});