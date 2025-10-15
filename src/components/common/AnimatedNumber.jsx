import { useEffect, useState } from 'react';

/**
 * Componente que anima números com efeito count-up
 */
export function AnimatedNumber({ value, duration = 1000, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Extrair apenas números do value
    const numericValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^0-9.]/g, '')) 
      : value;
    
    if (isNaN(numericValue)) {
      setCount(0);
      return;
    }
    
    let start = 0;
    const end = numericValue;
    const increment = end / (duration / 16); // 60 FPS
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  // Formatar número
  const formattedCount = Number.isInteger(count) 
    ? Math.floor(count) 
    : count.toFixed(1);
  
  return (
    <span>
      {prefix}{formattedCount}{suffix}
    </span>
  );
}

export default AnimatedNumber;
