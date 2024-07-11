document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "HbE6jQotg9jTnaoxmPLX9sc4gb5Guf9D"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const forecastDiv = document.getElementById("forecast");
    const fiveDayForecastDiv = document.getElementById("fiveDayForecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetch12HourForecast(locationKey); // Fetch 12-hour forecast after fetching current conditions
                    fetchFiveDayForecast(locationKey); // Fetch 5-day forecast after fetching current conditions
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function fetch12HourForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    display12HourForecast(data);
                } else {
                    forecastDiv.innerHTML += `<p>No 12-hour forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 12-hour forecast data:", error);
                forecastDiv.innerHTML += `<p>Error fetching 12-hour forecast data.</p>`;
            });
    }

    function display12HourForecast(data) {
        let forecastContent = `<h2>12-Hour Forecast</h2>`;
        data.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            const temperature = hour.Temperature.Value;
            const weather = hour.IconPhrase;
            forecastContent += `
                <p><strong>${time}</strong>: ${temperature}°C, ${weather}</p>
            `;
        });
        forecastDiv.innerHTML += forecastContent;
    }

    function fetchFiveDayForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayFiveDayForecast(data.DailyForecasts);
                } else {
                    fiveDayForecastDiv.innerHTML += `<p>No 5-day forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 5-day forecast data:", error);
                fiveDayForecastDiv.innerHTML += `<p>Error fetching 5-day forecast data.</p>`;
            });
    }

    function displayFiveDayForecast(forecasts) {
        let forecastContent = `<h2>5-Day Forecast</h2>`;
        forecasts.forEach(day => {
            const date = new Date(day.Date);
            const maxTemp = day.Temperature.Maximum.Value;
            const minTemp = day.Temperature.Minimum.Value;
            const dayWeather = day.Day.IconPhrase;
            const nightWeather = day.Night.IconPhrase;
            forecastContent += `
                <div>
                    <h3>${date.toDateString()}</h3>
                    <p>Max Temp: ${maxTemp}°C</p>
                    <p>Min Temp: ${minTemp}°C</p>
                    <p>Day Weather: ${dayWeather}</p>
                    <p>Night Weather: ${nightWeather}</p>
                </div>
            `;
        });
        fiveDayForecastDiv.innerHTML = forecastContent;
    }
});
