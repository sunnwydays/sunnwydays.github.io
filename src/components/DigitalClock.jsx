import { useState, useEffect } from 'react'

export default function DigitalClock() {
    const [time, setTime] = useState(new Date())
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => {
            clearInterval(intervalId) /*stop the prev timer from continuing to run */
        }
    }, [])

    const formatTime = () => {
        let hours = time.getHours() //using let instead of const because value will change
        const meridiem = hours < 12 ? "AM" : "PM"
        hours = hours % 12 || 12     //if the first thing is 0, then ok, if not, then second thing
        const minutes = time.getMinutes()
        return `${hours}:${String(minutes).padStart(2, "0")} ${meridiem}`
    }

    return (
        <div className="clock">
            <span>{formatTime()}</span>
        </div>
    )
}