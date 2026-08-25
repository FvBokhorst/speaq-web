"use client";

import { useEffect, useRef } from "react";

/**
 * Vloeiende achtergrondanimatie in de hero.
 *
 * De videobestanden zijn byte-voor-byte dezelfde als op speaq.id, zodat beide
 * sites dezelfde beweging tonen. Er zijn twee uitvoeringen, een donkere en een
 * lichte, en de bron volgt het thema.
 *
 * Het thema wordt elders gezet door ThemeToggle, die de klasse "light" op het
 * html-element aan- en uitzet. Daarom kijken we naar die klasse in plaats van
 * naar de opslag: dan werkt dit ongeacht wie de klasse verandert.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = () => {
      const light = document.documentElement.classList.contains("light");
      const src = light ? "/hero/speaq-hero-light.mp4" : "/hero/speaq-hero.mp4";
      const poster = light
        ? "/hero/speaq-hero-light-poster.jpg"
        : "/hero/speaq-hero-poster.jpg";
      if (el.getAttribute("src") === src) return;
      el.setAttribute("src", src);
      el.poster = poster;
      el.load();
      const started = el.play();
      if (started && typeof started.catch === "function") {
        started.catch(() => {});
      }
    };

    sync();
    const waarnemer = new MutationObserver(sync);
    waarnemer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => waarnemer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none motion-reduce:hidden"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
