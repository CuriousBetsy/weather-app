"use strict";

navigator.geolocation.getCurrentPosition(
  (position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data.address.town);
        getWeatherFromCity(data.address.town, 1);
      });
  },
  () => {
    "Failed to get the location";
  }
);

async function getWeatherFromCity(city, days) {
  let x = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=314c348aacb744639aa165431232111&q=${city}&days=${days}&aqi=yes&alerts=no`
  );
  x = await x.json();
  console.log(x);
  console.log(x.current);
  let w = {
    // w for weather
    icon: x.current.condition.icon,
    iconDescription: x.current.condition.text,
    temp: x.current.temp_c,
    tempFeelsLike: x.current.feelslike_c.address,
    humidity: x.current.humidity,
    cloud: x.current.cloud,
    sunrise: x.forecast.forecastday[0].astro.sunrise,
    sunset: x.forecast.forecastday[0].astro.sunset,
    moonrise: x.forecast.forecastday[0].astro.moonrise,
    moonset: x.forecast.forecastday[0].astro.moonset,
    airQuality: x.current.air_quality["us-epa-index"],
  };
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <img src="${w.icon}">
    <div>${w.iconDescription}</div>
    <br>
    <div>Current temperature: ${w.temp}℃</div>
    <div>Feels like: ${w.tempFeelsLike}℃</div>
    <div>Humidity: ${w.humidity}</div>
    <div>Cloud: ${w.cloud}%</div>
    <br>
    <div>Sunrise: ${w.sunrise}</div>
    <div>Sunset: ${w.sunset}</div>
    <div>Moonrise: ${w.moonrise}</div>
    <div>Moonset : ${w.moonset}</div>
    <br>
    <div>Air quality: ${x.current.air_quality["us-epa-index"]}</div>
    `
  );
}
