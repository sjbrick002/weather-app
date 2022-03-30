const countryInput = document.querySelector(".country-selection");
const stateLabel = document.querySelector("label[for='state']");
const stateInput = document.querySelector(".state-selection");
const cityInput = document.querySelector(".city-input");
const button = document.querySelector("button");
const k = "cbef1da7b0112adb5da24e3be58bc728";

let country;
let state;
let city;

let temperature;
let weatherDescription;
let windSpeed;
let humidity;
let sunrise;
let sunset;

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

button.addEventListener("click", retrieveWeatherInfo);

function retrieveLocationCoordinates(cityInput, stateInput, countryInput) {
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}${!stateInput ? "" : `,${stateInput}`},${countryInput}&appid=${k}`)
        .then(response => response.json())
        .catch(err => console.error(err));
};

async function retrieveWeatherInfo() {
    try {
        const coordinateInfo = await retrieveLocationCoordinates(cityInput.value, stateInput.value, countryInput.value);
        country = coordinateInfo[0].country;
        state = coordinateInfo[0].state;
        city = coordinateInfo[0].name;
        console.log(`${city}, ${state}, ${country}`);
        const weatherApiResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinateInfo[0].lat}&lon=${coordinateInfo[0].lon}&appid=${k}`);
        const weatherInfo = await weatherApiResponse.json();
        temperature = weatherInfo.main.temp;
        weatherDescription = weatherInfo.weather[0].description;
        windSpeed = weatherInfo.wind.speed;
        humidity = weatherInfo.main.humidity;
        sunrise = weatherInfo.sys.sunrise;
        sunset = weatherInfo.sys.sunset;
        console.log(`Temp: ${temperature}, Weather: ${weatherDescription}, Wind Speed: ${windSpeed}, Humidity: ${humidity}, Sunrise: ${sunrise}, Sunset: ${sunset}`);
    } catch {
        err => console.error(err);
    };
};

function processTemperature(temperature) {
    let celsius = temperature - 273.15;
    let fahrenheit = ((celsius * 9) / 5) + 32;
    return [`${celsius}`, `${fahrenheit}`];
};

function processWeatherDescription(weatherDescription) {
    let descriptionArray = weatherDescription.split("");
    descriptionArray = descriptionArray.map((letter, index) => (index === 0 || descriptionArray[index - 1] === " ") ? letter.toUpperCase() : letter.toLowerCase());
    descriptionString = descriptionArray.join("");
    return descriptionString;
};

function processWindSpeed(windSpeed) {
    let metersPerSec = windSpeed;
    let milesPerHour = (windSpeed / 1609.34) * 3600;
    return [`${metersPerSec}`, `${milesPerHour}`];
};

function processTime(seconds) {
    let time = new Date();
    time.setTime(seconds * 1000);
    let hour =  time.getHours() + 1;
    let modifiedHour = (hour < 13) ? hour : hour - 12;
    let minutes = time.getMinutes();
    let timeIndicator = (hour < 13) ? "AM" : "PM";
    console.log(seconds);
    console.log(`${modifiedHour}:${minutes} ${timeIndicator}`);
};