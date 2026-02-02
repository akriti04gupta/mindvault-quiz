import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TimerRingProps {
  duration: number;
  timeRemaining: number;
  size?: number;
  strokeWidth?: number;
  onTick?: (time: number) => void;
}

const TimerRing = ({
  duration,
  timeRemaining,
  size = 100,
  strokeWidth = 6,
  onTick,
}: TimerRingProps) => {
  const prevTimeRef = useRef(timeRemaining);

  useEffect(() => {
    if (prevTimeRef.current !== timeRemaining && onTick) {
      onTick(timeRemaining);
    }
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining, onTick]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.max(0, timeRemaining / duration);
  const offset = circumference * (1 - progress);

  const getColor = () => {
    if (progress > 0.5) return 'hsl(var(--timer-ring))';
    if (progress > 0.25) return 'hsl(var(--timer-warning))';
    return 'hsl(var(--timer-danger))';
  };

  const getAnimationClass = () => {
    if (progress > 0.5) return '';
    if (progress > 0.25) return 'timer-warning';
    return 'timer-danger';
  };

  const getTextColor = () => {
    if (progress > 0.5) return 'text-primary';
    if (progress > 0.25) return 'text-timer-warning';
    return 'text-timer-danger';
  };

  return (
    <div
      className={`relative overflow-hidden rounded-full ${getAnimationClass()}`}
      style={{ width: size, height: size }}
    >
      {/* Progress ring ONLY (background ring removed to avoid square outline) */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.3s linear, stroke 0.3s ease',
            filter: `drop-shadow(0 0 8px ${getColor()})`,
          }}
        />
      </svg>

      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={timeRemaining}
          initial={{ scale: 1.3, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`font-display text-2xl font-bold ${getTextColor()}`}
        >
          {timeRemaining}
        </motion.span>
      </div>
    </div>
  );
};

export default TimerRing;
