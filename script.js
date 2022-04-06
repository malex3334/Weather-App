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
const localClockEl = document.getElementById("local-clock");
const localTimeEl = document.getElementById("local-time-container");
const airPollutionEl = document.getElementById("air-pollution");
const airPollutionContainer = document.getElementById("loader");
const airProgressEl = document.getElementById("air-progress");
const airPollutionIcn = document.getElementById("air-icon");
const testing = document.querySelector(".testing");
const forecastSectionEl = document.getElementById("forecast");
const loader = document.querySelector(".loader");

let lat;
let lon;

let apiKey = "fb574912b0999ba535af23dc7e4332dd";
let units = "metric";

function getWeather(city) {
  // loader animation
  loader.classList.add("show-loader");
  // fetching data
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  )
    .then((response) => {
      if (!response.ok) throw new Error(`error ${response.status}`);
      loader.classList.remove("show-loader");
      return response.json();
    })
    .then((cityData) => {
      lat = cityData[0].lat;
      lon = cityData[0].lon;
      cityName = cityData[0].name;
    })
    .catch((err) => {
      console.log("City not found");
      document.getElementById("input-error").innerHTML =
        "Brak takiego miasta w bazie";
      setTimeout(() => {
        document.getElementById("input-error").innerHTML = "";
      }, 3000);
      return response.json();
    })
    .then(() => {
      // GET WEATHER BASED ON GEOCODE
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      )
        .then((response) => {
          if (!response.ok) throw new Error(`error: ${response.status}`);

          return response.json();
        })
        .then((data) => {
          // DESTRUCTURING OUTPUT

          // const city = data.name;
          const { temp, pressure, humidity, feels_like, temp_max, temp_min } =
            data.main;
          const { speed, deg } = data.wind;
          const { country, sunrise, sunset } = data.sys;
          const icon = data.weather[0].icon;
          const timezone = data.timezone;

          // PRINTING RESULTS TO THE DOM

          tempEl.innerHTML = Math.round(temp) + "&deg;";
          tempFeelEl.innerHTML = Math.round(feels_like) + "&deg;";
          tempMinEl.innerHTML = Math.round(temp_max) + "&deg;";
          tempMaxEl.innerHTML = Math.round(temp_min) + "&deg;";
          nameEl.innerHTML = cityName;
          windtSpeedEl.innerHTML = Math.round(speed) + "m/s";
          windDirEl.style.transform = `rotate(${deg - 45}deg)`;
          pressureEl.innerHTML = pressure + " hPa";
          humEl.innerHTML = humidity + "%";
          conditionsEl.src = `img/${icon}.png`;
          document.body.style.backgroundImage = `url(' https://source.unsplash.com/1200x720/?${cityName}')`;
          countryEl.innerHTML = country;

          // DATES AND TIMEZONES
          const myDate = new Date();
          const newDate = new Date(myDate);
          newDate.setHours(newDate.getHours());

          const sunriseTZ = sunrise + timezone - 3600;
          const sunsetTZ = sunset + timezone - 3600;

          timeConverter(sunriseTZ, sunsetTZ);

          function ticker() {
            const myDate = new Date();
            const newDate = new Date(myDate);
            newDate.setHours(
              myDate.getHours() - myDate.toTimeString().slice(12, 15)
            );

            newDate.setHours(newDate.getHours() + timezone / 60 / 60);

            if (myDate.getHours() !== newDate.getHours()) {
              clockEl.textContent = myDate.toTimeString().slice(0, 8);
              localTimeEl.classList.remove("hide");
              localClockEl.textContent =
                "Local " + newDate.toTimeString().slice(0, 5);
            } else {
              localTimeEl.classList.add("hide");
              clockEl.textContent = myDate.toTimeString().slice(0, 8);
            }
          }

          var myTimer = window.setInterval(ticker, 1000);

          // SET NEW TIMER

          inputValue.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
              window.clearInterval(myTimer);
            } else return;
          });

          submitBtn.addEventListener("click", () => {
            window.clearInterval(myTimer);
          });
        });

      // .catch((err) => {
      //   console.log("City not found");
      //   document.getElementById("input-error").innerHTML =
      //     "Brak takiego miasta w bazie";
      //   setTimeout(() => {
      //     document.getElementById("input-error").innerHTML = "";
      //   }, 3000);
      // });
      // GET AIR POLLUTION DATA
      getAir();
      // RESET FORECAST DIV!
      forecastSectionEl.innerHTML = "";
      // GET FORECAST FUNCTION
      getDailyForecast();
    });
}

