// These elements are necessary for local storage items in the sidebar
var currentCity = "";

/* ================================================================================== */

// My Unique OpenWeather API Key for homework-6: e5e3b0ace283e06f86b26937890c837a

// Define the API key into a variable:
var openWeatherAPIKey = "e5e3b0ace283e06f86b26937890c837a";

// Create variables for API calls to use for user input and local storage:
var city = "";
var previousCity;

// DEFINE TODAY'S DATE HTML ELEMENT
var todaysDate = $("#todays-forecast-date");

// DISPLAY TODAY'S DATE
function displayCurrentDate() {
  var rightNow = moment().format('MMM DD, YYYY');
  todaysDate.text(rightNow);
}
displayCurrentDate();

/* ================================================================================== */

// 1. getRequestedCity() | Create a function that takes value of user entered city, and utilizes previously city variable
var getRequestedCity = function (city) {
  city = $(".search-input").val();
  currentCity = $('#search-input').val();
  console.log("City value = " + city);

  // HOW TO CONSTRUCT A QUERY URL IN OPENWEATHER:
  // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key};

  // SAMPLE CITY QUERY:
  // http://api.openweathermap.org/data/2.5/weather?q=dallas&appid=e5e3b0ace283e06f86b26937890c837a

  // Define a variable that constructs a query URL to make the API call based on city name:
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + openWeatherAPIKey;

  var uviURL = "";

  // Make API call using fetch  
  fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);

          // Display the City <H2>
          $("#city-result-h2").text(data.name);

          // Create variable to construct icon URL
          var imgIcon = "<img class='todays-icon' src='https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png' />";
          // DISPLAY ICON
          $("#temp-icon-id").html(imgIcon);
          // TEMP
          $("#temperature-id").text("Temperature: " + Math.floor(((data.main.temp - 273.15) * 9 / 5 + 32)));
          // WIND SPEED
          $("#wind-speed-id").text("Wind Speed: " + data.wind.speed + " mph");
          // HUMIDITY
          $("#humidity-id").text("Humidity: " + data.main.humidity + "%");

          // Call the 5 day forecast function here, so it can borrow elements from the getToday's weather functionality
          getFiveDayForecast(data)

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
function getFiveDayForecast(cityData) {
  // ******* Starting over completely from scratch. The vanila Javascript just wasn't doing the trick for me

  // Defining the first portion of the openweathermap API url (This doesn't give a full five days, it's hourly and only for today and tomorrow)
  // var queryFiveDayURL = "https://api.openweathermap.org/data/2.5/forecast";

  //EXAMPLE:
  // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
  var queryFiveDayURL = "https://api.openweathermap.org/data/2.5/onecall";

  console.log(cityData);
  // "Fetching" the data by constructing with ajax
  $.ajax({
    url: queryFiveDayURL,
    dataType: "json",
    type: "GET",
    data: {
      // parameters and documentation found here: https://openweathermap.org/api/one-call-api
      // Adding the Lat and Lon coordinates to marry the 2 endpoints
      lat: cityData.coord.lat,
      lon: cityData.coord.lon,
      appid: openWeatherAPIKey,
      units: "imperial"
    },
    success: function (data) {
      // TEST: Display all data to examine the keys and values
      console.log('Received data:', data)
      // TEST: View the fully concatenated string in the console
      console.log("The URL string = " + queryFiveDayURL + "?q=" + city + "&appid=" + openWeatherAPIKey);
      // Create empty string to use in various was for UI elements
      var constructUI = "";

      // Get the uv index for the current day here
      var uviValue = data.current.uvi;

      // Update the element that should hold it in the HTML
      $("#uvi-id").html("UV Index: " + uviValue);

      // if UV Index is 0 - 3 (low)
      if (uviValue <= 3){
        $("#uvi-id").css({"background-color": "green", "color": "white"});
        $("#condition-color").css({"color": "green"});
      }

      // if UV Index 3 - 5 (moderate)
      if (uviValue > 3 && uviValue < 6){
        $("#uvi-id").css({"background-color": "yellow", "color": "black"});
        $("#condition-color").css({"color": "yellow"});
      }
      
      // if UV Index is > 6 (high)
      if (uviValue >= 6){
        $("#uvi-id").css({"background-color": "red", "color": "black"});
        $("#condition-color").css({"color": "red"});
      }

      // Run a loop that construct the full blue weather card
      $.each(data.daily.slice(1, 6), function (index, val) {
        // I worked through this solution with the BCS rep. I've never used Intl.DateTimeFormat but it saved me a ton of time from having to do Momentjs conversions
        const date = Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        }).format(new Date(val.dt * 1000));

        console.log("The days of the week are: " + date);
        // ========================
        // Open the beginning of column + weather card + Display the date for the next 5 days
        constructUI += "<div class='card weather-card'><div class='card-body'><h5 class='card-title'>" + date + "</h5><ul>"
        // ADD Icon
        constructUI += "<li><img src='https://openweathermap.org/img/w/" + val.weather[0].icon + ".png'></li>";

        // ADD Temp + Round the decimal
        constructUI += "<li>Temp: " + Math.floor(val.temp.max) + "°F</li>";

        // ADD Wind
        constructUI += "<li>Wind: " + val.wind_speed + " mph</li>";

        // ADD Humidity
        constructUI += "<li>Humidity: " + val.humidity + " %</li>";

        // CLOSE Entire UI Element
        constructUI += "</ul></div></div>";

      });
      // Append the UI elements to the parent HTML element
      $(".weather-card-container").html(constructUI);

      // SHOW TODAY'S FORECAST CONTAINER
      $(".todays-forecast-container").show();

      // SHOW CITY RESULTS HEADER
      $(".sort-bar").show();
    }
  });

}

