import { useEffect } from "react";
import { useLocation } from "wouter";

export function IntroSplash() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const end = Date.now() + 3 * 1000;

    (function frame() {
      if (window.confetti) {
        window.confetti({
          particleCount: 70,
          spread: 70,
          origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
      }
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    const timeout = setTimeout(() => {
      setLocation("/welcome");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [setLocation]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] text-center">
      <h1 
        className="text-5xl md:text-6xl font-bold mb-2 tracking-wider"
        style={{
          color: '#ffb26b',
          textShadow: '0 0 18px rgba(255, 178, 107, 0.8)'
        }}
        data-testid="text-intro-title"
      >
        Happy Birthday Dave!
      </h1>
      <p 
        className="text-xl text-white animate-fade-in-up"
        data-testid="text-intro-subtitle"
      >
        Get ready for your birthday challenge...
      </p>
    </div>
  );
}