//  SUBMIT SEARCH INPUT VIA SEARCH BUTTON

submitBtn.addEventListener("click", () => {
  document.getElementById("input-error").innerHTML = "";
  cityName = inputValue.value;
  getWeather(cityName);
});

//  SUBMIT SEARCH INPUT VIA ENTER KEY

inputValue.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    document.getElementById("input-error").innerHTML = "";
    cityName = inputValue.value;
    getWeather(cityName);
  } else return;
});

document
  .getElementById("forecast-details-btn--left")
  .addEventListener("click", () => {
    document.getElementById("details").classList.toggle("hide-details");
    forecastSectionEl.classList.toggle("hide-forecast");
  });

document
  .getElementById("forecast-details-btn--right")
  .addEventListener("click", () => {
    document.getElementById("details").classList.toggle("hide-details");
    forecastSectionEl.classList.toggle("hide-forecast");
  });

let cityName = "";
getWeather("wroclaw");

// GET CEOLOCATION BY INPUTET

function getAir() {
  fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((airData) => {
      const airPollution = airData.list[0].main.aqi;
      if (airPollution === 1) {
        airProgressEl.style.width = "10%";
        airProgressEl.style.backgroundColor = "green";
        airPollutionIcn.name = "happy";
      }
      if (airPollution === 2) {
        airProgressEl.style.width = "40%";
        airProgressEl.style.backgroundColor = "yellow";
        airPollutionIcn.name = "happy";
      }
      if (airPollution === 3) {
        airProgressEl.style.width = "60%";
        airProgressEl.style.backgroundColor = "orange";
        airPollutionIcn.name = "sad";
      }
      if (airPollution === 4) {
        airProgressEl.style.width = "80%";
        airProgressEl.style.backgroundColor = "violet";
        airPollutionIcn.name = "sad";
      }
      if (airPollution === 5) {
        airProgressEl.style.width = "100%";
        airProgressEl.style.backgroundColor = "purple";
        airPollutionIcn.name = "skull";
      }
    })
    .catch((err) => {
      console.log("air pollution", err);
    });
}

// FORECAST FUNCTION
function getDailyForecast() {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((forecastData) => {
      let i = 1;
      for (let i = 1; i < 4; i++) {
        const { day, night } = forecastData.daily[i].temp;
        const { icon } = forecastData.daily[i].weather[0];
        const forecastDay = new Date(forecastData.daily[i].dt * 1000);
        const forecastDayString = forecastDay.toString().slice(4, 11);
        const dayOfWeek = forecastDay.toString().slice(0, 3);
        const htmlTemplate = `
        <div id="forecast-single" class="forecast-day">
          <h4 class="forecast-title">${forecastDayString}</h4>
          <h5 class="forecast-subtlite">${dayOfWeek}</h5>
          <img src="./img/${icon}.png" id="conditions" class="img forecast"></img>
          <div class="forecast-temp">
            <ion-icon id="sunny-icn"  class="forecast-icon-small" name="sunny"></ion-icon>
            <div id='forecast-day' class="sunrise">${Math.floor(day)}&deg;</div>
            <ion-icon id="sunset-icn" class="forecast-icon-small"  name="moon"></ion-icon>
            <div id='forecast-night' class="sunset">${Math.floor(
              night
            )}&deg;</div>
          </div>
        </div>
        `;

        forecastSectionEl.innerHTML += htmlTemplate;
      }
    })
    .then(() => {
      // loader remover
      loader.classList.remove("show-loader");
    });
}

// TIME FORMAT

const msToHMS = function (duration) {
  var miliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration * 60 * 60) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
};

// SUNRISE CONVERTER
const timeConverter = function (sunrise, sunset) {
  let date = new Date((sunrise - 3600) * 1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let formattedSunrise = `${hours}:${minutes.substr(-2)}`;
  let dateTwo = new Date((sunset - 3600) * 1000);
  let hoursTwo = dateTwo.getHours();
  let minutesTwo = "0" + dateTwo.getMinutes();
  let formattedSunset = `${hoursTwo}:${minutesTwo.substr(-2)}`;

  sunriseEl.innerHTML = formattedSunrise;
  sunsetEl.innerHTML = formattedSunset;
};
