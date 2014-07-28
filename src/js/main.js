var weatherApp = angular.module('weatherApp', ['ngResource', 'ngAnimate', 'ngTouch']);

weatherApp.constant("errors", {
	geo: {
		unsupported: "Your browser does not support geolocation, try entering an address.",
		permission: "You denied access to your location.",
		unavailable: "Unable to find you.",
		timeout: "Finding your location timed out."
	},
	network: "Could not load the weather. Please check your network connection and try again later.",
	storage: "Your browser does not support local storage. We can't save your settings and the app will not work."
});
weatherApp.constant("units", {
	us: {
		speed: "mph",
		distance: "miles",
		temperature: "Fahrenheit",
	},
	si: {
		speed: "kph",
		distance: "kilometers",
		temperature: "Celsius",
	}
});