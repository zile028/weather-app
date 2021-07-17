// let urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;
// let urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=beograd&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;
/* 
https://locationiq.com
https://us1.locationiq.com/v1/reverse.php?key=pk.70d9619acb05266ad971e957f023fea1&lat=42.894453239952774&lon=20.869329696608226&format=json
*/

/******************************************************
                    SELECTORS 
*******************************************************/
let city = document.getElementById("citySearch");
let btnMyLocation = document.getElementById("myLocation");
let toCurrentDiv = document.querySelector(".current");
let toSingleDiv = document.querySelector(".singleResult");
let toDetailsDiv = document.querySelector(".details");
let toHourlyDiv = document.querySelector(".hourly");
let toDaylyDiv = document.querySelector(".dayly");
let btnToDay = document.getElementById("btnToDay");
let btnHourly = document.getElementById("btnHourly");
let myPosition = {};
let cityName = "";
let currentResult = [];
let hourlyWeeklyResult = [];

/******************************************************
                    LISTENERS 
*******************************************************/

btnMyLocation.addEventListener("click", getMyLocation);
btnToDay.addEventListener("click", toDayWeather);
btnHourly.addEventListener("click", toHourlyWeather);
city.addEventListener("keyup", autoComplite);
city.addEventListener("focusout", findCity);

function autoComplite(e) {
  if (e.code === "Enter") {
  } else {
  }
}

function findCity() {}

function toHourlyWeather(lat, lon) {
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
                  REQUESTT 
*******************************************************/

function currentDay(cityName) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=92fe8ed71d6c96ecf7fa577cadb248f5&units=metric`;
  let xml = new XMLHttpRequest();
  xml.open("GET", url);
  xml.onreadystatechange = function () {
    if (xml.readyState === 4 && xml.status === 200) {
      currentResult = JSON.parse(xml.response);
      displaySingleresult(currentResult);
      fullWeather(currentResult["coord"]["lat"], currentResult["coord"]["lon"]);
    }
  };
  xml.send();
}

function fullWeather(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=92fe8ed71d6c96ecf7fa577cadb248f5&units=metric&lang=sr`;
  let xml = new XMLHttpRequest();
  xml.open("GET", url);
  xml.onreadystatechange = function () {
    if (xml.readyState === 4 && xml.status === 200) {
      hourlyWeeklyResult = JSON.parse(xml.response);
      hourlyWeather(hourlyWeeklyResult);
      daylyWeather(hourlyWeeklyResult);
      // console.log(JSON.parse(xml.response));
    }
  };
  xml.send();
}

/******************************************************
                  TO DAY WEATHER 
*******************************************************/
function toDayWeather() {
  cityName = city.value;
  currentDay(cityName);
  cityName = cityName.toLowerCase();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  city.value = cityName;
}

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

  text = `<h2>${temp}C&deg;<img src="http://openweathermap.org/img/wn/${data["weather"]["0"]["icon"]}@2x.png" alt=""></h2>`;
  text += `<h4><span class="day">${tempMax}C&deg;</span>/<span class="night">${tempMin}C&deg;</span></h4>`;
  text += `<p>My time: ${times.times.myTime}h</p>`;
  text += `<p>${cityName} time: ${times.times.cityTime}h</p>`;
  toSingleDiv.innerHTML = text;

  text = `<ul class="col-6">`;
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
  toDetailsDiv.innerHTML = text;
  //end details
}

/******************************************************
                    HOURLY WEATHER
*******************************************************/
function hourlyWeather(data) {
  let hourlyArray = data["hourly"];
  let textHTML = ``;

  for (let i = 0; i < 24; i++) {
    let allData = {
      time: utcToLocalTime(hourlyArray[i]["dt"]) + "h",
      temp: Math.ceil(hourlyArray[i]["temp"]) + "C&deg;",
      desc: hourlyArray[i]["weather"][0]["description"],
      icon: `<img src="http://openweathermap.org/img/wn/${hourlyArray[i]["weather"][0]["icon"]}.png" alt="">`,
    };

    textHTML += `<div>`;
    textHTML += `<h5>${allData["time"]}</h5>`;
    textHTML += `${allData["icon"]}`;
    textHTML += `<h3>${allData["temp"]}</h3>`;
    textHTML += `<p>${allData["desc"]}</p>`;
    textHTML += `</div>`;
  }

  toHourlyDiv.innerHTML = textHTML;
}

/******************************************************
                    DAYLY WEATHER
*******************************************************/

function daylyWeather(data) {
  let daylyArray = data["daily"];
  let textHTML = ``;
  console.log(daylyArray);
  // for (let i = 0; i < 24; i++) {
  //   let allData = {
  //     time: utcToLocalTime(hourlyArray[i]["dt"]) + "h",
  //     temp: Math.ceil(hourlyArray[i]["temp"]) + "C&deg;",
  //     desc: hourlyArray[i]["weather"][0]["description"],
  //     icon: `<img src="http://openweathermap.org/img/wn/${hourlyArray[i]["weather"][0]["icon"]}.png" alt="">`,
  //   };

  //   textHTML += `<div>`;
  //   textHTML += `<h5>${allData["time"]}</h5>`;
  //   textHTML += `${allData["icon"]}`;
  //   textHTML += `<h3>${allData["temp"]}</h3>`;
  //   textHTML += `<p>${allData["desc"]}</p>`;
  //   textHTML += `</div>`;
  // }

  toDaylyDiv.innerHTML = textHTML;
}

/******************************************************
              WEATHER OF MY LOCATION
*******************************************************/

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
    lon: position.coords.longitude,
  };
  let url = `http://api.openweathermap.org/data/2.5/weather?lat=${myPosition["lat"]}&lon=${myPosition["lon"]}&appid=92fe8ed71d6c96ecf7fa577cadb248f5&units=metric`;
  let xml = new XMLHttpRequest();
  xml.open("GET", url);
  xml.onreadystatechange = function () {
    if (xml.readyState === 4 && xml.status === 200) {
      currentResult = JSON.parse(xml.response);
      displaySingleresult(currentResult);
      city.value = currentResult["name"];
    }
  };
  xml.send();
}

/******************************************************
              FUNCTION FOR FORMATING DATA
*******************************************************/

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
  this.formatTime = function () {
    if (this.date.getHours() + this.diference < 10) {
      this.hours = "0" + this.date.getHours();
    } else {
      this.hours = this.date.getHours();
    }
    if (this.date.getMinutes() < 10) {
      this.minutes = "0" + this.date.getMinutes();
    } else {
      this.minutes = this.date.getMinutes();
    }
  };
  this.formatTime();
  this.times = {
    myTime: this.date.toLocaleTimeString().slice(0, -3),
    cityTime: this.hours + ":" + this.minutes,
  };
}
