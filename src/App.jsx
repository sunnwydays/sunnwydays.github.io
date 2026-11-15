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

const DEFAULT_SEARCH = { name: "Ottawa, Ontario, CA", lat: 45.42472, lon: -75.69944 }

const defaultLocations = [
  { name: "Toronto", lat: 43.661885, lon: -79.3945 },
  { name: "Markham", lat: 43.8599, lon: -79.335 },
  { name: "Amsterdam", lat: 52.3676, lon: 4.9041 }
];

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
    location: load("location", DEFAULT_SEARCH),
    mode: load("mode", "detailed"),
    error: null,
    refreshKey: 0
  }))

  useEffect(() => save("location", state.location), [state.location])
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
  const card = (location) => <Card key={`${state.mode}-${location.lat},${location.lon}`} location={location} refreshKey={state.refreshKey} />

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
          <div className="card-row">
            {card(defaultLocations[0])}
            {card(defaultLocations[1])}
          </div>
          <div className="card-row">
            {card(state.location)}
            {card(defaultLocations[2])}
          </div>
        </div>
      ) : (
        <div>
          {card(defaultLocations[0])}
          {card(defaultLocations[1])}
          {card(state.location)}
        </div>
      )}
      <Footer />
    </div>
  )
}
