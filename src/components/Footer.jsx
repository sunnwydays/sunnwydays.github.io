export default function Footer() {
    return (
        <footer>
            <a href="https://water.usgs.gov/edu/activity-howmuchrain-metric.html">Moderate rain is 0.5-4.0 mm/h</a><br />
            <a href="https://www.canada.ca/en/environment-climate-change/services/weather-health/uv-index-sun-safety.html">Moderate UV is 3-5, highest around noon</a><br />
            <a href="https://www.canada.ca/en/environment-climate-change/services/general-marine-weather-information/understanding-forecasts/beaufort-wind-scale-table.html">11-16 km/h wind moves small branches, raises paper</a><br />
            <a href="https://www.airnow.gov/aqi/aqi-basics/">AQI under 50 is good, over 100 is unhealthy for sensitive groups</a><br />
            Average Toronto humidity is 61%<br />
            <div>
                Weather from <a href="https://open-meteo.com/">open-meteo.com</a><br />
                <a href="https://github.com/sunnwydays">Made with React,</a> card times are local to each city<br />
                Sunny Day! 2024-2026
            </div>
        </footer>        
    )
}
/* Features:
Weather
3 display modes
Search by city
Clock
Outlier days (cancelled) - would've probably been if the min/max temperature was 25% off from the weekly mean
Ultimate-recommended weather (cancelled)
Intuition scale (cancelled)
other notes see my notes
*/