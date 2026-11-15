// isDay is optional: pass 0 to get night versions of clear/cloudy emojis
export default function getEmoji(code, isDay = 1) {
    const night = isDay === 0
    return code === 0 ? (night ? "🌙" : "🌞") :
        code === 1 ? (night ? "🌙" : "🌤️") :
            code === 2 ? (night ? "☁️" : "⛅") :
                code === 3 ? "🌥️" :
                    code === 45 || code === 48 ? "🌫️" :
                        code >= 51 && code <= 57 ? "💧" :
                            code === 61 ? "💧" :
                                code === 63 ? "🌧️" :
                                    code === 65 ? "🌊" :
                                        code === 66 || code === 67 ? "☔" :
                                            code === 71 ? "❄️" :
                                                code === 73 ? "🌨️" :
                                                    code === 75 ? "☃️" :
                                                        code === 77 ? "🌨️" :
                                                            code >= 80 && code <= 82 ? "🚿" :
                                                                code === 85 || code === 86 ? "🌨️" :
                                                                    code === 95 ? "⚡" :
                                                                        code === 96 ? "🌩️" :
                                                                            code === 99 ? "⛈️" :
                                                                                "❓"
}

export function describeCode(code) {
    const descriptions = {
        0: "Clear", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Freezing fog",
        51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
        56: "Freezing drizzle", 57: "Freezing drizzle",
        61: "Light rain", 63: "Rain", 65: "Heavy rain",
        66: "Freezing rain", 67: "Freezing rain",
        71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
        80: "Light showers", 81: "Showers", 82: "Heavy showers",
        85: "Snow showers", 86: "Heavy snow showers",
        95: "Thunderstorm", 96: "Thunderstorm, hail", 99: "Thunderstorm, heavy hail"
    }
    return descriptions[code] ?? "Unknown"
}

export const isSnowCode = (code) => (code >= 71 && code <= 77) || code === 85 || code === 86
export const isWetCode = (code) => code >= 51
