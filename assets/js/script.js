// Define HTML elements as variables to reference later:
// var searchInput = document.getElementById("search-input"); ... I may have a use for this in other functions, so don't delete
var clearButton = document.getElementById("clear-btn");
var storedCityUlEl = document.getElementById("city-result-ul");
var storedCityLiEl = document.getElementById("city-result-list-item");
var cityHeaderEl = document.getElementById("city-result-h2");
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

/* ================================================================================== */

// 1. getRequestedCity() | Create a function that takes value of user entered city, and utilizes previously city variable
var getRequestedCity = function (city) {
    city = $(".search-input").val();
    console.log("City value = " + city);
    
    // HOW TO CONSTRUCT A QUERY URL IN OPENWEATHER:
    // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key};

    // Define a variable that constructs a query URL to make the API call based on city name:
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + openWeatherAPIKey;

    // Make API call using fetch  
    fetch(queryURL)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            // possibly call another function that actually prints the response to the page?
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to locate city');
      });
  };

// 2. getFiveDayForecast() | Create a function that displays the 5 day forecase of the requested city
function getFiveDayForecast(){
    console.log("getFiveDayForecast function triggered");
}

// 3. storePreviousCities() | Create a function that stores previously searched city results, makes it an <a>, and, if clicked, replaces the today's forecast and 5 day forecast with chosen city
function storePreviousCities(){
    console.log("storePreviousCities function triggered");
}

// 4. clearPreviousCities() | Create a function that clears the results of the previously searched cities
function clearPreviousCities(){
    console.log("clearPreviousCities function triggered");
}

// 5. Add event listener for search button

// 6. Add event listener for clear button
$("#search-btn").on("click", function () {
    console.log("Search Button triggered");
    getRequestedCity();
    getFiveDayForecast();

});

// 7. Call all the functions (I may not need this because of the event listeners)
// getRequestedCity();
// getFiveDayForecast();
// storePreviousCities();
// clearPreviousCities();