weatherApp.filter("icon", function() {
	//convert weather data object to icon
	return function (current) {
		if (typeof(current) !== "object") return;
		if (current === {}) return "sun";
		//Create list for icon
		var icon = [];
		//Check precip type and that probability is above 50%
		if (current.precipType && current.precipProbability > 0.5) {
			//GUYS IT'S RAINING
			if (current.precipType === "rain") {
				//Check intensity of the rain
				if (current.precipIntensity >= 0.4) {
					icon.push("downpour");
				} else if (current.precipIntensity >= 0.1) {
					icon.push("rain");
				} else if (current.precipIntensity >= 0.017) {
					icon.push("showers");
				} else {
					icon.push("drizzle");
				}
			//Handle snow
			} else if (current.precipType === "snow") {
				if (current.precipIntensity >= 0.1) {
					icon.push("snow");
				} else {
					icon.push("flurries");
				}
			//If anything else
			} else {
				icon.push(current.precipType);
			}
		//Check for other less important weather things
		} else {
			//fog (in miles)
			//definition https://en.wikipedia.org/wiki/Visibility#Fog.2C_mist.2C_and_haze
			if (current.visibility <= 0.625) {
				icon.push("fog");
			//haze (in miles)
			} else if (current.visiblity <= 3.1) {
				icon.push("haze");
			//Check wind (mph)
			} else if (current.windSpeed >= 25) {
				icon.push("wind");
			}
		}
		//Check if completely cloudy
		if (current.cloudCover >= 0.75) {
			icon.push("cloud");
		} else {
			//Check if partially cloudy
			if (current.cloudCover >= 0.25) {
				icon.push("cloud")
			}
			//Check the time of day
			//Past sunset or before sunrise. Only allow the moon on days that are "today"
			if (moment().diff(current.time, "days") === 0 && (moment().isAfter(current.sunsetTime) || moment().isBefore(current.sunriseTime))) {
				icon.push("moon");
			} else {
				icon.push("sun");
			}
		}
		//Return the list as a string
		return icon.join(" ");
	}
});