/* ================================================================================== */

/* 
  ================================================================
  NEW APPROACH TO STORING AND DISPLAYING CITIES IN SIDEBAR
  ================================================================
*/

// STEP 1 - DEFINE VARIABLES
var cityListEl = document.querySelector('#city-result-ul');
var citySearchEl = document.querySelector('#city-value');

// STEP 2 - CREATE FUNCTION THAT CREATES SIDEBAR LIST ITEMS
function storePreviousCities() {

  console.log("storePreviousCities function triggered");
  cityListEl.innerHTML += '<li>' + citySearchEl.value + '</li>';
  localStorage.setItem('StoredCities', citySearchEl.value);

}

// STEP 3 - SHOW PREVIOUS CITIES
function viewPreviousCities() {
  // Check for saved cities
  var savedCities = localStorage.getItem('StoredCities');
  console.log(savedCities);
  console.log(typeof savedCities);
  // If there are any saved cities, update our list
  if (savedCities) {
    // Show city list
    cityListEl.innerHTML = '<li>' + savedCities + '</li>';

  }
};

// STEP 4 - CALL THE VIEW PREVIOUS CITIES FUNCTION
viewPreviousCities();

// STEP 5 — NEW EVENT LISTENER FOR LIST ITEMS IN SIDEBAR
$("#city-result-ul").on("click", "li", function () {
  console.log($(this).text());

  var city = $(this).text();
  // define list item

  // Define a variable that constructs a query URL to make the API call based on city name:
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + openWeatherAPIKey;

  // Make API call using fetch  
  fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);

          // Display the City <H2>
          $("#city-result-h2").text(data.name);

          // Create variable to construct icon URL
          var imgIcon = "<img class='todays-icon' src='https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png' />";
          // DISPLAY ICON
          $("#temp-icon-id").html(imgIcon);
          // TEMP
          $("#temperature-id").text("Temperature: " + Math.floor(((data.main.temp - 273.15) * 9 / 5 + 32)));
          // WIND SPEED
          $("#wind-speed-id").text("Wind Speed: " + data.wind.speed + " mph");
          // HUMIDITY
          $("#humidity-id").text("Humidity: " + data.main.humidity + "%");

          // Call the 5 day forecast function here, so it can borrow elements from the getToday's weather functionality
          getFiveDayForecast(data)

          // SHOW 5 DAY CONTAINER
          $(".weather-card").show();

          // SHOW TODAY'S FORECAST CONTAINER
          $(".todays-forecast-container").show();

          // SHOW CITY RESULTS HEADER
          $(".sort-bar").show();

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
});

/* ================================================================================== */

// 3. Add event listener for search button
$("#search-btn").on("click", function () {
  // get today's forecast (which calls the 5 day forecast inside of the function)
  getRequestedCity();

  // DISPLAY PREVIOUSLY SEARCHED CITIES IN SIDEBAR
  storePreviousCities();

  // SHOW 5 DAY CONTAINER
  $(".weather-card").show();

  // SHOW TODAY'S FORECAST CONTAINER
  $(".todays-forecast-container").show();

  // SHOW CITY RESULTS HEADER
  $(".sort-bar").show();

});

// 4. Add event listener for clear button
$("#clear-btn").on("click", function () {
  // CLEAR THE SEARCH INPUT FIELD
  $(".search-input").val("");
  // CLEAR TODAY'S FORECAST
  // document.getElementById('todays-forecast-ul').innerHTML = '';
  //CLEAR THE CITY <H2>
  document.getElementById('city-result-h2').innerHTML = '';

  // HIDE TODAY'S FORECAST CONTAINER
  $(".todays-forecast-container").hide();

  // HIDE THE 5 DAY FORECAST
  $(".weather-card").hide();

  // HIDE CITY RESULTS HEADER
  $(".sort-bar").hide();

  // CLEARING LOCAL STORAGE
  localStorage.clear();

  // CLEAR SIDEBAR
  document.getElementById('city-result-ul').innerHTML = '';

});