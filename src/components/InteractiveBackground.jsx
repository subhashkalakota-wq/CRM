import React, { useEffect, useRef } from 'react';

/**
 * InteractiveBackground
 * 
 * Creates a subtle, premium canvas-based glow that follows the user's cursor.
 * The glow is a radial gradient that smoothly trails the pointer.
 * Works in both light and dark themes.
 */
const InteractiveBackground = () => {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const smooth = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    const LERP = 0.07;

    const draw = () => {
      // Smooth follow
      smooth.current.x += (pointer.current.x - smooth.current.x) * LERP;
      smooth.current.y += (pointer.current.y - smooth.current.y) * LERP;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Outer large glow
      const grad = ctx.createRadialGradient(
        smooth.current.x, smooth.current.y, 0,
        smooth.current.x, smooth.current.y, 420
      );
      grad.addColorStop(0, 'rgba(167, 131, 100, 0.09)');
      grad.addColorStop(0.4, 'rgba(200, 160, 100, 0.04)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Inner bright core
      const core = ctx.createRadialGradient(
        smooth.current.x, smooth.current.y, 0,
        smooth.current.x, smooth.current.y, 80
      );
      core.addColorStop(0, 'rgba(214, 173, 96, 0.18)');
      core.addColorStop(0.5, 'rgba(214, 173, 96, 0.06)');
      core.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = core;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default InteractiveBackground;
