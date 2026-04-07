"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("speaq_cookie_noted");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  function handleDismiss() {
    localStorage.setItem("speaq_cookie_noted", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-lg mx-auto bg-bg-card border border-[rgba(100,116,139,0.2)] rounded-xl px-5 py-4 flex items-center justify-between gap-4 shadow-lg backdrop-blur-sm">
        <p className="text-sm text-text-secondary leading-snug">
          SPEAQ uses no cookies, trackers, or analytics. Your privacy is absolute.
        </p>
        <button
          onClick={handleDismiss}
          className="shrink-0 px-4 py-2 text-sm font-medium text-bg-deep bg-quantum-teal rounded-lg hover:opacity-90 transition-opacity"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
