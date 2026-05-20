import { formatCountdown } from '../utils/formatters'
import { useCountdown } from '../hooks/useCountdown'

interface CountdownTimerProps {
  startDate: string
  endDate: string
  variant?: 'compact' | 'expanded'
  size?: 'sm' | 'md' | 'lg'
}

interface TimeUnit {
  value: number
  label: string
  color: string
}

export function CountdownTimer({
  startDate,
  endDate,
  variant = 'compact',
  size = 'md',
}: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isLive, isPast } = useCountdown(startDate, endDate)

  if (isPast) {
    return (
      <div className="text-center py-6">
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl text-white font-bold">
          ✓ Event Ended
        </div>
      </div>
    )
  }

  if (isLive) {
    return (
      <div className="text-center">
        <div className={`inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold pulse-glow ${
          size === 'sm' ? 'text-base' : size === 'lg' ? 'text-3xl' : 'text-xl'
        }`}>
          🔴 LIVE NOW
        </div>
      </div>
    )
  }

  const countdown = formatCountdown(days, hours, minutes, seconds)
  const timeUnits: TimeUnit[] = [
    { value: days, label: 'Days', color: 'from-blue-500 to-cyan-500' },
    { value: hours, label: 'Hours', color: 'from-purple-500 to-pink-500' },
    { value: minutes, label: 'Minutes', color: 'from-orange-500 to-red-500' },
    { value: seconds, label: 'Seconds', color: 'from-green-500 to-emerald-500' },
  ]

  if (variant === 'expanded') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className={`card bg-gradient-to-br ${unit.color} relative overflow-hidden group tap-target`}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300" />

              {/* Content */}
              <div className="relative p-4 md:p-6 text-center text-white">
                <div className={`font-bold tabular-nums ${
                  size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-5xl' : 'text-4xl'
                }`}>
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm font-semibold mt-2 opacity-90">
                  {unit.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact display below */}
        <div className="text-center text-sm md:text-base text-gray-600 font-mono bg-white/50 backdrop-blur-sm rounded-xl p-4">
          {countdown}
        </div>
      </div>
    )
  }

  return (
    <div className={`text-center font-mono font-bold text-gray-900 inline-block px-6 py-3 bg-white/50 backdrop-blur-sm rounded-xl border-2 border-gray-200 ${
      size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl md:text-3xl' : 'text-lg'
    }`}>
      {countdown}
    </div>
  )
}
