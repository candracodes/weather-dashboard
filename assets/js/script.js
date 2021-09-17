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
var lastCity = "";

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
          // attempting to save to local storage.
          storePreviousCities(city);

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
function storePreviousCities(newCity) {
  console.log("storePreviousCities function triggered");
  // Assuming it's a user's first time here, then this "false" is a true statement and I want to default to this
  var cityExists = false;

  // Check to see if City boolean is true, i.e. "Is there anything in storage"
  for (let i = 0; i < localStorage.length; i++) {
      if (localStorage["cities" + i] === newCity) {
          cityExists = true;
          break;
      }
  }
  // Add to local storage if the city is new
  if (cityExists === false) {
      localStorage.setItem('cities' + localStorage.length, newCity);
  }
}

// 4. showPreviousCities() | Create a function that actually constructs the city results in sidebar and makes them clickable
function showPreviousCities() {
  console.log("showPreviousCities function triggered");

  if (localStorage.length===0){
    if (lastCity){
        $('#search-input').attr("value", lastCity);
    } else {
        $('#search-input').attr("value", "Dallas");
    }
} else {
    // Build key of last city written to localStorage
    let lastCityKey="cities"+(localStorage.length-1);
    lastCity=localStorage.getItem(lastCityKey);
    // Set search input to last city searched
    $('#search-input').attr("value", lastCity);
    // Append stored cities to page
    for (let i = 0; i < localStorage.length; i++) {
        let city = localStorage.getItem("cities" + i);
        let cityEl;
        // Set to lastCity if currentCity not set
        if (currentCity===""){
            currentCity=lastCity;
        }
        // Set button class to active for currentCity
        if (city === currentCity) {
            cityEl = `<li class="city-result-list-item"><a onclick="getRequestedCity()">${city}</a></li>`;
        } else {
            cityEl = `<li class="city-result-list-item"><a onclick="getRequestedCity()">${city}</a></li>`;
        } 
        // Append city to page
        $('#city-result-ul').prepend(cityEl);
    }
}
}

// 5. Add event listener for search button
$("#search-btn").on("click", function () {

  getRequestedCity();
  currentCity = $('#search-input').val();
  showPreviousCities();

});
// 6. Add event listener to make historical data clickable
$("#city-result-ul").on("click", function (event) {
  // TODO: not exactly working how I want, but maybe I can fix this and resubmit homework
  event.preventDefault();
  $('#search-input').val(event.target.textContent);
  currentCity = $('#search-input').val();

});

// 7. Add event listener for clear button
$("#clear-btn").on("click", function () {
  // CLEAR THE SEARCH INPUT FIELD
  $(".search-input").val("");
  // CLEAR TODAY'S FORECAST
  document.getElementById('todays-forecast-ul').innerHTML = '';
  //CLEAR THE CITY <H2>
  document.getElementById('city-result-h2').innerHTML = '';
  // CLEAR SIDEBAR RESULTS
  $( "#city-result-ul" ).empty();
  // TODO: FIGURE OUT A WAY TO CLEAR OUT THE 5 DAY FORECAST
  // CLEARING LOCAL STORAGE
  localStorage.clear();
});

// 8. Call the function to display previously searched cities
showPreviousCities();