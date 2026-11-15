import useGetWeather from './useGetWeather';
import getEmoji from './getEmoji';
import NowSummary, { CardHeader, CardStatus } from './NowSummary';
import { weekday, windArrowStyle } from './weatherUtils';

export default function Card({ location, refreshKey }) {
  const { weather, aqi, error, updated } = useGetWeather(location.lat, location.lon, refreshKey)

  if (!weather) return <CardStatus name={location.name} error={error} className="card-container-week" />

  const { daily } = weather
  const days = daily.time.slice(0, 7)

  // scale for the little temperature range bars, based on this week's coldest and warmest
  const weekMin = Math.min(...daily.temperature_2m_min.slice(0, 7))
  const weekMax = Math.max(...daily.temperature_2m_max.slice(0, 7))
  const toPercent = (t) => ((t - weekMin) / (weekMax - weekMin || 1)) * 100

  return (
    <div className="card-container card-container-week">
      <CardHeader name={location.name} weather={weather} updated={updated} error={error} />
      <NowSummary weather={weather} aqi={aqi} />
      <div className="weather-container">
        <div className="label-container">
          <p>&nbsp;</p>
          <p className="emoji-space">&nbsp;</p>
          <p className="temperature">max</p>
          <p className="temperature">min</p>
          <p className="temperature">&nbsp;</p>
          <p className="temperature">rain</p>
          <p className="temperature">precip</p>
          <p className="temperature">wind</p>
          <p className="temperature">max UV</p>
        </div>
        <div className="detail-container detail-container-week">
          {days.map((date, index) => (
            <div key={date} className={index === 0 ? "detail-column-week current-detail-column" : "detail-column-week"}>
              <p>{index === 0 ? "Today" : weekday(date)}</p>
              <p className="emoji">{getEmoji(daily.weather_code[index])}</p>
              <p className="temperature">{Math.round(daily.temperature_2m_max[index])}°</p>
              <p className="temperature muted">{Math.round(daily.temperature_2m_min[index])}°</p>
              <p className="temperature">
                <span className="range-bar">
                  <span style={{
                    left: `${toPercent(daily.temperature_2m_min[index])}%`,
                    right: `${100 - toPercent(daily.temperature_2m_max[index])}%`
                  }} />
                </span>
              </p>
              <p className={daily.precipitation_probability_max[index] >= 50 ? "temperature rain-high" : "temperature"}>
                {daily.precipitation_probability_max[index]}%
              </p>
              <p className="temperature">{daily.precipitation_sum[index].toFixed(1)} mm</p>
              <p className="temperature" title={`gusts up to ${Math.round(daily.wind_gusts_10m_max[index])} km/h`}>
                {daily.wind_speed_10m_max[index].toFixed(0)} km/h{" "}
                <span className="arrow" style={windArrowStyle(daily.wind_direction_10m_dominant[index])}>↑</span>
              </p>
              <p className="temperature">{daily.uv_index_max[index].toFixed(1)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
