/* selector */
let city = document.getElementById("citySearch");
let singleResult = document.querySelector(".singleResult");
let btnToDay = document.getElementById("btnToDay");
let currentResult = [];
let hourlyWeeklyResult = [];
// let urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;
// let urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=beograd&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;

let urlWeatherOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;

btnToDay.addEventListener("click", toDayWeather);
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

  let lat = data["coord"]["lat"];
  let lon = data["coord"]["lon"];
  // hourly(lat, lon);
}
