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
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <img src="${x.current.condition.icon}">
    <div>${x.current.condition.text}</div>
    <br>
    <div>Current temperature: ${x.current.temp_c}℃</div>
    <div>Feels like: ${x.current.feelslike_c}℃</div>
    <div>Humidity: ${x.current.humidity}</div>
    <div>Cloud: ${x.current.cloud}%</div>
    <br>
    <div>Sunrise: ${x.forecast.forecastday[0].astro.sunrise}</div>
    <div>Sunset: ${x.forecast.forecastday[0].astro.sunset}</div>
    <div>Moonrise: ${x.forecast.forecastday[0].astro.moonrise}</div>
    <div>Moonset : ${x.forecast.forecastday[0].astro.moonset}</div>
    <br>
    <div>Air quality: ${x.current.air_quality["us-epa-index"]}</div>
    `
  );
}
