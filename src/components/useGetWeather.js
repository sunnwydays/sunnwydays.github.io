import { useEffect, useState } from 'react'

// One request per city gets everything all three views need, so switching views doesn't refetch.
// timezone=auto makes every time in the response local to the city (Amsterdam shows Amsterdam hours).
const CURRENT = "temperature_2m,apparent_temperature,weather_code,is_day,precipitation,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m"
const HOURLY = "temperature_2m,apparent_temperature,weather_code,is_day,precipitation,precipitation_probability,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index"
const DAILY = "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,uv_index_max,sunrise,sunset"

const CACHE_MINUTES = 10
const cache = {} // "lat,lon" -> { time, data, aqi }

async function fetchAll(lat, lon) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${CURRENT}&hourly=${HOURLY}&daily=${DAILY}&timezone=auto&forecast_days=8`
    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`

    const [weatherRes, airRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(airUrl).catch(() => null) // air quality is a bonus, don't fail the card over it
    ])
    if (!weatherRes.ok) throw new Error(`Weather request failed (${weatherRes.status})`)
    const data = await weatherRes.json()
    const aqi = airRes?.ok ? (await airRes.json()).current : null
    return { data, aqi }
}

export default function useGetWeather(lat, lon, refreshKey) {
    const [state, setState] = useState({ key: null, weather: null, aqi: null, error: null, updated: null })

    useEffect(() => {
        const key = `${lat},${lon}`
        const cached = cache[key]
        if (cached && Date.now() - cached.time < CACHE_MINUTES * 60 * 1000) {
            setState({ key, weather: cached.data, aqi: cached.aqi, error: null, updated: cached.time })
            return
        }

        let ignore = false // stops an old request from overwriting a newer city
        fetchAll(lat, lon)
            .then(({ data, aqi }) => {
                cache[key] = { time: Date.now(), data, aqi }
                if (!ignore) setState({ key, weather: data, aqi, error: null, updated: cache[key].time })
            })
            .catch((error) => {
                console.log("Failed to fetch weather:", error.message)
                if (!ignore) setState(prev => prev.key === key
                    ? { ...prev, error: error.message } // refresh failed: keep showing the last data
                    : { key, weather: null, aqi: null, error: error.message, updated: null })
            })
        return () => { ignore = true }
    }, [lat, lon, refreshKey])

    // while a new city loads, don't show the previous city's weather (but keep it during a refresh)
    if (state.key !== `${lat},${lon}`) return { weather: null, aqi: null, error: null, updated: null }
    return state
}
