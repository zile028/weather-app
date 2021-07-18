/******************************************************
                    SELECTORS 
*******************************************************/
let city = document.getElementById("citySearch");
let main = document.querySelector(".main");
let btnMyLocation = document.getElementById("myLocation");
let toCurrentDiv = document.querySelector(".current");
let toSingleDiv = document.querySelector(".singleResult");
let toDetailsDiv = document.querySelector(".details");
let toHourlyDiv = document.querySelector(".hourly");
let toDailyDiv = document.querySelector(".daily");
let myPosition = {};
let cityName = "";
let currentResult = [];
let hourlyWeeklyResult = [];

/******************************************************
                    LISTENERS 
*******************************************************/

window.addEventListener("wheel", scrolling);
window.onload = getMyLocation();
btnMyLocation.addEventListener("click", getMyLocation);
city.addEventListener("keyup", getCityWeather);

/******************************************************
                  MOVMENT FUNCTION 
*******************************************************/

function scrolling(e) {
  if (e.deltaY > 0) {
    main.scrollTop += 100;
  } else {
    main.scrollTop -= 100;
  }
}

/******************************************************
                  INPUT FUNCTION 
*******************************************************/

function getCityWeather(e) {
  if (e.keyCode === 13) {
    toDayWeather();
  }
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
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=92fe8ed71d6c96ecf7fa577cadb248f5&units=metric`;
  let xml = new XMLHttpRequest();
  xml.open("GET", url);
  xml.onreadystatechange = function () {
    if (xml.readyState === 4 && xml.status === 200) {
      hourlyWeeklyResult = JSON.parse(xml.response);
      hourlyWeather(hourlyWeeklyResult);
      dailyWeather(hourlyWeeklyResult);
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
  cityName = formatCityName(city.value);
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
  text += `<h4><span class="day">${tempMax}C&deg;</span><span class="night">/${tempMin}C&deg;</span></h4>`;
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
  let textHTML = `<div class="col-6">`;

  for (let i = 0; i < 24; i++) {
    let allData = {
      time: utcToLocalTime(hourlyArray[i]["dt"]) + "h",
      temp: Math.ceil(hourlyArray[i]["temp"]) + "C&deg;",
      desc: hourlyArray[i]["weather"][0]["description"],
      icon: `<img src="http://openweathermap.org/img/wn/${hourlyArray[i]["weather"][0]["icon"]}.png" alt="">`,
    };
    if (i === 12) {
      textHTML += `</div>`;
      textHTML += `<div class="col-6">`;
    }
    textHTML += `<div class="item d-flex justify-content-start align-items-center ">`;
    textHTML += `${allData["icon"]}`;
    textHTML += `<div>`;
    textHTML += `<h5>${allData["time"]}</h5>`;
    textHTML += `<h3>${allData["temp"]}</h3>`;
    textHTML += `<p>${allData["desc"]}</p>`;
    textHTML += `</div>`;
    textHTML += `</div>`;
  }
  textHTML += `</div>`;
  toHourlyDiv.innerHTML = textHTML;
}

/******************************************************
                    DAILY WEATHER
*******************************************************/

function dailyWeather(data) {
  let dailyArray = data["daily"];
  let i = 0;

  let textHTML = `<div class="row no-gutters justify-content-around">`;
  dailyArray.shift();
  dailyArray.forEach((day) => {
    let allData = {
      dName: new UTCtoLocal(day["dt"]).dayName(),
      mornT: "Morning: " + day["temp"]["morn"] + "C&deg;",
      dayT: "Day: " + day["temp"]["day"] + "C&deg;",
      eveT: "Evening: " + day["temp"]["eve"] + "C&deg;",
      nightT: "Night: " + day["temp"]["night"] + "C&deg;",
      minT: "Min daily: " + day["temp"]["min"] + "C&deg;",
      maxT: "Max daily: " + day["temp"]["max"] + "C&deg;",
      desc: day["weather"][0]["description"],
      icon: `<img src="http://openweathermap.org/img/wn/${dailyArray[i]["weather"][0]["icon"]}.png" alt="">`,
    };

    textHTML += `<div class="col-12 row no-gutters align-items-center">`;
    textHTML += `${allData["icon"]}`;
    textHTML += `<h3>${allData["dName"]} - <span>${allData["desc"]}</span></h3>`;
    textHTML += `</div>`;
    textHTML += `<ul class="col-md-3">`;
    textHTML += `<li>${allData["mornT"]}</li>`;
    textHTML += `<li>${allData["dayT"]}</li>`;
    textHTML += `</ul>`;
    textHTML += `<ul class="col-md-3">`;
    textHTML += `<li>${allData["eveT"]}</li>`;
    textHTML += `<li>${allData["nightT"]}</li>`;
    textHTML += `</ul>`;
    textHTML += `</ul>`;
    textHTML += `<ul class="col-md-3">`;
    textHTML += `<li>${allData["minT"]}</li>`;
    textHTML += `<li>${allData["maxT"]}</li>`;
    textHTML += `</ul>`;
  });
  textHTML += `</div>`;

  toDailyDiv.innerHTML = textHTML;
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
      cityName = currentResult["name"];
      displaySingleresult(currentResult);
      fullWeather(currentResult["coord"]["lat"], currentResult["coord"]["lon"]);
      city.value = cityName;
    }
  };
  xml.send();
}

/******************************************************
              FUNCTION FOR FORMATING DATA
*******************************************************/
function formatCityName(name) {
  let newName = "";
  let arrName = name.split(" ");
  arrName.forEach((word) => {
    word.toLowerCase();
    word = word.charAt(0).toUpperCase() + word.slice(1);
    newName += word + " ";
  });

  return newName.trim();
}
function utcToLocalTime(ts) {
  let date = new Date(ts * 1000);
  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let formattedTime = hours + ":" + minutes;
  return formattedTime;
}

function UTCtoLocal(ts) {
  this.date = new Date(ts * 1000);
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
  this.times = this.hours + ":" + this.minutes;
  this.dayNum = this.date.getDay();
  this.dayName = function () {
    let dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayNames[this.dayNum];
  };
  this.dayDate = this.date.getDate();
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
