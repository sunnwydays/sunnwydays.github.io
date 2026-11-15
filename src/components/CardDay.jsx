import useGetWeather from './useGetWeather';
import getEmoji from './getEmoji';
import NowSummary, { CardHeader, CardStatus } from './NowSummary';
import { formatHour, nowIndex } from './weatherUtils';

export default function Card({ location, refreshKey }) {
  const { weather, aqi, error, updated } = useGetWeather(location.lat, location.lon, refreshKey)

  if (!weather) return <CardStatus name={location.name} error={error} className="card-container-day" />

  // next 24 hours starting now (in the city's own time), instead of only what's left of today
  const start = nowIndex(weather)
  const hours = Array.from({ length: 24 }, (_, i) => start + i)
  const { hourly } = weather

  return (
    <div className="card-container card-container-day">
      <CardHeader name={location.name} weather={weather} updated={updated} error={error} />
      <NowSummary weather={weather} aqi={aqi} />
      <div className="weather-container">
        <div className="label-container">
          <p>&nbsp;</p>
          <p className="emoji-space">&nbsp;</p>
          <p className="temperature">temp</p>
          <p className="temperature">feels</p>
          <p className="temperature">rain</p>
        </div>
        <div className="detail-container detail-container-day">
          {hours.map((i, index) => (
            <div key={i} className={index === 0 ? "detail-column current-detail-column" : "detail-column"}>
              <p>{index === 0 ? "Now" : formatHour(Number(hourly.time[i].slice(11, 13)))}</p>
              <p className="emoji">{getEmoji(hourly.weather_code[i], hourly.is_day[i])}</p>
              <p className="temperature">{Math.round(hourly.temperature_2m[i])}°</p>
              <p className="temperature muted">{Math.round(hourly.apparent_temperature[i])}°</p>
              <p className={hourly.precipitation_probability[i] >= 50 ? "temperature rain-high" : "temperature muted"}>
                {hourly.precipitation_probability[i]}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
/*
info for reference (e.g. how cold is cold, can you play frisbee - wind speed, precip, cold)
sweater temperature
warn about upcoming rain / wind / cold / hot
outlier days
hourly, daily, weekly views
*/

/*
index is current hour
Week (daily is just one day, no wind speed/direction)

{
  "latitude": 43.883667,
  "longitude": -79.31714,
  "generationtime_ms": 0.357985496520996,
  "utc_offset_seconds": -14400,
  "timezone": "America/Toronto",
  "timezone_abbreviation": "EDT",
  "elevation": 204,
  "hourly_units": {
    "time": "iso8601",
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "apparent_temperature": "°C",
    "precipitation_probability": "%",
    "weather_code": "wmo code",
    "wind_speed_10m": "km/h",
    "wind_direction_10m": "°"
  },
  "hourly": {
    "time": ["2024-05-09T00:00", "2024-05-09T01:00", ..., "2024-05-15T23:00"],
    "temperature_2m": [8.7, 8.2, 7.5],
    "relative_humidity_2m": [90, 91, 91],
    "apparent_temperature": [7, 6.6, 5.9],
    "precipitation_probability": [2, 1, 0],
    "weather_code": [0, 0, 0],
    "wind_speed_10m": [6.8, 5.8],
    "wind_direction_10m": [335, 330, 336]
  },
  "daily_units": {
    "time": "iso8601",
    "weather_code": "wmo code",
    "temperature_2m_max": "°C",
    "temperature_2m_min": "°C",
    "daylight_duration": "s",
    "uv_index_max": "",
    "wind_speed_10m_max": "km/h"
  },
  "daily": {
    "time": ["2024-05-09", "2024-05-10"],
    "weather_code": [3, 55, 51],
    "temperature_2m_max": [17.8, 15.4, 14.5],
    "temperature_2m_min": [6.8, 8.7, 5.7],
    "daylight_duration": [52349.39, 52488.78, 52625.32],
    "uv_index_max": [6.8, 6.6, 5.95],
    "wind_speed_10m_max": [18.5, 16.4, 14.3]
  }
}
*/

/* weather codes from github
enum WeatherCode: Int {
    case clearSky = 0
    case mainlyClear = 1
    case partlyCloudy = 2
    case overcast = 3
    case fog = 45
    case depositingRimeFog = 48
    case lightDrizzle = 51
    case moderateDrizzle = 53
    case denseDrizzle = 55
    case lightFreezingDrizzle = 56
    case moderateOrDenseFreezingDrizzle = 57
    case lightRain = 61
    case moderateRain = 63
    case heavyRain = 65
    case lightFreezingRain = 66
    case moderateOrHeavyFreezingRain = 67
    case slightSnowfall = 71
    case moderateSnowfall = 73
    case heavySnowfall = 75
    case snowGrains = 77
    case slightRainShowers = 80
    case moderateRainShowers = 81
    case heavyRainShowers = 82
    case slightSnowShowers = 85
    case heavySnowShowers = 86
    case thunderstormSlightOrModerate = 95
    case thunderstormStrong = 96
    case thunderstormHeavy = 99

⛱️🌇🌄🌅🌁🌫️
🔥🌞☀️🌤️⛅🌥️☁️
💧🌧️🌦️🌊🌂☂️☔🚿🌈
⚡🌩️⛈️🌪️
❄️🌨️☃️⛄
*/

/* original card
  <p className="temperature">16°C</p>
  <p className="feels-like">Feels like 14°C</p>
  <p className="weather">Sunny</p>
  <p className="PLACEHOLDER">Rain, wind</p>
  <p className="PLACEHOLDER">Humidity: 60%</p>
  <p className="PLACEHOLDER">UV: 5</p>
  <p className="PLACEHOLDER">Sunrise at: 7:32 AM</p>
  <p className="PLACEHOLDER">Sunset at: 9:19 PM</p>
*/