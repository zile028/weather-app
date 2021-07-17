function CurrentTime() {
  this.date = new Date();
  this.myTimeZone = this.date.getTimezoneOffset() * 60;
  this.cityTimeZone = currentResult["timezone"];
  this.diference = (this.cityTimeZone + this.myTimeZone) / 3600;
  this.times = {
    myTime: this.date.toLocaleTimeString(),
    cityTime:
      this.date.getHours() +
      this.diference +
      ":" +
      this.date.getMinutes() +
      ":" +
      this.date.getSeconds(),
  };
}
