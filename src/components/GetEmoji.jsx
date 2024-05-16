export default function GetEmoji(code) {
    return code === 0 ? "🌞" :
        code === 1 ? "🌤️" :
            code === 2 ? "⛅" :
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
                                                            code === 80 || code === 81 ? "🚿" :
                                                                code === 85 || code === 86 ? "🚿" :
                                                                    code === 95 ? "⚡" :
                                                                        code === 96 ? "🌩️" :
                                                                            code === 97 ? "⛈️" :
                                                                                "❓"
}