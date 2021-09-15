// Define HTML elements as variables to reference later:
var searchInput = document.getElementById("search-input");
var searchButton = document.getElementById("search-btn");
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
var city;
var previousCity;

// HOW TO CONSTRUCT A QUERY URL IN OPENWEATHER:
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key};

// Define a variable that constructs a query URL to make the API call based on city name:
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + openWeatherAPIKey;

// Make API call using fetch
fetch(queryURL);

/* ================================================================================== */

// 1. Create a function that takes value of user entered city, and utilizes city variable

// 2. Create a function that stores previously searched city results, makes it an <a>, and, if clicked, replaces the today's forecast and 5 day forecast with chosen city

// 3. Create a function that clears the results of the previously searched cities

// 4. Add event listener for search button

// 5. Add event listener for clear button

// 6. Call all the functions