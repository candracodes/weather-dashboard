// Define HTML elements as variables to reference later (possibly)
// var storedCityLiEl = document.getElementById("city-result-list-item");
// var todaysForecastContainerEl = document.getElementById("todays-forecast-container");
// var weatherCardContainerEl = document.getElementById("weather-card-container");
// var weatherCardEl = document.getElementById("weather-card");

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

  getRequestedCity();
  // getFiveDayForecast();

});

// 6. Add event listener for clear button
$("#clear-btn").on("click", function () {
  // CLEAR THE SEARCH INPUT FIELD
  $(".search-input").val("");
  // CLEAR TODAY'S FORECAST
  document.getElementById('todays-forecast-ul').innerHTML = '';
  //CLEAR THE CITY <H2>
  document.getElementById('city-result-h2').innerHTML = '';
  // CLEAR BLUE 5DAY WEATHER CARDS
  // document.getElementById('#clearBlueBoxes').empty();
  $( "ul" ).empty();
  // CLEARING LOCAL STORAGE FOR FUTURE SAVED RESULTS
  localStorage.clear();
});