import { describeCode, isSnowCode } from './getEmoji';

export const formatHour = (hour) => {
  const meridiem = hour < 12 ? "AM" : "PM"
  const hours = hour % 12 || 12
  return `${hours} ${meridiem}`
}

// "2026-11-15T07:12" -> "7:12 AM" (API times are already in the city's local time)
export const formatClock = (isoTime) => {
  const [hours, minutes] = isoTime.slice(11, 16).split(":").map(Number)
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`
}

// current local time in the city, using the offset the API gives us
export const cityTime = (utcOffsetSeconds) => {
  const local = new Date(Date.now() + utcOffsetSeconds * 1000)
  const hours = local.getUTCHours()
  return `${hours % 12 || 12}:${String(local.getUTCMinutes()).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
// "2026-11-15" -> "Sunday" (uses the city's date, so Amsterdam can be a day ahead)
export const weekday = (isoDate) => {
  const [y, m, d] = isoDate.split("-").map(Number)
  return DAYS[new Date(y, m - 1, d).getDay()]
}

// index of the current hour in the hourly arrays
export const nowIndex = (weather) => {
  const hourStamp = weather.current.time.slice(0, 13) + ":00"
  const index = weather.hourly.time.indexOf(hourStamp)
  return index === -1 ? 0 : index
}

// wind direction is where the wind comes FROM, so the arrow points the opposite way (where it's blowing)
export const windArrowStyle = (degrees) => ({ display: "inline-block", transform: `rotate(${degrees + 180}deg)` })
export const compass = (degrees) => ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(degrees / 45) % 8]

// "sweater temperature" idea from my old notes
export const whatToWear = (feelsLike) =>
  feelsLike >= 23 ? "T-shirt weather" :
    feelsLike >= 16 ? "Light layer" :
      feelsLike >= 9 ? "Sweater weather" :
        feelsLike >= 0 ? "Jacket" :
          feelsLike >= -12 ? "Winter coat" :
            "Bundle up, it's freezing"

export const aqiLabel = (aqi) =>
  aqi <= 50 ? "good" : aqi <= 100 ? "moderate" : aqi <= 150 ? "unhealthy for some" : "unhealthy"

export const uvLabel = (uv) =>
  uv < 3 ? "low" : uv < 6 ? "moderate" : uv < 8 ? "high" : "very high"

// short heads-ups for the next ~12 hours: rain, wind, UV, big temperature changes, frisbee
export function getHeadsUps(weather, aqi) {
  const { current, hourly, daily } = weather
  const start = nowIndex(weather)
  const next = (hours) => Array.from({ length: hours }, (_, i) => start + i).filter(i => i < hourly.time.length)
  const notes = []

  // rain / snow
  const wetNow = current.precipitation > 0 || current.weather_code >= 51
  if (wetNow) {
    const dryAt = next(12).find(i => hourly.precipitation_probability[i] < 30 && hourly.precipitation[i] === 0)
    notes.push({
      type: "rain",
      text: `${isSnowCode(current.weather_code) ? "Snowing" : "Wet"} now${dryAt ? `, drying up around ${formatHour(Number(hourly.time[dryAt].slice(11, 13)))}` : ""}`
    })
  } else {
    const wetAt = next(12).find(i => hourly.precipitation_probability[i] >= 50 || hourly.precipitation[i] >= 0.3)
    if (wetAt !== undefined) {
      const kind = isSnowCode(hourly.weather_code[wetAt]) ? "Snow" : "Rain"
      notes.push({
        type: "rain",
        text: `${kind} likely ${wetAt === start ? "this hour" : `around ${formatHour(Number(hourly.time[wetAt].slice(11, 13)))}`} (${hourly.precipitation_probability[wetAt]}%)`
      })
    }
  }

  // wind
  const maxGust = Math.max(...next(12).map(i => hourly.wind_gusts_10m[i]))
  if (maxGust >= 40) notes.push({ type: "wind", text: `Gusty, up to ${Math.round(maxGust)} km/h` })

  // UV
  if (daily.uv_index_max[0] >= 6 && current.is_day) notes.push({ type: "uv", text: `UV ${daily.uv_index_max[0].toFixed(0)} today, wear sunscreen` })

  // tomorrow vs today
  const swing = daily.temperature_2m_max[1] - daily.temperature_2m_max[0]
  if (Math.abs(swing) >= 6) notes.push({ type: "temp", text: `Tomorrow ${Math.round(Math.abs(swing))}° ${swing > 0 ? "warmer" : "colder"}` })

  // air quality
  if (aqi?.us_aqi > 100) notes.push({ type: "air", text: `Air quality ${aqiLabel(aqi.us_aqi)} (AQI ${aqi.us_aqi})` })

  // frisbee: next 3 daylight hours, dry, not too windy, not too cold/hot
  const soon = next(3)
  const frisbeeOk = current.is_day
    && soon.every(i => hourly.precipitation_probability[i] < 40 && hourly.precipitation[i] === 0)
    && soon.every(i => hourly.wind_gusts_10m[i] < 35)
    && current.apparent_temperature >= 5 && current.apparent_temperature <= 32
  if (frisbeeOk) {
    const calm = soon.every(i => hourly.wind_speed_10m[i] < 15)
    notes.push({ type: "good", text: calm ? "🥏 Great frisbee weather" : "🥏 Frisbee OK, a bit breezy" })
  }

  return notes
}

export const describeNow = (current) => describeCode(current.weather_code)
