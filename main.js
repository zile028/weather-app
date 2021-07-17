// let urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;
// let urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=beograd&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;
/* 
https://locationiq.com
https://us1.locationiq.com/v1/reverse.php?key=pk.70d9619acb05266ad971e957f023fea1&lat=42.894453239952774&lon=20.869329696608226&format=json
*/

/* selector */
let city = document.getElementById("citySearch");
let btnMyLocation = document.getElementById("myLocation");
let toDayResult = document.querySelector(".current");
// let singleDetail = toDayResult.querySelector(".details");
let btnToDay = document.getElementById("btnToDay");
let btnHourly = document.getElementById("btnHourly");
let myPosition = {};
let cityName = "";
let currentResult = [];
let hourlyWeeklyResult = [];

function getMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {
  myPosition = {
    lat: position.coords.latitude,
    log: position.coords.longitude,
  };
  console.log(myPosition);
}

btnMyLocation.addEventListener("click", getMyLocation);
btnToDay.addEventListener("click", toDayWeather);
// btnHourly.addEventListener("click", toHourlyWeather);
city.addEventListener("keyup", autoComplite);
city.addEventListener("focusout", findCity);

function toDayWeather() {
  cityName = city.value;
  currentDay(cityName);
  cityName = cityName.toLowerCase();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  city.value = cityName;
}

function autoComplite(e) {
  if (e.code === "Enter") {
  } else {
  }
}

function findCity() {}

function currentDay(cityName) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=92fe8ed71d6c96ecf7fa577cadb248f5&units=metric`;
  let xml = new XMLHttpRequest();
  xml.open("GET", url);
  xml.onreadystatechange = function () {
    if (xml.readyState === 4 && xml.status === 200) {
      currentResult = JSON.parse(xml.response);
      displaySingleresult(currentResult);
    }
  };
  xml.send();
}
function hourlyWeekly(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=92fe8ed71d6c96ecf7fa577cadb248f5&units=metric&lang=sr`;
  let xml = new XMLHttpRequest();
  xml.open("GET", url);
  xml.onreadystatechange = function () {
    if (xml.readyState === 4 && xml.status === 200) {
      hourlyWeeklyResult = JSON.parse(xml.response);
    }
  };
  xml.send();
}

/******************************************************
TO DAY WEATHER 
*******************************************************/
function displaySingleresult(data) {
  let mainData = data["main"];
  let wind = data["wind"];
  let sys = data["sys"];
  let temp = Math.round(mainData["temp"]);
  let tempMax = Math.round(mainData["temp_max"]);
  let tempMin = Math.round(mainData["temp_min"]);
  let times = new CurrentTime();
  let sunrise = utcToLocalTime(sys["sunrise"]);
  let sunset = utcToLocalTime(sys["sunset"]);
  let text = `<div class="singleResult d-flex flex-column justify-content-center">`;
  text += `<h2>${temp}C&deg;<img src="http://openweathermap.org/img/wn/${data["weather"]["0"]["icon"]}@2x.png" alt=""></h2>`;
  text += `<h4><span class="day">${tempMax}C&deg;</span>/<span class="night">${tempMin}C&deg;</span></h4>`;
  text += `<p>My time: ${times.times.myTime}</p>`;
  text += `<p>${cityName} time: ${times.times.cityTime}</p>`;
  text += `</div>`; //end singleResult
  text += `<div class="details row justify-content-between align-items-center">`;
  text += `<ul class="col-6">`;
  text += `<li>Feels like: ${mainData["feels_like"]}C&deg</li>`;
  text += `<li>Pressure: ${mainData["pressure"]}hPa</li>`;
  text += `<li>Humidity: ${mainData["humidity"]}%</li>`;
  text += `<li>Visibility: ${data["visibility"]}m</li>`;
  text += `</ul>`;
  text += `<ul class="col-6">`;
  text += `<li>Wind speed: ${wind["speed"]}m/s</li>`;
  text += `<li>Wind direction: ${wind["deg"]}&deg</li>`;
  text += `<li>Sunrise: ${sunrise}h</li>`;
  text += `<li>Sunset: ${sunset}h</li>`;
  text += `</ul>`;

  text += `</div>`; //end details

  toDayResult.innerHTML = text;

  getLocation();

  let lat = data["coord"]["lat"];
  let lon = data["coord"]["lon"];
  // hourly(lat, lon);
}

function utcToLocalTime(ts) {
  let date = new Date(ts * 1000);
  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let formattedTime = hours + ":" + minutes;
  return formattedTime;
}

function CurrentTime() {
  this.date = new Date();
  this.myTimeZone = this.date.getTimezoneOffset() * 60;
  this.cityTimeZone = currentResult["timezone"];
  this.diference = (this.cityTimeZone + this.myTimeZone) / 3600;
  this.times = {
    myTime: this.date.toLocaleTimeString().slice(0, -3),
    cityTime:
      this.date.getHours() + this.diference + ":" + this.date.getMinutes(),
  };
}
