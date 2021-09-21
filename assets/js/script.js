/* ========================================================================================================== */
/* 
NOTE TO REVIEWER:
THINGS THAT WORK:
1. Proper display of Today's Forecast (parameters include: date, icon, temp, wind, humidity)
2. Proper display of 5 Day Forecast
3. Cities saved to local storage in side bar, but they only display after a user enters a second search
*/
/* ========================================================================================================== */

// TODO: 1. Figre out a way to display locally stored results immediately after a user hits "Search", and NOT JUST after a user clicks Search for the second time
// TODO: 2. Figure out how to stop "Today's Forecast" from duplicating when a user enters a new city. It should obliterate the previous "Today's Forecast"
// TODO: 3. Figure out how to cross-reference endpoints so I can display the UV Index in Today's Forecast
// TODO: 4. Once UV Index is working, add conditional statements that will display color options for classes like: favorable, moderate, and severe
// TODO: 5. Figure out a way to prevent the "Error: Bad Request" when a user clicks on a city result

/* ================================================================================== */

// These elements are necessary for local storage items in the sidebar
var currentCity = "";
// var lastCity = "";

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
  currentCity= $('#search-input').val();
  console.log("City value = " + city);

  // HOW TO CONSTRUCT A QUERY URL IN OPENWEATHER:
  // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key};

  // SAMPLE CITY QUERY:
  // http://api.openweathermap.org/data/2.5/weather?q=dallas&appid=e5e3b0ace283e06f86b26937890c837a

  // TODO: THIS QUERY ACTUALLY HAS UV INDEX, BUT HOW DO I CROSS-REFERENCE?:
  // https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid={API key}

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

          // To define an icon, you need to create a URL constructed like this => http://openweathermap.org/img/wn/10d@2x.png
          // Create variable to construct icon URL
          var imgIcon = "<img class='todays-icon' src='https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png' />";
          // DISPLAY ICON with imgIcon variable
          $("#todays-forecast-ul").append("<li>" + imgIcon + "</li>");

          // To display the temperature, the results are in a format called "Kelvin" and needs to be converted with a formula
          // Convert Kelvin to Fahrenheit:
          // (K − 273.15) × 9/5 + 32 = °F. (where K is the value the computer initially spews)

          // DISPLAY TEMPERATURE (NOTE: this could be achieved by simply referring to the unit: imperial parameter, but I want to hold on to this formula in case I need it in the future)
          $("#todays-forecast-ul").append("<li>Temp: " + Math.floor(((data.main.temp - 273.15) * 9 / 5 + 32)) + "° </li>");
          // DISPLAY WIND SPEED
          $("#todays-forecast-ul").append("<li>Wind: " + data.wind.speed + " mph</li>");
          // DISPLAY HUMIDITY
          $("#todays-forecast-ul").append("<li>Humidity: " + data.main.humidity + "%</li>");

          // TODO: UV Index is not a key in the queryURL parameter, so I have to use another endpoint to produce this. In the mean time...
          // DISPLAY UV INDEX
          // $("#todays-forecast-ul").append("<li>UV Index: Unknown</li>");
          $("#todays-forecast-ul").append("<li></li>");

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
      console.log("The URL string = " + queryFiveDayURL +"?q=" + city +"&appid=" + openWeatherAPIKey);
      // Create empty string to use in various was for UI elements
      var constructUI = "";
      // Run a loop that construct the full blue weather card
      $.each(data.daily.slice(1,6), function (index, val) {
        // I worked through this solution with the BCS rep. I've never used Intl.DateTimeFormat but it saved me a ton of time from having to do Momentjs conversions
        const date = Intl.DateTimeFormat("en-US", {month :"short", day: "2-digit", year:"numeric"}).format(new Date(val.dt*1000));

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
    }
  });

}

/* ================================================================================== */

/* 
  ================================================================
  TODO: NEW APPROACH TO STORING AND DISPLAYING CITIES IN SIDEBAR
  ================================================================
*/

// TODO: STEP 1 - DEFINE VARIABLES
var cityListEl = document.querySelector('#city-result-ul');
var citySearchEl = document.querySelector('#city-value');

// TODO: STEP 2 - CREATE FUNCTION THAT CREATES SIDEBAR LIST ITEMS
function storePreviousCities() {

  console.log("storePreviousCities function triggered");
  cityListEl.innerHTML += '<li>' + citySearchEl.value + '</li>';
  localStorage.setItem('StoredCities', cityListEl.innerHTML);
  // TODO: Try to figure out a way to make list items clickable and to display previously searched city results in main section
  
}

// TODO: STEP 3 - SHOW PREVIOUS CITIES
function viewPreviousCities() {
  // Check for saved cities
  var savedCities = localStorage.getItem('StoredCities');

  // If there are any saved cities, update our list
  if (savedCities) {
    // Show city list
    cityListEl.innerHTML = savedCities;

  }
};

// TODO: STEP 4 - CALL THE VIEW PREVIOUS CITIES FUNCTION
viewPreviousCities();

/* ================================================================================== */

// 3. Add event listener for search button
$("#search-btn").on("click", function () {
  // get today's forecast (which calls the 5 day forecast inside of the function)
  getRequestedCity();
  
  // TODO: STEP 5: DISPLAY PREVIOUSLY SEARCHED CITIES IN SIDEBAR
  storePreviousCities();

});

// 4. Add event listener for clear button
$("#clear-btn").on("click", function () {
  // CLEAR THE SEARCH INPUT FIELD
  $(".search-input").val("");
  // CLEAR TODAY'S FORECAST
  document.getElementById('todays-forecast-ul').innerHTML = '';
  //CLEAR THE CITY <H2>
  document.getElementById('city-result-h2').innerHTML = '';
  
  // TODO: FIGURE OUT A WAY TO CLEAR OUT THE 5 DAY FORECAST
  // CLEARING LOCAL STORAGE
  localStorage.clear();

  // CLEAR SIDEBAR
  document.getElementById('city-result-ul').innerHTML = '';
  
});
