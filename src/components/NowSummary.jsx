import { useEffect, useState } from 'react'

import getEmoji from './getEmoji';
import { aqiLabel, cityTime, compass, describeNow, formatClock, getHeadsUps, uvLabel, whatToWear, windArrowStyle } from './weatherUtils';

// "5:30 PM" in my own time zone, matching the format used everywhere else
const localClock = (timestamp) => {
  const d = new Date(timestamp)
  return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() < 12 ? "AM" : "PM"}`
}

// re-render every minute so the city's local time stays correct
function useMinuteTick() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60 * 1000)
    return () => clearInterval(id)
  }, [])
}

export function CardHeader({ name, weather, updated, error, onRemove }) {
  useMinuteTick()
  return (
    <div className="card-header">
      <h1>
        {name}
        {onRemove && <button className="card-remove" onClick={onRemove} title="Clear search" aria-label="Clear search">×</button>}
      </h1>
      {weather && (
        <p className="card-subtitle">
          {cityTime(weather.utc_offset_seconds)} local
          {updated && <> · updated {localClock(updated)}</>}
          {error && <span className="stale"> · couldn&apos;t refresh</span>}
        </p>
      )}
    </div>
  )
}

// shown instead of a card while loading or if the first fetch failed
export function CardStatus({ name, error, className, onRemove }) {
  return (
    <div className={`card-container ${className}`}>
      <CardHeader name={name} onRemove={onRemove} />
      <p className={error ? "card-status card-status-error" : "card-status"}>
        {error ? `Couldn't load weather: ${error}` : "Loading..."}
      </p>
    </div>
  )
}

export default function NowSummary({ weather, aqi }) {
  const { current, daily } = weather
  const headsUps = getHeadsUps(weather, aqi)

  return (
    <div className="now">
      <div className="now-main">
        <span className="now-emoji">{getEmoji(current.weather_code, current.is_day)}</span>
        <div>
          <div className="now-temp">{Math.round(current.temperature_2m)}°</div>
          <div className="now-desc">{describeNow(current)}</div>
        </div>
      </div>

      <div className="now-stats">
        <div><span>Feels like</span>{Math.round(current.apparent_temperature)}°</div>
        <div><span>High / Low</span>{Math.round(daily.temperature_2m_max[0])}° / {Math.round(daily.temperature_2m_min[0])}°</div>
        <div>
          <span>Wind</span>
          {Math.round(current.wind_speed_10m)} km/h {compass(current.wind_direction_10m)}{" "}
          <span className="arrow" style={windArrowStyle(current.wind_direction_10m)}>↑</span>
        </div>
        <div><span>Gusts</span>{Math.round(current.wind_gusts_10m)} km/h</div>
        <div><span>Rain chance</span>{daily.precipitation_probability_max[0]}% today</div>
        <div><span>Humidity</span>{current.relative_humidity_2m}%</div>
        <div><span>Max UV</span>{daily.uv_index_max[0].toFixed(0)} {uvLabel(daily.uv_index_max[0])}</div>
        <div><span>Sunrise / Sunset</span>{formatClock(daily.sunrise[0])} / {formatClock(daily.sunset[0])}</div>
        {aqi && <div><span>Air quality</span>{aqi.us_aqi} {aqiLabel(aqi.us_aqi)}</div>}
      </div>

      <div className="chips">
        <span className="chip chip-wear">{whatToWear(current.apparent_temperature)}</span>
        {headsUps.map((note) => (
          <span key={note.text} className={`chip chip-${note.type}`}>{note.text}</span>
        ))}
      </div>
    </div>
  )
}
