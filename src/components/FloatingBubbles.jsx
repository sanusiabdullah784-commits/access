import { useMemo, useState, useEffect } from 'react';

function FloatingBubbles() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Accessibility: Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // 2. Interactive Mouse Parallax
    const handleMouseMove = (e) => {
      if (mediaQuery.matches) return; // Don't calculate if reduced motion is preferred
      // Normalize mouse position from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Generate random bubbles once to prevent re-rendering glitches
  const bubbles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 80 + 30, // Random size between 30px and 110px
      left: Math.random() * 100, // Random horizontal position (0% to 100%)
      duration: Math.random() * 20 + 20, // Random float speed (20s to 40s)
      delay: Math.random() * 10, // Random start delay (0s to 10s)
      parallaxFactor: Math.random() * 0.6 + 0.2, // Depth factor (0.2 to 0.8)
    }));
  }, []);

  // 3. Accessibility: Render nothing if user prefers reduced motion
  if (reducedMotion) {
    return null;
  }

  return (
    <>
      {/* Inject custom keyframes for organic sway + float */}
      <style>{`
        @keyframes floatAndSway {
          0% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-40vh) translateX(15px); }
          66% { transform: translateY(-80vh) translateX(-15px); }
          100% { transform: translateY(-120vh) translateX(0); }
        }
        .bubble-animate {
          animation: floatAndSway linear infinite;
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {bubbles.map((bubble) => {
          // Calculate parallax offset (moves opposite to mouse for 3D depth)
          const moveX = -mousePos.x * bubble.parallaxFactor * 40;
          const moveY = -mousePos.y * bubble.parallaxFactor * 40;

          return (
            <div
              key={bubble.id}
              className="rounded-full"
              style={{
                position: 'absolute',
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
                bottom: `-${bubble.size}px`,
                // Apply parallax via margin to avoid conflicting with inner transform animation
                marginLeft: `${moveX}px`,
                marginTop: `${moveY}px`,
                transition: 'margin 0.3s ease-out',
              }}
            >
              <div 
                className="bubble-animate w-full h-full rounded-full"
                style={{
                  animationDuration: `${bubble.duration}s`,
                  animationDelay: `${bubble.delay}s`,
                  // 4. Glassmorphism & Brand Gradients
                  background: 'linear-gradient(135deg, rgba(26, 86, 219, 0.08) 0%, rgba(34, 211, 238, 0.04) 100%)',
                  boxShadow: '0 8px 32px rgba(26, 86, 219, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default FloatingBubbles;