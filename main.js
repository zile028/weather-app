/* selector */
let city = document.getElementById("citySearch");

// let urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;
let urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=beograd&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;

let urlWeatherOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=92fe8ed71d6c96ecf7fa577cadb248f5`;

city.addEventListener("keyup", autoComplite);
city.addEventListener("focusout", findCity);

function autoComplite(e) {
  if (e.code === "Enter") {
    let cityName = city.value;
    urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=92fe8ed71d6c96ecf7fa577cadb248f5&units=metric`;
    sendRequest();
  } else {
    // console.log(city.value);
  }
}

function findCity() {}

function sendRequest() {
  let xml = new XMLHttpRequest();
  xml.open("GET", urlWeatherCurrent);
  xml.onreadystatechange = function () {
    if (xml.readyState === 4 && xml.status === 200) {
      getData(JSON.parse(xml.response));
    }
  };
  xml.send();
}

function getData(data) {
  console.log(data);
}
