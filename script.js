const searchSection = document.querySelector(".location-search-section-initial");
const countryInput = document.querySelector(".country-selection");
const stateLabel = document.querySelector("label[for='state']");
const stateInput = document.querySelector(".state-selection");
const cityInput = document.querySelector(".city-input");
const weatherBtn = document.querySelector(".weather-button");

const loadingScreen = document.querySelector(".loading-screen");
const main = document.querySelector("main");
const weatherIcon = document.querySelector(".weather-icon");
const locationStat = document.querySelector(".location-stat");
const conversionBtn = document.querySelector(".conversion-button");
const tempStat = document.querySelector(".temp-stat");
const descriptionStat = document.querySelector(".description-stat");
const windStat = document.querySelector(".windspeed-stat");
const humidityStat = document.querySelector(".humidity-stat");
const sunriseStat = document.querySelector(".sunrise-stat");
const sunsetStat = document.querySelector(".sunset-stat");
const adviceQuote =  document.querySelector("blockquote");
const adviceSpeaker = document.querySelector(".speaker");
const k = "cbef1da7b0112adb5da24e3be58bc728";

const eventListeners = (() => {
    countryInput.addEventListener("input", () => {
        if (countryInput.value === "US") {
            stateLabel.className = "";
            stateInput.className = "state-selection";
        } else {
            stateLabel.className = "invisible";
            stateInput.className = "state-selection invisible";
            stateInput.value = "";
        };
    });
    let weather;
    let unit = 0;
    weatherBtn.addEventListener("click", async function() {
        searchSection.className = "location-search-section";
        loadingScreen.className = "loading-screen";
        weather = await generateWeatherInfo();
        loadingScreen.className = "loading-screen invisible"
        displayWeatherInfo(weather, unit);
    });
    conversionBtn.addEventListener("click", () => {
        unit = (unit === 0) ? 1 : 0;
        conversionBtn.textContent = (unit === 0) ? "Imperial" : "Metric";
        tempStat.textContent = weather.temperature[unit];
        windStat.textContent = `Wind Speed: ${weather.windSpeed[unit]}`;
    });
})();

const processor = (() => {
    function temperature(temperature) {
        let celsius = Math.floor((temperature - 273.15));
        let fahrenheit = Math.floor((((celsius * 9) / 5) + 32));
        return [`${celsius}°C`, `${fahrenheit}°F`];
    };
    function weatherDescription(weatherDescription) {
        let descriptionArray = weatherDescription.split("");
        descriptionArray = descriptionArray.map((letter, index) => (index === 0 || descriptionArray[index - 1] === " ") ? letter.toUpperCase() : letter.toLowerCase());
        descriptionString = descriptionArray.join("");
        return descriptionString;
    };
    function windSpeed(windSpeed) {
        let metersPerSec = windSpeed;
        let milesPerHour = Math.round((windSpeed / 1609.34) * 3600);
        return [`${metersPerSec} m/s`, `${milesPerHour} mph`];
    };
    function time(seconds) {
        let time = new Date();
        time.setTime(seconds * 1000);
        let hour =  time.getHours() + 1;
        let modifiedHour = (hour < 13) ? hour : hour - 12;
        let minutes = time.getMinutes();
        let timeIndicator = (hour < 13) ? "AM" : "PM";
        return `${modifiedHour}:${minutes} ${timeIndicator}`
    };
    return {temperature, weatherDescription, windSpeed, time};
})();

function retrieveLocationCoordinates(cityInput, stateInput, countryInput) {
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}${!stateInput ? "" : `,${stateInput}`},${countryInput}&appid=${k}`, {mode: "cors"})
        .then(response => response.json())
        .catch(err => console.error(err));
};

async function retrieveWeatherInfo(latitude, longitude) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${k}`, {mode: "cors"});
        const data = await response.json();
        return data;
    } catch {
        err => console.error(err);
    };
};

