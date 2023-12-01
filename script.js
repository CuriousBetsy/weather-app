"use strict";
// Отрисовка погоды по запросу из формы
document.querySelector("header form").addEventListener("submit", function (e) {
  e.preventDefault();
  // console.log(typeof this.querySelector("input").value);
  document.querySelector(".main-container").remove();
  getWeatherFromCity(this.querySelector("input").value);
  document.querySelector(".country").style.fontSize = "60px";
});

// При загрузке страницы код сразу получает геоданные из браузера и вызывает функцию, которая отрисовывает погоду для нынешней локации
navigator.geolocation.getCurrentPosition(
  (position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        getWeatherFromCity(data.address.city || data.address.town);
      });
  },
  () => {
    console.log("Failed to get the location");
  }
);

// функция, которая вытаскивает погоду с сервера
async function getWeatherFromCity(city, days = 2) {
  let x = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=314c348aacb744639aa165431232111&q=${city}&days=${days}&aqi=yes&alerts=no`
  );
  console.log(x);
  x = await x.json();
  console.log(x);
  let w = {
    // w for weather
    city: x.location.name,
    country: x.location.country,
    icon: x.current.condition.icon,
    iconDescription: x.current.condition.text,
    temp: x.current.temp_c,
    tempFeelsLike: x.current.feelslike_c,
    humidity: x.current.humidity,
    cloud: x.current.cloud,
    windSpeed: x.current.wind_kph,
    windDirection: x.current.wind_dir,
    sunrise: x.forecast.forecastday[0].astro.sunrise,
    sunset: x.forecast.forecastday[0].astro.sunset,
    moonrise: x.forecast.forecastday[0].astro.moonrise,
    moonset: x.forecast.forecastday[0].astro.moonset,
    airQuality: x.current.air_quality["us-epa-index"],
  };

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="main-container">
    <div class="temp-and-location border">
    <img
    class="icon"
    src="${w.icon}"
    />
    <p class="country">${w.country}</p>
    <p class="city">${w.city}</p>
    <p class="current-temp">Current temperature: ${w.temp}C</p>
    <p class="feels-like">Feels like: ${w.tempFeelsLike}C</p>
    </div>
    
    <div class="additional-data border">
    <p>Humidity: ${w.humidity}%</p>
    <p>Cloud: ${w.cloud}%</p>
    <p>Wind speed: ${w.windSpeed}km/h</p>
    <p>Wind direction: ${w.windDirection}</p>
    <p>Air quality: 1</p>
    </div>
    <div class="sun-moon border">
    <p>Sunrise: ${w.sunrise}</p>
    <p>Sunset: ${w.sunset}</p>
    <p>Moonrise: ${w.moonrise}</p>
    <p>Moonset : ${w.moonset}</p>
    </div>
    <div class="tf-hours-wrapper">
    <div class="tf-hours border">
    </div>
    </div>
    </div>
    </div>
    `
  );
  tfHours(x.forecast.forecastday).forEach((hour) => {
    document.querySelector(".tf-hours").insertAdjacentHTML(
      "beforeend",
      `
      <div class="hour">
          <img src="https:${hour.condition.icon}" />
          <p class="temp">${Math.round(hour.temp_c)}C</p>
          <p class="time">${hour.time.slice(-5)}</p>
        </div>
      `
    );
  });

  if (w.country.length > 7) {
    document.querySelector(".country").style.fontSize = "30px";
  }
}

// FUNCTION THAT CREATES AN ARRAY OF THE NEXT 24 hours;
function tfHours(forecastday) {
  let arr = [];
  //forecast day is the array of days with full 24 hours forecasts
  for (let i = new Date().getHours(); i < 24; i++) {
    arr.push(forecastday[0].hour[i]);
  }
  for (let i = 0; arr.length < 24; i++) {
    arr.push(forecastday[1].hour[i]);
  }
  console.log(arr);
  return arr;
}
