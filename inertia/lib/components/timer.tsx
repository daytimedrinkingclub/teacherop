import React, { useState, useEffect } from 'react'
import { Icons } from './icons'

type TimerProps = {
  initialTime?: number // Option to pass initial time (in seconds) if needed
}

const Timer: React.FC<TimerProps> = ({ initialTime = 0 }) => {
  const [seconds, setSeconds] = useState(initialTime) // Timer value in seconds

  useEffect(() => {
    // Start the timer when the component is mounted
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1)
    }, 1000)

    return () => clearInterval(interval) // Cleanup the interval on unmount
  }, [])

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
    const remainingSeconds = secs % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  return (
    <div className="flex items-center p-2 text-white rounded-md bg-foreground">
      <Icons.clockIcon className="flex-shrink-0 mr-1 w-5 h-5" />
      <span className="text-base font-medium">{formatTime(seconds)}</span>
    </div>
  )
}

export default Timer
