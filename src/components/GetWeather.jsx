import { useEffect, useRef } from 'react'

export default function GetWeather(lat, lon, city, setError, setWeather, isLoaded, setIsLoaded, mode = "day") {
    const weatherUrl = mode == "day" ? `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,weather_code&timezone=America%2FNew_York&forecast_days=1` : mode== "week" ? `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=America%2FNew_York` : `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=America%2FNew_York`
    const isLoading = useRef(false);    // need to use ref because React batches state updates, not immediately updating isLoading if it is a state variable, and avoid rerendering

    const fetchData = async () => {
        isLoading.current = true;
        // console.log("Fetching weather for", lat, lon)
        try {
            const res = await fetch(weatherUrl)
            // console.log(weatherUrl)
            if (!res.ok) throw new Error
            const data = await res.json()
            setWeather(data)
            // console.log(data)
            // console.log("---WEATHER FOR", city,"FETCHED")
            setError(null)
        } catch (error) {
            console.log("Failed to fetch weather:", error.message)
            setError(error.message)
        }
        setIsLoaded(isLoaded => ({ ...isLoaded, [city]: true }))
        isLoading.current = false;
    }
    useEffect(() => {
        if (!isLoaded[city] && !isLoading.current) {
            setIsLoaded(isLoaded => ({ ...isLoaded, [city]: false }))
            fetchData()
        }
    }, [lat, lon])
}

/*
day: https://api.open-meteo.com/v1/forecast?latitude=43.7001&longitude=-79.4163&hourly=temperature_2m,apparent_temperature,weather_code&timezone=America%2FNew_York&forecast_days=1
week: https://api.open-meteo.com/v1/forecast?latitude=43.7001&longitude=-79.4163&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=America%2FNew_York
detailed: https://api.open-meteo.com/v1/forecast?latitude=43.7001&longitude=-79.4163&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=America%2FNew_York
*/