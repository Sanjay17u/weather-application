import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    
    const allIcons = {
        '01d': clear_icon,
        '01n': clear_icon,
        '02d': cloud_icon,
        '02n': cloud_icon,
        '03d': cloud_icon,
        '03n': cloud_icon,
        '04d': drizzle_icon,
        '04n': drizzle_icon,
        '09d': rain_icon,
        '09n': rain_icon,
        '10d': rain_icon,
        '10n': rain_icon,
        '13d': snow_icon,
        '13n': snow_icon,
    };

    const search = async (city) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
                cloudiness: data.clouds.all,
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        search('New Delhi');  
    }, []);

    return (
        <div className="weather-container">
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Enter city..."
                    ref={inputRef}
                    onKeyDown={(e) => e.key === 'Enter' && search(inputRef.current.value)}
                />
                <img
                    src={search_icon}
                    alt="Search"
                    className="search-icon"
                    onClick={() => search(inputRef.current.value)}
                />
            </div>

            {weatherData ? (
                <div className="weather-card">
                    <h1 className="city">{weatherData.location}</h1>
                    <img src={weatherData.icon} alt="weather-icon" className="weather-icon" />
                    <p className="temperature">{weatherData.temperature}°C</p>

                    <div className="weather-details">
                        <div className="detail">
                            <img src={humidity_icon} alt="Humidity" className="detail-icon" />
                            <p>Humidity: {weatherData.humidity}%</p>
                        </div>
                        <div className="detail">
                            <img src={wind_icon} alt="Wind Speed" className="detail-icon" />
                            <p>Wind: {weatherData.windSpeed} m/s</p>
                        </div>
                        <div className="detail">
                            <img src={cloud_icon} alt="Cloudiness" className="detail-icon" />
                            <p>Clouds: {weatherData.cloudiness}%</p>
                        </div>
                    </div>

                    <div className="additional-info">
                        <p>Sunrise: {weatherData.sunrise}</p>
                        <p>Sunset: {weatherData.sunset}</p>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Weather;
