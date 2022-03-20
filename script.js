"use strict";
const inputValue = document.getElementById("input-value");
const submitBtn = document.getElementById("submit");
const tempEl = document.getElementById("temp");
const tempFeelEl = document.getElementById("feel");
const tempMinEl = document.getElementById("min");
const tempMaxEl = document.getElementById("max");
const nameEl = document.getElementById("city");
const windtSpeedEl = document.getElementById("wind-speed");
const windDirEl = document.getElementById("wind-dir");
const pressureEl = document.getElementById("pressure");
const conditionsEl = document.getElementById("conditions");
const humEl = document.getElementById("humidity");
const countryEl = document.getElementById("country");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const clockEl = document.getElementById("clock");

let apiKey = "fb574912b0999ba535af23dc7e4332dd";

let units = "metric";

function getWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // return;
      const city = data.name;
      const { name, temp, pressure, humidity, feels_like, temp_max, temp_min } =
        data.main;
      const { gust, speed, deg } = data.wind;
      const { country, sunrise, sunset } = data.sys;
      const icon = data.weather[0].icon;
      const timezone = data.timezone;
      const processedName = data.name;
      const sunriseTZ = sunrise + timezone;
      const sunsetTZ = sunset + timezone;
      console.log(timezone);

      tempEl.innerHTML = Math.round(temp) + "&deg;";
      tempFeelEl.innerHTML = Math.round(feels_like) + "&deg;";
      tempMinEl.innerHTML = Math.round(temp_max) + "&deg;";
      tempMaxEl.innerHTML = Math.round(temp_min) + "&deg;";
      nameEl.innerHTML = city;
      windtSpeedEl.innerHTML = Math.round(speed) + "m/s";
      windDirEl.style.transform = `rotate(${deg - 45}deg)`;
      pressureEl.innerHTML = pressure + " hPa";
      humEl.innerHTML = humidity + "%";
      conditionsEl.src = `img/${icon}.png`;
      document.body.style.backgroundImage = `url(' https://source.unsplash.com/1200x720/?${processedName}')`;
      countryEl.innerHTML = country;

      timeConverter(sunriseTZ, sunsetTZ);
    })

    .catch((err) => {
      console.log("City not found");
      document.getElementById("input-error").innerHTML =
        "Brak takiego miasta w bazie";
      setTimeout(() => {
        document.getElementById("input-error").innerHTML = "";
      }, 3000);
    });
}

let cityName = "";

submitBtn.addEventListener("click", () => {
  document.getElementById("input-error").innerHTML = "";
  cityName = inputValue.value;
  getWeather(cityName);
});

inputValue.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    document.getElementById("input-error").innerHTML = "";
    cityName = inputValue.value;
    getWeather(cityName);
  } else return;
});

countryEl.addEventListener("click", () => {
  document.getElementById("details").classList.toggle("hide");
});

getWeather("wroclaw");

// sunrise & sunset function
const timeConverter = function (sunrise, sunset) {
  let date = new Date((sunrise - 3600) * 1000);
  console.log(date);
  let hours = date.getHours();
  console.log(hours);
  let minutes = "0" + date.getMinutes();
  console.log(minutes);
  // const seconds = "0" + date.getSeconds();
  let formattedSunrise = `${hours}:${minutes.substr(-2)}`;

  sunriseEl.innerHTML = formattedSunrise;

  let dateTwo = new Date((sunset - 3600) * 1000);
  let hoursTwo = dateTwo.getHours();
  let minutesTwo = "0" + dateTwo.getMinutes();
  // const seconds = "0" + date.getSeconds();
  let formattedSunset = `${hoursTwo}:${minutesTwo.substr(-2)}`;

  sunsetEl.innerHTML = formattedSunset;
};
