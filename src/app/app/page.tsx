"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { generateId, deriveKey, encrypt, decrypt } from "./crypto";
import { languages, Lang } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Identity {
  speaqId: string;
  displayName: string;
  createdAt: number;
}

interface Contact {
  speaqId: string;
  name: string;
  addedAt: number;
}

interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
}

type Screen = "welcome" | "main" | "chat" | "addContact";
type Tab = "chats" | "contacts" | "wallet" | "settings";

// ---------------------------------------------------------------------------
// i18n for app screens
// ---------------------------------------------------------------------------

const appStrings: Record<string, Record<Lang, string>> = {
  "welcome.title": {
    en: "Welcome to SPEAQ",
    nl: "Welkom bij SPEAQ",
    fr: "Bienvenue sur SPEAQ",
    es: "Bienvenido a SPEAQ",
    ru: "Dobro pozalovat' v SPEAQ",
    de: "Willkommen bei SPEAQ",
    sl: "Dobrodosli v SPEAQ",
    lg: "Tukusanyukidde ku SPEAQ",
    sw: "Karibu SPEAQ",
  },
  "welcome.enterName": {
    en: "Enter your name",
    nl: "Voer je naam in",
    fr: "Entrez votre nom",
    es: "Ingresa tu nombre",
    ru: "Vvedite vashe imya",
    de: "Gib deinen Namen ein",
    sl: "Vnesi svoje ime",
    lg: "Wandika erinnya lyo",
    sw: "Weka jina lako",
  },
  "welcome.create": {
    en: "Create Identity",
    nl: "Identiteit aanmaken",
    fr: "Creer une identite",
    es: "Crear identidad",
    ru: "Sozdat' lichnost'",
    de: "Identitat erstellen",
    sl: "Ustvari identiteto",
    lg: "Tonda obuntukirivu",
    sw: "Unda Utambulisho",
  },
  "tab.chats": {
    en: "Chats", nl: "Chats", fr: "Discussions", es: "Chats",
    ru: "Chaty", de: "Chats", sl: "Klepeti", lg: "Byokwogerako", sw: "Mazungumzo",
  },
  "tab.contacts": {
    en: "Contacts", nl: "Contacten", fr: "Contacts", es: "Contactos",
    ru: "Kontakty", de: "Kontakte", sl: "Stiki", lg: "Abantu", sw: "Wasiliani",
  },
  "tab.wallet": {
    en: "Wallet", nl: "Wallet", fr: "Portefeuille", es: "Billetera",
    ru: "Koshelek", de: "Wallet", sl: "Denarnica", lg: "Wallet", sw: "Mkoba",
  },
  "tab.settings": {
    en: "Settings", nl: "Instellingen", fr: "Parametres", es: "Ajustes",
    ru: "Nastroiki", de: "Einstellungen", sl: "Nastavitve", lg: "Entegeka", sw: "Mipangilio",
  },
  "chat.secured": {
    en: "Quantum Secured", nl: "Quantum Beveiligd", fr: "Securise Quantique",
    es: "Seguridad Cuantica", ru: "Kvantovaya zaschita", de: "Quantengesichert",
    sl: "Kvantno zasciteno", lg: "Quantum Ekuumiddwa", sw: "Usalama wa Quantum",
  },
  "chat.placeholder": {
    en: "Type a message...", nl: "Typ een bericht...", fr: "Tapez un message...",
    es: "Escribe un mensaje...", ru: "Napishite soobshchenie...",
    de: "Nachricht eingeben...", sl: "Vpisi sporocilo...",
    lg: "Wandika obubaka...", sw: "Andika ujumbe...",
  },
  "contacts.add": {
    en: "Add Contact", nl: "Contact toevoegen", fr: "Ajouter un contact",
    es: "Agregar contacto", ru: "Dobavit' kontakt", de: "Kontakt hinzufugen",
    sl: "Dodaj stik", lg: "Gattako omuntu", sw: "Ongeza mtu",
  },
  "contacts.yourId": {
    en: "Your SPEAQ ID", nl: "Jouw SPEAQ ID", fr: "Votre SPEAQ ID",
    es: "Tu SPEAQ ID", ru: "Vash SPEAQ ID", de: "Deine SPEAQ ID",
    sl: "Tvoj SPEAQ ID", lg: "SPEAQ ID yo", sw: "SPEAQ ID yako",
  },
  "settings.profile": {
    en: "Profile", nl: "Profiel", fr: "Profil", es: "Perfil",
    ru: "Profil'", de: "Profil", sl: "Profil", lg: "Profayilo", sw: "Wasifu",
  },
  "settings.language": {
    en: "Language", nl: "Taal", fr: "Langue", es: "Idioma",
    ru: "Yazyk", de: "Sprache", sl: "Jezik", lg: "Olulimi", sw: "Lugha",
  },
  "settings.deleteAll": {
    en: "Delete All Data", nl: "Alle data verwijderen", fr: "Supprimer toutes les donnees",
    es: "Eliminar todos los datos", ru: "Udalit' vse dannye",
    de: "Alle Daten loschen", sl: "Izbrisi vse podatke",
    lg: "Sazaamu data yonna", sw: "Futa data yote",
  },
  "settings.deleteConfirm": {
    en: "Are you sure? This cannot be undone.",
    nl: "Weet je het zeker? Dit kan niet ongedaan worden.",
    fr: "Etes-vous sur ? Cette action est irreversible.",
    es: "Estas seguro? Esto no se puede deshacer.",
    ru: "Vy uvereny? Eto nel'zya otmenit'.",
    de: "Bist du sicher? Dies kann nicht ruckgangig gemacht werden.",
    sl: "Ali ste prepricani? Tega ni mogoce razveljaviti.",
    lg: "Oli mukakafu? Kino tekisoboka kukyusibwa.",
    sw: "Una uhakika? Hii haiwezi kutenduliwa.",
  },
  "addContact.title": {
    en: "Add Contact", nl: "Contact toevoegen", fr: "Ajouter un contact",
    es: "Agregar contacto", ru: "Dobavit' kontakt", de: "Kontakt hinzufugen",
    sl: "Dodaj stik", lg: "Gattako omuntu", sw: "Ongeza mtu",
  },
  "addContact.id": {
    en: "SPEAQ ID", nl: "SPEAQ ID", fr: "SPEAQ ID", es: "SPEAQ ID",
    ru: "SPEAQ ID", de: "SPEAQ ID", sl: "SPEAQ ID", lg: "SPEAQ ID", sw: "SPEAQ ID",
  },
  "addContact.name": {
    en: "Display Name", nl: "Weergavenaam", fr: "Nom d'affichage", es: "Nombre visible",
    ru: "Imya", de: "Anzeigename", sl: "Prikazano ime", lg: "Erinnya", sw: "Jina",
  },
  "addContact.save": {
    en: "Save", nl: "Opslaan", fr: "Enregistrer", es: "Guardar",
    ru: "Sohranit'", de: "Speichern", sl: "Shrani", lg: "Tereka", sw: "Hifadhi",
  },
  "wallet.coming": {
    en: "Wallet coming soon", nl: "Wallet binnenkort beschikbaar",
    fr: "Portefeuille bientot disponible", es: "Billetera proximamente",
    ru: "Koshelek skoro", de: "Wallet kommt bald",
    sl: "Denarnica kmalu", lg: "Wallet ejja mangu", sw: "Mkoba unakuja hivi karibuni",
  },
  "noChats": {
    en: "No conversations yet", nl: "Nog geen gesprekken",
    fr: "Pas encore de conversations", es: "Sin conversaciones aun",
    ru: "Net razgovorov", de: "Noch keine Gesprache",
    sl: "Se ni pogovorov", lg: "Tewali byokwogerako", sw: "Hakuna mazungumzo bado",
  },
  "noContacts": {
    en: "No contacts yet", nl: "Nog geen contacten",
    fr: "Pas encore de contacts", es: "Sin contactos aun",
    ru: "Net kontaktov", de: "Noch keine Kontakte",
    sl: "Se ni stikov", lg: "Tewali bantu", sw: "Hakuna wasiliani bado",
  },
};

