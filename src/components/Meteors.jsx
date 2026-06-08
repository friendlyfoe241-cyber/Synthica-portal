import { useEffect, useState, useCallback, useRef } from "react";

const Meteors = () => {
  const containerRef = useRef(null);
  const tailLengths = [100, 150, 200];
  const [activeMeteors, setActiveMeteors] = useState([]);

  const isPositionValid = (x, y, existing) => {
    const minDistance = window.innerWidth * 0.05;
    return !existing.some(pos => {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      return distance < minDistance;
    });
  };

  const createMeteor = useCallback((tailLength, delay = 0) => {
    if (window.scrollY > window.innerHeight * 0.1) return;

    setTimeout(() => {
      let startX, startY, attempts = 0;
      do {
        startX = Math.random() * (window.innerWidth * 0.5);
        startY = Math.random() * (window.innerHeight * 0.35);
        attempts++;
      } while (!isPositionValid(startX, startY, activeMeteors) && attempts < 10);

      const id = Math.random().toString(36).substr(2, 9);
      const duration = 2 + Math.random();

      const newMeteor = { id, x: startX, y: startY, tailLength, duration };
      
      setActiveMeteors(prev => [...prev, newMeteor]);

      setTimeout(() => {
        setActiveMeteors(prev => prev.filter(m => m.id !== id));
      }, duration * 1000);
    }, delay);
  }, [activeMeteors]);

  useEffect(() => {
    let timeout;
    const runGroup = () => {
      for (let i = 0; i < 3; i++) {
        createMeteor(tailLengths[i], i * 200);
      }
      timeout = setTimeout(runGroup, 4000); // Frequency adjust
    };

    const initialTimeout = setTimeout(runGroup, 1000);
    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timeout);
    };
  }, [createMeteor]);

  return (
    <div className="meteors-container" ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {activeMeteors.map(meteor => (
        <div
          key={meteor.id}
          className="meteor"
          style={{
            left: `${meteor.x}px`,
            top: `${meteor.y}px`,
            '--tail-length': `${meteor.tailLength}px`,
            animation: `meteor-fall ${meteor.duration}s linear forwards`
          }}
        />
      ))}
    </div>
  );
};

export default Meteors;
