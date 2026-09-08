import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, className = '', threshold = 0.05 }) {
  const [isVisible, setIsVisible] = useState(true);
  const domRef = useRef(null);

  useEffect(() => {
    // Fail-safe: Always ensure visibility after 100ms even if observer fails
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      try {
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                setIsVisible(true);
                if (domRef.current) observer.unobserve(domRef.current);
              }
            });
          },
          { threshold }
        );

        const currentRef = domRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
          clearTimeout(timer);
          if (currentRef) observer.unobserve(currentRef);
        };
      } catch (e) {
        setIsVisible(true);
      }
    }

    return () => clearTimeout(timer);
  }, [threshold]);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'} ${className}`}
    >
      {children}
    </div>
  );
}

