import { useState, useEffect } from 'react'

export interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
  isLive: boolean
  isPast: boolean
  totalSeconds: number
}

export function useCountdown(startDate: string, endDate: string): CountdownState {
  const [state, setState] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
    isPast: false,
    totalSeconds: 0,
  })

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime()
      const start = new Date(startDate).getTime()
      const end = new Date(endDate).getTime()

      // Check if live (between start and end)
      const isLive = now >= start && now < end

      // Check if past
      const isPast = now >= end

      // If past, don't calculate
      if (isPast) {
        setState({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isLive: false,
          isPast: true,
          totalSeconds: 0,
        })
        return
      }

      // Calculate time difference from now to start
      const distance = start - now
      const totalSeconds = Math.max(0, Math.floor(distance / 1000))

      const days = Math.floor(totalSeconds / (24 * 60 * 60))
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
      const seconds = totalSeconds % 60

      setState({
        days,
        hours,
        minutes,
        seconds,
        isLive,
        isPast: false,
        totalSeconds,
      })
    }

    // Calculate immediately
    calculateCountdown()

    // Update every 100ms for smooth countdown
    const interval = setInterval(calculateCountdown, 100)

    return () => clearInterval(interval)
  }, [startDate, endDate])

  return state
}
