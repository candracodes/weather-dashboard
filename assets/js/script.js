// Define HTML elements as variables to reference later:
var storedCityLiEl = document.getElementById("city-result-list-item");
var todaysForecastContainerEl = document.getElementById("todays-forecast-container");
var weatherCardContainerEl = document.getElementById("weather-card-container");
var weatherCardEl = document.getElementById("weather-card");

/* ================================================================================== */

// My Unique OpenWeather API Key for homework-6: e5e3b0ace283e06f86b26937890c837a

// Define the API key into a variable:
var openWeatherAPIKey = "e5e3b0ace283e06f86b26937890c837a";

// Create variables for API calls to use for user input and local storage:
var city = "";
var previousCity;

// DISPLAY TODAY'S DATE
// DISPLAY THE DATE
var todaysDate = $("#todays-forecast-date");

function displayCurrentDate() {
  var rightNow = moment().format('MMM DD, YYYY');
  todaysDate.text(rightNow);
}
displayCurrentDate();

/* ================================================================================== */

// 1. getRequestedCity() | Create a function that takes value of user entered city, and utilizes previously city variable
var getRequestedCity = function (city) {
  city = $(".search-input").val();
  console.log("City value = " + city);

  // HOW TO CONSTRUCT A QUERY URL IN OPENWEATHER:
  // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key};

  // SAMPLE CITY QUERY:
  // http://api.openweathermap.org/data/2.5/weather?q=dallas&appid=e5e3b0ace283e06f86b26937890c837a

  // TODO: THIS QUERY ACTUALLY HAS UV INDEX, BUT HOW DO I CROSS-REFERENCE?:
  // https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid={API key}

  // Define a variable that constructs a query URL to make the API call based on city name:
  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + openWeatherAPIKey;

  var uviURL = "";

  // Make API call using fetch  
  fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);

          // Display the City <H2>
          $("#city-result-h2").text(data.name);

          // To define an icon, you need to create a URL constructed like this => http://openweathermap.org/img/wn/10d@2x.png
          // Create variable to construct icon URL
          var imgIcon = "<img class='todays-icon' src='http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png' />";
          // DISPLAY ICON with imgIcon variable
          $("#todays-forecast-ul").append("<li>" + imgIcon + "</li>");

          // To display the temperature, the results are in a format called "Kelvin" and needs to be converted with a formula
          // Convert Kelvin to Fahrenheit:
          // (K − 273.15) × 9/5 + 32 = °F. (where K is the value the computer initially spews)

          // DISPLAY TEMPERATURE
          $("#todays-forecast-ul").append("<li>Temp: " + Math.floor(((data.main.temp - 273.15) * 9 / 5 + 32)) + "° </li>");
          // DISPLAY WIND SPEED
          $("#todays-forecast-ul").append("<li>Wind: " + data.wind.speed + " mph</li>");
          // DISPLAY HUMIDITY
          $("#todays-forecast-ul").append("<li>Humidity: " + data.main.humidity + "%</li>");

          // TODO: UV Index is not a key in the queryURL parameter, so I have to use another endpoint to produce this

          // TODO: Stop this function from concatenating additional UL elements after the search button is clicked. It should only display one result

        });
      } else {
        // Error handling for errors that are number based like 404, 505, etc
        alert('Error: ' + response.statusText);
      }
    })
    // Error handling if the error is anything other than the numbered responses
    .catch(function (error) {
      alert('Unable to locate city');
    });
};

// 2. getFiveDayForecast() | Create a function that displays the 5 day forecase of the requested city
function getFiveDayForecast() {
  console.log("getFiveDayForecast function triggered");
}

// 3. storePreviousCities() | Create a function that stores previously searched city results, makes it an <a>, and, if clicked, replaces the today's forecast and 5 day forecast with chosen city
function storePreviousCities() {
  console.log("storePreviousCities function triggered");
}

// 4. clearPreviousCities() | Create a function that clears the results of the previously searched cities
function clearPreviousCities() {
  console.log("clearPreviousCities function triggered");
}

// 5. Add event listener for search button
$("#search-btn").on("click", function () {
  console.log("Search Button triggered");
  getRequestedCity();
  getFiveDayForecast();

});

// 6. Add event listener for clear button
$("#clear-btn").on("click", function () {
  // CLEAR TODAY'S FORECAST
  document.getElementById('todays-forecast-ul').innerHTML='';
  //CLEAR THE CITY <H2>
  document.getElementById('city-result-h2').innerHTML='';
  localStorage.clear();
});