async function generateWeatherInfo() {
    try {
        const coordinateInfo = await retrieveLocationCoordinates(cityInput.value, stateInput.value, countryInput.value);
        let country = coordinateInfo[0].country;
        let state = coordinateInfo[0].state;
        let city = coordinateInfo[0].name;
        console.log(`${city}, ${state}, ${country}`);
        const weatherInfo = await retrieveWeatherInfo(coordinateInfo[0].lat, coordinateInfo[0].lon);
        let weatherClassification = weatherInfo.weather[0].main;
        let temperature = processor.temperature(weatherInfo.main.temp);
        let weatherDescription = processor.weatherDescription(weatherInfo.weather[0].description);
        let windSpeed = processor.windSpeed(weatherInfo.wind.speed);
        let humidity = `${weatherInfo.main.humidity}%`;
        let sunrise = processor.time(weatherInfo.sys.sunrise);
        let sunset = processor.time(weatherInfo.sys.sunset);
        console.log(`Temp: ${temperature[0]} or ${temperature[1]}, Weather: ${weatherDescription}, Wind Speed: ${windSpeed[0]} or ${windSpeed[1]}, Humidity: ${humidity}, Sunrise: ${sunrise}, Sunset: ${sunset}`);
        return {
            location: `${city}, ${state}, ${country}`,
            weatherClassification,
            temperature,
            weatherDescription,
            windSpeed,
            humidity,
            sunrise,
            sunset
        }
    } catch {
        err => console.error(err);
    };
};

function displayWeatherInfo(weather, unit) {
    if (main.className === "invisible") {main.className = ""};
    if (weather.weatherClassification === "Thunderstorm") {
        weatherIcon.setAttribute("src", "./img/images.png");
        weatherIcon.setAttribute("alt", "Painting of a thunderstorm");
        adviceQuote.textContent = "It's storming outside! Let's stay in and read today!";
        adviceSpeaker.textContent = "-Turtle";
    } else if (weather.weatherClassification === "Drizzle" || weather.weatherClassification === "Rain") {
        weatherIcon.setAttribute("src", "./img/6e664d22666e826843cdfefc957b11fe.jpg");
        weatherIcon.setAttribute("alt", "Picture of rain puddle");
        adviceQuote.textContent = "Get your rain gear there are puddles to splash!";
        adviceSpeaker.textContent = "-Otter";
    } else if (weather.weatherClassification === "Snow") {
        weatherIcon.setAttribute("src", "./img/images.png");
        weatherIcon.setAttribute("alt", "Blue nowflake");
        adviceQuote.textContent = "Huddle up! It's cold outside!";
        adviceSpeaker.textContent = "-Penguin";
    } else if (weather.weatherClassification === "Clear") {
        weatherIcon.setAttribute("src", "./img/ryanlerch_simple_sun_motif_preview_57db.png");
        weatherIcon.setAttribute("alt", "Picture of rain puddle");
        adviceQuote.textContent = "The sun is out! Time for a run!";
        adviceSpeaker.textContent = "-Cheetah";
    } else if (weather.weatherClassification === "Clouds") {
        weatherIcon.setAttribute("src", "./img/storm-clouds-jutta-kuss.jpg");
        weatherIcon.setAttribute("alt", "Picture of clouds");
        adviceQuote.textContent = "Looks like a great day for cloud watching!";
        adviceSpeaker.textContent = "-Crow";
    } else {
        weatherIcon.setAttribute("src", "./img/Exclamation Mark.jpg");
        weatherIcon.setAttribute("alt", "Alert icon");
        adviceQuote.textContent = "Be careful! The weather is being weird.";
        adviceSpeaker.textContent = "-Platypus";
    }

    locationStat.textContent = weather.location;
    tempStat.textContent = weather.temperature[unit];
    descriptionStat.textContent = weather.weatherDescription;
    windStat.textContent = `Wind Speed: ${weather.windSpeed[unit]}`;
    humidityStat.textContent = `Humidity: ${weather.humidity}`;
    sunriseStat.textContent = `Sunrise: ${weather.sunrise}`;
    sunsetStat.textContent = `Sunset: ${weather.sunset}`;
};