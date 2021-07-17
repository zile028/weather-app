/* selector */
let city = document.getElementById("citySearch");
let singleResult = document.querySelector(".singleResult");
let btnToDay = document.getElementById("btnToDay");
let btnHourly = document.getElementById("btnHourly");
let currentResult = [];
let hourlyWeeklyResult = [];
// let urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;
// let urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=beograd&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;

let urlWeatherOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;

btnToDay.addEventListener("click", toDayWeather);
btnHourly.addEventListener("click", toHourlyWeather);
city.addEventListener("keyup", autoComplite);
city.addEventListener("focusout", findCity);

function toDayWeather() {
  currentDay(city.value);
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

/* 
function hourly(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily&appid=92fe8ed71d6c96ecf7fa577cadb248f5&units=metric&lang=sr`;
  let xml = new XMLHttpRequest();
  xml.open("GET", url);
  xml.onreadystatechange = function () {
    if (xml.readyState === 4 && xml.status === 200) {
      let datas = JSON.parse(xml.response);
      console.log(JSON.parse(xml.response));
      let dt = datas["hourly"][12]["dt"];
      console.log(dt);
      let date = new Date(dt * 1000);
      console.log(date.getHours());
    }
  };
  xml.send();
} */
function getResult(mode, data) {
  dataResult = data;
  if (mode === current) {
  }
}
function currentTemp() {
  // dataResult = sendRequest("current");
  // console.log(dataResult);
}

function displaySingleresult(data) {
  let temp = Math.round(data["main"]["temp"]);
  let tempMax = Math.round(data["main"]["temp_max"]);
  let tempMin = Math.round(data["main"]["temp_min"]);
  let text = `
  <h2>${temp}C&deg;</h2>
  <h4>
      <span class="day">${tempMax}C&deg;</span>/
      <span class="night">${tempMin}C&deg;</span>
  </h4>
`;
  singleResult.innerHTML = text;

  let dt = data["dt"];
  // console.log(dt);
  // let utcDate = new Date(dt * 1000);
  // console.log(utcDate.getHours() + ":" + utcDate.getMinutes());

  let unix_timestamp = dt;
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  let date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  let hours = date.getHours();
  // Minutes part from the timestamp
  let minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  let seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  let formattedTime =
    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

  console.log(formattedTime);

  let lat = data["coord"]["lat"];
  let lon = data["coord"]["lon"];
  // hourly(lat, lon);
}

function FormatTime(timeStamp) {
  this.ts = timeStamp;
  this.date = new Date(this.ts * 1000);
  this.hours = this.date.getHours;
  this.minutes = this.date.getMinutes;
  this.hours = this.date.getHours;
  this.hours = this.date.getHours;
}

function toHourlyWeather() {
  let unix_timestamp = 1626512243;
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = date.getMinutes();
  // Seconds part from the timestamp
  var seconds = date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime =
    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

  console.log(formattedTime);
}