function t(key: string, lang: Lang): string {
  return appStrings[key]?.[lang] ?? appStrings[key]?.en ?? key;
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------------------------------------------------------------------------
// SVG Icons (no emoji)
// ---------------------------------------------------------------------------

function IconChat({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function IconUsers({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconWallet({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <path d="M1 10h22" />
    </svg>
  );
}

function IconSettings({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function IconBack({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconSend({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconPlus({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconShield({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCopy({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function IconTrash({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function IconGlobe({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SPEAQ Logo SVG
// ---------------------------------------------------------------------------

function SpeaqLogo({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="90" stroke="#D4A853" strokeWidth="3" opacity="0.3" />
      <circle cx="100" cy="100" r="70" stroke="#D4A853" strokeWidth="2" opacity="0.15" />
      <text x="100" y="120" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="72" fontWeight="700" fill="#F1F5F9">
        S
      </text>
      <text x="100" y="120" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="72" fontWeight="700" fill="url(#goldGrad)" opacity="0.3">
        S
      </text>
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A853" />
          <stop offset="100%" stopColor="#E8C47A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RELAY_URL = "wss://speaq-relay-244491980730.europe-west1.run.app";

// ---------------------------------------------------------------------------
// Main App Component
// ---------------------------------------------------------------------------

export default function SpeaqApp() {
  // State
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [screen, setScreen] = useState<Screen>("welcome");
  const [tab, setTab] = useState<Tab>("chats");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputText, setInputText] = useState("");
  const [newContactId, setNewContactId] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [copied, setCopied] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadJSON<Identity | null>("speaq_identity", null);
    if (saved) {
      setIdentity(saved);
      setScreen("main");
    }
    setContacts(loadJSON<Contact[]>("speaq_contacts", []));
    setMessages(loadJSON<Record<string, Message[]>>("speaq_messages", {}));
    const savedLang = localStorage.getItem("speaq_lang");
    if (savedLang && languages.some((l) => l.code === savedLang)) {
      setLang(savedLang as Lang);
    }
  }, []);

  // Save contacts & messages on change
  useEffect(() => {
    if (contacts.length > 0) saveJSON("speaq_contacts", contacts);
  }, [contacts]);

  useEffect(() => {
    if (Object.keys(messages).length > 0) saveJSON("speaq_messages", messages);
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  // Handle incoming WS message
  const handleWsMessage = useCallback(
    async (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        // Accept RECEIVE_SEALED or RECEIVE
        if (
          (msg.type === "RECEIVE_SEALED" || msg.type === "RECEIVE") &&
          msg.blob &&
          identity
        ) {
          const fromId = msg.from;
          if (!fromId) return;

          // Derive key and decrypt
          const key = await deriveKey(identity.speaqId, fromId);
          let plaintext: string;
          try {
            plaintext = await decrypt(key, msg.blob);
          } catch {
            // Could not decrypt -- possibly different encryption scheme
            console.warn("[SPEAQ] Decryption failed for message from", fromId);
            return;
          }

          let parsed: { text?: string; from?: string; senderId?: string; timestamp?: number };
          try {
            parsed = JSON.parse(plaintext);
          } catch {
            parsed = { text: plaintext };
          }

          const text = parsed.text || plaintext;
          const senderId = parsed.senderId || fromId;

          const newMsg: Message = {
            id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
            text,
            fromMe: false,
            timestamp: parsed.timestamp || Date.now(),
          };

          setMessages((prev) => {
            const updated = { ...prev };
            const existing = updated[senderId] || [];
            updated[senderId] = [...existing, newMsg];
            return updated;
          });

          // Auto-add contact if not known
          setContacts((prev) => {
            if (prev.some((c) => c.speaqId === senderId)) return prev;
            const name = parsed.from || senderId.substring(0, 8);
            return [...prev, { speaqId: senderId, name, addedAt: Date.now() }];
          });
        }
      } catch (e) {
        console.error("[SPEAQ] WS message parse error:", e);
      }
    },
    [identity]
  );

  // WebSocket connection
  const connectWs = useCallback(() => {
    if (!identity) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(RELAY_URL);

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: "AUTH", speaqId: identity.speaqId }));
    };

    ws.onmessage = handleWsMessage;

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
      reconnectTimer.current = setTimeout(connectWs, 3000);
    };

    ws.onerror = () => {
      setConnected(false);
    };

    wsRef.current = ws;
  }, [identity, handleWsMessage]);

  // Connect when identity available
  useEffect(() => {
    if (identity) connectWs();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [identity, connectWs]);

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Handlers
  const createIdentity = () => {
    if (!nameInput.trim()) return;
    const id: Identity = {
      speaqId: generateId(),
      displayName: nameInput.trim(),
      createdAt: Date.now(),
    };
    saveJSON("speaq_identity", id);
    setIdentity(id);
    setScreen("main");
  };

  const sendMsg = async () => {
    if (!inputText.trim() || !activeContact || !identity || !wsRef.current) return;
    if (wsRef.current.readyState !== WebSocket.OPEN) return;

    const plainPayload = JSON.stringify({
      type: "message",
      text: inputText.trim(),
      from: identity.displayName,
      senderId: identity.speaqId,
      timestamp: Date.now(),
    });

    const key = await deriveKey(identity.speaqId, activeContact.speaqId);
    const blob = await encrypt(key, plainPayload);

    wsRef.current.send(
      JSON.stringify({
        type: "SEND_SEALED",
        to: activeContact.speaqId,
        blob,
      })
    );

    const newMsg: Message = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      text: inputText.trim(),
      fromMe: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => {
      const updated = { ...prev };
      const existing = updated[activeContact.speaqId] || [];
      updated[activeContact.speaqId] = [...existing, newMsg];
      return updated;
    });

    setInputText("");
  };

  const addContact = () => {
    if (!newContactId.trim() || !newContactName.trim()) return;
    const contact: Contact = {
      speaqId: newContactId.trim().toLowerCase(),
      name: newContactName.trim(),
      addedAt: Date.now(),
    };
    setContacts((prev) => {
      if (prev.some((c) => c.speaqId === contact.speaqId)) return prev;
      return [...prev, contact];
    });
    setNewContactId("");
    setNewContactName("");
    setScreen("main");
  };

  const openChat = (contact: Contact) => {
    setActiveContact(contact);
    setScreen("chat");
  };

  const deleteAllData = () => {
    if (!confirm(t("settings.deleteConfirm", lang))) return;
    localStorage.removeItem("speaq_identity");
    localStorage.removeItem("speaq_contacts");
    localStorage.removeItem("speaq_messages");
    localStorage.removeItem("speaq_lang");
    setIdentity(null);
    setContacts([]);
    setMessages({});
    setScreen("welcome");
    if (wsRef.current) wsRef.current.close();
  };

  const copyId = () => {
    if (!identity) return;
    navigator.clipboard.writeText(identity.speaqId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const changeLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("speaq_lang", newLang);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getLastMessage = (contactId: string): string => {
    const msgs = messages[contactId];
    if (!msgs || msgs.length === 0) return "";
    return msgs[msgs.length - 1].text;
  };

  const getLastTimestamp = (contactId: string): number => {
    const msgs = messages[contactId];
    if (!msgs || msgs.length === 0) return 0;
    return msgs[msgs.length - 1].timestamp;
  };

  // Chat list: contacts that have messages, sorted by last message time
  const chatList = contacts
    .filter((c) => (messages[c.speaqId]?.length ?? 0) > 0)
    .sort((a, b) => getLastTimestamp(b.speaqId) - getLastTimestamp(a.speaqId));

  // -----------------------------------------------------------------------
  // RENDER: Welcome Screen
  // -----------------------------------------------------------------------
  if (screen === "welcome") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col items-center justify-center px-6">
        <SpeaqLogo size={96} />
        <h1 className="mt-6 text-2xl font-heading font-bold text-text-primary">
          {t("welcome.title", lang)}
        </h1>
        <p className="mt-2 text-sm text-text-secondary text-center max-w-xs">
          Quantum-encrypted messaging
        </p>
        <div className="mt-8 w-full max-w-xs space-y-4">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createIdentity()}
            placeholder={t("welcome.enterName", lang)}
            className="w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-base focus:outline-none focus:border-voice-gold/50 transition-colors"
            autoFocus
          />
          <button
            onClick={createIdentity}
            disabled={!nameInput.trim()}
            className="w-full py-3 rounded-xl bg-voice-gold text-bg-deep font-body font-semibold text-base transition-all hover:bg-voice-warm disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
          >
            {t("welcome.create", lang)}
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // RENDER: Add Contact Screen
  // -----------------------------------------------------------------------
  if (screen === "addContact") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 bg-bg-surface border-b border-[rgba(100,116,139,0.15)]">
          <button onClick={() => setScreen("main")} className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary">
            <IconBack />
          </button>
          <h2 className="text-lg font-heading font-semibold text-text-primary">
            {t("addContact.title", lang)}
          </h2>
        </header>

        <div className="flex-1 px-6 py-8 space-y-5">
          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
              {t("addContact.id", lang)}
            </label>
            <input
              type="text"
              value={newContactId}
              onChange={(e) => setNewContactId(e.target.value)}
              placeholder="a1b2c3d4e5f6a7b8"
              className="w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-mono text-sm focus:outline-none focus:border-voice-gold/50 transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
              {t("addContact.name", lang)}
            </label>
            <input
              type="text"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addContact()}
              placeholder="John"
              className="w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-base focus:outline-none focus:border-voice-gold/50 transition-colors"
            />
          </div>
          <button
            onClick={addContact}
            disabled={!newContactId.trim() || !newContactName.trim()}
            className="w-full py-3 rounded-xl bg-voice-gold text-bg-deep font-body font-semibold text-base transition-all hover:bg-voice-warm disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
          >
            {t("addContact.save", lang)}
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // RENDER: Chat View
  // -----------------------------------------------------------------------
  if (screen === "chat" && activeContact) {
    const contactMessages = messages[activeContact.speaqId] || [];
    return (
      <div className="h-dvh bg-bg-deep flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 bg-bg-surface border-b border-[rgba(100,116,139,0.15)] shrink-0">
          <button onClick={() => { setScreen("main"); setActiveContact(null); }} className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary">
            <IconBack />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-base font-body font-semibold text-text-primary truncate">
              {activeContact.name}
            </p>
            <div className="flex items-center gap-1.5">
              <IconShield className="w-3 h-3 text-quantum-teal" />
              <span className="text-[10px] font-mono text-quantum-teal uppercase tracking-wider">
                {t("chat.secured", lang)}
              </span>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-quantum-teal" : "bg-resistance-red"}`} />
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {contactMessages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <IconShield className="w-8 h-8 text-quantum-teal/30 mx-auto mb-2" />
                <p className="text-sm text-text-muted">End-to-end encrypted</p>
              </div>
            </div>
          )}
          {contactMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                  msg.fromMe
                    ? "bg-voice-gold/20 text-text-primary rounded-br-md"
                    : "bg-bg-card text-text-primary rounded-bl-md"
                }`}
              >
                <p className="text-sm font-body break-words">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.fromMe ? "text-voice-gold/60" : "text-text-muted"}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="shrink-0 px-4 py-3 bg-bg-surface border-t border-[rgba(100,116,139,0.15)]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMsg()}
              placeholder={t("chat.placeholder", lang)}
              className="flex-1 px-4 py-2.5 rounded-full bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-sm focus:outline-none focus:border-voice-gold/50 transition-colors min-h-[44px]"
            />
            <button
              onClick={sendMsg}
              disabled={!inputText.trim() || !connected}
              className="p-2.5 rounded-full bg-voice-gold text-bg-deep transition-all hover:bg-voice-warm disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <IconSend />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // RENDER: Main Screen with Tabs
  // -----------------------------------------------------------------------
  return (
    <div className="h-dvh bg-bg-deep flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-bg-surface border-b border-[rgba(100,116,139,0.15)] shrink-0">
        <div className="flex items-center gap-2">
          <SpeaqLogo size={32} />
          <span className="text-lg font-heading font-bold text-text-primary">SPEAQ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-quantum-teal" : "bg-resistance-red"}`} />
          <span className="text-[10px] font-mono text-text-muted">
            {connected ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* ---- CHATS TAB ---- */}
        {tab === "chats" && (
          <div className="relative h-full">
            {chatList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6">
                <IconChat className="w-12 h-12 text-text-muted/30 mb-3" />
                <p className="text-sm text-text-muted">{t("noChats", lang)}</p>
              </div>
            ) : (
              <div className="divide-y divide-[rgba(100,116,139,0.1)]">
                {chatList.map((contact) => (
                  <button
                    key={contact.speaqId}
                    onClick={() => openChat(contact)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-card/50 transition-colors text-left min-h-[64px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center shrink-0">
                      <span className="text-base font-heading font-bold text-voice-gold">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-body font-semibold text-text-primary truncate">
                          {contact.name}
                        </span>
                        <span className="text-[10px] font-mono text-text-muted ml-2 shrink-0">
                          {getLastTimestamp(contact.speaqId) > 0 && formatTime(getLastTimestamp(contact.speaqId))}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary truncate mt-0.5">
                        {getLastMessage(contact.speaqId)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* FAB */}
            <button
              onClick={() => setScreen("addContact")}
              className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-voice-gold text-bg-deep shadow-lg flex items-center justify-center hover:bg-voice-warm transition-all"
            >
              <IconPlus className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* ---- CONTACTS TAB ---- */}
        {tab === "contacts" && (
          <div className="px-4 py-4 space-y-4">
            {/* Your SPEAQ ID */}
            {identity && (
              <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
                <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-2">
                  {t("contacts.yourId", lang)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-text-primary break-all flex-1">
                    {identity.speaqId}
                  </span>
                  <button onClick={copyId} className="p-2 rounded-lg hover:bg-bg-elevated transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <IconCopy className={copied ? "text-quantum-teal" : "text-text-muted"} />
                  </button>
                </div>
              </div>
            )}

            {/* Contact list */}
            {contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <IconUsers className="w-12 h-12 text-text-muted/30 mb-3" />
                <p className="text-sm text-text-muted">{t("noContacts", lang)}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {contacts.map((contact) => (
                  <button
                    key={contact.speaqId}
                    onClick={() => openChat(contact)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-bg-card/50 transition-colors text-left min-h-[56px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center shrink-0">
                      <span className="text-base font-heading font-bold text-voice-gold">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-body font-semibold text-text-primary truncate">
                        {contact.name}
                      </p>
                      <p className="text-[10px] font-mono text-text-muted truncate">
                        {contact.speaqId}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Add contact button */}
            <button
              onClick={() => setScreen("addContact")}
              className="w-full py-3 rounded-xl border border-voice-gold/30 text-voice-gold font-body font-semibold text-sm hover:bg-voice-gold/10 transition-all min-h-[44px]"
            >
              {t("contacts.add", lang)}
            </button>
          </div>
        )}

        {/* ---- WALLET TAB ---- */}
        {tab === "wallet" && (
          <div className="flex flex-col items-center justify-center h-full px-6 py-16">
            <IconWallet className="w-12 h-12 text-text-muted/30 mb-3" />
            <p className="text-sm text-text-muted">{t("wallet.coming", lang)}</p>
          </div>
        )}

        {/* ---- SETTINGS TAB ---- */}
        {tab === "settings" && (
          <div className="px-4 py-4 space-y-4">
            {/* Profile */}
            {identity && (
              <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
                <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-3">
                  {t("settings.profile", lang)}
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center">
                    <span className="text-xl font-heading font-bold text-voice-gold">
                      {identity.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-body font-semibold text-text-primary">
                      {identity.displayName}
                    </p>
                    <p className="text-[10px] font-mono text-text-muted">
                      {identity.speaqId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-quantum-teal/10 w-fit">
                  <IconShield className="w-3 h-3 text-quantum-teal" />
                  <span className="text-[10px] font-mono text-quantum-teal uppercase tracking-wider">
                    {t("chat.secured", lang)}
                  </span>
                </div>
              </div>
            )}

            {/* Language */}
            <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
              <div className="flex items-center gap-2 mb-3">
                <IconGlobe className="w-4 h-4 text-quantum-teal" />
                <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider">
                  {t("settings.language", lang)}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className={`px-3 py-2 rounded-lg text-xs font-body transition-all min-h-[44px] ${
                      l.code === lang
                        ? "bg-voice-gold/20 text-voice-gold border border-voice-gold/30"
                        : "bg-bg-elevated text-text-secondary border border-transparent hover:border-[rgba(100,116,139,0.2)]"
                    }`}
                  >
                    <span className="font-mono text-[10px] block text-text-muted">{l.label}</span>
                    <span className="block mt-0.5">{l.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantum Secured info */}
            <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
              <div className="flex items-center gap-2 mb-2">
                <IconShield className="w-4 h-4 text-quantum-teal" />
                <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider">
                  {t("chat.secured", lang)}
                </p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                All messages are encrypted with AES-256-GCM using the Web Crypto API.
                Keys are derived locally from SPEAQ IDs -- they never leave your device.
                No one, not even SPEAQ, can read your messages.
              </p>
            </div>

            {/* Delete all data */}
            <button
              onClick={deleteAllData}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-resistance-red/30 text-resistance-red font-body font-semibold text-sm hover:bg-resistance-red/10 transition-all min-h-[44px]"
            >
              <IconTrash className="w-4 h-4" />
              {t("settings.deleteAll", lang)}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="shrink-0 flex items-center justify-around bg-bg-surface border-t border-[rgba(100,116,139,0.15)] px-2 py-1 safe-area-pb">
        {(["chats", "contacts", "wallet", "settings"] as Tab[]).map((t_) => {
          const isActive = tab === t_;
          const Icon = t_ === "chats" ? IconChat : t_ === "contacts" ? IconUsers : t_ === "wallet" ? IconWallet : IconSettings;
          return (
            <button
              key={t_}
              onClick={() => setTab(t_)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 min-h-[48px] min-w-[48px] transition-colors ${
                isActive ? "text-voice-gold" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-body">{t(`tab.${t_}`, lang)}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
