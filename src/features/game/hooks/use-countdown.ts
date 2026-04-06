import { useEffect, useState } from "react";

export function useCountdown(initialValue: number) {
  const [timeLeft, setTimeLeft] = useState(initialValue);

  useEffect(() => {
    if (timeLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timeLeft]);

  return timeLeft;
}
