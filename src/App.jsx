import { useReducer } from 'react'

import Search from './components/Search';
import CardDay from './components/CardDay';
import CardWeek from './components/CardWeek';
import CardDetailed from './components/CardDetailed';
import DigitalClock from './components/DigitalClock';
import Dropdown from './components/Dropdown';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';

export const ACTIONS = {
  SET_CITY: "set-city",
  SET_LAT: "set-search-lat",
  SET_LON: "set-search-lon",
  SET_MODE: "set-mode",
  SET_ERROR: "set-error",
  SET_IS_LOADED: "toggle-is-loaded",
  RESET_IS_LOADED: "reset-is-loaded"
}

export default function App() {
  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.SET_CITY:
        return { ...state, city: action.payload }
      case ACTIONS.SET_LAT:
        return { ...state, lat: action.payload }
      case ACTIONS.SET_LON:
        return { ...state, lon: action.payload }
      case ACTIONS.SET_MODE: 
        return { ...state, mode: action.payload }
      case ACTIONS.SET_ERROR:
        return { ...state, error: action.payload }
      case ACTIONS.SET_IS_LOADED:
        return { ...state, isLoaded: {...state.isLoaded, ...action.payload} }
      case ACTIONS.RESET_IS_LOADED:
        return { ...state, isLoaded: {} }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    city: "Ottawa",
    lat: "45.42472",
    lon: "-75.69944",
    mode: "day",
    error: null,
    isLoaded: {}
  }) 

  // extra space to avoid conflict with user typing "Toronto" - may have slightly different lat/lon
  const defaultLocations = [
    { city: " Toronto  ", lat: "43.661885", lon: "-79.394500" },
    { city: " Markham  ", lat: "43.8599", lon: "-79.3350" },
    { city: " Amsterdam  ", lat: "52.3676", lon: "4.9041" }
  ];

  return (
    <div className="main-container">
      <div className="top">
        <DigitalClock />
        <Search dispatch={dispatch} city={state.city} />
        <Dropdown dispatch={dispatch} mode={state.mode} />
      </div>
      {state.mode == "day" ? (
        <div>
          <div className="card-row">
            <CardDay dispatch={dispatch} city={state.city} lat={state.lat} lon={state.lon} isLoaded={state.isLoaded} />
            <CardDay dispatch={dispatch} city={defaultLocations[0].city} lat={defaultLocations[0].lat} lon={defaultLocations[0].lon} isLoaded={state.isLoaded} />
          </div>
          <div className="card-row">
            <CardDay dispatch={dispatch} city={defaultLocations[1].city} lat={defaultLocations[1].lat} lon={defaultLocations[1].lon} isLoaded={state.isLoaded} />
            <CardDay dispatch={dispatch} city={defaultLocations[2].city} lat={defaultLocations[2].lat} lon={defaultLocations[2].lon} isLoaded={state.isLoaded} />
          </div>
        </div>
      ) : state.mode == "week" ? (
        <div>
          <CardWeek dispatch={dispatch} city={state.city} lat={state.lat} lon={state.lon} isLoaded={state.isLoaded} />
          <CardWeek dispatch={dispatch} city={defaultLocations[0].city} lat={defaultLocations[0].lat} lon={defaultLocations[0].lon} isLoaded={state.isLoaded} />
          <CardWeek dispatch={dispatch} city={defaultLocations[1].city} lat={defaultLocations[1].lat} lon={defaultLocations[1].lon} isLoaded={state.isLoaded} />
        </div>
      ) : (
        <div>
          <CardDetailed dispatch={dispatch} city={state.city} lat={state.lat} lon={state.lon} isLoaded={state.isLoaded} />
          <CardDetailed dispatch={dispatch} city={defaultLocations[0].city} lat={defaultLocations[0].lat} lon={defaultLocations[0].lon} isLoaded={state.isLoaded} />
          <CardDetailed dispatch={dispatch} city={defaultLocations[1].city} lat={defaultLocations[1].lat} lon={defaultLocations[1].lon} isLoaded={state.isLoaded} />
        </div>
      )}
      {state.error && <ErrorMessage error={state.error} />}
      <Footer />
    </div>
  )
}

// const [city, setCity] = useState("Ottawa")
// const [searchLat, setSearchLat] = useState("45.42472")
// const [searchLon, setSearchLon] = useState("-75.69944")
// const [mode, setMode] = useState("day")
// const [error, setError] = useState(null)
// ^replaced with useReducer