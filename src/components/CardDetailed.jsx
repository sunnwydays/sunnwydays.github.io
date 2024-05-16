import { useState } from 'react'

import GetWeather from './GetWeather';
import GetEmoji from './GetEmoji';

export default function Card(props) {
  const [weather, setWeather] = useState({})
  const currentTime = new Date();
  const hour = currentTime.getHours();
  const formatHour = (hour) => {
    const meridiem = hour < 12 ? "AM" : "PM"
    const hours = hour % 12 || 12
    return `${hours} ${meridiem}`
  }
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const currentDayOfWeek = new Date().getDay();
  const followingWeekdays = daysOfWeek.slice(currentDayOfWeek, currentDayOfWeek + 7);
  const [day, setDay] = useState(0);

  GetWeather(props.lat, props.lon, props.city, props.setError, setWeather, props.isLoaded, props.setIsLoaded, "detailed")

  if (!props.isLoaded[props.city]) {
    return <p>Loading...</p>;
  }

  const dailyMax = weather.daily.temperature_2m_max
  const dailyMin = weather.daily.temperature_2m_min
  const dailyCode = weather.daily.weather_code
  const dailyPrecipitation = weather.daily.precipitation_sum
  const dailyWind = weather.daily.wind_speed_10m_max
  const dailyDirection = weather.daily.wind_direction_10m_dominant  
  const dailyDuration = weather.daily.daylight_duration

  const hourlyTemperatures = weather.hourly.temperature_2m
  const hourlyApparent = weather.hourly.apparent_temperature
  const hourlyCode = weather.hourly.weather_code
  const hourlyPrecipitation = weather.hourly.precipitation
  const hourlyWind = weather.hourly.wind_speed_10m
  const hourlyDirection = weather.hourly.wind_direction_10m
  const hourlyHumidity = weather.hourly.relative_humidity_2m

  return (
    <div className="card-container card-container-week">
      <h1>{props.city.replace(/%2C/g, ', ').replace(/\+/g, ' ')}</h1>
      <div className="weather-container weather-container-detailed">
        <div className="flex">
          <div className="day-selection">
            {followingWeekdays.map((dayOfTheWeek, index) => (
              <label key={index}>
                <input type="radio" name={props.city} checked={day === index} onChange={() => setDay(index)} />
                &nbsp;{index === 0 ? "Today" : dayOfTheWeek}
              </label>
            ))}
          </div>
          <div className="day-detail-container detail-container-week">
            <div key={day} className="detail-column-week" style={day === 0 ? { fontWeight: "bold" } : null} >
              <p style={{ textDecoration: "underline" }} >{day === 0 ? "Today" : followingWeekdays[day]}</p>
              <p className="temperature">max {Math.round(dailyMax[day])}°C</p>
              <p className="temperature">min {Math.round(dailyMin[day])}°C</p>
              <p className="emoji">{GetEmoji(dailyCode[day])}</p>
              <p className="temperature">{dailyPrecipitation[day]} mm</p>
              <p className="temperature">{dailyWind[day].toFixed(0)} km/h</p>
              <p className="temperature" style={{ transform: `rotate(${dailyDirection[day]}deg)` }}>⬆️</p>
              <p className="temperature">{(dailyDuration[day] / 3600).toFixed(1)} h</p>
            </div>
          </div>
        </div>
          <div className="label-container label-container-detailed">
            <p>&nbsp;</p>
            <p className="temperature">temp</p>
            <p className="temperature">feels</p>
            <p className="emoji-space">&nbsp;</p>
            <p className="temperature">precip</p>
            <p className="temperature">wind</p>
            <p className="temperature">&nbsp;</p>
            <p className="temperature">humidity</p>
          </div>
          <div className="detail-container detail-container-detailed">
            {hourlyTemperatures.slice(24 * day, 24 * day + 24).map((temp, index) => (
              <div key={index} className={(index === hour && day === 0) ? "detail-column-detailed current-detail-column" : "detail-column-detailed"}>
                <p >{(index === hour && day === 0) ? "Now" : formatHour(index)}</p>
                <p className="temperature">{Math.round(temp)}°C</p>
                <p className="temperature">{Math.round(hourlyApparent[index + 24 * day])}°C</p>
                <p className="emoji">{GetEmoji(hourlyCode[index + 24 * day])}</p>
                <p className="temperature">{hourlyPrecipitation[index + 24 * day]} mm</p>
                <p className="temperature">{hourlyWind[index + 24 * day].toFixed(0)} km/h</p>
                <p className="temperature" style={{ transform: `rotate(${hourlyDirection[index + 24 * day]}deg)` }}>⬆️</p>
                <p className="temperature">{hourlyHumidity[index + 24 * day]}%</p>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}