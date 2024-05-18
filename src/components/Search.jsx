import {useState, useEffect} from 'react'

import { ACTIONS } from '../App';

export default function Search( {dispatch, city} ) {
    const [tempCity, setTempCity] = useState('')
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=2&language=en` //doesn't work with count=1 for some reason

    const handleSearch = async () => {
        if ( tempCity.trim().length > 1 ) {
            const formattedCity = tempCity
                .trim()
                .replace(/(?<!,) +/g, '+') // replace spaces not after a comma with a plus
                .replace(/\s+/g, '') // remove other whitespace
                .replace(/,/g, '%2C'); // replace commas with %2C
            dispatch({type: ACTIONS.SET_CITY, payload: formattedCity})
            setTempCity('')
        }
    }

    useEffect(() => {geocode()}, [city])

    const geocode = async () => {
        try {            
            const geocodeRes = await fetch(geocodeUrl)
            if (!geocodeRes.ok) throw new Error('Geocode failed - check city input')
            const geocodeData = await geocodeRes.json()
            dispatch({type: ACTIONS.SET_LAT, payload: geocodeData.results[0].latitude})
            dispatch({type: ACTIONS.SET_LON, payload: geocodeData.results[0].longitude})
            dispatch({type: ACTIONS.SET_ERROR, payload: null})
        } catch (error) {
            console.log("Error:", error.message)
            dispatch({type: ACTIONS.SET_ERROR, payload: error.message})
        }
    }

    return (
        <div className="search-container">
            <input onChange={(e)=>setTempCity(e.target.value)}
                   placeholder="Enter a city..."
                   type="text"
                   value={tempCity}
                   name="city-input"
                   onKeyDown={e => e.key === 'Enter' ? handleSearch() : null}
                   />
            <button onClick={() => handleSearch()}>Search</button>
        </div>
    )
  }