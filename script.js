"use strict";
// Отрисовка погоды по запросу из формы
document.querySelector("header form").addEventListener("submit", function (e) {
  e.preventDefault();
  // console.log(typeof this.querySelector("input").value);
  getWeatherFromCity(this.querySelector("input").value);
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
    `http://api.weatherapi.com/v1/forecast.json?key=314c348aacb744639aa165431232111&q=${city}&days=${days}&aqi=yes&alerts=no`
  );
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
    <div>
    <div>${w.country}, ${w.city}</div>
    <img src="${w.icon}">
    <div>${w.iconDescription}</div>
    <br>
    <div>Current temperature: ${w.temp}℃</div>
    <div>Feels like: ${w.tempFeelsLike}℃</div>
    <div>Humidity: ${w.humidity}</div>
    <div>Cloud: ${w.cloud}%</div>
    <div>Wind speed: ${w.windSpeed}km/h</div>
    <div>Wind direction: ${w.windDirection}</div>
    <br>
    <div>Sunrise: ${w.sunrise}</div>
    <div>Sunset: ${w.sunset}</div>
    <div>Moonrise: ${w.moonrise}</div>
    <div>Moonset : ${w.moonset}</div>
    <br>
    <div>Air quality: ${x.current.air_quality["us-epa-index"]}</div>
    <br>
    <br>
    `
  );
}
