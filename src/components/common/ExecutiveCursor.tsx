import React, { useEffect, useState, useRef } from 'react';

/**
 * ExecutiveCursor.tsx
 * Ultra-sleek, precision cursor with interactive hover dynamics for executive web applications.
 * Automatically respects touch/mobile devices and accessibility settings.
 */
export const ExecutiveCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Position references for 60fps smooth animation
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Check if device supports fine mouse pointer (desktop/laptop)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check interactive element under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest(
            'button, a, [role="button"], input[type="submit"], input[type="button"], select, .cursor-pointer, [data-cursor="pointer"], [data-clickable="true"]'
          )
        );
        const isText = Boolean(
          target.closest('input[type="text"], input[type="email"], input[type="search"], textarea, [contenteditable="true"]')
        );

        setIsHovered(isClickable);
        setIsTextInput(isText);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    // Smooth animation loop for trailing ring
    const animate = () => {
      // Lerp for smooth spring following effect
      const ease = 0.22;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Precision Inner Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[99999] rounded-full transition-transform duration-75 ease-out ${
          isTextInput
            ? 'w-1 h-4 bg-[#00C896] rounded-xs opacity-70'
            : isClicked
            ? 'w-1.5 h-1.5 bg-[#00E5AA] scale-75'
            : isHovered
            ? 'w-2 h-2 bg-[#00E5AA] scale-125 shadow-[0_0_8px_#00E5AA]'
            : 'w-1.5 h-1.5 bg-[#00C896] opacity-90'
        }`}
      />

      {/* Floating Interactive Outer Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[99998] rounded-full transition-[width,height,background-color,border-color,box-shadow] duration-200 ease-out flex items-center justify-center ${
          isTextInput
            ? 'w-0 h-0 border-transparent opacity-0'
            : isClicked
            ? 'w-7 h-7 border border-[#00E5AA] bg-[#00C896]/20 scale-90 shadow-[0_0_12px_rgba(0,200,150,0.4)]'
            : isHovered
            ? 'w-11 h-11 border-2 border-[#00E5AA] bg-[#00C896]/15 shadow-[0_0_20px_rgba(0,200,150,0.35)] scale-110'
            : 'w-7 h-7 border border-[#00C896]/45 bg-transparent opacity-60'
        }`}
      />
    </>
  );
};

export default ExecutiveCursor;
