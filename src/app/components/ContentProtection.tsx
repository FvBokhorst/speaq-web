"use client";

import { useEffect } from "react";

export default function ContentProtection() {
  useEffect(() => {
    const preventContext = (e: MouseEvent) => e.preventDefault();
    const preventCopy = (e: ClipboardEvent) => e.preventDefault();
    document.addEventListener("contextmenu", preventContext);
    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    return () => {
      document.removeEventListener("contextmenu", preventContext);
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
    };
  }, []);
  return null;
}
