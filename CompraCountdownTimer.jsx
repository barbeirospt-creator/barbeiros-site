
import React, { useState, useEffect } from 'react';

export default function CompraCountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!deadline) {
      setTimeLeft('Sem prazo');
      return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(deadline) - new Date();
      
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft('Expirado');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute to save resources

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <span className={`font-medium ${isExpired ? 'text-red-400' : 'text-gray-300'}`}>
      {timeLeft}
    </span>
  );
}
