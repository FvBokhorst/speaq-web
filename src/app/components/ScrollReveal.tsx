"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  glow?: boolean;
}

export default function ScrollReveal({ children, delay = 0, className = "", glow = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            if (glow) {
              el.style.boxShadow = "0 0 40px rgba(212, 168, 83, 0.1)";
            }
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, glow]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(80px)",
        transition: "opacity 0.9s ease-out, transform 0.9s ease-out, box-shadow 0.9s ease-out",
        background: "transparent",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}
