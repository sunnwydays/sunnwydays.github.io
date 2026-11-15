import { useEffect, useRef, useState } from 'react'

import useGetWeather from './useGetWeather';
import getEmoji from './getEmoji';
import NowSummary, { CardHeader, CardStatus } from './NowSummary';
import { formatClock, formatHour, nowIndex, weekday, windArrowStyle } from './weatherUtils';

export default function Card({ location, refreshKey, onRemove }) {
  const { weather, aqi, error, updated } = useGetWeather(location.lat, location.lon, refreshKey)
  const [day, setDay] = useState(0);
  const hourlyRef = useRef(null)

  // the "Now" hour in the city's time (only meaningful for today)
  const nowHour = weather ? nowIndex(weather) : 0

  // scroll the hourly row so "Now" (or the morning, for other days) is in view
  useEffect(() => {
    const container = hourlyRef.current
    if (!container) return
    const target = container.children[day === 0 ? nowHour : 7]
    if (target) container.scrollLeft += target.getBoundingClientRect().left - container.getBoundingClientRect().left - 8
  }, [day, nowHour, weather])

  if (!weather) return <CardStatus name={location.name} onRemove={onRemove} error={error} className="card-container-week" />

  const { daily, hourly } = weather
  const days = daily.time.slice(0, 7)
  const hours = Array.from({ length: 24 }, (_, i) => 24 * day + i)

  return (
    <div className="card-container card-container-week">
      <CardHeader name={location.name} onRemove={onRemove} weather={weather} updated={updated} error={error} />
      <NowSummary weather={weather} aqi={aqi} />
      <div className="weather-container weather-container-detailed">
        <div className="flex">
          <div className="day-selection">
            {days.map((date, index) => (
              <label key={date} className={day === index ? "selected" : null}>
                <input type="radio" name={location.name} checked={day === index} onChange={() => setDay(index)} />
                {index === 0 ? "Today" : weekday(date)}
              </label>
            ))}
          </div>
          <div className="day-detail-container detail-container-week">
            <div key={day} className="detail-column-week">
              <p className="day-title">{day === 0 ? "Today" : weekday(days[day])}</p>
              <p className="emoji">{getEmoji(daily.weather_code[day])}</p>
              <p className="temperature">max {Math.round(daily.temperature_2m_max[day])}°</p>
              <p className="temperature">min {Math.round(daily.temperature_2m_min[day])}°</p>
              <p className="temperature muted">feels {Math.round(daily.apparent_temperature_min[day])}° to {Math.round(daily.apparent_temperature_max[day])}°</p>
              <p className="temperature">{daily.precipitation_probability_max[day]}% rain, {daily.precipitation_sum[day].toFixed(1)} mm</p>
              <p className="temperature">
                {daily.wind_speed_10m_max[day].toFixed(0)} km/h{" "}
                <span className="arrow" style={windArrowStyle(daily.wind_direction_10m_dominant[day])}>↑</span>
              </p>
              <p className="temperature muted">gusts {daily.wind_gusts_10m_max[day].toFixed(0)} km/h</p>
              <p className="temperature">{daily.uv_index_max[day].toFixed(1)} UV</p>
              <p className="temperature muted">🌅 {formatClock(daily.sunrise[day])}</p>
              <p className="temperature muted">🌇 {formatClock(daily.sunset[day])}</p>
            </div>
          </div>
        </div>
        <div className="hourly-wrap">
          <div className="label-container label-container-detailed">
            <p>&nbsp;</p>
            <p className="emoji-space">&nbsp;</p>
            <p className="temperature">temp</p>
            <p className="temperature">feels</p>
            <p className="temperature">rain</p>
            <p className="temperature">precip</p>
            <p className="temperature">wind km/h</p>
            <p className="temperature">gusts</p>
            <p className="temperature">humidity</p>
            <p className="temperature">UV</p>
          </div>
          <div className="detail-container detail-container-detailed" ref={hourlyRef}>
            {hours.map((i, index) => {
              const isNow = day === 0 && i === nowHour
              const isPast = day === 0 && i < nowHour
              return (
                <div key={i} className={`detail-column-detailed${isNow ? " current-detail-column" : ""}${isPast ? " past" : ""}`}>
                  <p>{isNow ? "Now" : formatHour(index)}</p>
                  <p className="emoji">{getEmoji(hourly.weather_code[i], hourly.is_day[i])}</p>
                  <p className="temperature">{Math.round(hourly.temperature_2m[i])}°</p>
                  <p className="temperature muted">{Math.round(hourly.apparent_temperature[i])}°</p>
                  <p className={hourly.precipitation_probability[i] >= 50 ? "temperature rain-high" : "temperature"}>
                    {hourly.precipitation_probability[i]}%
                  </p>
                  <p className="temperature">{hourly.precipitation[i]} mm</p>
                  <p className="temperature">
                    {hourly.wind_speed_10m[i].toFixed(0)}{" "}
                    <span className="arrow" style={windArrowStyle(hourly.wind_direction_10m[i])}>↑</span>
                  </p>
                  <p className="temperature muted">{hourly.wind_gusts_10m[i].toFixed(0)}</p>
                  <p className="temperature">{hourly.relative_humidity_2m[i]}%</p>
                  <p className="temperature">{(hourly.uv_index[i] ?? 0).toFixed(0)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
