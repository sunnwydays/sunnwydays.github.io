import { useState } from 'react'

import { ACTIONS } from '../actions';

// so "London, ON" works (the API only knows full province names)
const PROVINCES = {
    on: "ontario", qc: "quebec", bc: "british columbia", ab: "alberta", mb: "manitoba", sk: "saskatchewan",
    ns: "nova scotia", nb: "new brunswick", nl: "newfoundland", pe: "prince edward island",
    yt: "yukon", nt: "northwest territories", nu: "nunavut"
}

// "London, Canada" -> search "London", then pick the result whose country/province matches "Canada"
async function geocode(input) {
    const [name, ...rest] = input.split(",").map(part => part.trim()).filter(Boolean)
    const typed = rest.join(" ").toLowerCase()
    const hint = PROVINCES[typed] ?? typed
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=10&language=en`

    const res = await fetch(url)
    if (!res.ok) throw new Error('Geocode failed - check city input')
    const data = await res.json()
    const results = data.results ?? []
    if (results.length === 0) throw new Error(`Couldn't find "${input}"`)

    const matches = (place) => [place.country, place.country_code, place.admin1, place.admin2]
        .some(field => field && field.toLowerCase().startsWith(hint))
    const place = (hint && results.find(matches)) || results[0]

    return {
        name: [place.name, place.admin1 && place.admin1 !== place.name ? place.admin1 : null, place.country_code]
            .filter(Boolean).join(", "),
        lat: place.latitude,
        lon: place.longitude
    }
}

export default function Search({ dispatch }) {
    const [tempCity, setTempCity] = useState('')
    const [busy, setBusy] = useState(false)

    const handleSearch = async () => {
        if (tempCity.trim().length < 2 || busy) return
        setBusy(true)
        try {
            const location = await geocode(tempCity.trim())
            dispatch({ type: ACTIONS.SET_LOCATION, payload: location })
            dispatch({ type: ACTIONS.SET_ERROR, payload: null })
            setTempCity('')
        } catch (error) {
            console.log("Error:", error.message)
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        }
        setBusy(false)
    }

    const handleMyLocation = () => {
        if (!navigator.geolocation) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: "Location isn't available in this browser" })
            return
        }
        setBusy(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                dispatch({
                    type: ACTIONS.SET_LOCATION,
                    payload: {
                        name: "My location",
                        lat: position.coords.latitude.toFixed(4),
                        lon: position.coords.longitude.toFixed(4)
                    }
                })
                dispatch({ type: ACTIONS.SET_ERROR, payload: null })
                setBusy(false)
            },
            () => {
                dispatch({ type: ACTIONS.SET_ERROR, payload: "Couldn't get your location" })
                setBusy(false)
            }
        )
    }

    return (
        <div className="search-container">
            <input onChange={(e) => setTempCity(e.target.value)}
                   placeholder="Enter a city..."
                   type="text"
                   value={tempCity}
                   name="city-input"
                   onKeyDown={e => e.key === 'Enter' ? handleSearch() : null}
                   />
            <button onClick={handleSearch} disabled={busy}>{busy ? "..." : "Search"}</button>
            <button className="icon-button" onClick={handleMyLocation} disabled={busy} title="Use my location" aria-label="Use my location">📍</button>
        </div>
    )
}
