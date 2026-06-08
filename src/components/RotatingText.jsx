import { useState, useEffect } from 'react';

const RotatingText = ({ texts, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('slide-in-up');

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationClass('slide-up');
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setAnimationClass('slide-in-up');
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [texts, interval]);

  return (
    <span className="rotating-text-wrapper">
      <span className={`rotating-text ${animationClass}`}>
        {texts[currentIndex]}
      </span>
    </span>
  );
};

export default RotatingText;
