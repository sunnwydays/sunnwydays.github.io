import { useState } from 'react'

import Search from './components/Search';
import CardDay from './components/CardDay';
import CardWeek from './components/CardWeek';
import CardDetailed from './components/CardDetailed';
import DigitalClock from './components/DigitalClock';
import Dropdown from './components/Dropdown';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';

export default function App() {
  const [city, setCity] = useState("Ottawa")
  const [searchLat, setSearchLat] = useState("45.42472")
  const [searchLon, setSearchLon] = useState("-75.69944")
  const [mode, setMode] = useState("day")
  const [error, setError] = useState(null)

  const defaultCity1 = " Toronto  " // extra space to avoid conflict with user typing "Toronto"
  const defaultLat1 = "43.661885"
  const defaultLon1 = "-79.394500"
  const defaultCity2 = " Markham  "
  const defaultLat2 = "43.8599"
  const defaultLon2 = "-79.3350"
  const defaultCity3 = " Amsterdam  "
  const defaultLat3 = "52.3676"
  const defaultLon3 = "4.9041"
  const [isLoaded, setIsLoaded] = useState({})

  return (
    <div className="main-container">
      <div className="top">
        <DigitalClock />
        <Search setLat={setSearchLat} setLon={setSearchLon} city={city} setCity={setCity} setError={setError} />
        <Dropdown mode={mode} setMode={setMode} setIsLoaded={setIsLoaded} />
      </div>
      {mode == "day" ? (
        <div>
          <div className="card-row">
            <CardDay lat={searchLat} lon={searchLon} city={city} setError={setError} isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
            <CardDay lat={defaultLat1} lon={defaultLon1} city={defaultCity1} setError={setError} isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
          </div>
          <div className="card-row">
            <CardDay lat={defaultLat2} lon={defaultLon2} city={defaultCity2} setError={setError} isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
            <CardDay lat={defaultLat3} lon={defaultLon3} city={defaultCity3} setError={setError} isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
          </div>
        </div>
      ) : mode == "week" ? (
        <div>
          <CardWeek lat={searchLat} lon={searchLon} city={city} setError={setError} isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
          <CardWeek lat={defaultLat1} lon={defaultLon1} city={defaultCity1} setError={setError} isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
          <CardWeek lat={defaultLat2} lon={defaultLon2} city={defaultCity2} setError={setError} isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
        </div>
      ) : (
        <div>
          <CardDetailed lat={searchLat} lon={searchLon} city={city} setError={setError} isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
          <CardDetailed lat={defaultLat1} lon={defaultLon1} city={defaultCity1} setError={setError} isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
          <CardDetailed lat={defaultLat2} lon={defaultLon2} city={defaultCity2} setError={setError} isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
        </div>
      )}
      {error && <ErrorMessage error={error} />}
      <Footer />
    </div>
  )
}