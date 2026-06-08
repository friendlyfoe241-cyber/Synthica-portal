import { useEffect, useRef } from "react";

const Globe = () => {
  const canvasRef = useRef();

  useEffect(() => {
    let mounted = true;
    let globe = null;

    const init = async () => {
      try {
        const module = await import("https://esm.sh/cobe@0.6.3");
        const createGlobe = module.default;
        
        if (!mounted || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        let width = canvas.offsetWidth || 800;
        let phi = 0;

        globe = createGlobe(canvas, {
          devicePixelRatio: 2,
          width: width * 2,
          height: width * 2,
          phi: phi,
          theta: 0.3,
          dark: 1,
          diffuse: 2,
          mapSamples: 20000,
          mapBrightness: 20,
          baseColor: [0.2, 0.2, 0.2],
          glowColor: [1, 1, 1],
          markerColor: [1, 1, 1],
          markers: [],
          scale: 1,
          offset: [0, 0],
          onRender: (state) => {
            if (!mounted || !globe) return;
            state.phi = phi;
            phi += 0.01;
          }
        });
      } catch (e) {
        console.error('Globe init error:', e);
      }
    };

    init();

    return () => {
      mounted = false;
      if (globe) globe.destroy();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      id="hero-globe-canvas" 
      style={{ 
        width: '100%', 
        height: '100%', 
        contain: 'layout paint size', 
        userSelect: 'none',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '1800px',
        maxHeight: '1800px'
      }} 
    />
  );
};

export default Globe;
