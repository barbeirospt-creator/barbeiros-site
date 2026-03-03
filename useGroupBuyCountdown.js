import { useState, useEffect } from 'react';

export function useGroupBuyCountdown(deadline) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!deadline) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeRemaining('Expirado');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      let result = '';
      if (days > 0) result += `${days} dias `;
      if (hours > 0) result += `${hours}h `;
      if (minutes > 0) result += `${minutes}m `;
      if (days === 0 && hours === 0) result += `${seconds}s`;

      setTimeRemaining(result.trim());
      setIsExpired(false);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return { timeRemaining, isExpired };
}