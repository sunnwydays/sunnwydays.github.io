import { useState } from 'react'

import useGetWeather from './useGetWeather';
import getEmoji from './getEmoji';

export default function Card(props) {
  const [weather, setWeather] = useState({})
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const currentDayOfWeek = new Date().getDay();
  const followingWeekdays = daysOfWeek.slice(currentDayOfWeek, currentDayOfWeek + 7);

  useGetWeather(props.dispatch, props.city, props.lat, props.lon, props.isLoaded, setWeather, "week")

  if (!props.isLoaded[props.city]) {
    return <p>Loading...</p>;
  }

  const dailyMax = weather.daily.temperature_2m_max
  const dailyMin = weather.daily.temperature_2m_min
  const dailyCode = weather.daily.weather_code
  const dailyPrecipitation = weather.daily.precipitation_sum
  const dailyWind = weather.daily.wind_speed_10m_max
  const dailyDirection = weather.daily.wind_direction_10m_dominant
  const dailyMaxUV = weather.daily.uv_index_max

  return (
    <div className="card-container card-container-week">
      <h1>{props.city.replace(/%2C/g, ', ').replace(/\+/g, ' ')}</h1>
      <div className="weather-container">
        <div className="label-container">
          <p>&nbsp;</p>
          <p className="temperature">max</p>
          <p className="temperature">min</p>
          <p className="emoji-space">&nbsp;</p>
          <p className="temperature">precip</p>
          <p className="temperature">wind</p>
          <p className="temperature">&nbsp;</p>
          <p className="temperature">max UV</p>
        </div>
        <div className="detail-container detail-container-week">
          {dailyMax.map((max, index) => (
            <div key={index} className={index === 0 ? "detail-column-week current-detail-column" : "detail-column-week"}>
              <p >{index === 0 ? "Today" : followingWeekdays[index]}</p>
              <p className="temperature">{Math.round(max)}°C</p>
              <p className="temperature">{Math.round(dailyMin[index])}°C</p>
              <p className="emoji">{getEmoji(dailyCode[index])}</p>
              <p className="temperature">{dailyPrecipitation[index]} mm</p>
              <p className="temperature">{dailyWind[index].toFixed(0)} km/h</p>
              <p className="temperature" style={{ transform: `rotate(${dailyDirection[index]}deg)` }}>⬆️</p>
              <p className="temperature">{dailyMaxUV[index].toFixed(1)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}