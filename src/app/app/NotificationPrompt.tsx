"use client";

/**
 * Notification opt-in banner.
 *
 * Appears once the user has an identity + PIN unlocked. Shows three
 * options: Enable, Later (dismiss 24h), Never (persisted decline).
 * Hidden if push is unsupported, already subscribed, or recently
 * dismissed.
 */

import { useEffect, useState } from "react";
import {
  isPushSupported,
  loadPushState,
  requestPermissionAndSubscribe,
  dismissPromptFor,
  savePushState,
  type PushLocalState,
} from "./push-register";

interface Props {
  speaqId: string;
}

export default function NotificationPrompt({ speaqId }: Props) {
  const [state, setState] = useState<PushLocalState>({ status: "pristine" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPushSupported()) {
      setState({ status: "unsupported" });
      return;
    }
    setState(loadPushState());
  }, []);

  const shouldRender = (() => {
    if (state.status === "unsupported") return false;
    if (state.status === "subscribed") return false;
    if (state.status === "declined") return false;
    if (state.status === "dismissed" && state.until > Date.now()) return false;
    if (typeof Notification !== "undefined" && Notification.permission === "denied") return false;
    return true;
  })();

  if (!shouldRender) return null;

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onEnable = async () => {
    setBusy(true);
    setErrorMsg(null);
    try {
      if (typeof Notification === "undefined") {
        setErrorMsg("Browser ondersteunt geen notificaties");
        setBusy(false);
        return;
      }
      if (Notification.permission === "denied") {
        setErrorMsg("Notificaties geblokkeerd. Ga naar Instellingen -> Notificaties -> SPEAQ om te deblokkeren");
        setBusy(false);
        return;
      }
      const next = await requestPermissionAndSubscribe(speaqId);
      setState(next);
      if (next.status === "declined") setErrorMsg("Je hebt notificaties geweigerd in het iOS dialoog");
      else if (next.status === "unsupported") setErrorMsg("Push niet ondersteund op dit apparaat");
      else if (next.status !== "subscribed") setErrorMsg("Aanmelden mislukt -- VAPID key of netwerk probleem");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Onbekende fout");
    }
    setBusy(false);
  };

  const onLater = () => {
    dismissPromptFor(24);
    setState({ status: "dismissed", until: Date.now() + 24 * 60 * 60 * 1000 });
  };

  const onNever = () => {
    savePushState({ status: "declined" });
    setState({ status: "declined" });
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 60,
        background: "#12141A",
        border: "1px solid #2A2D36",
        borderRadius: 12,
        padding: "14px 16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        color: "#E8E6DE",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#D4A853" }}>
        Stay in the loop
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.4, opacity: 0.85, marginBottom: 12 }}>
        Get notified when someone sends you a message. SPEAQ never shows the message content on the lock screen -- only that something arrived.
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          disabled={busy}
          onClick={onEnable}
          style={{
            background: "#D4A853",
            color: "#08090D",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            fontWeight: 600,
            fontSize: 13,
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? "Enabling..." : "Enable"}
        </button>
        <button
          type="button"
          onClick={onLater}
          style={{
            background: "transparent",
            color: "#E8E6DE",
            border: "1px solid #2A2D36",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Later
        </button>
        <button
          type="button"
          onClick={onNever}
          style={{
            background: "transparent",
            color: "#8B8A85",
            border: "none",
            padding: "8px 10px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Don&apos;t ask again
        </button>
      </div>
      {errorMsg && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#F87171", lineHeight: 1.4 }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}
