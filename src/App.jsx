import { useEffect, useReducer } from 'react'

import Search from './components/Search';
import CardDay from './components/CardDay';
import CardWeek from './components/CardWeek';
import CardDetailed from './components/CardDetailed';
import DigitalClock from './components/DigitalClock';
import ViewSwitch from './components/ViewSwitch';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';
import { ACTIONS } from './actions';

// shown in this order when I haven't searched anything (week/detailed show the first 3, day shows 4)
const defaultLocations = [
  { name: "Toronto", lat: 43.661885, lon: -79.3945 },
  { name: "Markham", lat: 43.8599, lon: -79.335 },
  { name: "Ottawa", lat: 45.42472, lon: -75.69944 },
  { name: "Amsterdam", lat: 52.3676, lon: 4.9041 }
];

const samePlace = (a, b) => Math.abs(a.lat - b.lat) < 0.05 && Math.abs(a.lon - b.lon) < 0.05

// remember the last searched city and view between visits
// (localStorage can throw in private windows, so it's wrapped)
const load = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}
const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* not important */ }
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOCATION:
      return { ...state, location: action.payload }
    case ACTIONS.SET_MODE:
      return { ...state, mode: action.payload }
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload }
    case ACTIONS.REFRESH:
      return { ...state, refreshKey: state.refreshKey + 1 }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    location: load("searched", null), // null until I search something
    mode: load("mode", "detailed"),
    error: null,
    refreshKey: 0
  }))

  useEffect(() => save("searched", state.location), [state.location])
  useEffect(() => save("mode", state.mode), [state.mode])

  // keep the weather fresh if the tab stays open: check every 15 min and whenever I come back to the tab
  // (useGetWeather only actually refetches if its data is over 10 min old)
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") dispatch({ type: ACTIONS.REFRESH })
    }
    const id = setInterval(refresh, 15 * 60 * 1000)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      clearInterval(id)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [])

  const Card = state.mode === "day" ? CardDay : state.mode === "week" ? CardWeek : CardDetailed
  const clearSearch = () => dispatch({ type: ACTIONS.SET_LOCATION, payload: null })

  // searched city (or my location) goes first, then the defaults without any duplicate of it
  const locations = state.location
    ? [state.location, ...defaultLocations.filter(place => !samePlace(place, state.location))]
    : defaultLocations
  const shown = locations.slice(0, state.mode === "day" ? 4 : 3)
  const cards = shown.map(location => (
    <Card
      key={`${state.mode}-${location.lat},${location.lon}`}
      location={location}
      refreshKey={state.refreshKey}
      onRemove={location === state.location ? clearSearch : null}
    />
  ))

  return (
    <div className="main-container">
      <div className="top">
        <DigitalClock />
        <Search dispatch={dispatch} />
        <ViewSwitch dispatch={dispatch} mode={state.mode} />
      </div>
      {state.error && <ErrorMessage error={state.error} dispatch={dispatch} />}
      {state.mode === "day" ? (
        <div>
          <div className="card-row">{cards.slice(0, 2)}</div>
          <div className="card-row">{cards.slice(2, 4)}</div>
        </div>
      ) : (
        <div>{cards}</div>
      )}
      <Footer />
    </div>
  )
}
