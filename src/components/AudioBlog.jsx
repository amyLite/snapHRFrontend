import React, { useEffect, useRef } from 'react';

export default function AudioBlob() {
  const circleRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;

    const interval = setInterval(() => {
      if (!circle) return;

      const blur = Math.floor(Math.random() * 40) + 10;   // 10 to 50
      const spread = Math.floor(Math.random() * 20);      // 0 to 20

      const shadow = `0 0 ${blur}px ${spread}px rgba(100, 200, 255, 0.6)`;
      circle.style.boxShadow = shadow;
    }, 100); // every 100ms for a smooth visual effect

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={circleRef}
      className="w-40 h-40 rounded-full bg-blue-400 transition-shadow duration-100 ease-in-out"
    />
  );
}
