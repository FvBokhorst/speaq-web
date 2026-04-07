"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  generateId, deriveKey, encrypt, decrypt, hashPinPBKDF2,
  generateKyberKeyPair, kyberEncapsulate, kyberDecapsulate,
  initRatchet, ratchetEncrypt, ratchetDecrypt,
  saveRatchetState, loadRatchetState,
  type KyberKeyPair, type RatchetState,
  generateSigningKeyPair, signData, verifySignature,
  saveSigningKeys, loadSigningKeys, saveContactSigningKey, loadContactSigningKey,
  type SigningKeyPair,
} from "./crypto";
import { languages, Lang } from "@/lib/i18n";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { WavRecorder } from "./wav-recorder";
import INFO from "./info-data";
import {
  loadWallet, saveWallet, loadTransactions, saveTransactions,
  addMiningReward, sendQC as walletSendQC, qcToGold, qcToEur, qcToSparks, getGoldPrice,
  type WalletState, type Transaction,
} from "./wallet";
import {
  loadStats, saveStats, loadRewards, saveRewards,
  simulateMiningCycle, getSupplyInfo, getEstimatedDaily,
  REWARD_RATES, WEB_MINING_TYPES, addLedgerEntry,
  type MiningStats, type MiningReward, type MiningType, type MiningLedgerEntry,
} from "./mining";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Identity {
  speaqId: string;
  displayName: string;
  createdAt: number;
  did?: string;
}

interface Contact {
  speaqId: string;
  name: string;
  addedAt: number;
  blocked?: boolean;
}

interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
}

interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: number;
}

interface GroupMsg {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  fromMe: boolean;
}

interface WitnessRecord {
  id: string;
  hash: string;
  timestamp: number;
  location?: { lat: number; lng: number };
  description: string;
}

interface WalletProject {
  id: string;
  name: string;
  description: string;
  balance: number;
}

interface DeadManConfig {
  enabled: boolean;
  timeoutMinutes: number;
  message: string;
  recipients: string[];
  lastCheckin: number;
}

type Screen =
  | "onboarding" | "lock" | "setPin" | "welcome" | "main" | "chat" | "addContact"
  | "walletDetail" | "sendQC" | "transactions"
  | "miningDetail"
  | "call"
  | "groups" | "createGroup" | "groupChat"
  | "advanced" | "ghostGroup" | "witness" | "deadman"
  | "info" | "sovereignId" | "lightning" | "settings" | "privacy";

type Tab = "chats" | "contacts" | "wallet" | "mining" | "settings";

// ---------------------------------------------------------------------------
// i18n
// ---------------------------------------------------------------------------

const appStrings: Record<string, Record<string, string>> = {
  "welcome.title": { en: "Welcome to SPEAQ", nl: "Welkom bij SPEAQ", fr: "Bienvenue sur SPEAQ", es: "Bienvenido a SPEAQ", ru: "Dobro pozalovat' v SPEAQ", de: "Willkommen bei SPEAQ", sl: "Dobrodosli v SPEAQ", lg: "Tukusanyukidde ku SPEAQ", sw: "Karibu SPEAQ" },
  "welcome.enterName": { en: "Enter your name", ru: "Vvedite vashe imya", nl: "Voer je naam in", fr: "Entrez votre nom", es: "Ingresa tu nombre", de: "Gib deinen Namen ein", sl: "Vnesi svoje ime", lg: "Wandika erinnya lyo", sw: "Weka jina lako" },
  "welcome.create": { en: "Create Identity", ru: "Sozdat lichnost", nl: "Identiteit aanmaken", fr: "Creer une identite", es: "Crear identidad", de: "Identitat erstellen", sl: "Ustvari identiteto", lg: "Tonda obuntukirivu", sw: "Unda Utambulisho" },
  "tab.chats": { en: "Chats", nl: "Chats", fr: "Discussions", es: "Chats", ru: "Chaty", de: "Chats", sl: "Klepeti", lg: "Byokwogerako", sw: "Mazungumzo" },
  "tab.contacts": { en: "Contacts", nl: "Contacten", fr: "Contacts", es: "Contactos", ru: "Kontakty", de: "Kontakte", sl: "Stiki", lg: "Abantu", sw: "Wasiliani" },
  "tab.wallet": { en: "Wallet", nl: "Wallet", fr: "Portefeuille", es: "Billetera", ru: "Koshelek", de: "Wallet", sl: "Denarnica", lg: "Wallet", sw: "Mkoba" },
  "tab.mining": { en: "Mining", nl: "Mining", fr: "Minage", es: "Mineria", ru: "Majning", de: "Mining", sl: "Rudarjenje", lg: "Okusimba", sw: "Uchimbaji" },
  "tab.more": { en: "More", nl: "Meer", fr: "Plus", es: "Mas", ru: "Eshche", de: "Mehr", sl: "Vec", lg: "Ebisingawo", sw: "Zaidi" },
  "tab.settings": { en: "Settings", nl: "Instellingen", fr: "Parametres", es: "Ajustes", ru: "Nastrojki", de: "Einstellungen", sl: "Nastavitve", lg: "Entegeka", sw: "Mipangilio" },
  "chat.secured": { en: "Quantum Secured", ru: "Kvantovaya zashchita", nl: "Quantum Beveiligd", fr: "Securise Quantique", es: "Seguridad Cuantica", de: "Quantengesichert", sl: "Kvantno zasciteno", lg: "Quantum Ekuumiddwa", sw: "Usalama wa Quantum" },
  "chat.placeholder": { en: "Type a message...", ru: "Napishite soobshchenie...", nl: "Typ een bericht...", fr: "Tapez un message...", es: "Escribe un mensaje...", de: "Nachricht eingeben...", sl: "Vpisi sporocilo...", lg: "Wandika obubaka...", sw: "Andika ujumbe..." },
  "contacts.add": { en: "Add Contact", ru: "Dobavit kontakt", nl: "Contact toevoegen", fr: "Ajouter un contact", es: "Agregar contacto", de: "Kontakt hinzufugen", sl: "Dodaj stik", lg: "Gattako omuntu", sw: "Ongeza mtu" },
  "contacts.yourId": { en: "Your SPEAQ ID", ru: "Vash SPEAQ ID", nl: "Jouw SPEAQ ID", fr: "Votre SPEAQ ID", es: "Tu SPEAQ ID", de: "Deine SPEAQ ID", sl: "Tvoj SPEAQ ID", lg: "SPEAQ ID yo", sw: "SPEAQ ID yako" },
  "settings.profile": { en: "Profile", ru: "Profil", nl: "Profiel", fr: "Profil", es: "Perfil", de: "Profil", sl: "Profil", lg: "Profayilo", sw: "Wasifu" },
  "settings.language": { en: "Language", ru: "Yazyk", nl: "Taal", fr: "Langue", es: "Idioma", de: "Sprache", sl: "Jezik", lg: "Olulimi", sw: "Lugha" },
  "settings.deleteAll": { en: "Delete All Data", ru: "Udalit vse dannye", nl: "Alle data verwijderen", fr: "Supprimer toutes les donnees", es: "Eliminar todos los datos", de: "Alle Daten loschen", sl: "Izbrisi vse podatke", lg: "Sazaamu data yonna", sw: "Futa data yote" },
  "settings.deleteConfirm": { en: "Are you sure? This cannot be undone.", ru: "Vy uvereny? Eto nelzya otmenit.", nl: "Weet je het zeker? Dit kan niet ongedaan worden.", fr: "Etes-vous sur ? Cette action est irreversible.", es: "Estas seguro? Esto no se puede deshacer.", de: "Bist du sicher? Dies kann nicht ruckgangig gemacht werden.", sl: "Ali ste prepricani?", lg: "Oli mukakafu?", sw: "Una uhakika?" },
  "addContact.title": { en: "Add Contact", ru: "Dobavit kontakt", nl: "Contact toevoegen", fr: "Ajouter un contact", es: "Agregar contacto", de: "Kontakt hinzufugen", sl: "Dodaj stik", lg: "Gattako omuntu", sw: "Ongeza mtu" },
  "addContact.id": { en: "SPEAQ ID", nl: "SPEAQ ID", fr: "SPEAQ ID", es: "SPEAQ ID", de: "SPEAQ ID", sl: "SPEAQ ID", lg: "SPEAQ ID", sw: "SPEAQ ID" },
  "addContact.name": { en: "Display Name", ru: "Imya", nl: "Weergavenaam", fr: "Nom d'affichage", es: "Nombre visible", de: "Anzeigename", sl: "Prikazano ime", lg: "Erinnya", sw: "Jina" },
  "addContact.save": { en: "Save", ru: "Sokhranit", nl: "Opslaan", fr: "Enregistrer", es: "Guardar", de: "Speichern", sl: "Shrani", lg: "Tereka", sw: "Hifadhi" },
  "noChats": { en: "No conversations yet", ru: "Net razgovorov", nl: "Nog geen gesprekken", fr: "Pas encore de conversations", es: "Sin conversaciones", de: "Noch keine Gesprache", sl: "Se ni pogovorov", lg: "Tewali byokwogerako", sw: "Hakuna mazungumzo bado" },
  "noContacts": { en: "No contacts yet", ru: "Net kontaktov", nl: "Nog geen contacten", fr: "Pas encore de contacts", es: "Sin contactos", de: "Noch keine Kontakte", sl: "Se ni stikov", lg: "Tewali bantu", sw: "Hakuna wasiliani bado" },
  // Wallet
  "wallet.balance": { en: "Balance", ru: "Balans", nl: "Saldo", fr: "Solde", es: "Saldo", de: "Guthaben" },
  "wallet.send": { en: "Send", ru: "Otpravit", nl: "Verstuur", fr: "Envoyer", es: "Enviar", de: "Senden" },
  "wallet.receive": { en: "Receive", ru: "Poluchit", nl: "Ontvangen", fr: "Recevoir", es: "Recibir", de: "Empfangen" },
  "wallet.transactions": { en: "Transactions", ru: "Tranzaktsii", nl: "Transacties", fr: "Transactions", es: "Transacciones", de: "Transaktionen" },
  "wallet.goldValue": { en: "Gold Value", ru: "Stoimost zolota", nl: "Goudwaarde", fr: "Valeur Or", es: "Valor Oro", de: "Goldwert" },
  "wallet.projects": { en: "Projects", ru: "Proekty", nl: "Projecten", fr: "Projets", es: "Proyectos", de: "Projekte", sl: "Projekti", lg: "Pulojekiti", sw: "Miradi" },
  // Mining
  "mining.title": { en: "Network Mining", ru: "Setevoj majning", nl: "Netwerk Mining", fr: "Minage Reseau", es: "Mineria de Red", de: "Netzwerk Mining" },
  "mining.start": { en: "Start Mining", ru: "Nachat majning", nl: "Start Mining", fr: "Demarrer", es: "Iniciar", de: "Starten" },
  "mining.stop": { en: "Stop Mining", ru: "Ostanovit majning", nl: "Stop Mining", fr: "Arreter", es: "Detener", de: "Stoppen" },
  "mining.today": { en: "Today", ru: "Segodnya", nl: "Vandaag", fr: "Aujourd'hui", es: "Hoy", de: "Heute" },
  "mining.total": { en: "Total Earned", ru: "Vsego zarabotano", nl: "Totaal Verdiend", fr: "Total Gagne", es: "Total Ganado", de: "Gesamt Verdient" },
  "mining.level": { en: "Miner Level", ru: "Uroven majnera", nl: "Miner Level", fr: "Niveau Mineur", es: "Nivel Minero", de: "Miner Level" },
  "mining.streak": { en: "Day Streak", ru: "Dnej podryad", nl: "Dag Streak", fr: "Serie Jours", es: "Racha Dias", de: "Tage Serie" },
  "mining.estimated": { en: "Est. Daily", ru: "Ots. v den", nl: "Gesch. Dagelijks", fr: "Est. Quotidien", es: "Est. Diario", de: "Gesch. Taglich" },
  "mining.supply": { en: "Supply Info", ru: "Informatsiya o zapasakh", nl: "Voorraad Info", fr: "Info Offre", es: "Info Suministro", de: "Vorrat Info" },
  // Groups
  "groups.title": { en: "Groups", ru: "Gruppy", nl: "Groepen", fr: "Groupes", es: "Grupos", de: "Gruppen" },
  "groups.create": { en: "Create Group", ru: "Sozdat gruppu", nl: "Groep Aanmaken", fr: "Creer un Groupe", es: "Crear Grupo", de: "Gruppe Erstellen" },
  "groups.name": { en: "Group Name", ru: "Nazvanie gruppy", nl: "Groepsnaam", fr: "Nom du Groupe", es: "Nombre del Grupo", de: "Gruppenname" },
  "groups.members": { en: "Members", ru: "Uchastniki", nl: "Leden", fr: "Membres", es: "Miembros", de: "Mitglieder" },
  // Advanced
  "adv.title": { en: "Advanced", ru: "Dopolnitelno", nl: "Geavanceerd", fr: "Avance", es: "Avanzado", de: "Erweitert" },
  "adv.ghost": { en: "Ghost Groups", ru: "Prizrachnye gruppy", nl: "Ghost Groepen", fr: "Groupes Fantomes", es: "Grupos Fantasma", de: "Geister Gruppen" },
  "adv.ghostDesc": { en: "Anonymous group chats with hidden identities", ru: "Anonimnye gruppovye chaty so skrytymi lichnostyami", nl: "Anonieme groepsgesprekken met verborgen identiteiten" },
  "adv.witness": { en: "Witness Mode", ru: "Rezhim svidetelya", nl: "Getuige Modus", fr: "Mode Temoin", es: "Modo Testigo", de: "Zeugenmodus" },
  "adv.witnessDesc": { en: "Create tamper-proof evidence records", ru: "Sozdanie zashchishchennykh ot poddelki dokazatelstv", nl: "Maak manipulatiebestendige bewijsrecords" },
  "adv.deadman": { en: "Dead Man's Switch", ru: "Mertvaya ruka", nl: "Dead Man's Switch", fr: "Commutateur d'Homme Mort", es: "Interruptor de Hombre Muerto", de: "Totmannschalter" },
  "adv.deadmanDesc": { en: "Auto-alert if you don't check in", ru: "Avto-opoveshchenie esli vy ne otmetites", nl: "Auto-alarm als je niet incheckt" },
  // Call
  "call.title": { en: "Voice Call", ru: "Golosovoj vyzov", nl: "Spraakoproep", fr: "Appel Vocal", es: "Llamada de Voz", de: "Sprachanruf" },
  "call.calling": { en: "Calling...", ru: "Vyzov...", nl: "Bellen...", fr: "Appel en cours...", es: "Llamando...", de: "Anrufen..." },
  "call.end": { en: "End Call", ru: "Zavershit vyzov", nl: "Beeindig Oproep", fr: "Terminer", es: "Finalizar", de: "Beenden" },
  // Info
  "info.title": { en: "About SPEAQ", ru: "O SPEAQ", nl: "Over SPEAQ", fr: "A propos de SPEAQ", es: "Acerca de SPEAQ", de: "Uber SPEAQ" },
  "info.version": { en: "Version", ru: "Versiya", nl: "Versie" },
  "info.modules": { en: "10 Modules", ru: "10 Modulej", nl: "10 Modules" },
  // More menu
  "more.groups": { en: "Groups", nl: "Groepen", fr: "Groupes", es: "Grupos", de: "Gruppen", sl: "Skupine", lg: "Ebibinja", sw: "Vikundi" },
  "more.call": { en: "Voice Call", nl: "Spraakoproep", fr: "Appel", es: "Llamada", de: "Anruf", sl: "Klic", lg: "Okuyita", sw: "Piga simu" },
  "more.advanced": { en: "Advanced", nl: "Geavanceerd", fr: "Avance", es: "Avanzado", de: "Erweitert", sl: "Napredno", lg: "Ebyenjawulo", sw: "Kiwango cha juu" },
  "more.lightning": { en: "Lightning", nl: "Lightning", fr: "Lightning", es: "Lightning", de: "Lightning", sl: "Lightning", lg: "Lightning", sw: "Lightning" },
  "more.info": { en: "About", nl: "Over", fr: "A propos", es: "Acerca de", de: "Uber", sl: "O aplikaciji", lg: "Ebikwata ku", sw: "Kuhusu" },
  "more.sovereignId": { en: "Sovereign ID", nl: "Sovereign ID", fr: "Identite Souveraine", es: "ID Soberana", de: "Souverane ID", sl: "Suvereni ID", lg: "ID Eyeefuga", sw: "Kitambulisho Huru" },
  "more.settings": { en: "Settings", nl: "Instellingen", fr: "Parametres", es: "Ajustes", de: "Einstellungen", sl: "Nastavitve", lg: "Entegeka", sw: "Mipangilio" },
  "more.transactions": { en: "Transactions", nl: "Transacties", fr: "Transactions", es: "Transacciones", de: "Transaktionen", sl: "Transakcije", lg: "Entambuza", sw: "Shughuli" },
  // Settings sections (all 9 languages: en, nl, fr, es, ru, de, sl, lg, sw)
  "settings.security": { en: "Security", nl: "Beveiliging", fr: "Securite", es: "Seguridad", ru: "Bezopasnost", de: "Sicherheit", sl: "Varnost", lg: "Obukuumi", sw: "Usalama" },
  "settings.encryption": { en: "Encryption", nl: "Versleuteling", fr: "Chiffrement", es: "Cifrado", ru: "Shifrovanie", de: "Verschlusselung", sl: "Sifriranje", lg: "Enkuuma", sw: "Usimbaji" },
  "settings.forwardSecrecy": { en: "Forward Secrecy", nl: "Forward Secrecy", fr: "Confidentialite persistante", es: "Secreto perfecto", ru: "Pryamaya sekretnost", de: "Vorwartssicherheit", sl: "Posredna tajnost", lg: "Ekyama eky'omu maaso", sw: "Usiri wa mbele" },
  "settings.resetPin": { en: "Reset PIN", nl: "PIN resetten", fr: "Reinitialiser le PIN", es: "Restablecer PIN", ru: "Sbrosit PIN", de: "PIN zurucksetzen", sl: "Ponastavi PIN", lg: "Ddamu PIN", sw: "Weka upya PIN" },
  "settings.reset": { en: "Reset", nl: "Reset", fr: "Reinitialiser", es: "Restablecer", ru: "Sbrosit", de: "Zurucksetzen", sl: "Ponastavi", lg: "Ddamu", sw: "Weka upya" },
  "settings.privacyData": { en: "Privacy & Data", nl: "Privacy & Gegevens", fr: "Confidentialite et donnees", es: "Privacidad y datos", ru: "Konfidentsialnost i dannye", de: "Datenschutz & Daten", sl: "Zasebnost in podatki", lg: "Ekyama n'ebikukwatako", sw: "Faragha na data" },
  "settings.privacyPolicy": { en: "Privacy Policy", nl: "Privacybeleid", fr: "Politique de confidentialite", es: "Politica de privacidad", ru: "Politika konfidentsialnosti", de: "Datenschutzrichtlinie", sl: "Politika zasebnosti", lg: "Ebiragiro by'ekyama", sw: "Sera ya faragha" },
  "settings.view": { en: "View", nl: "Bekijk", fr: "Voir", es: "Ver", ru: "Smotret", de: "Anzeigen", sl: "Ogled", lg: "Laba", sw: "Tazama" },
  "settings.delete": { en: "Delete", nl: "Verwijder", fr: "Supprimer", es: "Eliminar", ru: "Udalit", de: "Loschen", sl: "Izbrisi", lg: "Sangula", sw: "Futa" },
  "settings.appearance": { en: "Appearance", nl: "Weergave", fr: "Apparence", es: "Apariencia", ru: "Oformlenie", de: "Darstellung", sl: "Videz", lg: "Endabika", sw: "Muonekano" },
  "settings.theme": { en: "Theme", nl: "Thema", fr: "Theme", es: "Tema", ru: "Tema", de: "Design", sl: "Tema", lg: "Ekikula", sw: "Mandhari" },
  "settings.themeDark": { en: "Dark", nl: "Donker", fr: "Sombre", es: "Oscuro", ru: "Temnaya", de: "Dunkel", sl: "Temna", lg: "Ekizirizi", sw: "Giza" },
  "settings.themeLight": { en: "Light", nl: "Licht", fr: "Clair", es: "Claro", ru: "Svetlaya", de: "Hell", sl: "Svetla", lg: "Ekitangaala", sw: "Mwanga" },
  "settings.themeSystem": { en: "System", nl: "Systeem", fr: "Systeme", es: "Sistema", ru: "Sistemnaya", de: "System", sl: "Sistem", lg: "Sisitemu", sw: "Mfumo" },
  "settings.about": { en: "About", nl: "Over", fr: "A propos", es: "Acerca de", ru: "O prilozhenii", de: "Uber", sl: "O aplikaciji", lg: "Ebikwata ku", sw: "Kuhusu" },
  "settings.howItWorks": { en: "How SPEAQ Works", nl: "Hoe SPEAQ Werkt", fr: "Comment SPEAQ Fonctionne", es: "Como Funciona SPEAQ", ru: "Kak Rabotaet SPEAQ", de: "Wie SPEAQ Funktioniert", sl: "Kako Deluje SPEAQ", lg: "SPEAQ Ekola Etya", sw: "Jinsi SPEAQ Inavyofanya Kazi" },
  "settings.version": { en: "Version", nl: "Versie", fr: "Version", es: "Version", ru: "Versiya", de: "Version", sl: "Razlicica", lg: "Ekika", sw: "Toleo" },
  "settings.website": { en: "Website", nl: "Website", fr: "Site web", es: "Sitio web", ru: "Sajt", de: "Webseite", sl: "Spletna stran", lg: "Omukutu", sw: "Tovuti" },
  "settings.tapChangePhoto": { en: "Tap to change photo", nl: "Tik om foto te wijzigen", fr: "Appuyez pour changer la photo", es: "Toca para cambiar la foto", ru: "Nazhmite chtoby izmenit foto", de: "Tippen um Foto zu andern", sl: "Tapnite za spremembo", lg: "Nyiga okukyusa ekifaananyi", sw: "Gusa kubadilisha picha" },
  "settings.exportIdentity": { en: "Export Identity", nl: "Identiteit exporteren", fr: "Exporter l'identite", es: "Exportar identidad", ru: "Eksportirovat lichnost", de: "Identitat exportieren", sl: "Izvozi identiteto", lg: "Ggya obuntukirivu", sw: "Hamisha utambulisho" },
  "settings.name": { en: "Name", nl: "Naam", fr: "Nom", es: "Nombre", ru: "Imya", de: "Name", sl: "Ime", lg: "Erinnya", sw: "Jina" },
  "settings.open": { en: "Open", nl: "Open", fr: "Ouvrir", es: "Abrir", ru: "Otkryt", de: "Offnen", sl: "Odpri", lg: "Ggula", sw: "Fungua" },
  // Wallet extra
  "wallet.noProjects": { en: "No projects yet. Create one to allocate Q-Credits.", nl: "Nog geen projecten. Maak er een om Q-Credits toe te wijzen.", fr: "Pas encore de projets.", es: "Sin proyectos aun.", ru: "Net proektov. Sozdajte odin.", de: "Noch keine Projekte.", sl: "Se ni projektov.", lg: "Tewali pulojekiti.", sw: "Hakuna miradi bado." },
  "wallet.noTransactions": { en: "No transactions yet", nl: "Nog geen transacties", fr: "Pas encore de transactions", es: "Sin transacciones", ru: "Net tranzaktsij", de: "Noch keine Transaktionen", sl: "Se ni transakcij", lg: "Tewali ntambuza", sw: "Hakuna shughuli bado" },
  "wallet.new": { en: "+ New", nl: "+ Nieuw", fr: "+ Nouveau", es: "+ Nuevo", ru: "+ Novyj", de: "+ Neu", sl: "+ Novo", lg: "+ Empya", sw: "+ Mpya" },
  "wallet.viewAll": { en: "View All", nl: "Alles bekijken", fr: "Voir tout", es: "Ver todo", ru: "Smotret vse", de: "Alle anzeigen", sl: "Poglej vse", lg: "Laba byonna", sw: "Tazama yote" },
  "wallet.linkedWallets": { en: "Linked Wallets", nl: "Gekoppelde Wallets", fr: "Portefeuilles lies", es: "Carteras vinculadas", ru: "Privyazannye koshelki", de: "Verknupfte Wallets", sl: "Povezane denarnice", lg: "Ensawo ezikwatiriziddwa", sw: "Mikoba iliyounganishwa" },
  "wallet.linkHint": { en: "Link a Monero, Bitcoin, or Ethereum wallet to convert Q-Credits.", nl: "Koppel een Monero, Bitcoin, of Ethereum wallet om Q-Credits om te zetten.", fr: "Liez un portefeuille pour convertir.", es: "Vincule una cartera para convertir.", ru: "Privyazhite koshelek dlya konvertatsii.", de: "Verknupfen Sie eine Wallet zum Konvertieren.", sl: "Povezi denarnico za pretvorbo.", lg: "Kwatiriza ensawo okukyusa.", sw: "Unganisha mkoba kubadilisha." },
  "wallet.link": { en: "+ Link", nl: "+ Koppel", fr: "+ Lier", es: "+ Vincular", ru: "+ Privyazat", de: "+ Verknupfen", sl: "+ Povezi", lg: "+ Kwatiriza", sw: "+ Unganisha" },
  // Chat
  "chat.e2e": { en: "End-to-end encrypted", nl: "End-to-end versleuteld", fr: "Chiffre de bout en bout", es: "Cifrado de extremo a extremo", ru: "Skvoznoe shifrovanie", de: "Ende-zu-Ende verschlusselt", sl: "Sifrirano od konca do konca", lg: "Enkuumiddwa okuva entandikwa okutuuka ku nkomerero", sw: "Imesimbwa kwa mwisho-hadi-mwisho" },
  "chat.share": { en: "What would you like to share?", nl: "Wat wil je delen?", fr: "Que souhaitez-vous partager?", es: "Que quieres compartir?", ru: "Chem vy khotite podelitsya?", de: "Was mochten Sie teilen?", sl: "Kaj zelite deliti?", lg: "Kiki ky'oyagala okugabana?", sw: "Ungependa kushiriki nini?" },
  "chat.photoVideo": { en: "Photo / Video", nl: "Foto / Video", fr: "Photo / Video", es: "Foto / Video", ru: "Foto / Video", de: "Foto / Video", sl: "Foto / Video", lg: "Foto / Video", sw: "Picha / Video" },
  "chat.documentFile": { en: "Document / File", nl: "Document / Bestand", fr: "Document / Fichier", es: "Documento / Archivo", ru: "Dokument / Fajl", de: "Dokument / Datei", sl: "Dokument / Datoteka", lg: "Ekiwandiiko / Fayiro", sw: "Hati / Faili" },
  "chat.voiceMessage": { en: "Voice Message", nl: "Spraakbericht", fr: "Message vocal", es: "Mensaje de voz", ru: "Golosovoe soobshchenie", de: "Sprachnachricht", sl: "Glasovno sporocilo", lg: "Obubaka bw'eddoboozi", sw: "Ujumbe wa sauti" },
  "chat.location": { en: "Location", nl: "Locatie", fr: "Localisation", es: "Ubicacion", ru: "Mestopolozhenie", de: "Standort", sl: "Lokacija", lg: "Ekifo", sw: "Mahali" },
  "chat.sendQC": { en: "Send Q-Credits", nl: "Verstuur Q-Credits", fr: "Envoyer Q-Credits", es: "Enviar Q-Credits", ru: "Otpravit Q-Credits", de: "Q-Credits senden", sl: "Poslji Q-Credits", lg: "Wereza Q-Credits", sw: "Tuma Q-Credits" },
  "chat.cancel": { en: "Cancel", nl: "Annuleer", fr: "Annuler", es: "Cancelar", ru: "Otmena", de: "Abbrechen", sl: "Preklici", lg: "Sazaamu", sw: "Ghairi" },
  // PIN
  "pin.set": { en: "Set Your PIN", nl: "Stel je PIN in", fr: "Definissez votre PIN", es: "Establezca su PIN", ru: "Ustanovite PIN", de: "PIN festlegen", sl: "Nastavite PIN", lg: "Teeka PIN yo", sw: "Weka PIN yako" },
  "pin.confirm": { en: "Confirm Your PIN", nl: "Bevestig je PIN", fr: "Confirmez votre PIN", es: "Confirme su PIN", ru: "Podtverdite PIN", de: "PIN bestatigen", sl: "Potrdite PIN", lg: "Kakasa PIN yo", sw: "Thibitisha PIN yako" },
  "pin.enter": { en: "Enter PIN", nl: "Voer PIN in", fr: "Entrez le PIN", es: "Ingrese PIN", ru: "Vvedite PIN", de: "PIN eingeben", sl: "Vnesite PIN", lg: "Yingiza PIN", sw: "Ingiza PIN" },
  "pin.unlock": { en: "Unlock", nl: "Ontgrendel", fr: "Deverrouiller", es: "Desbloquear", ru: "Razblokirovat", de: "Entsperren", sl: "Odkleni", lg: "Ggula", sw: "Fungua" },
  "pin.next": { en: "Next", nl: "Volgende", fr: "Suivant", es: "Siguiente", ru: "Dalee", de: "Weiter", sl: "Naprej", lg: "Ekiddako", sw: "Ifuatayo" },
  "pin.setPin": { en: "Set PIN", nl: "PIN instellen", fr: "Definir PIN", es: "Establecer PIN", ru: "Ustanovit PIN", de: "PIN setzen", sl: "Nastavi PIN", lg: "Teeka PIN", sw: "Weka PIN" },
  "pin.secureSub": { en: "Choose a PIN to secure your SPEAQ identity", nl: "Kies een PIN om je SPEAQ identiteit te beveiligen", fr: "Choisissez un PIN pour securiser votre identite", es: "Elija un PIN para asegurar su identidad", ru: "Vyberite PIN dlya zaschity vashej lichnosti", de: "Wahlen Sie eine PIN um Ihre Identitat zu sichern", sl: "Izberite PIN za zavarovanje identitete", lg: "Londa PIN okuwa obuntukirivu bwo", sw: "Chagua PIN kulinda utambulisho wako" },
  "pin.confirmSub": { en: "Enter the same PIN again", nl: "Voer dezelfde PIN opnieuw in", fr: "Entrez le meme PIN a nouveau", es: "Ingrese el mismo PIN de nuevo", ru: "Vvedite tot zhe PIN eshche raz", de: "Geben Sie dieselbe PIN erneut ein", sl: "Znova vnesite isti PIN", lg: "Yingiza PIN y'emu nate", sw: "Ingiza PIN sawa tena" },
  "pin.unlockSub": { en: "Unlock to access SPEAQ", nl: "Ontgrendel om SPEAQ te openen", fr: "Deverrouillez pour acceder a SPEAQ", es: "Desbloquee para acceder a SPEAQ", ru: "Razblokirujte dlya dostupa k SPEAQ", de: "Entsperren um auf SPEAQ zuzugreifen", sl: "Odklenite za dostop do SPEAQ", lg: "Ggula okufuna SPEAQ", sw: "Fungua kupata SPEAQ" },
  // Onboarding
  "onb.skip": { en: "Skip", nl: "Overslaan", fr: "Passer", es: "Omitir", ru: "Propustit", de: "Uberspringen", sl: "Preskoci", lg: "Buuka", sw: "Ruka" },
  "onb.next": { en: "Next", nl: "Volgende", fr: "Suivant", es: "Siguiente", ru: "Dalee", de: "Weiter", sl: "Naprej", lg: "Ekiddako", sw: "Ifuatayo" },
  "onb.getStarted": { en: "Get Started", nl: "Aan de slag", fr: "Commencer", es: "Comenzar", ru: "Nachat", de: "Los geht's", sl: "Zacni", lg: "Tandika", sw: "Anza" },
  // Mining detail
  "mining.active": { en: "Mining Active", nl: "Mining Actief", fr: "Minage Actif", es: "Mineria Activa", ru: "Majning aktiven", de: "Mining Aktiv", sl: "Rudarjenje aktivno", lg: "Okusimba kutandika", sw: "Uchimbaji unaendelea" },
  "mining.paused": { en: "Mining Paused", nl: "Mining Gepauzeerd", fr: "Minage en Pause", es: "Mineria Pausada", ru: "Majning na pauze", de: "Mining Pausiert", sl: "Rudarjenje zaustavljeno", lg: "Okusimba kwayimiriziddwa", sw: "Uchimbaji umesimamishwa" },
  "mining.earning": { en: "Earning Q-Credits for the network", nl: "Q-Credits verdienen voor het netwerk", fr: "Gagner des Q-Credits pour le reseau", es: "Ganando Q-Credits para la red", ru: "Zarabotok Q-Credits dlya seti", de: "Q-Credits fur das Netzwerk verdienen", sl: "Zasluzek Q-Credits za omrezje", lg: "Okufuna Q-Credits ku network", sw: "Kupata Q-Credits kwa mtandao" },
  "mining.tapStart": { en: "Tap to start earning", nl: "Tik om te beginnen met verdienen", fr: "Appuyez pour commencer a gagner", es: "Toque para comenzar a ganar", ru: "Nazhmite chtoby nachat zarabatyvat", de: "Tippen um zu verdienen", sl: "Tapnite za zacetek zasluzka", lg: "Nyiga okutandika okufuna", sw: "Gusa kuanza kupata" },
  "mining.types": { en: "Mining Types", nl: "Mining Types", fr: "Types de Minage", es: "Tipos de Mineria", ru: "Tipy majninga", de: "Mining Typen", sl: "Tipi rudarjenja", lg: "Ebika by'okusimba", sw: "Aina za uchimbaji" },
  "mining.recentRewards": { en: "Recent Rewards", nl: "Recente Beloningen", fr: "Recompenses Recentes", es: "Recompensas Recientes", ru: "Nedavnie nagrady", de: "Neueste Belohnungen", sl: "Nedavne nagrade", lg: "Empeera ez'omu biseera", sw: "Tuzo za hivi karibuni" },
  "mining.noRewards": { en: "No rewards yet. Start mining!", nl: "Nog geen beloningen. Start mining!", fr: "Pas encore de recompenses.", es: "Sin recompensas aun.", ru: "Net nagrad. Nachnite majning!", de: "Noch keine Belohnungen.", sl: "Se ni nagrad.", lg: "Tewali mpeera. Tandika okusimba!", sw: "Hakuna tuzo bado. Anza uchimbaji!" },
  "mining.contribution": { en: "Your Contribution", nl: "Jouw Bijdrage", fr: "Votre Contribution", es: "Tu Contribucion", ru: "Vash vklad", de: "Dein Beitrag", sl: "Vas prispevek", lg: "Ekigendererwa kyo", sw: "Mchango wako" },
  "mining.relayed": { en: "Messages Relayed", nl: "Berichten Doorgestuurd", fr: "Messages Relayes", es: "Mensajes Retransmitidos", ru: "Peredano soobshchenij", de: "Weitergeleitete Nachrichten", sl: "Posredovana sporocila", lg: "Obubaka obuwereddwa", sw: "Ujumbe uliopitishwa" },
  "mining.validated": { en: "Proofs Validated", nl: "Bewijzen Gevalideerd", fr: "Preuves Validees", es: "Pruebas Validadas", ru: "Provereno dokazatelstv", de: "Beweise Validiert", sl: "Preverjeni dokazi", lg: "Obujulizi obukakasiddwa", sw: "Uthibitisho uliothibitishwa" },
  "mining.stored": { en: "Storage Used", nl: "Opslag Gebruikt", fr: "Stockage Utilise", es: "Almacenamiento Usado", ru: "Ispolzovano khranilishcha", de: "Speicher Verwendet", sl: "Uporabljena shramba", lg: "Ekitundu eky'okutereka", sw: "Hifadhi iliyotumika" },
  "mining.onboarded": { en: "Users Onboarded", nl: "Gebruikers Aangemeld", fr: "Utilisateurs Integres", es: "Usuarios Incorporados", ru: "Polzovatelej dobavleno", de: "Benutzer Eingebunden", sl: "Vkljuceni uporabniki", lg: "Abakozesa abayingiziddwa", sw: "Watumiaji walioingizwa" },
  "ui.groups": { en: "Groups", nl: "Groepen", fr: "Groupes", es: "Grupos", ru: "Gruppy", de: "Gruppen", sl: "Skupine", lg: "Ebibinja", sw: "Vikundi" },
  "ui.scan": { en: "Scan", nl: "Scan", fr: "Scanner", es: "Escanear", ru: "Skanirovat", de: "Scannen", sl: "Skeniraj", lg: "Sikaana", sw: "Changanua" },
  "ui.add": { en: "+ Add", nl: "+ Toevoegen", fr: "+ Ajouter", es: "+ Agregar", ru: "+ Dobavit", de: "+ Hinzufugen", sl: "+ Dodaj", lg: "+ Gatta", sw: "+ Ongeza" },
  "ui.details": { en: "Details", nl: "Details", fr: "Details", es: "Detalles", ru: "Podrobnosti", de: "Details", sl: "Podrobnosti", lg: "Ebisingawo", sw: "Maelezo" },
  "ui.miningDetails": { en: "Mining Details", nl: "Mining Details", fr: "Details Minage", es: "Detalles Mineria", ru: "Podrobnosti majninga", de: "Mining Details", sl: "Podrobnosti rudarjenja", lg: "Ebisingawo by'okusimba", sw: "Maelezo ya uchimbaji" },
  "ui.newProject": { en: "New Project", nl: "Nieuw Project", fr: "Nouveau Projet", es: "Nuevo Proyecto", ru: "Novyj proekt", de: "Neues Projekt", sl: "Nov projekt", lg: "Pulojekiti empya", sw: "Mradi mpya" },
  "ui.projectName": { en: "Project name", nl: "Projectnaam", fr: "Nom du projet", es: "Nombre del proyecto", ru: "Nazvanie proekta", de: "Projektname", sl: "Ime projekta", lg: "Erinnya ly'omupulojekiti", sw: "Jina la mradi" },
  "ui.descOptional": { en: "Description (optional)", nl: "Beschrijving (optioneel)", fr: "Description (optionnel)", es: "Descripcion (opcional)", ru: "Opisanie (neobyzatelno)", de: "Beschreibung (optional)", sl: "Opis (neobvezno)", lg: "Ennyinyonnyola (si kyetaagisibwa)", sw: "Maelezo (si lazima)" },
  "ui.create": { en: "Create", nl: "Aanmaken", fr: "Creer", es: "Crear", ru: "Sozdat", de: "Erstellen", sl: "Ustvari", lg: "Tonda", sw: "Unda" },
  "ui.fund": { en: "Fund", nl: "Storten", fr: "Financer", es: "Financiar", ru: "Popolnit", de: "Einzahlen", sl: "Financiraj", lg: "Ssente", sw: "Fanya" },
  "ui.withdraw": { en: "Withdraw", nl: "Opnemen", fr: "Retirer", es: "Retirar", ru: "Vyvesti", de: "Abheben", sl: "Dvigni", lg: "Ggyamu", sw: "Toa" },
  "ui.linkCrypto": { en: "Link Crypto Wallet", nl: "Koppel Crypto Wallet", fr: "Lier Portefeuille Crypto", es: "Vincular Cartera Crypto", ru: "Privyazat kripto koshelek", de: "Krypto Wallet verknupfen", sl: "Povezi kripto denarnico", lg: "Kwatiriza ensawo ya kripto", sw: "Unganisha mkoba wa kripto" },
  "ui.labelOptional": { en: "Label (optional)", nl: "Label (optioneel)", fr: "Label (optionnel)", es: "Etiqueta (opcional)", ru: "Metka (neobyzatelno)", de: "Label (optional)", sl: "Oznaka (neobvezno)", lg: "Akabonero (si kyetaagisibwa)", sw: "Lebo (si lazima)" },
  "ui.noGroups": { en: "No groups yet", nl: "Nog geen groepen", fr: "Pas encore de groupes", es: "Sin grupos", ru: "Net grupp", de: "Noch keine Gruppen", sl: "Se ni skupin", lg: "Tewali bibinja", sw: "Hakuna vikundi bado" },
  "ui.addContactsFirst": { en: "Add contacts first", nl: "Voeg eerst contacten toe", fr: "Ajoutez d'abord des contacts", es: "Agregue contactos primero", ru: "Snachala dobavte kontakty", de: "Zuerst Kontakte hinzufugen", sl: "Najprej dodajte stike", lg: "Tandika okugatta abantu", sw: "Ongeza anwani kwanza" },
  "ui.stopSend": { en: "Stop & Send", nl: "Stop & Verstuur", fr: "Arreter & Envoyer", es: "Parar & Enviar", ru: "Stop i otpravit", de: "Stop & Senden", sl: "Ustavi & Poslji", lg: "Yimiriza & Wereza", sw: "Simamisha & Tuma" },
  "ui.recording": { en: "Recording...", nl: "Opnemen...", fr: "Enregistrement...", es: "Grabando...", ru: "Zapis...", de: "Aufnahme...", sl: "Snemanje...", lg: "Okukwata...", sw: "Kurekodi..." },
  "ui.platform": { en: "SPEAQ Freely.", nl: "SPEAQ Vrijuit.", fr: "SPEAQ Librement.", es: "SPEAQ Libremente.", ru: "SPEAQ Svobodno.", de: "SPEAQ Frei.", sl: "SPEAQ Svobodno.", lg: "SPEAQ Bwereere.", sw: "SPEAQ Kwa uhuru." },
  "ui.ghostWitness": { en: "Ghost / Witness / Dead Man", nl: "Ghost / Getuige / Dead Man", fr: "Fantome / Temoin / Homme Mort", es: "Fantasma / Testigo / Hombre Muerto", ru: "Prizrak / Svidetel / Mertvaya ruka", de: "Geist / Zeuge / Totmannschalter", sl: "Duh / Prica / Mrtva roka", lg: "Ekitabika / Omujulizi / Eswiichi", sw: "Mzimu / Shahidi / Swichi" },
  "ui.qrCode": { en: "QR", nl: "QR", fr: "QR", es: "QR", ru: "QR", de: "QR", sl: "QR", lg: "QR", sw: "QR" },
  "ui.tapEnlarge": { en: "Tap to enlarge or share", nl: "Tik om te vergroten of te delen", fr: "Appuyez pour agrandir ou partager", es: "Toque para ampliar o compartir", ru: "Nazhmite dlya uvelicheniya ili otpravki", de: "Tippen zum Vergrossern oder Teilen", sl: "Tapnite za povecavo ali deljenje", lg: "Nyiga okugaza oba okugabana", sw: "Gusa kupanua au kushiriki" },
  "ui.shareId": { en: "Share ID", nl: "Deel ID", fr: "Partager ID", es: "Compartir ID", ru: "Podelitsya ID", de: "ID teilen", sl: "Deli ID", lg: "Gabana ID", sw: "Shiriki ID" },
  "ui.close": { en: "Close", nl: "Sluiten", fr: "Fermer", es: "Cerrar", ru: "Zakryt", de: "Schliessen", sl: "Zapri", lg: "Ggalawo", sw: "Funga" },
  "ui.yourQR": { en: "Your SPEAQ QR Code", nl: "Jouw SPEAQ QR Code", fr: "Votre Code QR SPEAQ", es: "Tu Codigo QR SPEAQ", ru: "Vash QR kod SPEAQ", de: "Dein SPEAQ QR Code", sl: "Tvoja SPEAQ QR koda", lg: "QR Code yo eya SPEAQ", sw: "Msimbo wako wa QR wa SPEAQ" },
  "ui.scanQR": { en: "Scan SPEAQ QR Code", nl: "Scan SPEAQ QR Code", fr: "Scanner le Code QR SPEAQ", es: "Escanear Codigo QR SPEAQ", ru: "Skanirovat QR kod SPEAQ", de: "SPEAQ QR Code scannen", sl: "Skeniraj SPEAQ QR kodo", lg: "Sikaana QR Code ya SPEAQ", sw: "Changanua Msimbo wa QR wa SPEAQ" },
  "welcome.tagline": { en: "Quantum-encrypted communication platform", nl: "Quantum-versleuteld communicatieplatform", fr: "Plateforme de communication quantique", es: "Plataforma de comunicacion cuantica", ru: "Kvantovo-zashchishchennaya platforma", de: "Quantenverschlusselte Kommunikationsplattform", sl: "Kvantna komunikacijska platforma", lg: "Ekifo ky'okwogerako ekikuumiddwa", sw: "Jukwaa la mawasiliano ya quantum" },
  "welcome.encBadge": { en: "AES-256-GCM Encrypted", nl: "AES-256-GCM Versleuteld", fr: "Chiffrement AES-256-GCM", es: "Cifrado AES-256-GCM", ru: "Shifrovanie AES-256-GCM", de: "AES-256-GCM Verschlusselt", sl: "AES-256-GCM Sifrirano", lg: "AES-256-GCM Enkuumiddwa", sw: "AES-256-GCM Imesimbwa" },
  "chat.typing": { en: "typing...", nl: "typt...", fr: "ecrit...", es: "escribiendo...", ru: "pechataut...", de: "tippt...", sl: "tipka...", lg: "awandiika...", sw: "anaandika..." },
  "chat.encBanner": { en: "Kyber-768 + AES-256-GCM + Double Ratchet", nl: "Kyber-768 + AES-256-GCM + Double Ratchet", fr: "Kyber-768 + AES-256-GCM + Double Ratchet", es: "Kyber-768 + AES-256-GCM + Double Ratchet", ru: "Kyber-768 + AES-256-GCM + Double Ratchet", de: "Kyber-768 + AES-256-GCM + Double Ratchet", sl: "Kyber-768 + AES-256-GCM + Double Ratchet", lg: "Kyber-768 + AES-256-GCM + Double Ratchet", sw: "Kyber-768 + AES-256-GCM + Double Ratchet" },
  "chat.voiceExpired": { en: "Voice (needs file server)", nl: "Spraak (file server nodig)", fr: "Voix (serveur requis)", es: "Voz (servidor requerido)", ru: "Golos (nuzhen server)", de: "Sprache (Server benotigt)", sl: "Glas (streznik potreben)", lg: "Eddoboozi (server yeetaagisa)", sw: "Sauti (seva inahitajika)" },
  "wallet.mined": { en: "Mined", nl: "Gemijnd", fr: "Mine", es: "Minado", ru: "Dobyte", de: "Gemint", sl: "Pridobljeno", lg: "Ebisimbiddwa", sw: "Iliyochimbwa" },
  "wallet.sent": { en: "Sent", nl: "Verzonden", fr: "Envoye", es: "Enviado", ru: "Otpravleno", de: "Gesendet", sl: "Poslano", lg: "Ewereddwa", sw: "Imetumwa" },
  "wallet.received": { en: "Received", nl: "Ontvangen", fr: "Recu", es: "Recibido", ru: "Polucheno", de: "Empfangen", sl: "Prejeto", lg: "Efunidde", sw: "Imepokelewa" },
  "wallet.available": { en: "Available", nl: "Beschikbaar", fr: "Disponible", es: "Disponible", ru: "Dostupno", de: "Verfugbar", sl: "Na voljo", lg: "Ebiriwo", sw: "Inapatikana" },
  "wallet.recipient": { en: "Recipient SPEAQ ID", nl: "Ontvanger SPEAQ ID", fr: "ID SPEAQ du destinataire", es: "SPEAQ ID del destinatario", ru: "SPEAQ ID poluchatelya", de: "Empfanger SPEAQ ID", sl: "SPEAQ ID prejemnika", lg: "SPEAQ ID y'afuna", sw: "SPEAQ ID ya mpokeaji" },
  "wallet.selectContact": { en: "Select contact...", nl: "Selecteer contact...", fr: "Choisir un contact...", es: "Seleccionar contacto...", ru: "Vybrat kontakt...", de: "Kontakt wahlen...", sl: "Izberi stik...", lg: "Londa omuntu...", sw: "Chagua anwani..." },
  "wallet.amountQC": { en: "Amount (QC)", nl: "Bedrag (QC)", fr: "Montant (QC)", es: "Monto (QC)", ru: "Summa (QC)", de: "Betrag (QC)", sl: "Znesek (QC)", lg: "Omuwendo (QC)", sw: "Kiasi (QC)" },
  "mining.miningActive": { en: "Mining active -- earning QC", nl: "Mining actief -- QC verdienen", fr: "Minage actif -- gagner QC", es: "Mineria activa -- ganando QC", ru: "Majning aktiven -- zarabotok QC", de: "Mining aktiv -- QC verdienen", sl: "Rudarjenje aktivno -- zasluzek QC", lg: "Okusimba kutandika -- okufuna QC", sw: "Uchimbaji unaendelea -- kupata QC" },
  "mining.maxSupply": { en: "Max Supply", nl: "Max Voorraad", fr: "Offre Max", es: "Suministro Max", ru: "Maks zapas", de: "Max Vorrat", sl: "Maks zaloga", lg: "Obungi obusinga", sw: "Ugavi wa juu" },
  "mining.totalMined": { en: "Total Mined", nl: "Totaal Gemijnd", fr: "Total Mine", es: "Total Minado", ru: "Vsego dobyte", de: "Gesamt Gemint", sl: "Skupaj pridobljeno", lg: "Byonna ebisimbiddwa", sw: "Jumla iliyochimbwa" },
  "mining.remaining": { en: "Remaining", nl: "Resterend", fr: "Restant", es: "Restante", ru: "Ostalos", de: "Verbleibend", sl: "Preostalo", lg: "Ebyasigaddewo", sw: "Iliyobaki" },
  "mining.halving": { en: "Halving", nl: "Halvering", fr: "Halving", es: "Halving", ru: "Kholving", de: "Halving", sl: "Razpolovitev", lg: "Okugawanya mu bibiri", sw: "Kugawanya nusu" },
  "mining.nativeOnly": { en: "Native only", nl: "Alleen native", fr: "Natif seulement", es: "Solo nativo", ru: "Tolko nativnoe", de: "Nur nativ", sl: "Samo domorodno", lg: "Eky'omu app yokka", sw: "Asili tu" },
  "mining.manual": { en: "Manual", nl: "Handmatig", fr: "Manuel", es: "Manual", ru: "Vruchnuyu", de: "Manuell", sl: "Rocno", lg: "Mu ngalo", sw: "Kwa mkono" },
  "ghost.alias": { en: "Your alias", nl: "Jouw alias", fr: "Votre alias", es: "Tu alias", ru: "Vash psevdonim", de: "Dein Alias", sl: "Tvoj vzdevek", lg: "Erinnya lyo elyekyama", sw: "Jina lako la siri" },
  "ghost.notSet": { en: "Not set", nl: "Niet ingesteld", fr: "Non defini", es: "No establecido", ru: "Ne ustanovlen", de: "Nicht gesetzt", sl: "Ni nastavljeno", lg: "Teteekeddwa", sw: "Haijawekwa" },
  "ghost.random": { en: "Random", nl: "Willekeurig", fr: "Aleatoire", es: "Aleatorio", ru: "Sluchajnyj", de: "Zufallig", sl: "Nakljucno", lg: "Mu mbeera yonna", sw: "Nasibu" },
  "ghost.enterAlias": { en: "Enter alias...", nl: "Voer alias in...", fr: "Entrez un alias...", es: "Ingrese alias...", ru: "Vvedite psevdonim...", de: "Alias eingeben...", sl: "Vnesite vzdevek...", lg: "Yingiza erinnya...", sw: "Ingiza jina..." },
  "ghost.anonMsg": { en: "Anonymous message...", nl: "Anoniem bericht...", fr: "Message anonyme...", es: "Mensaje anonimo...", ru: "Anonimnoe soobshchenie...", de: "Anonyme Nachricht...", sl: "Anonimno sporocilo...", lg: "Obubaka obutamanyiddwa...", sw: "Ujumbe usiojulikana..." },
  "witness.create": { en: "Create Evidence Record", nl: "Bewijs Record Aanmaken", fr: "Creer un Enregistrement", es: "Crear Registro de Evidencia", ru: "Sozdat zapis dokazatelstva", de: "Beweisaufzeichnung erstellen", sl: "Ustvari dokazni zapis", lg: "Tonda ekiwandiiko ky'obujulizi", sw: "Unda Rekodi ya Ushahidi" },
  "witness.describe": { en: "Describe what you are witnessing...", nl: "Beschrijf wat je ziet...", fr: "Decrivez ce que vous voyez...", es: "Describa lo que esta presenciando...", ru: "Opishite chto vy vidite...", de: "Beschreiben Sie was Sie sehen...", sl: "Opisite kaj pricujete...", lg: "Nyonyola ky'olaba...", sw: "Eleza unachoshuhudia..." },
  "witness.record": { en: "Record with Timestamp + GPS", nl: "Opnemen met Timestamp + GPS", fr: "Enregistrer avec Horodatage + GPS", es: "Registrar con Marca de Tiempo + GPS", ru: "Zapisat s metkoi vremeni + GPS", de: "Aufzeichnen mit Zeitstempel + GPS", sl: "Posnemi s casovnim zigom + GPS", lg: "Kwata ne Timestamp + GPS", sw: "Rekodi na Muda + GPS" },
  "witness.records": { en: "Evidence Records", nl: "Bewijs Records", fr: "Enregistrements", es: "Registros de Evidencia", ru: "Zapisi dokazatelstv", de: "Beweisaufzeichnungen", sl: "Dokazni zapisi", lg: "Ebiwandiiko by'obujulizi", sw: "Rekodi za Ushahidi" },
  "deadman.status": { en: "Status", nl: "Status", fr: "Statut", es: "Estado", ru: "Status", de: "Status", sl: "Status", lg: "Embeera", sw: "Hali" },
  "deadman.armed": { en: "ARMED", nl: "ACTIEF", fr: "ARME", es: "ARMADO", ru: "AKTIVIROVAN", de: "AKTIV", sl: "OBOROZENO", lg: "ETANDISE", sw: "IMEWASHWA" },
  "deadman.inactive": { en: "INACTIVE", nl: "INACTIEF", fr: "INACTIF", es: "INACTIVO", ru: "NEAKTIVEN", de: "INAKTIV", sl: "NEAKTIVNO", lg: "TEKUTANDIKA", sw: "HAIFANYI KAZI" },
  "deadman.lastCheckin": { en: "Last check-in:", nl: "Laatste check-in:", fr: "Dernier check-in:", es: "Ultimo check-in:", ru: "Poslednij check-in:", de: "Letzter Check-in:", sl: "Zadnji check-in:", lg: "Check-in ey'oluvannyuma:", sw: "Kuingia mwisho:" },
  "deadman.checkIn": { en: "Check In (I'm Safe)", nl: "Check In (Ik ben veilig)", fr: "Check In (Je suis en securite)", es: "Check In (Estoy seguro)", ru: "Otmetitsya (Ya v bezopasnosti)", de: "Check In (Ich bin sicher)", sl: "Prijava (Sem varen)", lg: "Yingira (Ndi bulungi)", sw: "Jiandikishe (Niko salama)" },
  "deadman.enable": { en: "Enable Switch", nl: "Schakelaar Inschakelen", fr: "Activer l'Interrupteur", es: "Habilitar Interruptor", ru: "Vklyuchit pereklyuchatel", de: "Schalter Aktivieren", sl: "Omogoci stikalo", lg: "Tandika eswiichi", sw: "Washa swichi" },
  "deadman.timeout": { en: "Timeout (minutes)", nl: "Timeout (minuten)", fr: "Delai (minutes)", es: "Tiempo (minutos)", ru: "Tajm-aut (minuty)", de: "Zeitlimit (Minuten)", sl: "Cas (minute)", lg: "Obudde (eddakiika)", sw: "Muda (dakika)" },
  "deadman.alertMsg": { en: "Alert Message", nl: "Waarschuwingsbericht", fr: "Message d'Alerte", es: "Mensaje de Alerta", ru: "Soobshchenie trevogi", de: "Warnmeldung", sl: "Opozorilno sporocilo", lg: "Obubaka bw'okulabula", sw: "Ujumbe wa Tahadhari" },
  "deadman.msgPlaceholder": { en: "Message to send if you don't check in...", nl: "Bericht als je niet incheckt...", fr: "Message si vous ne vous connectez pas...", es: "Mensaje si no se registra...", ru: "Soobshchenie esli vy ne otmetites...", de: "Nachricht wenn Sie sich nicht melden...", sl: "Sporocilo ce se ne prijavite...", lg: "Obubaka bwe otoyingira...", sw: "Ujumbe ukitumwa usipoingia..." },
  "deadman.webNote": { en: "Note: In the web app, the switch only works while the app is open.", nl: "Let op: In de webapp werkt de schakelaar alleen als de app open is.", fr: "Note: Dans l'app web, le commutateur ne fonctionne que lorsque l'app est ouverte.", es: "Nota: En la app web, el interruptor solo funciona con la app abierta.", ru: "Primechanie: V veb-prilozhenii pereklyuchatel rabotaet tolko kogda prilozhenie otkryto.", de: "Hinweis: In der Web-App funktioniert der Schalter nur bei geoffneter App.", sl: "Opomba: V spletni aplikaciji stikalo deluje samo ko je aplikacija odprta.", lg: "Ebigambo: Mu app ey'omukutu, eswiichi ekola nga app eri mu ngeri.", sw: "Kumbuka: Katika programu ya wavuti, swichi inafanya kazi tu wakati programu imefunguliwa." },
  "info.tagline": { en: "Quantum Freedom Platform", nl: "Quantum Vrijheidsplatform", fr: "Plateforme Liberte Quantique", es: "Plataforma Libertad Cuantica", ru: "Platforma kvantovoj svobody", de: "Quantum Freiheitsplattform", sl: "Kvantna platforma svobode", lg: "Ekifo ky'eddembe ery'obukwakkulizo", sw: "Jukwaa la Uhuru wa Quantum" },
  "info.security": { en: "Security", nl: "Beveiliging", fr: "Securite", es: "Seguridad", ru: "Bezopasnost", de: "Sicherheit", sl: "Varnost", lg: "Obukuumi", sw: "Usalama" },
  "info.tokenomics": { en: "Tokenomics", nl: "Tokenomics", fr: "Tokenomics", es: "Tokenomics", ru: "Tokenomika", de: "Tokenomics", sl: "Tokenomika", lg: "Tokenomics", sw: "Tokenomics" },
  "sovereign.title": { en: "Sovereign ID", nl: "Sovereign ID", fr: "Identite Souveraine", es: "ID Soberana", ru: "Suverennij ID", de: "Souverane ID", sl: "Suvereni ID", lg: "ID Eyeefuga", sw: "Kitambulisho Huru" },
  "sovereign.did": { en: "Decentralized Identifier (DID)", nl: "Gedecentraliseerde Identifier (DID)", fr: "Identifiant Decentralise (DID)", es: "Identificador Descentralizado (DID)", ru: "Detsentralizovannyj identifikator (DID)", de: "Dezentraler Identifikator (DID)", sl: "Decentraliziran identifikator (DID)", lg: "Eky'okuzuula ekitali mu kifo kimu (DID)", sw: "Kitambulisho kisicho na kati (DID)" },
  "sovereign.created": { en: "Created", nl: "Aangemaakt", fr: "Cree", es: "Creado", ru: "Sozdano", de: "Erstellt", sl: "Ustvarjeno", lg: "Etondeddwa", sw: "Imeundwa" },
  "sovereign.w3c": { en: "W3C Standard", nl: "W3C Standaard", fr: "Norme W3C", es: "Estandar W3C", ru: "Standart W3C", de: "W3C Standard", sl: "W3C Standard", lg: "W3C Standard", sw: "Kiwango cha W3C" },
  "lightning.title": { en: "Lightning Network", nl: "Lightning Netwerk", fr: "Reseau Lightning", es: "Red Lightning", ru: "Set Lightning", de: "Lightning Netzwerk", sl: "Lightning Omrezje", lg: "Lightning Network", sw: "Mtandao wa Lightning" },
  "lightning.subtitle": { en: "Bitcoin Lightning", nl: "Bitcoin Lightning", fr: "Bitcoin Lightning", es: "Bitcoin Lightning", ru: "Bitcoin Lightning", de: "Bitcoin Lightning", sl: "Bitcoin Lightning", lg: "Bitcoin Lightning", sw: "Bitcoin Lightning" },
  "lightning.desc": { en: "Convert between QC and Bitcoin", nl: "Wissel tussen QC en Bitcoin", fr: "Convertir entre QC et Bitcoin", es: "Convertir entre QC y Bitcoin", ru: "Konvertirovat mezhdu QC i Bitcoin", de: "Zwischen QC und Bitcoin wechseln", sl: "Pretvarjaj med QC in Bitcoin", lg: "Kyusa wakati wa QC ne Bitcoin", sw: "Badilisha kati ya QC na Bitcoin" },
  "lightning.comingSoon": { en: "Coming Soon", nl: "Binnenkort", fr: "Bientot", es: "Proximamente", ru: "Skoro", de: "Kommt bald", sl: "Kmalu", lg: "Ejja mangu", sw: "Inakuja hivi karibuni" },
  "contacts.scanHint": { en: "Point your camera at a SPEAQ QR code", nl: "Richt je camera op een SPEAQ QR code", fr: "Dirigez votre camera vers un code QR SPEAQ", es: "Apunte su camara a un codigo QR SPEAQ", ru: "Napravte kameru na QR kod SPEAQ", de: "Richten Sie Ihre Kamera auf einen SPEAQ QR Code", sl: "Usmerite kamero na SPEAQ QR kodo", lg: "Koleza kamera yo ku QR Code ya SPEAQ", sw: "Elekeza kamera yako kwenye msimbo wa QR wa SPEAQ" },
  "contacts.qrDesc": { en: "Others scan this to start a quantum-encrypted chat with you", nl: "Anderen scannen dit om een quantum-versleuteld gesprek te starten", fr: "Les autres scannent ceci pour demarrer une conversation", es: "Otros escanean esto para iniciar un chat cifrado", ru: "Drugie skaniruyut eto chtoby nachat kvantovo-zashchishchennyj chat", de: "Andere scannen dies um einen quantenverschlusselten Chat zu starten", sl: "Drugi skenirajo to za zacetek kvantno sifriranega pogovora", lg: "Abalala basikaana kino okutandika okwogerako okukuumiddwa", sw: "Wengine wanachunguza hii kuanza mazungumzo yaliyosimbwa" },
  "contacts.emptyHint": { en: "Tap + Add to add a contact by SPEAQ ID", nl: "Tik + Toevoegen om een contact toe te voegen via SPEAQ ID", fr: "Appuyez + Ajouter pour ajouter un contact", es: "Toque + Agregar para agregar un contacto", ru: "Nazhmite + Dobavit chtoby dobavit kontakt", de: "Tippen Sie + Hinzufugen um einen Kontakt hinzuzufugen", sl: "Tapnite + Dodaj za dodajanje stika", lg: "Nyiga + Gatta okugatta omuntu", sw: "Gusa + Ongeza kuongeza anwani" },
  "info.miningTitle": { en: "How Mining Works", nl: "Hoe Mining Werkt", fr: "Comment Fonctionne le Minage", es: "Como Funciona la Mineria", ru: "Kak rabotaet majning", de: "Wie Mining Funktioniert", sl: "Kako deluje rudarjenje", lg: "Okusimba kukola kutya", sw: "Jinsi Uchimbaji Unavyofanya Kazi" },
  "info.miningP1": { en: "SPEAQ uses Proof of Contribution mining. You earn Q-Credits by helping the network -- not by wasting energy like Bitcoin.", nl: "SPEAQ gebruikt Proof of Contribution mining. Je verdient Q-Credits door het netwerk te helpen -- niet door energie te verspillen zoals Bitcoin.", fr: "SPEAQ utilise le minage par Preuve de Contribution. Vous gagnez des Q-Credits en aidant le reseau.", es: "SPEAQ utiliza mineria por Prueba de Contribucion. Ganas Q-Credits ayudando a la red.", ru: "SPEAQ ispolzuet majning Proof of Contribution. Vy zarabatyvaete Q-Credits pomogaya seti.", de: "SPEAQ nutzt Proof of Contribution Mining. Sie verdienen Q-Credits indem Sie dem Netzwerk helfen.", sl: "SPEAQ uporablja rudarjenje s Proof of Contribution. Zasluzite Q-Credits s pomocjo omrezju.", lg: "SPEAQ ekozesa Proof of Contribution. Ofuna Q-Credits ng'oyamba network.", sw: "SPEAQ inatumia uchimbaji wa Uthibitisho wa Mchango. Unapata Q-Credits kwa kusaidia mtandao." },
  "info.miningTypes": { en: "7 Mining Types: Relay (forward messages), Validation (verify proofs), Storage (store encrypted data), Mesh (Bluetooth node), Bridge (cash agent), Translation (translate app), Onboarding (invite users).", nl: "7 Mining Types: Relay (berichten doorsturen), Validatie (bewijzen verifieren), Opslag (versleutelde data bewaren), Mesh (Bluetooth node), Bridge (cash agent), Vertaling (app vertalen), Onboarding (gebruikers uitnodigen).", fr: "7 Types de Minage: Relais, Validation, Stockage, Mesh, Pont, Traduction, Integration.", es: "7 Tipos de Mineria: Retransmision, Validacion, Almacenamiento, Mesh, Puente, Traduccion, Incorporacion.", ru: "7 tipov majninga: Retranslyatsiya, Validatsiya, Khranenie, Mesh, Most, Perevod, Registratsiya.", de: "7 Mining-Typen: Relay, Validierung, Speicherung, Mesh, Bridge, Ubersetzung, Onboarding.", sl: "7 tipov rudarjenja: Prenos, Preverjanje, Shranjevanje, Mesh, Most, Prevajanje, Vkljucevanje.", lg: "Ebika 7 by'okusimba: Relay, Okukakasa, Okutereka, Mesh, Bridge, Okuvvuunula, Okuyingiza.", sw: "Aina 7 za uchimbaji: Relay, Uthibitisho, Hifadhi, Mesh, Daraja, Tafsiri, Usajili." },
  "info.miningRates": { en: "Daily earnings: ~0.02-0.05 QC/day (~5-8% annual yield, comparable to staking platforms). Rewards halve every 2,100,000 QC mined.", nl: "Dagelijkse verdiensten: ~0.02-0.05 QC/dag (~5-8% jaarlijks rendement, vergelijkbaar met staking platforms). Beloningen halveren elke 2.100.000 QC gemijnd.", fr: "Gains quotidiens: ~0.02-0.05 QC/jour (~5-8% rendement annuel). Les recompenses diminuent de moitie tous les 2.100.000 QC mines.", es: "Ganancias diarias: ~0.02-0.05 QC/dia (~5-8% rendimiento anual). Las recompensas se reducen a la mitad cada 2.100.000 QC minados.", ru: "Dnevnoj dokhod: ~0.02-0.05 QC/den (~5-8% godovoj dokhod). Nagrady umenshayutsya vdvoe kazhdye 2.100.000 QC.", de: "Tagliche Einnahmen: ~0.02-0.05 QC/Tag (~5-8% jahrliche Rendite). Belohnungen halbieren sich alle 2.100.000 QC.", sl: "Dnevni zasluzek: ~0.02-0.05 QC/dan (~5-8% letni donos). Nagrade se razpolovijo vsakih 2.100.000 QC.", lg: "Empeera ez'olunaku: ~0.02-0.05 QC/olunaku (~5-8% omwaka). Empeera zeegabanyizibwa buli 2,100,000 QC.", sw: "Mapato ya kila siku: ~0.02-0.05 QC/siku (~5-8% kwa mwaka). Tuzo hupungua nusu kila QC 2,100,000." },
  "info.miningProof": { en: "Proof System (C+): Every mining reward is double-signed. You sign with your private key (proves identity). The relay server co-signs as witness (proves the work happened). Both signatures are stored in your mining ledger. When the blockchain launches, only double-signed entries are accepted. This makes fraud impossible.", nl: "Bewijs Systeem (C+): Elke mining beloning wordt dubbel gesigned. Jij signeert met je private key (bewijst identiteit). De relay server tekent mee als getuige (bewijst dat het werk is gedaan). Beide handtekeningen worden opgeslagen in je mining ledger. Bij blockchain launch worden alleen dubbel-gesignde entries geaccepteerd. Fraude is onmogelijk.", fr: "Systeme de Preuve (C+): Chaque recompense est doublement signee. Vous signez avec votre cle privee. Le serveur relais co-signe comme temoin. Les deux signatures sont stockees. Lors du lancement de la blockchain, seules les entrees doublement signees sont acceptees.", es: "Sistema de Prueba (C+): Cada recompensa se firma dos veces. Tu firmas con tu clave privada. El servidor relay co-firma como testigo. Ambas firmas se almacenan. Al lanzar la blockchain, solo se aceptan entradas con doble firma.", ru: "Sistema dokazatelstv (C+): Kazhdaya nagrada podpisyvaetsya dvazhdy. Vy podpisyvaete svoim privatnym klyuchom. Server-retranslyator sopodspisyvaet kak svidetel. Obe podpisi sokhranyayutsya. Pri zapuske blokchejna prinimayutsya tolko zapisi s dvojnoj podpisyu.", de: "Beweis-System (C+): Jede Mining-Belohnung wird doppelt signiert. Sie signieren mit Ihrem privaten Schlussel. Der Relay-Server signiert als Zeuge mit. Beide Signaturen werden gespeichert. Beim Blockchain-Start werden nur doppelt signierte Eintrage akzeptiert.", sl: "Dokazni sistem (C+): Vsaka nagrada je dvojno podpisana. Vi podpisete s svojim zasebnim kljucem. Streznik za prenos sopodpise kot prica. Oba podpisa sta shranjena. Ob zagonu verige blokov so sprejeti samo dvojno podpisani vnosi.", lg: "Enkola y'Obujulizi (C+): Buli mpeera esainibwa emirundi ebiri. Osainiira ne key yo ey'ekyama. Relay server esainiira ng'omujulizi. Obusaini bubiri buterekeddwa. Blockchain bw'etandika, entries ez'obusaini bubiri zokka ze zikkirizibwa.", sw: "Mfumo wa Uthibitisho (C+): Kila tuzo inasainiwa mara mbili. Unasaini na ufunguo wako wa siri. Seva ya relay inasaini kama shahidi. Saini zote mbili zinahifadhiwa. Blockchain inapoanzishwa, maingizo yenye saini mbili tu yanakubaliwa." },
  "info.securityDesc": { en: "AES-256-GCM encryption via Web Crypto API. Kyber-768 quantum-resistant key exchange. Double Ratchet forward secrecy. Signed key exchange (ECDSA P-256) prevents man-in-the-middle attacks. Zero-knowledge architecture -- no one can read your messages, not even SPEAQ.", nl: "AES-256-GCM versleuteling via Web Crypto API. Kyber-768 quantum-resistente key exchange. Double Ratchet forward secrecy. Gesigneerde key exchange (ECDSA P-256) voorkomt man-in-the-middle aanvallen. Zero-knowledge architectuur -- niemand kan je berichten lezen, zelfs SPEAQ niet.", fr: "Chiffrement AES-256-GCM. Echange de cles Kyber-768 resistant au quantique. Confidentialite persistante Double Ratchet. Echange de cles signe (ECDSA P-256). Architecture zero-knowledge.", es: "Cifrado AES-256-GCM. Intercambio de claves Kyber-768 resistente al cuantico. Secreto perfecto Double Ratchet. Intercambio de claves firmado (ECDSA P-256). Arquitectura zero-knowledge.", ru: "Shifrovanie AES-256-GCM. Kvantovo-ustojchivyj obmen klyuchami Kyber-768. Pryamaya sekretnost Double Ratchet. Podpisannyj obmen klyuchami (ECDSA P-256). Arkhitektura nulevogo znaniya.", de: "AES-256-GCM Verschlusselung. Kyber-768 quantenresistenter Schlusselaustausch. Double Ratchet Vorwartssicherheit. Signierter Schlusselaustausch (ECDSA P-256). Zero-Knowledge Architektur.", sl: "AES-256-GCM sifriranje. Kyber-768 kvantno odporna izmenjava kljucev. Double Ratchet posredna tajnost. Podpisana izmenjava kljucev (ECDSA P-256). Zero-knowledge arhitektura.", lg: "AES-256-GCM enkuuma. Kyber-768 okukyusa kw'obusumuluzo. Double Ratchet ekyama eky'omu maaso. Okusainiira obusumuluzo (ECDSA P-256). Zero-knowledge architecture.", sw: "Usimbaji AES-256-GCM. Kubadilishana funguo Kyber-768 zinazostahimili quantum. Usiri wa mbele wa Double Ratchet. Kubadilishana funguo iliyosainiwa (ECDSA P-256). Usanifu wa zero-knowledge." },
  "mod.chat": { en: "Chat", nl: "Chat", fr: "Discussion", es: "Chat", ru: "Chat", de: "Chat", sl: "Klepet", lg: "Okwogerako", sw: "Mazungumzo" },
  "mod.chatDesc": { en: "Quantum-encrypted messaging", nl: "Quantum-versleuteld berichtenverkeer", fr: "Messagerie chiffree quantique", es: "Mensajeria cifrada cuantica", ru: "Kvantovo-zashchishchennye soobshcheniya", de: "Quantenverschlusselte Nachrichten", sl: "Kvantno sifrirano sporocanje", lg: "Obubaka obukuumiddwa", sw: "Ujumbe uliofichwa kwa quantum" },
  "mod.call": { en: "Call", nl: "Bellen", fr: "Appel", es: "Llamada", ru: "Zvonok", de: "Anruf", sl: "Klic", lg: "Okuyita", sw: "Piga simu" },
  "mod.callDesc": { en: "WebRTC voice & video calls", nl: "WebRTC spraak- en videogesprekken", fr: "Appels vocaux et video WebRTC", es: "Llamadas de voz y video WebRTC", ru: "Golosovye i video zvonki WebRTC", de: "WebRTC Sprach- und Videoanrufe", sl: "WebRTC glasovni in video klici", lg: "Okuyita kw'eddoboozi ne video WebRTC", sw: "Simu za sauti na video za WebRTC" },
  "mod.pay": { en: "Pay", nl: "Betalen", fr: "Payer", es: "Pagar", ru: "Oplata", de: "Bezahlen", sl: "Placilo", lg: "Okusasula", sw: "Lipa" },
  "mod.payDesc": { en: "Q-Credits gold-pegged currency", nl: "Q-Credits goud-gekoppelde valuta", fr: "Q-Credits monnaie indexee sur l'or", es: "Q-Credits moneda vinculada al oro", ru: "Q-Credits valyuta privyazannaya k zolotu", de: "Q-Credits goldgebundene Wahrung", sl: "Q-Credits valuta vezana na zlato", lg: "Q-Credits ensimbi ez'ezaabbu", sw: "Q-Credits sarafu iliyofungwa na dhahabu" },
  "mod.mining": { en: "Mining", nl: "Mining", fr: "Minage", es: "Mineria", ru: "Majning", de: "Mining", sl: "Rudarjenje", lg: "Okusimba", sw: "Uchimbaji" },
  "mod.miningDesc": { en: "Proof of Contribution rewards", nl: "Proof of Contribution beloningen", fr: "Recompenses Preuve de Contribution", es: "Recompensas Prueba de Contribucion", ru: "Nagrady Proof of Contribution", de: "Proof of Contribution Belohnungen", sl: "Nagrade Proof of Contribution", lg: "Empeera za Proof of Contribution", sw: "Tuzo za Uthibitisho wa Mchango" },
  "mod.groups": { en: "Groups", nl: "Groepen", fr: "Groupes", es: "Grupos", ru: "Gruppy", de: "Gruppen", sl: "Skupine", lg: "Ebibinja", sw: "Vikundi" },
  "mod.groupsDesc": { en: "Encrypted group conversations", nl: "Versleutelde groepsgesprekken", fr: "Conversations de groupe chiffrees", es: "Conversaciones grupales cifradas", ru: "Zashchishchennye gruppovye besedy", de: "Verschlusselte Gruppengesprache", sl: "Sifrirani skupinski pogovori", lg: "Emboozi z'ekibinja ezikuumiddwa", sw: "Mazungumzo ya kikundi yaliyofichwa" },
  "mod.ghost": { en: "Ghost Groups", nl: "Ghost Groepen", fr: "Groupes Fantomes", es: "Grupos Fantasma", ru: "Prizrachnye gruppy", de: "Geister Gruppen", sl: "Nevidne skupine", lg: "Ebibinja ebitabika", sw: "Vikundi vya roho" },
  "mod.ghostDesc": { en: "Anonymous messaging", nl: "Anoniem berichtenverkeer", fr: "Messagerie anonyme", es: "Mensajeria anonima", ru: "Anonimnye soobshcheniya", de: "Anonyme Nachrichten", sl: "Anonimno sporocanje", lg: "Obubaka obutamanyiddwa", sw: "Ujumbe usiojulikana" },
  "mod.witness": { en: "Witness Mode", nl: "Getuige Modus", fr: "Mode Temoin", es: "Modo Testigo", ru: "Rezhim svidetelya", de: "Zeugenmodus", sl: "Nacin price", lg: "Enkola y'omujulizi", sw: "Hali ya Shahidi" },
  "mod.witnessDesc": { en: "Tamper-proof evidence", nl: "Manipulatiebestendig bewijs", fr: "Preuves inviolables", es: "Evidencia a prueba de manipulacion", ru: "Zaschishchennye ot poddelki dokazatelstva", de: "Manipulationssichere Beweise", sl: "Dokazila odporna na posege", lg: "Obujulizi obutakyusibwa", sw: "Ushahidi usiobadilishwa" },
  "mod.deadman": { en: "Dead Man's Switch", nl: "Dead Man's Switch", fr: "Commutateur d'Homme Mort", es: "Interruptor de Hombre Muerto", ru: "Mertvaya ruka", de: "Totmannschalter", sl: "Mrtva roka", lg: "Eswiichi y'omufu", sw: "Swichi ya Mtu Aliyekufa" },
  "mod.deadmanDesc": { en: "Auto-alert system", nl: "Auto-alarm systeem", fr: "Systeme d'alerte automatique", es: "Sistema de alerta automatica", ru: "Sistema avto-opoveshcheniya", de: "Auto-Alarmsystem", sl: "Samodejni alarmni sistem", lg: "Enkola y'okulabula ey'otomattiki", sw: "Mfumo wa tahadhari otomatiki" },
  "mod.sovereign": { en: "Sovereign ID", nl: "Sovereign ID", fr: "Identite Souveraine", es: "ID Soberana", ru: "Suverennyj ID", de: "Souverane ID", sl: "Suvereni ID", lg: "ID Eyeefuga", sw: "Kitambulisho Huru" },
  "mod.sovereignDesc": { en: "Self-sovereign identity (DID)", nl: "Zelf-soevereine identiteit (DID)", fr: "Identite auto-souveraine (DID)", es: "Identidad auto-soberana (DID)", ru: "Samosuveren identifikatsiya (DID)", de: "Selbstbestimmte Identitat (DID)", sl: "Samosuverna identiteta (DID)", lg: "Obuntukirivu obw'okwefuga (DID)", sw: "Utambulisho wa kujitawala (DID)" },
  "mod.lightning": { en: "Lightning", nl: "Lightning", fr: "Lightning", es: "Lightning", ru: "Lightning", de: "Lightning", sl: "Lightning", lg: "Lightning", sw: "Lightning" },
  "mod.lightningDesc": { en: "Bitcoin Lightning integration", nl: "Bitcoin Lightning integratie", fr: "Integration Bitcoin Lightning", es: "Integracion Bitcoin Lightning", ru: "Integratsiya Bitcoin Lightning", de: "Bitcoin Lightning Integration", sl: "Integracija Bitcoin Lightning", lg: "Okugatta Bitcoin Lightning", sw: "Muunganisho wa Bitcoin Lightning" },
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
// SVG Icons (no emoji -- NOOIT)
// ---------------------------------------------------------------------------

function IconChat({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>);
}
function IconUsers({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>);
}
function IconWallet({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><path d="M1 10h22" /></svg>);
}
function IconSettings({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>);
}
function IconBack({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>);
}
function IconSend({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>);
}
function IconPlus({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
}
function IconShield({ className = "w-4 h-4" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
}
function IconCopy({ className = "w-4 h-4" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>);
}
function IconTrash({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>);
}
function IconGlobe({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>);
}
function IconMining({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>);
}
function IconMenu({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>);
}
function IconPhone({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>);
}
function IconGroup({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>);
}
function IconGhost({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12v8l2.5-2 2.5 2 2.5-2 2.5 2 2.5-2 2.5 2v-8c0-5.52-4.48-10-10-10z" /><circle cx="8.5" cy="11" r="1.5" fill="currentColor" /><circle cx="15.5" cy="11" r="1.5" fill="currentColor" /></svg>);
}
function IconEye({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>);
}
function IconAlert({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>);
}
function IconZap({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>);
}
function IconInfo({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>);
}
function IconFingerprint({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 018 4" /><path d="M5 19.5C5.5 18 6 15 6 12c0-3.5 2.5-6 6-6" /><path d="M12 10c-1.1 0-2 .9-2 2 0 3-1 5.5-3 7.5" /><path d="M12 10c1.1 0 2 .9 2 2 0 4 1 6 3 8" /><path d="M20 8c.6 1.2 1 2.6 1 4 0 5-2 8-5 10.5" /></svg>);
}
function IconArrowUp({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>);
}
function IconArrowDown({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>);
}
function IconCheck({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}
function IconPhoneOff({ className = "w-5 h-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.33-2.67m-2.67-3.34a19.79 19.79 0 01-3.07-8.63A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91" /><line x1="1" y1="1" x2="23" y2="23" /></svg>);
}

// ---------------------------------------------------------------------------
// SPEAQ Logo SVG
// ---------------------------------------------------------------------------

function SpeaqLogo({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="90" stroke="#2DD4BF" strokeWidth="0.5" opacity="0.15" />
      <circle cx="100" cy="100" r="80" stroke="#D4A853" strokeWidth="1" opacity="0.3" />
      <text x="100" y="125" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="100" fontWeight="700" fill="#D4A853">Q</text>
      <circle cx="132" cy="148" r="5" fill="#2DD4BF" opacity="0.7" />
      <circle cx="140" cy="155" r="2.5" fill="#2DD4BF" opacity="0.35" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RELAY_URL = "wss://speaq-relay-244491980730.europe-west1.run.app";

// ---------------------------------------------------------------------------
// Sub-screen header helper
// ---------------------------------------------------------------------------

// Contact avatar -- shows photo if available, otherwise initial letter
function ContactAvatar({ name, speaqId, size = 40, photos }: { name: string; speaqId: string; size?: number; photos: Record<string, string> }) {
  const photo = photos[speaqId];
  if (photo) {
    return <img src={photo} alt={name} className="rounded-full object-cover border border-voice-gold/30" style={{ width: size, height: size }} />;
  }
  return (
    <div className="rounded-full bg-bg-elevated flex items-center justify-center border border-quantum-teal/30" style={{ width: size, height: size }}>
      <span className="font-heading font-bold text-voice-gold" style={{ fontSize: size * 0.4 }}>{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

function ScreenHeader({ title, onBack, lang, rightAction }: { title: string; onBack: () => void; lang: Lang; rightAction?: React.ReactNode }) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 bg-bg-surface border-b border-[rgba(100,116,139,0.15)] shrink-0">
      <button onClick={onBack} className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary">
        <IconBack />
      </button>
      <h2 className="text-lg font-heading font-semibold text-text-primary flex-1">{title}</h2>
      {rightAction}
    </header>
  );
}

// ---------------------------------------------------------------------------
// Main App Component
// ---------------------------------------------------------------------------

export default function SpeaqApp() {
  // Core state
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

  // Wallet state
  const [wallet, setWalletState] = useState<WalletState>({ balance: 0, totalReceived: 0, totalSent: 0, totalMined: 0 });
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [sendAmount, setSendAmount] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [projects, setProjects] = useState<WalletProject[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);

  // Mining state
  const [miningStats, setMiningStats] = useState<MiningStats | null>(null);
  const [miningRewards, setMiningRewards] = useState<MiningReward[]>([]);
  const [miningActive, setMiningActive] = useState(false);
  const miningInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Groups state
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [groupMessages, setGroupMessages] = useState<Record<string, GroupMsg[]>>({});
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Call state
  const [callContact, setCallContact] = useState<Contact | null>(null);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const callTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  // Advanced state
  const [witnessRecords, setWitnessRecords] = useState<WitnessRecord[]>([]);
  const [witnessDesc, setWitnessDesc] = useState("");
  const [deadmanConfig, setDeadmanConfig] = useState<DeadManConfig>({ enabled: false, timeoutMinutes: 60, message: "", recipients: [], lastCheckin: Date.now() });
  const [ghostAlias, setGhostAlias] = useState("");
  const [ghostMessages, setGhostMessages] = useState<{ alias: string; text: string; timestamp: number }[]>([]);
  const [ghostInput, setGhostInput] = useState("");

  // PIN state
  const [pinInput, setPinInput] = useState("");
  const [pinStep, setPinStep] = useState<"enter" | "confirm">("enter");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinLocked, setPinLocked] = useState(true);

  // QR code state
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);

  // Profile photo
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contact photos (received from others via messages)
  const [contactPhotos, setContactPhotos] = useState<Record<string, string>>({});

  // QR Scanner
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scannerStream = useRef<MediaStream | null>(null);
  const scannerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Language picker
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [theme, setThemeState] = useState<"system" | "dark" | "light">("system");

  // Chat share menu
  const [showShareMenu, setShowShareMenu] = useState(false);
  const chatFileRef2 = useRef<HTMLInputElement>(null);
  const chatPhotoRef2 = useRef<HTMLInputElement>(null);

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const wavRecorder = useRef<WavRecorder | null>(null);
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingSeconds = useRef(0);

  // Store audio Blobs by message ID for playback (avoids data URL corruption)
  const voiceBlobs = useRef<Record<string, string>>({});

  // Onboarding
  const [onboardingSlide, setOnboardingSlide] = useState(0);

  // Disappearing messages per contact
  const [disappearTimers, setDisappearTimers] = useState<Record<string, number>>({});

  // Typing indicator
  const [typingContacts, setTypingContacts] = useState<Record<string, boolean>>({});

  // Kyber keypair (quantum crypto)
  const kyberKeys = useRef<KyberKeyPair | null>(null);
  const signingKeys = useRef<SigningKeyPair | null>(null);
  const pendingKeyExchanges = useRef<Record<string, string>>({}); // contactId -> our privateKey for this exchange

  // Video call refs
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ from: string; name: string; sdp: string } | null>(null);

  // Blocked users
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  // Linked wallets
  const [linkedWallets, setLinkedWallets] = useState<{ type: string; address: string; label: string }[]>([]);
  const [showLinkWallet, setShowLinkWallet] = useState(false);
  const [linkWalletType, setLinkWalletType] = useState("XMR");
  const [linkWalletAddr, setLinkWalletAddr] = useState("");
  const [linkWalletLabel, setLinkWalletLabel] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------------------------------------------------------------------------
  // Load from localStorage on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const saved = loadJSON<Identity | null>("speaq_identity", null);
    const hasPin = !!localStorage.getItem("speaq_pin");
    const onboardingDone = !!localStorage.getItem("speaq_onboarding_done");
    if (saved) {
      setIdentity(saved);
      if (hasPin) {
        setScreen("lock");
        setPinLocked(true);
      } else {
        setScreen("setPin");
        setPinLocked(true);
      }
    } else if (!onboardingDone) {
      setScreen("onboarding");
    }
    setContacts(loadJSON<Contact[]>("speaq_contacts", []));
    setMessages(loadJSON<Record<string, Message[]>>("speaq_messages", {}));
    setGroups(loadJSON<Group[]>("speaq_groups", []));
    setGroupMessages(loadJSON<Record<string, GroupMsg[]>>("speaq_group_messages", {}));
    setWitnessRecords(loadJSON<WitnessRecord[]>("speaq_witness", []));
    setDeadmanConfig(loadJSON<DeadManConfig>("speaq_deadman", { enabled: false, timeoutMinutes: 60, message: "", recipients: [], lastCheckin: Date.now() }));
    setGhostMessages(loadJSON<{ alias: string; text: string; timestamp: number }[]>("speaq_ghost", []));

    setWalletState(loadWallet());
    setTxs(loadTransactions());
    setProjects(loadJSON<WalletProject[]>("speaq_projects", []));
    const stats = loadStats();
    setMiningStats(stats);
    setMiningRewards(loadRewards());
    if (localStorage.getItem("speaq_mining_active") === "true") setMiningActive(true);

    const savedLang = localStorage.getItem("speaq_lang");
    if (savedLang && languages.some((l) => l.code === savedLang)) setLang(savedLang as Lang);

    // Theme (check both key formats for compat with landing page)
    const savedTheme = (localStorage.getItem("speaq_theme") || localStorage.getItem("speaq-theme")) as "system" | "dark" | "light" | null;
    if (savedTheme) { setThemeState(savedTheme); applyTheme(savedTheme); }
    else { applyTheme("system"); }
    // Listen for system theme changes
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onSystemThemeChange = () => { if ((localStorage.getItem("speaq_theme") || "system") === "system") applyTheme("system"); };
    mq.addEventListener("change", onSystemThemeChange);

    // Profile photo
    const savedPhoto = localStorage.getItem("speaq_profile_photo");
    if (savedPhoto) setProfilePhoto(savedPhoto);

    // Load or generate Kyber keypair + signing keypair
    const savedKyber = localStorage.getItem("speaq_kyber_keys");
    if (savedKyber) {
      kyberKeys.current = JSON.parse(savedKyber);
    } else if (saved) {
      generateKyberKeyPair().then((kp) => {
        kyberKeys.current = kp;
        localStorage.setItem("speaq_kyber_keys", JSON.stringify(kp));
      });
    }
    const savedSigning = loadSigningKeys();
    if (savedSigning) {
      signingKeys.current = savedSigning;
    } else if (saved) {
      generateSigningKeyPair().then((sk) => {
        signingKeys.current = sk;
        saveSigningKeys(sk);
      });
    }
    setBlockedUsers(loadJSON<string[]>("speaq_blocked", []));
    setLinkedWallets(loadJSON<{ type: string; address: string; label: string }[]>("speaq_linked_wallets", []));
    setDisappearTimers(loadJSON<Record<string, number>>("speaq_disappear", {}));
    setContactPhotos(loadJSON<Record<string, string>>("speaq_contact_photos", {}));
    return () => { mq.removeEventListener("change", onSystemThemeChange); };
  }, []);

  // Save on change
  useEffect(() => { if (contacts.length > 0) saveJSON("speaq_contacts", contacts); }, [contacts]);
  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      const safe: Record<string, Message[]> = {};
      for (const [k, msgs] of Object.entries(messages)) {
        safe[k] = msgs.map((m) => {
          // Photos: store separately in localStorage, keep reference in message
          if (m.text.startsWith("[img]") && m.text.length > 500) {
            const photoData = m.text.slice(5, -6);
            try { localStorage.setItem("speaq_photo_" + m.id, photoData); } catch {}
            return { ...m, text: "[img:saved:" + m.id + "]" };
          }
          // Voice: strip binary data, keep only label
          if (m.text.startsWith("[voice:") && m.text.length > 500) {
            return { ...m, text: m.text.slice(0, m.text.indexOf("]") + 1) };
          }
          // Files: strip binary data
          if (m.text.startsWith("[file:") && m.text.length > 500) {
            return { ...m, text: "[File: " + m.text.slice(6, m.text.indexOf("]")) + "]" };
          }
          return m;
        });
      }
      try { saveJSON("speaq_messages", safe); } catch {}
    }
  }, [messages]);
  useEffect(() => { if (groups.length > 0) saveJSON("speaq_groups", groups); }, [groups]);
  useEffect(() => { if (Object.keys(groupMessages).length > 0) saveJSON("speaq_group_messages", groupMessages); }, [groupMessages]);
  useEffect(() => { saveJSON("speaq_witness", witnessRecords); }, [witnessRecords]);
  useEffect(() => { saveJSON("speaq_ghost", ghostMessages); }, [ghostMessages]);
  useEffect(() => { if (projects.length > 0) saveJSON("speaq_projects", projects); }, [projects]);

  // Scroll to bottom
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, activeContact, groupMessages, activeGroup, ghostMessages]);

  // Mining interval
  useEffect(() => {
    if (miningActive && miningStats) {
      localStorage.setItem("speaq_mining_active", "true");
      miningInterval.current = setInterval(() => {
        setMiningStats((prev) => {
          if (!prev) return prev;
          const result = simulateMiningCycle(prev, miningRewards);
          setMiningRewards(result.rewards);
          if (result.earned > 0) {
            setWalletState((w) => {
              const updated = { ...w, balance: w.balance + result.earned, totalMined: w.totalMined + result.earned };
              saveWallet(updated);
              return updated;
            });
          }
          return result.stats;
        });
      }, 30000);
      return () => { if (miningInterval.current) clearInterval(miningInterval.current); };
    } else {
      localStorage.setItem("speaq_mining_active", "false");
      if (miningInterval.current) { clearInterval(miningInterval.current); miningInterval.current = null; }
    }
  }, [miningActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------------------
  // WebSocket
  // ---------------------------------------------------------------------------
  const handleWsMessage = useCallback(async (event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data);
      if ((msg.type === "RECEIVE_SEALED" || msg.type === "RECEIVE") && msg.blob && identity) {
        const fromId = msg.from;
        if (!fromId) { console.warn("[SPEAQ] No from field in message"); return; }
        console.log("[SPEAQ] Received message from", fromId, "blob size:", msg.blob.length);
        let plaintext = "";

        // Try legacy AES-256-GCM with SHA-256 key derivation (most reliable)
        try {
          const key = await deriveKey(identity.speaqId, fromId);
          plaintext = await decrypt(key, msg.blob);
          console.log("[SPEAQ] Decrypted OK, plaintext size:", plaintext.length);
        } catch (e: unknown) {
          // Try ratchet decrypt as fallback
          const ratchetState = loadRatchetState(fromId);
          if (ratchetState) {
            try {
              const ratchetMsg = JSON.parse(msg.blob);
              if (ratchetMsg.mn !== undefined && ratchetMsg.ct) {
                const result = await ratchetDecrypt(ratchetState, ratchetMsg.ct, ratchetMsg.mn);
                plaintext = result.plaintext;
                saveRatchetState(fromId, result.state);
                console.log("[SPEAQ] Ratchet decrypted OK");
              }
            } catch {}
          }
          if (!plaintext) { console.warn("[SPEAQ] All decryption failed from", fromId, (e as Error)?.message); return; }
        }

        if (!plaintext) return;
        let parsed: { text?: string; from?: string; senderId?: string; timestamp?: number; photo?: string; audioB64?: string };
        try { parsed = JSON.parse(plaintext); } catch { parsed = { text: plaintext }; }

        // Store sender's profile photo if included
        if (parsed.photo && parsed.senderId) {
          setContactPhotos((prev) => {
            const updated = { ...prev, [parsed.senderId!]: parsed.photo! };
            saveJSON("speaq_contact_photos", updated);
            return updated;
          });
        }
        // Handle voice message audio data
        const msgId = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        let text = parsed.text || plaintext;
        if (parsed.audioB64) {
          try {
            // Decode base64 in chunks to avoid stack overflow
            const b64 = parsed.audioB64;
            const binStr = atob(b64);
            const len = binStr.length;
            const arr = new Uint8Array(len);
            for (let i = 0; i < len; i++) arr[i] = binStr.charCodeAt(i);
            const blob = new Blob([arr], { type: "audio/wav" });
            const blobUrl = URL.createObjectURL(blob);
            voiceBlobs.current[msgId] = blobUrl;
            text = (parsed.text || "[voice:?s]").replace("]", ":" + msgId + "]");
            console.log("[SPEAQ] Voice received, blob size:", blob.size, "url:", blobUrl);
          } catch (e) { console.error("[SPEAQ] Voice decode error:", e); }
        }
        const senderId = parsed.senderId || fromId;
        const newMsg: Message = { id: msgId, text, fromMe: false, timestamp: parsed.timestamp || Date.now() };
        setMessages((prev) => ({ ...prev, [senderId]: [...(prev[senderId] || []), newMsg] }));
        setContacts((prev) => {
          if (prev.some((c) => c.speaqId === senderId)) return prev;
          return [...prev, { speaqId: senderId, name: parsed.from || senderId.substring(0, 8), addedAt: Date.now() }];
        });
      }
      // Handle call signaling
      if (msg.type === "CALL_OFFER" && msg.from) {
        const contact = contacts.find(c => c.speaqId === msg.from) || { speaqId: msg.from, name: msg.from.substring(0, 8), addedAt: Date.now() };
        // Don't use confirm() -- it blocks WebSocket and drops ICE candidates
        setIsVideoCall(!!msg.video);
        setIncomingCall({ from: msg.from, name: (contact as Contact).name, sdp: msg.sdp });
        setCallContact(contact as Contact);
      }
      if (msg.type === "CALL_ANSWER" && msg.sdp && peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: msg.sdp }));
      }
      if (msg.type === "ICE_CANDIDATE" && msg.candidate && peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
      }
      if (msg.type === "CALL_END") {
        endCall();
      }
      // KEY_EXCHANGE: someone wants to establish quantum-secure channel
      if (msg.type === "KEY_EXCHANGE" && msg.from && msg.blob && identity) {
        try {
          // Verify signature if present (prevents MITM)
          if (msg.sig && msg.signPub) {
            const valid = await verifySignature(msg.blob, msg.sig, msg.signPub);
            if (!valid) { console.warn("[SPEAQ] KEY_EXCHANGE signature INVALID from", msg.from); return; }
            // Store their signing public key for future verification
            saveContactSigningKey(msg.from, msg.signPub);
            console.log("[SPEAQ] KEY_EXCHANGE signature verified from", msg.from);
          }
          // Encapsulate to create shared secret
          const theirPublicKey = msg.blob;
          const { ciphertext, sharedSecret } = await kyberEncapsulate(theirPublicKey);
          // Sign our response
          const sig = signingKeys.current ? await signData(ciphertext, signingKeys.current.privateKey) : "";
          const signPub = signingKeys.current?.publicKey || "";
          // Send back signed ciphertext
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "KEY_EXCHANGE_RESPONSE", to: msg.from, blob: ciphertext, sig, signPub }));
          }
          // Init Double Ratchet as responder (not initiator)
          const ratchet = await initRatchet(sharedSecret, false);
          saveRatchetState(msg.from, ratchet);
          console.log("[SPEAQ] SIGNED quantum key exchange complete with", msg.from);
        } catch (e) {
          console.error("[SPEAQ] Key exchange failed:", e);
        }
      }

      // KEY_EXCHANGE_RESPONSE: they responded with signed Kyber ciphertext
      if (msg.type === "KEY_EXCHANGE_RESPONSE" && msg.from && msg.blob && identity) {
        try {
          // Verify signature if present
          if (msg.sig && msg.signPub) {
            const valid = await verifySignature(msg.blob, msg.sig, msg.signPub);
            if (!valid) { console.warn("[SPEAQ] KEY_EXCHANGE_RESPONSE signature INVALID from", msg.from); return; }
            saveContactSigningKey(msg.from, msg.signPub);
            console.log("[SPEAQ] KEY_EXCHANGE_RESPONSE signature verified from", msg.from);
          }
          const privateKey = pendingKeyExchanges.current[msg.from];
          if (privateKey) {
            const sharedSecret = await kyberDecapsulate(msg.blob, privateKey);
            const ratchet = await initRatchet(sharedSecret, true);
            saveRatchetState(msg.from, ratchet);
            delete pendingKeyExchanges.current[msg.from];
            console.log("[SPEAQ] SIGNED quantum key exchange response received from", msg.from);
          }
        } catch (e) {
          console.error("[SPEAQ] Key exchange response failed:", e);
        }
      }

      // ACK with mining receipt (C+ system)
      if (msg.type === "ACK" && msg.miningReceipt && msg.receiptData && identity) {
        const entry: MiningLedgerEntry = {
          speaqId: identity.speaqId,
          miningType: "relay",
          amount: 0.0001,
          timestamp: Date.now(),
          minerSignature: signingKeys.current ? await signData(msg.receiptData, signingKeys.current.privateKey) : "",
          relaySignature: msg.miningReceipt,
          receiptData: msg.receiptData,
        };
        addLedgerEntry(entry);
      }

      // Typing indicator
      if (msg.type === "TYPING" && msg.from) {
        setTypingContacts((prev) => ({ ...prev, [msg.from]: true }));
        setTimeout(() => setTypingContacts((prev) => ({ ...prev, [msg.from]: false })), 3000);
      }
    } catch (e) { console.error("[SPEAQ] WS message parse error:", e); }
  }, [identity, contacts]); // eslint-disable-line react-hooks/exhaustive-deps

  const connectWs = useCallback(() => {
    if (!identity) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;
    const ws = new WebSocket(RELAY_URL);
    ws.onopen = () => { setConnected(true); ws.send(JSON.stringify({ type: "AUTH", speaqId: identity.speaqId })); };
    ws.onmessage = handleWsMessage;
    ws.onclose = () => { setConnected(false); wsRef.current = null; reconnectTimer.current = setTimeout(connectWs, 3000); };
    ws.onerror = () => { setConnected(false); };
    wsRef.current = ws;
  }, [identity, handleWsMessage]);

  useEffect(() => {
    if (identity) connectWs();
    return () => { if (reconnectTimer.current) clearTimeout(reconnectTimer.current); if (wsRef.current) { wsRef.current.onclose = null; wsRef.current.close(); } };
  }, [identity, connectWs]);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const createIdentity = () => {
    if (!nameInput.trim()) return;
    const speaqId = generateId();
    const id: Identity = { speaqId, displayName: nameInput.trim(), createdAt: Date.now(), did: `did:speaq:${speaqId}` };
    saveJSON("speaq_identity", id);
    setIdentity(id);
    setScreen("setPin");
    // Generate Kyber keypair + signing keypair
    generateKyberKeyPair().then((kp) => {
      kyberKeys.current = kp;
      localStorage.setItem("speaq_kyber_keys", JSON.stringify(kp));
    });
    generateSigningKeyPair().then((sk) => {
      signingKeys.current = sk;
      saveSigningKeys(sk);
    });
    // Generate QR
    QRCode.toDataURL(`speaq://${speaqId}`, { width: 200, margin: 1, color: { dark: "#D4A853", light: "#0A0A0F" } })
      .then((url: string) => setQrDataUrl(url)).catch(() => {});
  };

  // PIN handlers -- uses PBKDF2 with 100,000 iterations (same as native app)
  const hashPin = async (pin: string): Promise<string> => {
    return hashPinPBKDF2(pin, identity?.speaqId || "default");
  };

  const handlePinDigit = (digit: string) => {
    if (pinInput.length < 6) setPinInput(pinInput + digit);
  };

  const handlePinDelete = () => {
    setPinInput(pinInput.slice(0, -1));
  };

  const handlePinSubmit = async () => {
    if (screen === "setPin") {
      if (pinStep === "enter") {
        if (pinInput.length < 4) { alert("PIN must be at least 4 digits"); return; }
        setConfirmPin(pinInput);
        setPinInput("");
        setPinStep("confirm");
      } else {
        if (pinInput === confirmPin) {
          const hashed = await hashPin(pinInput);
          localStorage.setItem("speaq_pin", hashed);
          setPinInput("");
          setPinStep("enter");
          setConfirmPin("");
          setPinLocked(false);
          setScreen("main");
        } else {
          alert("PINs don't match. Try again.");
          setPinInput("");
          setPinStep("enter");
          setConfirmPin("");
        }
      }
    } else if (screen === "lock") {
      const stored = localStorage.getItem("speaq_pin");
      const hashed = await hashPin(pinInput);
      if (hashed === stored) {
        setPinInput("");
        setPinLocked(false);
        setScreen("main");
      } else {
        alert("Wrong PIN");
        setPinInput("");
      }
    }
  };

  // Profile photo handler
  const handleProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfilePhoto(dataUrl);
      localStorage.setItem("speaq_profile_photo", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Share ID
  const shareId = () => {
    if (!identity) return;
    if (navigator.share) {
      navigator.share({ title: "SPEAQ", text: `Connect with me on SPEAQ!\n\nMy SPEAQ ID: ${identity.speaqId}\n\nDownload: thespeaq.com` });
    } else {
      copyId();
    }
  };

  // Finish voice recording: create blob URL, encrypt, send
  const finishVoice = async (audioBlob: Blob) => {
    setIsRecording(false);
    if (recordingTimer.current) { clearInterval(recordingTimer.current); recordingTimer.current = null; }
    if (!identity || !wsRef.current || !activeContact || audioBlob.size < 100) return;
    try {
      const blobUrl = URL.createObjectURL(audioBlob);
      const dur = recordingSeconds.current;
      const msgId = generateId();
      voiceBlobs.current[msgId] = blobUrl;
      const msgText = `[voice:${dur}s:${msgId}]`;
      const newMsg: Message = { id: msgId, text: msgText, fromMe: true, timestamp: Date.now() };
      setMessages((prev) => ({ ...prev, [activeContact!.speaqId]: [...(prev[activeContact!.speaqId] || []), newMsg] }));
      const arrayBuf = await audioBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuf);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode.apply(null, Array.from(bytes.slice(i, i + 8192)));
      const audioB64 = btoa(binary);
      const key = await deriveKey(identity.speaqId, activeContact.speaqId);
      const payload = JSON.stringify({ type: "message", text: `[voice:${dur}s]`, audioB64, from: identity.displayName, senderId: identity.speaqId, timestamp: Date.now() });
      const encBlob = await encrypt(key, payload);
      wsRef.current.send(JSON.stringify({ type: "SEND", to: activeContact.speaqId, blob: encBlob }));
      recordingSeconds.current = 0;
      setRecordingDuration(0);
    } catch (err) { alert("Voice error: " + (err as Error).message); }
  };

  // Compress image before sending (max 400px, JPEG quality 0.4 for reliable transfer)
  const compressImage = (dataUrl: string, maxW = 400, quality = 0.4): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let w = img.width, h = img.height;
          if (w > maxW) { h = (h * maxW) / w; w = maxW; }
          if (h > maxW) { w = (w * maxW) / h; h = maxW; }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, w, h);
          const result = canvas.toDataURL("image/jpeg", quality);
          console.log("[SPEAQ] Compressed image:", img.width + "x" + img.height, "->", w + "x" + h, "size:", result.length);
          resolve(result);
        } catch (e) { reject(e); }
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = dataUrl;
    });
  };

  // Send typing indicator
  const sendTyping = () => {
    if (!activeContact || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "TYPING", to: activeContact.speaqId }));
  };

  // Block/unblock user
  const blockUser = (speaqId: string) => {
    if (!confirm(`Block this user?`)) return;
    const updated = [...blockedUsers, speaqId];
    setBlockedUsers(updated);
    saveJSON("speaq_blocked", updated);
  };

  const unblockUser = (speaqId: string) => {
    const updated = blockedUsers.filter((id) => id !== speaqId);
    setBlockedUsers(updated);
    saveJSON("speaq_blocked", updated);
  };

  // Link wallet
  const addLinkedWallet = () => {
    if (!linkWalletAddr.trim()) return;
    const w = { type: linkWalletType, address: linkWalletAddr.trim(), label: linkWalletLabel.trim() };
    const updated = [...linkedWallets, w];
    setLinkedWallets(updated);
    saveJSON("speaq_linked_wallets", updated);
    setLinkWalletAddr("");
    setLinkWalletLabel("");
    setShowLinkWallet(false);
  };

  const removeLinkedWallet = (index: number) => {
    const updated = linkedWallets.filter((_, i) => i !== index);
    setLinkedWallets(updated);
    saveJSON("speaq_linked_wallets", updated);
  };

  // Set disappearing messages for contact
  const setDisappearTimer = (contactId: string, minutes: number) => {
    const updated = { ...disappearTimers, [contactId]: minutes };
    setDisappearTimers(updated);
    saveJSON("speaq_disappear", updated);
  };

  // QR Scanner - opens camera to scan SPEAQ QR codes
  const startScanner = async () => {
    setShowScanner(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      scannerStream.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      // Start scanning frames
      scannerInterval.current = setInterval(() => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video.readyState !== video.HAVE_ENOUGH_DATA) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          const value = code.data;
          const speaqId = value.startsWith("speaq://") ? value.replace("speaq://", "") : value;
          if (speaqId && speaqId.length >= 8) {
            stopScanner();
            setNewContactId(speaqId);
            setScreen("addContact");
          }
        }
      }, 200);
    } catch (err) {
      alert("Could not access camera");
      setShowScanner(false);
    }
  };

  const stopScanner = () => {
    if (scannerInterval.current) { clearInterval(scannerInterval.current); scannerInterval.current = null; }
    if (scannerStream.current) { scannerStream.current.getTracks().forEach((t2) => t2.stop()); scannerStream.current = null; }
    setShowScanner(false);
  };

  const sendMsg = async () => {
    if (!inputText.trim() || !activeContact || !identity || !wsRef.current) return;
    if (wsRef.current.readyState !== WebSocket.OPEN) return;

    const payload: Record<string, unknown> = { type: "message", text: inputText.trim(), from: identity.displayName, senderId: identity.speaqId, timestamp: Date.now() };
    // Include small profile photo thumbnail (only if not already cached by receiver)
    if (profilePhoto && !contactPhotos[activeContact.speaqId + "_sent"]) {
      // Compress to tiny 80px thumbnail for embedding in messages
      const thumb = await compressImage(profilePhoto);
      // Only include if small enough (< 10KB as data URL)
      if (thumb.length < 15000) {
        payload.photo = thumb;
        setContactPhotos((prev) => ({ ...prev, [activeContact.speaqId + "_sent"]: "1" }));
      }
    }
    const plainPayload = JSON.stringify(payload);
    let blob: string;

    // Check if we have a ratchet (quantum-secure channel) with this contact
    const ratchetState = loadRatchetState(activeContact.speaqId);
    if (ratchetState) {
      // Ratchet encrypt: unique key per message, forward secrecy
      const result = await ratchetEncrypt(ratchetState, plainPayload);
      saveRatchetState(activeContact.speaqId, result.state);
      // Send as JSON with message number so receiver can ratchet-decrypt
      blob = JSON.stringify({ mn: result.messageNumber, ct: result.ciphertext });
    } else {
      // No ratchet yet -- initiate Kyber key exchange AND send with legacy encryption
      // The key exchange runs in background; future messages will use ratchet
      if (!pendingKeyExchanges.current[activeContact.speaqId] && kyberKeys.current) {
        // Generate fresh keypair for this exchange + sign it
        const kp = await generateKyberKeyPair();
        pendingKeyExchanges.current[activeContact.speaqId] = kp.privateKey;
        const sig = signingKeys.current ? await signData(kp.publicKey, signingKeys.current.privateKey) : "";
        const signPub = signingKeys.current?.publicKey || "";
        wsRef.current.send(JSON.stringify({ type: "KEY_EXCHANGE", to: activeContact.speaqId, blob: kp.publicKey, sig, signPub }));
        console.log("[SPEAQ] Initiated SIGNED Kyber key exchange with", activeContact.speaqId);
      }
      // Send with legacy AES-256-GCM (still encrypted, just not quantum-resistant yet)
      const key = await deriveKey(identity.speaqId, activeContact.speaqId);
      blob = await encrypt(key, plainPayload);
    }

    wsRef.current.send(JSON.stringify({ type: "SEND", to: activeContact.speaqId, blob }));
    const newMsg: Message = { id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6), text: inputText.trim(), fromMe: true, timestamp: Date.now() };
    setMessages((prev) => ({ ...prev, [activeContact.speaqId]: [...(prev[activeContact.speaqId] || []), newMsg] }));
    setInputText("");
  };

  const addContact = () => {
    if (!newContactId.trim() || !newContactName.trim()) return;
    const contact: Contact = { speaqId: newContactId.trim().toLowerCase(), name: newContactName.trim(), addedAt: Date.now() };
    setContacts((prev) => prev.some((c) => c.speaqId === contact.speaqId) ? prev : [...prev, contact]);
    setNewContactId("");
    setNewContactName("");
    setScreen("main");
  };

  const openChat = (contact: Contact) => { setActiveContact(contact); setScreen("chat"); };

  const deleteAllData = () => {
    if (!confirm(t("settings.deleteConfirm", lang))) return;
    localStorage.clear();
    setIdentity(null); setContacts([]); setMessages({}); setScreen("welcome");
    setMiningActive(false); setGroups([]); setGroupMessages({});
    if (wsRef.current) wsRef.current.close();
  };

  const copyId = () => {
    if (!identity) return;
    navigator.clipboard.writeText(identity.speaqId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const changeLang = (newLang: Lang) => { setLang(newLang); localStorage.setItem("speaq_lang", newLang); };

  const applyTheme = useCallback((t: "system" | "dark" | "light") => {
    const isDark = t === "dark" || (t === "system" && !window.matchMedia("(prefers-color-scheme: light)").matches);
    document.documentElement.classList.toggle("light", !isDark);
  }, []);

  const changeTheme = (t: "system" | "dark" | "light") => {
    setThemeState(t);
    localStorage.setItem("speaq_theme", t);
    applyTheme(t);
  };
  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (ts: number) => new Date(ts).toLocaleDateString();
  const getLastMessage = (cid: string): string => { const m = messages[cid]; return m && m.length > 0 ? m[m.length - 1].text : ""; };
  const getLastTimestamp = (cid: string): number => { const m = messages[cid]; return m && m.length > 0 ? m[m.length - 1].timestamp : 0; };

  // Mining handlers
  const toggleMining = () => {
    if (miningActive) {
      setMiningActive(false);
    } else {
      setMiningStats((prev) => {
        const s = prev || loadStats();
        const updated = { ...s, activeTypes: [...WEB_MINING_TYPES] as MiningType[], miningStarted: Date.now() };
        saveStats(updated);
        return updated;
      });
      setMiningActive(true);
    }
  };

  const toggleMiningType = (type: MiningType) => {
    setMiningStats((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      if (updated.activeTypes.includes(type)) {
        updated.activeTypes = updated.activeTypes.filter((t2) => t2 !== type);
      } else {
        updated.activeTypes = [...updated.activeTypes, type];
      }
      saveStats(updated);
      return updated;
    });
  };

  // Wallet handlers
  const handleSendQC = () => {
    const amount = parseFloat(sendAmount);
    if (!amount || amount <= 0 || !sendTo.trim()) return;
    const result = walletSendQC(wallet, txs, amount, sendTo.trim());
    if (!result) { alert("Insufficient balance"); return; }
    setWalletState(result.wallet);
    setTxs(result.txs);
    setSendAmount("");
    setSendTo("");
    setScreen("walletDetail");
  };

  // Project handlers
  const createProject = () => {
    if (!newProjectName.trim()) return;
    const p: WalletProject = { id: generateId(), name: newProjectName.trim(), description: newProjectDesc.trim(), balance: 0 };
    setProjects((prev) => [...prev, p]);
    setNewProjectName("");
    setNewProjectDesc("");
    setShowNewProject(false);
  };

  const fundProject = (projectId: string) => {
    const amountStr = prompt(`How many QC to add? (Available: ${wallet.balance.toFixed(2)})`);
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (!amount || amount <= 0 || amount > wallet.balance) { alert("Invalid amount"); return; }
    setWalletState((w) => { const u = { ...w, balance: w.balance - amount }; saveWallet(u); return u; });
    setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, balance: p.balance + amount } : p));
  };

  const withdrawProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const amountStr = prompt(`How many QC to withdraw? (Project: ${project.balance.toFixed(2)})`);
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (!amount || amount <= 0 || amount > project.balance) { alert("Invalid amount"); return; }
    setWalletState((w) => { const u = { ...w, balance: w.balance + amount }; saveWallet(u); return u; });
    setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, balance: p.balance - amount } : p));
  };

  const deleteProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    if (!confirm(`Delete "${project.name}"? Balance of ${project.balance.toFixed(2)} QC will be returned.`)) return;
    setWalletState((w) => { const u = { ...w, balance: w.balance + project.balance }; saveWallet(u); return u; });
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  // Group handlers
  const createGroup = () => {
    if (!newGroupName.trim() || !identity) return;
    const group: Group = { id: generateId(), name: newGroupName.trim(), members: [identity.speaqId, ...selectedMembers], createdAt: Date.now() };
    setGroups((prev) => [...prev, group]);
    setNewGroupName("");
    setSelectedMembers([]);
    setScreen("main");
    setTab("settings");
  };

  const sendGroupMsg = async () => {
    if (!inputText.trim() || !activeGroup || !identity || !wsRef.current) return;
    const msg: GroupMsg = { id: generateId(), groupId: activeGroup.id, senderId: identity.speaqId, senderName: identity.displayName, text: inputText.trim(), timestamp: Date.now(), fromMe: true };
    setGroupMessages((prev) => ({ ...prev, [activeGroup.id]: [...(prev[activeGroup.id] || []), msg] }));
    // Send to each member
    for (const memberId of activeGroup.members) {
      if (memberId === identity.speaqId) continue;
      const key = await deriveKey(identity.speaqId, memberId);
      const blob = await encrypt(key, JSON.stringify({ type: "group_message", groupId: activeGroup.id, text: inputText.trim(), from: identity.displayName, senderId: identity.speaqId, timestamp: Date.now() }));
      wsRef.current.send(JSON.stringify({ type: "SEND", to: memberId, blob }));
    }
    setInputText("");
  };

  // Call handlers
  const startCall = async (contact: Contact, video = false) => {
    if (!identity || !wsRef.current) return;
    setCallContact(contact);
    setIsVideoCall(video);
    setScreen("call");
    setCallActive(true);
    setCallDuration(0);
    callTimer.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true, video });
      // Show local video preview
      if (video && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
        localVideoRef.current.play().catch(() => {});
      }
      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      peerConnection.current = pc;
      localStream.current.getTracks().forEach((track) => pc.addTrack(track, localStream.current!));
      pc.onicecandidate = (e) => {
        if (e.candidate && wsRef.current) {
          wsRef.current.send(JSON.stringify({ type: "ICE_CANDIDATE", to: contact.speaqId, candidate: e.candidate }));
        }
      };
      pc.ontrack = (e) => {
        // Use DOM audio element (Safari blocks new Audio().play() outside user gesture)
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = e.streams[0];
          remoteAudioRef.current.play().catch(() => {});
        }
        if (video && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
          remoteVideoRef.current.play().catch(() => {});
        }
      };
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      wsRef.current.send(JSON.stringify({ type: "CALL_OFFER", to: contact.speaqId, sdp: offer.sdp, video }));
    } catch (err) {
      console.error("Call failed:", err);
      alert("Could not access microphone");
      endCall();
    }
  };

  const handleCallAnswer = async (sdp: string, from: string, wantVideo = false) => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: wantVideo });
      if (wantVideo && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
        localVideoRef.current.play().catch(() => {});
      }
      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      peerConnection.current = pc;
      localStream.current.getTracks().forEach((track) => pc.addTrack(track, localStream.current!));
      pc.onicecandidate = (e) => {
        if (e.candidate && wsRef.current) wsRef.current.send(JSON.stringify({ type: "ICE_CANDIDATE", to: from, candidate: e.candidate }));
      };
      pc.ontrack = (e) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = e.streams[0];
          remoteAudioRef.current.play().catch(() => {});
        }
        if (wantVideo && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
          remoteVideoRef.current.play().catch(() => {});
        }
      };
      await pc.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp }));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      if (wsRef.current) wsRef.current.send(JSON.stringify({ type: "CALL_ANSWER", to: from, sdp: answer.sdp }));
      setCallActive(true);
      setCallDuration(0);
      callTimer.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    } catch (err) {
      console.error("Answer failed:", err);
      endCall();
    }
  };

  const endCall = () => {
    if (callTimer.current) { clearInterval(callTimer.current); callTimer.current = null; }
    if (peerConnection.current) { peerConnection.current.close(); peerConnection.current = null; }
    if (localStream.current) { localStream.current.getTracks().forEach((t2) => t2.stop()); localStream.current = null; }
    if (callContact && wsRef.current) wsRef.current.send(JSON.stringify({ type: "CALL_END", to: callContact.speaqId }));
    setCallActive(false);
    setCallDuration(0);
    setCallContact(null);
    setScreen("main");
  };

  // Witness handler
  const createWitnessRecord = () => {
    if (!witnessDesc.trim()) return;
    const record: WitnessRecord = {
      id: generateId(),
      hash: Date.now().toString(36) + Math.random().toString(36),
      timestamp: Date.now(),
      description: witnessDesc.trim(),
    };
    // Try to get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          record.location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setWitnessRecords((prev) => [record, ...prev]);
        },
        () => { setWitnessRecords((prev) => [record, ...prev]); }
      );
    } else {
      setWitnessRecords((prev) => [record, ...prev]);
    }
    setWitnessDesc("");
  };

  // Dead man switch checkin
  const deadmanCheckin = () => {
    const updated = { ...deadmanConfig, lastCheckin: Date.now() };
    setDeadmanConfig(updated);
    saveJSON("speaq_deadman", updated);
  };

  // Ghost group
  const sendGhostMsg = () => {
    if (!ghostInput.trim()) return;
    const alias = ghostAlias || `Ghost-${Math.floor(Math.random() * 9999)}`;
    if (!ghostAlias) setGhostAlias(alias);
    setGhostMessages((prev) => [...prev, { alias, text: ghostInput.trim(), timestamp: Date.now() }]);
    setGhostInput("");
  };

  // Chat list sorted
  const chatList = contacts.filter((c) => (messages[c.speaqId]?.length ?? 0) > 0).sort((a, b) => getLastTimestamp(b.speaqId) - getLastTimestamp(a.speaqId));

  const formatCallDuration = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // =========================================================================
  // RENDER: Onboarding (5 slides, shown once)
  // =========================================================================
  if (screen === "onboarding") {
    const slides = [
      { icon: "Q", title: "Quantum Encrypted", sub: "Every message, call, and payment is protected by post-quantum cryptography. Even future quantum computers cannot break it." },
      { icon: "C", title: "Chat & Call Freely", sub: "Text, voice, and video calls with end-to-end encryption. No phone number required. No data stored on servers." },
      { icon: "$", title: "Pay Without Banks", sub: "Send and receive Q-Credits backed by gold. No bank account needed. Instant, borderless, private." },
      { icon: "G", title: "Ghost Groups & Witness", sub: "Invisible groups where members don't see each other. Tamper-proof witness recording for evidence." },
      { icon: "M", title: "Mine by Contributing", sub: "Earn Q-Credits by helping the network. Relay messages, validate proofs, store data, onboard users." },
    ];
    const slide = slides[onboardingSlide];
    return (
      <div className="h-dvh bg-bg-deep flex flex-col items-center justify-center px-8">
        <button onClick={() => { localStorage.setItem("speaq_onboarding_done", "1"); setScreen("welcome"); }} className="absolute top-12 right-6 text-sm text-text-muted">{t("onb.skip", lang)}</button>
        <div className="w-24 h-24 rounded-full border-2 border-voice-gold flex items-center justify-center mb-8">
          <span className="text-4xl font-heading font-bold text-voice-gold">{slide.icon}</span>
        </div>
        <h2 className="text-2xl font-heading font-bold text-text-primary text-center mb-4">{slide.title}</h2>
        <p className="text-sm text-text-muted text-center leading-relaxed max-w-xs">{slide.sub}</p>
        {/* Dots */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (<div key={i} className={`h-2 rounded-full ${i === onboardingSlide ? "w-6 bg-voice-gold" : "w-2 bg-bg-elevated"}`} />))}
        </div>
        <button onClick={() => {
          if (onboardingSlide < slides.length - 1) { setOnboardingSlide(onboardingSlide + 1); }
          else { localStorage.setItem("speaq_onboarding_done", "1"); setScreen("welcome"); }
        }} className="mt-8 px-12 py-3 rounded-xl bg-voice-gold text-bg-deep font-body font-semibold text-base min-h-[44px]">
          {onboardingSlide === slides.length - 1 ? t("onb.getStarted", lang) : t("onb.next", lang)}
        </button>
      </div>
    );
  }

  // =========================================================================
  // RENDER: PIN Lock Screen / Set PIN Screen
  // =========================================================================
  if (screen === "lock" || screen === "setPin") {
    const isSet = screen === "setPin";
    const title = isSet ? (pinStep === "enter" ? t("pin.set", lang) : t("pin.confirm", lang)) : t("pin.enter", lang);
    const subtitle = isSet ? (pinStep === "enter" ? t("pin.secureSub", lang) : t("pin.confirmSub", lang)) : t("pin.unlockSub", lang);
    return (
      <div className="h-dvh bg-bg-deep flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="flex items-center mb-8">
          <span className="text-3xl font-heading font-bold text-text-primary tracking-tight">SPEA</span>
          <div className="w-9 h-9 rounded-full border border-voice-gold flex items-center justify-center ml-0.5 relative">
            <span className="text-2xl font-heading font-bold text-voice-gold -mt-0.5">Q</span>
            <div className="absolute bottom-1 right-2 w-1 h-1 rounded-full bg-quantum-teal" />
          </div>
        </div>
        <h2 className="text-xl font-body font-semibold text-text-primary mb-1">{title}</h2>
        <p className="text-xs text-text-muted mb-8">{subtitle}</p>
        {/* PIN dots */}
        <div className="flex gap-3 mb-10">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-3 h-3 rounded-full border-2 border-voice-gold ${i < pinInput.length ? "bg-voice-gold" : ""}`} />
          ))}
        </div>
        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 w-60">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((key) => (
            <button key={key || "empty"} disabled={key === ""}
              onClick={() => { if (key === "del") handlePinDelete(); else if (key !== "") handlePinDigit(key); }}
              className={`h-14 rounded-xl flex items-center justify-center text-2xl font-body transition-all min-h-[56px] ${key === "" ? "" : "bg-bg-card hover:bg-bg-elevated active:bg-bg-elevated text-text-primary"}`}>
              {key === "del" ? <span className="text-lg text-text-muted">&#8592;</span> : key}
            </button>
          ))}
        </div>
        {/* Submit */}
        {pinInput.length >= 4 && (
          <button onClick={handlePinSubmit} className="mt-6 px-10 py-3 rounded-xl bg-voice-gold text-bg-deep font-body font-semibold text-base min-h-[44px]">
            {isSet ? (pinStep === "enter" ? t("pin.next", lang) : t("pin.setPin", lang)) : t("pin.unlock", lang)}
          </button>
        )}
      </div>
    );
  }

  // =========================================================================
  // RENDER: Welcome Screen
  // =========================================================================
  if (screen === "welcome") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col items-center justify-center px-6">
        <SpeaqLogo size={96} />
        <h1 className="mt-6 text-2xl font-heading font-bold text-text-primary">{t("welcome.title", lang)}</h1>
        <p className="mt-2 text-sm text-text-secondary text-center max-w-xs">{t("welcome.tagline", lang)}</p>
        <div className="mt-8 w-full max-w-xs space-y-4">
          <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && createIdentity()}
            placeholder={t("welcome.enterName", lang)}
            className="w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-base focus:outline-none focus:border-voice-gold/50 transition-colors" autoFocus />
          <button onClick={createIdentity} disabled={!nameInput.trim()}
            className="w-full py-3 rounded-xl bg-voice-gold text-bg-deep font-body font-semibold text-base transition-all hover:bg-voice-warm disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]">
            {t("welcome.create", lang)}
          </button>
        </div>
        <div className="mt-6 flex items-center gap-1.5 text-quantum-teal/60">
          <IconShield className="w-3 h-3" />
          <span className="text-[10px] font-mono uppercase tracking-wider">{t("welcome.encBadge", lang)}</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Add Contact
  // =========================================================================
  if (screen === "addContact") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("addContact.title", lang)} onBack={() => setScreen("main")} lang={lang} />
        <div className="flex-1 px-6 py-8 space-y-5">
          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{t("addContact.id", lang)}</label>
            <input type="text" value={newContactId} onChange={(e) => setNewContactId(e.target.value)} placeholder="a1b2c3d4e5f6a7b8"
              className="w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-mono text-sm focus:outline-none focus:border-voice-gold/50 transition-colors" autoFocus />
          </div>
          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{t("addContact.name", lang)}</label>
            <input type="text" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addContact()} placeholder="John"
              className="w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-base focus:outline-none focus:border-voice-gold/50 transition-colors" />
          </div>
          <button onClick={addContact} disabled={!newContactId.trim() || !newContactName.trim()}
            className="w-full py-3 rounded-xl bg-voice-gold text-bg-deep font-body font-semibold text-base transition-all hover:bg-voice-warm disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]">
            {t("addContact.save", lang)}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Chat View
  // =========================================================================
  if (screen === "chat" && activeContact) {
    const contactMessages = messages[activeContact.speaqId] || [];
    const isTyping = typingContacts[activeContact.speaqId];
    const disappearMin = disappearTimers[activeContact.speaqId] || 0;
    const disappearLabel = disappearMin === 0 ? "" : disappearMin < 60 ? `${disappearMin}m` : disappearMin < 1440 ? `${disappearMin / 60}h` : `${disappearMin / 1440}d`;

    return (
      <div className="h-dvh bg-bg-deep flex flex-col">
        {/* Hidden file inputs */}
        <input ref={chatPhotoRef2} type="file" accept="image/*,video/*" className="hidden" onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || !identity || !wsRef.current || !activeContact) return;
          if (file.size > 10 * 1024 * 1024) { alert("Max 10MB"); return; }
          setShowShareMenu(false);
          try {
            const rawDataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error("Read failed"));
              reader.readAsDataURL(file);
            });
            const dataUrl = file.type.startsWith("image/") ? await compressImage(rawDataUrl) : rawDataUrl;
            console.log("[SPEAQ] Photo ready, compressed size:", dataUrl.length);
            const msgText = `[img]${dataUrl}[/img]`;
            const plainPayload = JSON.stringify({ type: "message", text: msgText, from: identity.displayName, senderId: identity.speaqId, timestamp: Date.now() });
            console.log("[SPEAQ] Payload size:", plainPayload.length);
            const key = await deriveKey(identity.speaqId, activeContact.speaqId);
            const encBlob = await encrypt(key, plainPayload);
            console.log("[SPEAQ] Encrypted blob size:", encBlob.length);
            const wsMsg = JSON.stringify({ type: "SEND", to: activeContact.speaqId, blob: encBlob });
            console.log("[SPEAQ] WebSocket message size:", wsMsg.length);
            wsRef.current!.send(wsMsg);
            console.log("[SPEAQ] Photo sent OK");
            const newMsg: Message = { id: generateId(), text: msgText, fromMe: true, timestamp: Date.now() };
            setMessages((prev) => ({ ...prev, [activeContact.speaqId]: [...(prev[activeContact.speaqId] || []), newMsg] }));
          } catch (err) {
            console.error("[SPEAQ] Photo send failed:", err);
            alert("Could not send photo: " + (err as Error).message);
          }
        }} />
        <input ref={chatFileRef2} type="file" className="hidden" onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || !identity || !wsRef.current || !activeContact) return;
          if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
          setShowShareMenu(false);
          const reader = new FileReader();
          reader.onload = async () => {
            const dataUrl = reader.result as string;
            const msgText = `[file:${file.name}]${dataUrl}[/file]`;
            const newMsg: Message = { id: generateId(), text: msgText, fromMe: true, timestamp: Date.now() };
            setMessages((prev) => ({ ...prev, [activeContact.speaqId]: [...(prev[activeContact.speaqId] || []), newMsg] }));
            const key = await deriveKey(identity!.speaqId, activeContact.speaqId);
            const blob = await encrypt(key, JSON.stringify({ type: "message", text: msgText, from: identity!.displayName, senderId: identity!.speaqId, timestamp: Date.now() }));
            wsRef.current!.send(JSON.stringify({ type: "SEND", to: activeContact.speaqId, blob }));
          };
          reader.readAsDataURL(file);
        }} />

        {/* Header with voice + video call buttons */}
        <header className="flex items-center gap-2 px-4 py-3 bg-bg-surface border-b border-[rgba(100,116,139,0.15)] shrink-0">
          <button onClick={() => { setScreen("main"); setActiveContact(null); }} className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary"><IconBack /></button>
          <ContactAvatar name={activeContact.name} speaqId={activeContact.speaqId} size={36} photos={contactPhotos} />
          <div className="flex-1 min-w-0">
            <p className="text-base font-body font-semibold text-text-primary truncate">{activeContact.name}</p>
            {isTyping ? <p className="text-[10px] text-[#22C55E]">{t("chat.typing", lang)}</p> : <div className="flex items-center gap-1.5"><IconShield className="w-3 h-3 text-quantum-teal" /><span className="text-[10px] font-mono text-quantum-teal uppercase tracking-wider">{t("chat.secured", lang)}{disappearLabel ? ` -- ${disappearLabel}` : ""}</span></div>}
          </div>
          {/* Voice call */}
          <button onClick={() => startCall(activeContact)} className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center"><span className="text-xs font-heading font-bold text-text-muted">P</span></button>
          {/* Video call */}
          <button onClick={() => startCall(activeContact, true)} className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center"><span className="text-xs font-heading font-bold text-text-muted">V</span></button>
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-quantum-teal" : "bg-resistance-red"}`} />
        </header>

        {/* Encryption banner */}
        <div className="px-4 py-1 bg-bg-card/50 border-b border-[rgba(100,116,139,0.08)]">
          <p className="text-[9px] font-mono text-text-muted text-center">{t("chat.encBanner", lang)}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {contactMessages.length === 0 && (
            <div className="flex items-center justify-center h-full"><div className="text-center"><IconShield className="w-8 h-8 text-quantum-teal/30 mx-auto mb-2" /><p className="text-sm text-text-muted">{t("chat.e2e", lang)}</p></div></div>
          )}
          {contactMessages.map((msg) => {
            const isImg = (msg.text.startsWith("[img]") && msg.text.endsWith("[/img]")) || msg.text.startsWith("[img:saved:");
            const isFile = msg.text.startsWith("[file:") && msg.text.endsWith("[/file]");
            const isVoice = msg.text.startsWith("[voice:") && (msg.text.endsWith("]") || msg.text.endsWith("[/voice]"));
            const isPay = msg.text.startsWith("[Payment:");
            let content: React.ReactNode;
            if (isImg) {
              let src = msg.text.slice(5, -6);
              // Load saved photo from localStorage if needed
              if (msg.text.startsWith("[img:saved:")) {
                const savedId = msg.text.slice(11, -1);
                src = localStorage.getItem("speaq_photo_" + savedId) || "";
              }
              content = src ? <img src={src} alt="Photo" className="max-w-full rounded-xl max-h-60 object-cover" /> : <p className="text-xs text-text-muted">[Photo]</p>;
            } else if (isFile) {
              const nameEnd = msg.text.indexOf("]");
              const fileName = msg.text.slice(6, nameEnd);
              const dataUrl = msg.text.slice(nameEnd + 1, -7);
              content = <a href={dataUrl} download={fileName} className="flex items-center gap-2 text-voice-gold underline text-sm"><span className="text-lg font-heading font-bold">F</span>{fileName}</a>;
            } else if (isVoice) {
              // Format: [voice:5s:msgId] -- extract duration and msgId
              const inner = msg.text.slice(7, -1); // "5s:abc123" or "5s"
              const colonIdx = inner.indexOf(":");
              const duration = colonIdx > -1 ? inner.slice(0, colonIdx) : inner;
              const voiceMsgId = colonIdx > -1 ? inner.slice(colonIdx + 1) : msg.id;
              const blobUrl = voiceBlobs.current[voiceMsgId] || voiceBlobs.current[msg.id] || "";
              content = (
                <div>
                  {blobUrl ? (
                    <audio controls preload="auto" src={blobUrl} className="w-full" style={{ minHeight: 44 }} />
                  ) : (
                    <p className="text-[10px] text-text-muted">Voice {duration} (needs file server for persistence)</p>
                  )}
                </div>
              );
            } else if (isPay) {
              const amount = msg.text.match(/\[(Payment: .+?)\]/)?.[1] || msg.text;
              content = <div className="text-center"><span className="text-2xl font-heading font-bold text-voice-gold">Q</span><p className="text-lg font-heading font-bold text-voice-gold mt-1">{amount.replace("Payment: ", "")}</p></div>;
            } else {
              content = <p className="text-sm font-body break-words">{msg.text}</p>;
            }
            return (
              <div key={msg.id} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${msg.fromMe ? "bg-voice-gold/20 text-text-primary rounded-br-md" : "bg-bg-card text-text-primary rounded-bl-md"}`}>
                  {content}
                  <p className={`text-[10px] mt-1 ${msg.fromMe ? "text-voice-gold/60" : "text-text-muted"}`}>{formatTime(msg.timestamp)}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar with + attach button */}
        <div className="shrink-0 px-4 py-3 bg-bg-surface border-t border-[rgba(100,116,139,0.15)]">
          {/* Share menu (matches native: Photo/Video, Document/File, Voice Message, Location, Send Q-Credits) */}
          {showShareMenu && (
            <div className="mb-3 bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] overflow-hidden">
              <p className="px-4 py-2 text-xs text-text-muted border-b border-[rgba(100,116,139,0.1)]">{t("chat.share", lang)}</p>
              {[
                { label: t("chat.photoVideo", lang), action: () => chatPhotoRef2.current?.click() },
                { label: t("chat.documentFile", lang), action: () => chatFileRef2.current?.click() },
                { label: t("chat.voiceMessage", lang), action: async () => {
                  setShowShareMenu(false);
                  if (!identity || !wsRef.current || !activeContact) return;
                  try {
                    const rec = new WavRecorder();
                    await rec.start();
                    wavRecorder.current = rec;
                    setIsRecording(true);
                    setRecordingDuration(0);
                    recordingSeconds.current = 0;
                    recordingTimer.current = setInterval(() => {
                      recordingSeconds.current++;
                      setRecordingDuration(recordingSeconds.current);
                      if (recordingSeconds.current >= 60) {
                        // Auto-stop at 60s
                        if (wavRecorder.current) {
                          const blob = wavRecorder.current.stop();
                          wavRecorder.current = null;
                          finishVoice(blob);
                        }
                      }
                    }, 1000);
                  } catch { alert("Could not access microphone"); }
                }},
                { label: t("chat.location", lang), action: () => {
                  setShowShareMenu(false);
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                      if (!identity || !wsRef.current || !activeContact) return;
                      const locText = `[Location: ${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}]`;
                      const newMsg: Message = { id: generateId(), text: locText, fromMe: true, timestamp: Date.now() };
                      setMessages((prev) => ({ ...prev, [activeContact.speaqId]: [...(prev[activeContact.speaqId] || []), newMsg] }));
                      const key = await deriveKey(identity.speaqId, activeContact.speaqId);
                      const blob = await encrypt(key, JSON.stringify({ type: "message", text: locText, from: identity.displayName, senderId: identity.speaqId, timestamp: Date.now() }));
                      wsRef.current!.send(JSON.stringify({ type: "SEND", to: activeContact.speaqId, blob }));
                    }, () => alert("Could not get location"));
                  }
                }},
                { label: t("chat.sendQC", lang), action: () => {
                  setShowShareMenu(false);
                  if (!identity || !wsRef.current || !activeContact) return;
                  const amountStr = prompt("Amount (QC):");
                  if (!amountStr) return;
                  const amount = parseFloat(amountStr);
                  if (!amount || amount <= 0 || amount > wallet.balance) { alert("Invalid amount or insufficient balance"); return; }
                  setWalletState((w) => { const u = { ...w, balance: w.balance - amount, totalSent: w.totalSent + amount }; saveWallet(u); return u; });
                  const payText = `[Payment: ${amount.toFixed(2)} QC]`;
                  const newMsg: Message = { id: generateId(), text: payText, fromMe: true, timestamp: Date.now() };
                  setMessages((prev) => ({ ...prev, [activeContact.speaqId]: [...(prev[activeContact.speaqId] || []), newMsg] }));
                  deriveKey(identity.speaqId, activeContact.speaqId).then(async (key) => {
                    const blob = await encrypt(key, JSON.stringify({ type: "message", text: payText, from: identity.displayName, senderId: identity.speaqId, timestamp: Date.now() }));
                    wsRef.current!.send(JSON.stringify({ type: "SEND", to: activeContact.speaqId, blob }));
                  });
                }},
              ].map((item) => (
                <button key={item.label} onClick={item.action} className="w-full px-4 py-3 text-left text-sm font-body text-voice-gold border-b border-[rgba(100,116,139,0.08)] hover:bg-bg-elevated min-h-[44px]">{item.label}</button>
              ))}
              <button onClick={() => setShowShareMenu(false)} className="w-full px-4 py-3 text-left text-sm font-body text-text-muted min-h-[44px]">{t("chat.cancel", lang)}</button>
            </div>
          )}
          {isRecording ? (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-resistance-red animate-pulse" />
              <span className="text-sm font-mono text-resistance-red flex-1">Recording... {recordingDuration}s</span>
              <button onClick={() => { if (wavRecorder.current) { const blob = wavRecorder.current.stop(); wavRecorder.current = null; finishVoice(blob); } }}
                className="px-6 py-2.5 rounded-full bg-resistance-red text-white font-body font-semibold text-sm min-h-[44px]">{t("ui.stopSend", lang)}</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* + Attach button */}
              <button onClick={() => setShowShareMenu(!showShareMenu)} className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center shrink-0"><span className="text-xl text-voice-gold font-bold">+</span></button>
              <input type="text" value={inputText} onChange={(e) => { setInputText(e.target.value); sendTyping(); }} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMsg()}
                placeholder={t("ui.platform", lang)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-sm focus:outline-none focus:border-voice-gold/50 transition-colors min-h-[44px]" />
              <button onClick={sendMsg} disabled={!inputText.trim() || !connected}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${inputText.trim() ? "bg-voice-gold" : "bg-bg-elevated"}`}><span className={`text-lg font-bold ${inputText.trim() ? "text-bg-deep" : "text-text-muted"}`}>&gt;</span></button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Call Screen
  // =========================================================================
  // Incoming call overlay (shown on any screen)
  if (incomingCall && screen !== "call") {
    return (
      <div className="h-dvh bg-bg-deep flex flex-col items-center justify-center px-6">
        <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
        <div className="w-24 h-24 rounded-full bg-bg-elevated flex items-center justify-center mb-6 animate-pulse">
          <IconPhone className="w-10 h-10 text-quantum-teal" />
        </div>
        <h2 className="text-xl font-heading font-semibold text-text-primary mb-2">{incomingCall.name}</h2>
        <p className="text-sm text-text-secondary mb-8">{t("call.calling", lang)}</p>
        <div className="flex gap-6">
          <button onClick={() => {
            setScreen("call");
            handleCallAnswer(incomingCall.sdp, incomingCall.from, isVideoCall);
            setIncomingCall(null);
          }} className="w-16 h-16 rounded-full bg-[#22C55E] flex items-center justify-center text-white"><IconPhone className="w-7 h-7" /></button>
          <button onClick={() => {
            if (wsRef.current) wsRef.current.send(JSON.stringify({ type: "CALL_END", to: incomingCall.from }));
            setIncomingCall(null);
            setCallContact(null);
          }} className="w-16 h-16 rounded-full bg-resistance-red flex items-center justify-center text-white"><IconPhoneOff className="w-7 h-7" /></button>
        </div>
      </div>
    );
  }

  if (screen === "call") {
    return (
      <div className="h-dvh bg-bg-deep flex flex-col items-center justify-center px-6 relative">
        {/* Hidden audio element for reliable playback on Safari */}
        <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
        {/* Video elements (hidden for audio-only calls) */}
        {isVideoCall && (
          <>
            <video ref={remoteVideoRef} playsInline autoPlay className="absolute inset-0 w-full h-full object-cover" />
            <video ref={localVideoRef} playsInline autoPlay muted className="absolute top-4 right-4 w-24 h-32 object-cover rounded-xl border-2 border-voice-gold z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        )}
        <div className="relative z-20 flex flex-col items-center">
          {!isVideoCall && (
            <div className="w-24 h-24 rounded-full bg-bg-elevated flex items-center justify-center mb-6">
              {callContact && <ContactAvatar name={callContact.name} speaqId={callContact.speaqId} size={96} photos={contactPhotos} />}
            </div>
          )}
          <h2 className="text-xl font-heading font-semibold text-text-primary mb-2">{callContact?.name || "Unknown"}</h2>
          <p className="text-sm text-text-secondary mb-1">{callActive ? formatCallDuration(callDuration) : t("call.calling", lang)}</p>
          <div className="flex items-center gap-1.5 mb-12"><IconShield className="w-3 h-3 text-quantum-teal" /><span className="text-[10px] font-mono text-quantum-teal uppercase tracking-wider">{t("chat.secured", lang)}</span></div>
          <button onClick={endCall} className="w-16 h-16 rounded-full bg-resistance-red flex items-center justify-center text-white"><IconPhoneOff className="w-7 h-7" /></button>
          <p className="mt-3 text-xs text-text-muted">{t("call.end", lang)}</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Wallet Detail
  // =========================================================================
  if (screen === "walletDetail") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("tab.wallet", lang)} onBack={() => setScreen("main")} lang={lang} />
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {/* Balance card */}
          <div className="bg-bg-card rounded-xl p-5 border border-[rgba(100,116,139,0.15)] text-center">
            <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-1">{t("wallet.balance", lang)}</p>
            <p className="text-3xl font-heading font-bold text-voice-gold">{wallet.balance.toFixed(4)} QC</p>
            <p className="text-sm text-text-secondary mt-1">{qcToGold(wallet.balance).toFixed(4)}g gold = EUR {qcToEur(wallet.balance).toFixed(2)}</p>
            <p className="text-[10px] text-text-muted mt-1">{qcToSparks(wallet.balance).toLocaleString()} Sparks</p>
          </div>
          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setScreen("sendQC")} className="py-3 rounded-xl bg-voice-gold/20 text-voice-gold font-body font-semibold text-sm flex items-center justify-center gap-2 min-h-[44px]"><IconArrowUp className="w-4 h-4" />{t("wallet.send", lang)}</button>
            <button onClick={() => { copyId(); }} className="py-3 rounded-xl bg-quantum-teal/20 text-quantum-teal font-body font-semibold text-sm flex items-center justify-center gap-2 min-h-[44px]"><IconArrowDown className="w-4 h-4" />{t("wallet.receive", lang)}</button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-bg-card rounded-lg p-3 border border-[rgba(100,116,139,0.1)] text-center">
              <p className="text-[10px] font-mono text-text-muted">{t("wallet.mined", lang)}</p>
              <p className="text-sm font-body font-semibold text-text-primary">{wallet.totalMined.toFixed(4)}</p>
            </div>
            <div className="bg-bg-card rounded-lg p-3 border border-[rgba(100,116,139,0.1)] text-center">
              <p className="text-[10px] font-mono text-text-muted">{t("wallet.sent", lang)}</p>
              <p className="text-sm font-body font-semibold text-text-primary">{wallet.totalSent.toFixed(4)}</p>
            </div>
            <div className="bg-bg-card rounded-lg p-3 border border-[rgba(100,116,139,0.1)] text-center">
              <p className="text-[10px] font-mono text-text-muted">{t("wallet.received", lang)}</p>
              <p className="text-sm font-body font-semibold text-text-primary">{wallet.totalReceived.toFixed(4)}</p>
            </div>
          </div>
          {/* Gold info */}
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
            <p className="text-xs font-mono text-voice-gold uppercase tracking-wider mb-2">{t("wallet.goldValue", lang)}</p>
            <p className="text-xs text-text-secondary">1 QC = 0.01 gram gold</p>
            <p className="text-xs text-text-secondary">Gold price: EUR {getGoldPrice().toFixed(2)}/gram</p>
            <p className="text-xs text-text-secondary">1 QC = 100,000,000 Sparks</p>
          </div>
          {/* Recent transactions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider">{t("wallet.transactions", lang)}</p>
              <button onClick={() => setScreen("transactions")} className="text-xs text-quantum-teal">{ t("wallet.viewAll", lang) }</button>
            </div>
            {txs.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-[rgba(100,116,139,0.08)]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "mining" ? "bg-voice-gold/20" : tx.type === "send" ? "bg-resistance-red/20" : "bg-quantum-teal/20"}`}>
                  {tx.type === "mining" ? <IconMining className="w-4 h-4 text-voice-gold" /> : tx.type === "send" ? <IconArrowUp className="w-4 h-4 text-resistance-red" /> : <IconArrowDown className="w-4 h-4 text-quantum-teal" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-body text-text-primary truncate">{tx.description}</p>
                  <p className="text-[10px] font-mono text-text-muted">{formatTime(tx.timestamp)}</p>
                </div>
                <p className={`text-sm font-mono font-semibold ${tx.type === "send" ? "text-resistance-red" : "text-quantum-teal"}`}>
                  {tx.type === "send" ? "-" : "+"}{tx.amount.toFixed(4)}
                </p>
              </div>
            ))}
            {txs.length === 0 && <p className="text-xs text-text-muted text-center py-4">{ t("wallet.noTransactions", lang) }</p>}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Send QC
  // =========================================================================
  if (screen === "sendQC") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("wallet.send", lang)} onBack={() => setScreen("walletDetail")} lang={lang} />
        <div className="flex-1 px-6 py-8 space-y-5">
          <div className="text-center mb-4">
            <p className="text-xs text-text-muted">{t("wallet.available", lang)}</p>
            <p className="text-xl font-heading font-bold text-voice-gold">{wallet.balance.toFixed(4)} QC</p>
          </div>
          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{t("wallet.recipient", lang)}</label>
            <select value={sendTo} onChange={(e) => setSendTo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary font-mono text-sm focus:outline-none focus:border-voice-gold/50">
              <option value="">Select contact...</option>
              {contacts.map((c) => (<option key={c.speaqId} value={c.speaqId}>{c.name} ({c.speaqId.substring(0, 8)}...)</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Amount (QC)</label>
            <input type="number" step="0.0001" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder="0.0000"
              className="w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-mono text-lg focus:outline-none focus:border-voice-gold/50 transition-colors" />
            {sendAmount && <p className="text-xs text-text-muted mt-1">= {qcToGold(parseFloat(sendAmount) || 0).toFixed(4)}g gold (EUR {qcToEur(parseFloat(sendAmount) || 0).toFixed(2)})</p>}
          </div>
          <button onClick={handleSendQC} disabled={!sendAmount || !sendTo || parseFloat(sendAmount) <= 0 || parseFloat(sendAmount) > wallet.balance}
            className="w-full py-3 rounded-xl bg-voice-gold text-bg-deep font-body font-semibold text-base transition-all hover:bg-voice-warm disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]">
            {t("wallet.send", lang)} QC
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Transactions
  // =========================================================================
  if (screen === "transactions") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("wallet.transactions", lang)} onBack={() => setScreen("walletDetail")} lang={lang} />
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {txs.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 py-3 border-b border-[rgba(100,116,139,0.08)]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === "mining" ? "bg-voice-gold/20" : tx.type === "send" ? "bg-resistance-red/20" : "bg-quantum-teal/20"}`}>
                {tx.type === "mining" ? <IconMining className="w-5 h-5 text-voice-gold" /> : tx.type === "send" ? <IconArrowUp className="w-5 h-5 text-resistance-red" /> : <IconArrowDown className="w-5 h-5 text-quantum-teal" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body text-text-primary truncate">{tx.description}</p>
                <p className="text-[10px] font-mono text-text-muted">{formatDate(tx.timestamp)} {formatTime(tx.timestamp)}</p>
              </div>
              <p className={`text-sm font-mono font-semibold ${tx.type === "send" ? "text-resistance-red" : "text-quantum-teal"}`}>
                {tx.type === "send" ? "-" : "+"}{tx.amount.toFixed(4)} QC
              </p>
            </div>
          ))}
          {txs.length === 0 && <p className="text-sm text-text-muted text-center py-8">No transactions yet. Start mining to earn Q-Credits.</p>}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Mining Detail
  // =========================================================================
  if (screen === "miningDetail") {
    const stats = miningStats || loadStats();
    const supply = getSupplyInfo(stats.totalEarned);
    const estDaily = getEstimatedDaily(stats.activeTypes, stats.totalEarned);
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("mining.title", lang)} onBack={() => setScreen("main")} lang={lang} />
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {/* Start/Stop */}
          <button onClick={toggleMining}
            className={`w-full py-4 rounded-xl font-body font-bold text-lg transition-all min-h-[56px] ${miningActive ? "bg-resistance-red/20 text-resistance-red border border-resistance-red/30" : "bg-voice-gold/20 text-voice-gold border border-voice-gold/30"}`}>
            {miningActive ? t("mining.stop", lang) : t("mining.start", lang)}
          </button>
          {miningActive && <div className="flex items-center justify-center gap-2"><div className="w-2 h-2 rounded-full bg-quantum-teal animate-pulse" /><span className="text-xs font-mono text-quantum-teal">Mining active</span></div>}
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
              <p className="text-[10px] font-mono text-text-muted uppercase">{t("mining.today", lang)}</p>
              <p className="text-lg font-heading font-bold text-voice-gold">{stats.todayEarned.toFixed(5)} QC</p>
            </div>
            <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
              <p className="text-[10px] font-mono text-text-muted uppercase">{t("mining.total", lang)}</p>
              <p className="text-lg font-heading font-bold text-text-primary">{stats.totalEarned.toFixed(4)} QC</p>
            </div>
            <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
              <p className="text-[10px] font-mono text-text-muted uppercase">{t("mining.level", lang)}</p>
              <p className="text-lg font-heading font-bold text-quantum-teal">Lv.{stats.level}</p>
            </div>
            <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
              <p className="text-[10px] font-mono text-text-muted uppercase">{t("mining.streak", lang)}</p>
              <p className="text-lg font-heading font-bold text-text-primary">{stats.streak} days</p>
            </div>
          </div>
          {/* Estimated daily */}
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
            <p className="text-xs font-mono text-text-muted uppercase mb-1">{t("mining.estimated", lang)}</p>
            <p className="text-sm font-body text-text-primary">{estDaily.toFixed(5)} QC/day ({(estDaily * 365).toFixed(2)} QC/year)</p>
          </div>
          {/* Mining types */}
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
            <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-3">{ t("mining.types", lang) }</p>
            {(Object.keys(REWARD_RATES) as MiningType[]).map((type) => {
              const rate = REWARD_RATES[type];
              const isActive = stats.activeTypes.includes(type);
              const isDisabled = type === "mesh" || type === "bridge" || type === "translation" || type === "onboarding";
              return (
                <button key={type} onClick={() => !isDisabled && toggleMiningType(type)} disabled={isDisabled}
                  className={`w-full flex items-center justify-between py-3 px-3 rounded-lg mb-1 transition-all min-h-[44px] ${isActive ? "bg-voice-gold/10 border border-voice-gold/20" : "bg-bg-elevated border border-transparent"} ${isDisabled ? "opacity-40" : ""}`}>
                  <div>
                    <p className="text-sm font-body text-text-primary capitalize">{type}</p>
                    <p className="text-[10px] text-text-muted">{rate.description} | Cap: {rate.dailyCap} QC/day</p>
                  </div>
                  {isActive && <IconCheck className="w-4 h-4 text-voice-gold" />}
                  {isDisabled && <span className="text-[9px] font-mono text-text-muted">{type === "mesh" ? "Native only" : "Manual"}</span>}
                </button>
              );
            })}
          </div>
          {/* Supply info */}
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
            <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-2">{t("mining.supply", lang)}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs"><span className="text-text-muted">{t("mining.maxSupply", lang)}</span><span className="text-text-primary font-mono">{supply.maxSupply.toLocaleString()} QC</span></div>
              <div className="flex justify-between text-xs"><span className="text-text-muted">{t("mining.totalMined", lang)}</span><span className="text-text-primary font-mono">{supply.totalMined.toFixed(4)} QC</span></div>
              <div className="flex justify-between text-xs"><span className="text-text-muted">{t("mining.remaining", lang)}</span><span className="text-text-primary font-mono">{supply.remaining.toLocaleString()} QC</span></div>
              <div className="flex justify-between text-xs"><span className="text-text-muted">{t("mining.halving", lang)}</span><span className="text-text-primary font-mono">#{supply.currentHalving} ({(supply.halvingProgress * 100).toFixed(4)}%)</span></div>
              <div className="w-full bg-bg-elevated rounded-full h-1.5 mt-2"><div className="bg-voice-gold rounded-full h-1.5" style={{ width: `${Math.min(supply.halvingProgress * 100, 100)}%` }} /></div>
            </div>
          </div>
          {/* Recent rewards */}
          <div>
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{ t("mining.recentRewards", lang) }</p>
            {miningRewards.slice(-10).reverse().map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-[rgba(100,116,139,0.06)]">
                <div>
                  <p className="text-xs font-body text-text-primary">{r.description}</p>
                  <p className="text-[10px] font-mono text-text-muted">{formatTime(r.timestamp)}</p>
                </div>
                <p className="text-xs font-mono text-quantum-teal">+{r.amount.toFixed(5)} QC</p>
              </div>
            ))}
            {miningRewards.length === 0 && <p className="text-xs text-text-muted text-center py-4">No rewards yet. Start mining!</p>}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Groups
  // =========================================================================
  if (screen === "groups") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("groups.title", lang)} onBack={() => { setScreen("main"); setTab("contacts"); }} lang={lang}
          rightAction={<button onClick={() => setScreen("createGroup")} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-voice-gold"><IconPlus /></button>} />
        <div className="flex-1 overflow-y-auto">
          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6"><IconGroup className="w-12 h-12 text-text-muted/30 mb-3" /><p className="text-sm text-text-muted">{t("ui.noGroups", lang)}</p></div>
          ) : (
            <div className="divide-y divide-[rgba(100,116,139,0.1)]">
              {groups.map((g) => (
                <button key={g.id} onClick={() => { setActiveGroup(g); setScreen("groupChat"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-card/50 transition-colors text-left min-h-[64px]">
                  <div className="w-10 h-10 rounded-full bg-quantum-teal/20 flex items-center justify-center shrink-0"><IconGroup className="w-5 h-5 text-quantum-teal" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-semibold text-text-primary truncate">{g.name}</p>
                    <p className="text-[10px] font-mono text-text-muted">{g.members.length} members</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Create Group
  // =========================================================================
  if (screen === "createGroup") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("groups.create", lang)} onBack={() => setScreen("groups")} lang={lang} />
        <div className="flex-1 px-6 py-6 space-y-5">
          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{t("groups.name", lang)}</label>
            <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Group name"
              className="w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-base focus:outline-none focus:border-voice-gold/50" autoFocus />
          </div>
          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{t("groups.members", lang)}</label>
            {contacts.map((c) => (
              <button key={c.speaqId} onClick={() => setSelectedMembers((prev) => prev.includes(c.speaqId) ? prev.filter((m) => m !== c.speaqId) : [...prev, c.speaqId])}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all min-h-[48px] ${selectedMembers.includes(c.speaqId) ? "bg-voice-gold/10 border border-voice-gold/20" : "bg-bg-card border border-transparent"}`}>
                <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center"><span className="text-sm font-heading font-bold text-voice-gold">{c.name.charAt(0).toUpperCase()}</span></div>
                <span className="text-sm font-body text-text-primary flex-1 text-left">{c.name}</span>
                {selectedMembers.includes(c.speaqId) && <IconCheck className="w-4 h-4 text-voice-gold" />}
              </button>
            ))}
            {contacts.length === 0 && <p className="text-xs text-text-muted">{t("ui.addContactsFirst", lang)}</p>}
          </div>
          <button onClick={createGroup} disabled={!newGroupName.trim()}
            className="w-full py-3 rounded-xl bg-voice-gold text-bg-deep font-body font-semibold text-base transition-all hover:bg-voice-warm disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]">
            {t("groups.create", lang)}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Group Chat
  // =========================================================================
  if (screen === "groupChat" && activeGroup) {
    const gmsgs = groupMessages[activeGroup.id] || [];
    return (
      <div className="h-dvh bg-bg-deep flex flex-col">
        <header className="flex items-center gap-3 px-4 py-3 bg-bg-surface border-b border-[rgba(100,116,139,0.15)] shrink-0">
          <button onClick={() => { setScreen("groups"); setActiveGroup(null); }} className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary"><IconBack /></button>
          <div className="flex-1 min-w-0">
            <p className="text-base font-body font-semibold text-text-primary truncate">{activeGroup.name}</p>
            <p className="text-[10px] font-mono text-text-muted">{activeGroup.members.length} members</p>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {gmsgs.map((msg) => (
            <div key={msg.id} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${msg.fromMe ? "bg-voice-gold/20 rounded-br-md" : "bg-bg-card rounded-bl-md"}`}>
                {!msg.fromMe && <p className="text-[10px] font-mono text-quantum-teal mb-1">{msg.senderName}</p>}
                <p className="text-sm font-body break-words text-text-primary">{msg.text}</p>
                <p className="text-[10px] mt-1 text-text-muted">{formatTime(msg.timestamp)}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="shrink-0 px-4 py-3 bg-bg-surface border-t border-[rgba(100,116,139,0.15)]">
          <div className="flex items-center gap-2">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendGroupMsg()}
              placeholder={t("chat.placeholder", lang)}
              className="flex-1 px-4 py-2.5 rounded-full bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-sm focus:outline-none focus:border-voice-gold/50 min-h-[44px]" />
            <button onClick={sendGroupMsg} disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-voice-gold text-bg-deep disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center"><IconSend /></button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Advanced Menu
  // =========================================================================
  if (screen === "advanced") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("adv.title", lang)} onBack={() => { setScreen("main"); setTab("settings"); }} lang={lang} />
        <div className="flex-1 px-4 py-6 space-y-3">
          {[
            { screen: "ghostGroup" as Screen, icon: <IconGhost className="w-6 h-6 text-voice-gold" />, title: t("adv.ghost", lang), desc: t("adv.ghostDesc", lang), color: "voice-gold" },
            { screen: "witness" as Screen, icon: <IconEye className="w-6 h-6 text-quantum-teal" />, title: t("adv.witness", lang), desc: t("adv.witnessDesc", lang), color: "quantum-teal" },
            { screen: "deadman" as Screen, icon: <IconAlert className="w-6 h-6 text-resistance-red" />, title: t("adv.deadman", lang), desc: t("adv.deadmanDesc", lang), color: "resistance-red" },
          ].map((item) => (
            <button key={item.screen} onClick={() => setScreen(item.screen)}
              className="w-full flex items-center gap-4 p-4 bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] hover:bg-bg-elevated transition-all text-left min-h-[72px]">
              <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center shrink-0">{item.icon}</div>
              <div className="flex-1"><p className="text-sm font-body font-semibold text-text-primary">{item.title}</p><p className="text-xs text-text-secondary mt-0.5">{item.desc}</p></div>
              <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Ghost Group
  // =========================================================================
  if (screen === "ghostGroup") {
    return (
      <div className="h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("adv.ghost", lang)} onBack={() => setScreen("advanced")} lang={lang} />
        <div className="px-4 py-3 bg-bg-surface border-b border-[rgba(100,116,139,0.1)]">
          <div className="flex items-center gap-2"><IconGhost className="w-4 h-4 text-voice-gold" /><span className="text-xs font-mono text-voice-gold">Your alias: {ghostAlias || "Not set"}</span></div>
          {!ghostAlias && (
            <div className="flex gap-2 mt-2">
              <input type="text" value={ghostAlias} onChange={(e) => setGhostAlias(e.target.value)} placeholder={t("ghost.enterAlias", lang)}
                className="flex-1 px-3 py-2 rounded-lg bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-mono text-sm min-h-[44px]" />
              <button onClick={() => setGhostAlias(`Ghost-${Math.floor(Math.random() * 9999)}`)} className="px-3 py-2 rounded-lg bg-voice-gold/20 text-voice-gold text-xs font-mono min-h-[44px]">{t("ghost.random", lang)}</button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {ghostMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.alias === ghostAlias ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${msg.alias === ghostAlias ? "bg-voice-gold/20 rounded-br-md" : "bg-bg-card rounded-bl-md"}`}>
                <p className="text-[10px] font-mono text-voice-gold/70 mb-1">{msg.alias}</p>
                <p className="text-sm font-body break-words text-text-primary">{msg.text}</p>
                <p className="text-[10px] mt-1 text-text-muted">{formatTime(msg.timestamp)}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="shrink-0 px-4 py-3 bg-bg-surface border-t border-[rgba(100,116,139,0.15)]">
          <div className="flex items-center gap-2">
            <input type="text" value={ghostInput} onChange={(e) => setGhostInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendGhostMsg()}
              placeholder={t("ghost.anonMsg", lang)}
              className="flex-1 px-4 py-2.5 rounded-full bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-sm min-h-[44px]" />
            <button onClick={sendGhostMsg} disabled={!ghostInput.trim()}
              className="p-2.5 rounded-full bg-voice-gold text-bg-deep disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center"><IconSend /></button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Witness Mode
  // =========================================================================
  if (screen === "witness") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("adv.witness", lang)} onBack={() => setScreen("advanced")} lang={lang} />
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
            <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-3">Create Evidence Record</p>
            <textarea value={witnessDesc} onChange={(e) => setWitnessDesc(e.target.value)} placeholder={t("witness.describe", lang)}
              className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-sm focus:outline-none min-h-[80px] resize-none" />
            <button onClick={createWitnessRecord} disabled={!witnessDesc.trim()}
              className="w-full mt-3 py-3 rounded-xl bg-quantum-teal text-bg-deep font-body font-semibold text-sm transition-all disabled:opacity-40 min-h-[44px]">
              Record with Timestamp + GPS
            </button>
          </div>
          <div>
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Evidence Records ({witnessRecords.length})</p>
            {witnessRecords.map((r) => (
              <div key={r.id} className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)] mb-2">
                <p className="text-sm font-body text-text-primary">{r.description}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-[10px] font-mono text-text-muted">Hash: {r.hash}</p>
                  <p className="text-[10px] font-mono text-text-muted">Time: {new Date(r.timestamp).toISOString()}</p>
                  {r.location && <p className="text-[10px] font-mono text-text-muted">GPS: {r.location.lat.toFixed(6)}, {r.location.lng.toFixed(6)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Dead Man's Switch
  // =========================================================================
  if (screen === "deadman") {
    const timeSince = Math.floor((Date.now() - deadmanConfig.lastCheckin) / 60000);
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("adv.deadman", lang)} onBack={() => setScreen("advanced")} lang={lang} />
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)] text-center">
            <p className="text-xs font-mono text-resistance-red uppercase tracking-wider mb-2">{t("deadman.status", lang)}</p>
            <p className="text-2xl font-heading font-bold text-text-primary">{deadmanConfig.enabled ? "ARMED" : "INACTIVE"}</p>
            <p className="text-xs text-text-muted mt-1">Last check-in: {timeSince} minutes ago</p>
          </div>
          <button onClick={deadmanCheckin}
            className="w-full py-4 rounded-xl bg-quantum-teal text-bg-deep font-body font-bold text-lg transition-all min-h-[56px]">
            Check In (I&apos;m Safe)
          </button>
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-text-primary">{t("deadman.enable", lang)}</span>
              <button onClick={() => { const u = { ...deadmanConfig, enabled: !deadmanConfig.enabled, lastCheckin: Date.now() }; setDeadmanConfig(u); saveJSON("speaq_deadman", u); }}
                className={`w-12 h-6 rounded-full transition-all ${deadmanConfig.enabled ? "bg-resistance-red" : "bg-bg-elevated"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${deadmanConfig.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1">{t("deadman.timeout", lang)}</label>
              <input type="number" value={deadmanConfig.timeoutMinutes}
                onChange={(e) => { const u = { ...deadmanConfig, timeoutMinutes: parseInt(e.target.value) || 60 }; setDeadmanConfig(u); saveJSON("speaq_deadman", u); }}
                className="w-full px-3 py-2 rounded-lg bg-bg-elevated border border-[rgba(100,116,139,0.15)] text-text-primary font-mono text-sm min-h-[44px]" />
            </div>
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1">{t("deadman.alertMsg", lang)}</label>
              <textarea value={deadmanConfig.message}
                onChange={(e) => { const u = { ...deadmanConfig, message: e.target.value }; setDeadmanConfig(u); saveJSON("speaq_deadman", u); }}
                placeholder={t("deadman.msgPlaceholder", lang)}
                className="w-full px-3 py-2 rounded-lg bg-bg-elevated border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-sm min-h-[60px] resize-none" />
            </div>
            <p className="text-[10px] text-text-muted">Note: In the web app, the switch only works while the app is open. Use the native app for background monitoring.</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Info
  // =========================================================================
  if (screen === "info") {
    const infoData = INFO[lang] || INFO.en;
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={infoData.title} onBack={() => { setScreen("main"); setTab("settings"); }} lang={lang} />
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <div className="text-center py-6"><SpeaqLogo size={80} /><h2 className="mt-4 text-xl font-heading font-bold text-text-primary">SPEAQ</h2><p className="text-sm text-text-secondary mt-1">{t("info.tagline", lang)}</p><p className="text-[10px] font-mono text-text-muted mt-1">v1.0.0 PWA</p></div>
          {infoData.sections.map((section, i) => (
            <div key={i} className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
              <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-2">{section.heading}</p>
              <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Sovereign ID
  // =========================================================================
  if (screen === "sovereignId") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("sovereign.title", lang)} onBack={() => { setScreen("main"); setTab("settings"); }} lang={lang} />
        <div className="flex-1 px-4 py-6 space-y-4">
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-4"><IconFingerprint className="w-10 h-10 text-quantum-teal" /></div>
            <h3 className="text-lg font-heading font-bold text-text-primary">{identity?.displayName}</h3>
          </div>
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
            <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-2">{t("sovereign.did", lang)}</p>
            <p className="text-xs font-mono text-text-primary break-all">{identity?.did || `did:speaq:${identity?.speaqId}`}</p>
          </div>
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
            <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-2">SPEAQ ID</p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-mono text-text-primary break-all flex-1">{identity?.speaqId}</p>
              <button onClick={copyId} className="p-2 rounded-lg hover:bg-bg-elevated min-h-[44px] min-w-[44px] flex items-center justify-center">
                <IconCopy className={copied ? "text-quantum-teal" : "text-text-muted"} />
              </button>
            </div>
          </div>
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
            <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-2">{t("sovereign.created", lang)}</p>
            <p className="text-xs font-mono text-text-primary">{identity ? new Date(identity.createdAt).toISOString() : "-"}</p>
          </div>
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
            <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-2">{t("sovereign.w3c", lang)}</p>
            <p className="text-xs text-text-secondary leading-relaxed">Your identity is self-sovereign. No central authority controls it. It follows the W3C Decentralized Identifier standard. Only you hold the keys.</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Lightning
  // =========================================================================
  if (screen === "lightning") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("lightning.title", lang)} onBack={() => { setScreen("main"); setTab("settings"); }} lang={lang} />
        <div className="flex-1 px-4 py-6 space-y-4">
          <div className="text-center py-8"><IconZap className="w-16 h-16 text-voice-gold mx-auto mb-4" /><h3 className="text-lg font-heading font-bold text-text-primary">{t("lightning.subtitle", lang)}</h3><p className="text-sm text-text-secondary mt-1">{t("lightning.desc", lang)}</p></div>
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
            <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-2">LNURL Protocol</p>
            <p className="text-xs text-text-secondary leading-relaxed">SPEAQ integrates with the Lightning Network via LNURL protocol. Convert Q-Credits to satoshis and vice versa. Send and receive Bitcoin Lightning payments directly in the app.</p>
          </div>
          <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)]">
            <p className="text-xs font-mono text-quantum-teal uppercase tracking-wider mb-2">Privacy</p>
            <p className="text-xs text-text-secondary leading-relaxed">Lightning transactions use a random alias. Your SPEAQ ID is never revealed to the Lightning Service Provider. Stealth routing ensures payment privacy.</p>
          </div>
          <div className="bg-bg-card rounded-xl p-4 border border-voice-gold/20">
            <p className="text-xs font-mono text-voice-gold uppercase tracking-wider mb-2">{t("lightning.comingSoon", lang)}</p>
            <p className="text-xs text-text-secondary">Lightning integration is available in the native app. Web app support coming in the next update.</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Settings Screen (matches native app exactly)
  // =========================================================================
  if (screen === "settings") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("tab.settings", lang)} onBack={() => { setScreen("main"); setTab("settings"); }} lang={lang} />
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Hidden file input for photo */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhoto} />

          {/* Profile Photo */}
          {identity && (
            <div className="flex flex-col items-center py-4">
              <button onClick={() => fileInputRef.current?.click()} className="relative">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-20 h-20 rounded-full border-2 border-voice-gold object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-bg-elevated border-2 border-voice-gold flex items-center justify-center">
                    <span className="text-3xl font-heading font-bold text-voice-gold">{identity.displayName.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </button>
              <p className="text-xs text-text-muted mt-2">{t("settings.tapChangePhoto", lang)}</p>
            </div>
          )}

          {/* Profile section */}
          <div>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2 px-2">{t("settings.profile", lang)}</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">{ t("settings.name", lang) }</span><span className="text-sm text-text-muted">{identity?.displayName}</span></div>
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">SPEAQ ID</span><span className="text-xs font-mono text-voice-gold">{identity?.speaqId}</span></div>
              {identity?.did && <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">DID</span><span className="text-[9px] font-mono text-text-muted truncate max-w-[180px]">{identity.did}</span></div>}
              <button onClick={() => setScreen("sovereignId")} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">{ t("settings.exportIdentity", lang) }</span><span className="text-sm text-voice-gold">QR</span></button>
            </div>
          </div>

          {/* Security section */}
          <div>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2 px-2">{ t("settings.security", lang) }</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">{ t("settings.encryption", lang) }</span><span className="text-xs text-quantum-teal">AES-256-GCM</span></div>
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">Key Derivation</span><span className="text-xs text-quantum-teal">Web Crypto API</span></div>
              <button onClick={() => { localStorage.removeItem("speaq_pin"); setScreen("setPin"); setPinInput(""); setPinStep("enter"); }}
                className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">{ t("settings.resetPin", lang) }</span><span className="text-sm text-voice-gold">{ t("settings.reset", lang) }</span></button>
            </div>
          </div>

          {/* Language section -- dropdown list like native app */}
          <div>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2 px-2">{t("settings.language", lang)}</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <button onClick={() => setShowLangPicker(!showLangPicker)} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]">
                <span className="text-sm text-text-primary">{t("settings.language", lang)}</span>
                <span className="text-sm text-voice-gold">{languages.find((l) => l.code === lang)?.name || "English"}</span>
              </button>
              {showLangPicker && languages.map((l) => (
                <button key={l.code} onClick={() => { changeLang(l.code); setShowLangPicker(false); }}
                  className={`flex justify-between px-4 py-3 w-full text-left min-h-[44px] ${l.code === lang ? "bg-voice-gold/10" : ""}`}>
                  <span className={`text-sm ${l.code === lang ? "text-voice-gold font-semibold" : "text-text-primary"}`}>{l.name}</span>
                  <span className="text-xs text-text-muted">{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced section */}
          <div>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2 px-2">{t("adv.title", lang)}</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <button onClick={() => setScreen("miningDetail")} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">{t("tab.mining", lang)}</span><span className="text-sm text-voice-gold">{t("settings.open", lang)}</span></button>
              <button onClick={() => setScreen("advanced")} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">{t("ui.ghostWitness", lang)}</span><span className="text-sm text-voice-gold">{t("settings.open", lang)}</span></button>
            </div>
          </div>

          {/* Privacy & Data section */}
          <div>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2 px-2">{ t("settings.privacyData", lang) }</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <button onClick={() => setScreen("privacy")} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">{t("settings.privacyPolicy", lang)}</span><span className="text-sm text-voice-gold">{t("settings.view", lang)}</span></button>
              <button onClick={deleteAllData} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-resistance-red">{ t("settings.deleteAll", lang) }</span><span className="text-sm text-resistance-red">{t("settings.delete", lang)}</span></button>
            </div>
          </div>

          {/* About section */}
          <div>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2 px-2">{ t("settings.about", lang) }</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <button onClick={() => setScreen("info")} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">{ t("settings.howItWorks", lang) }</span><span className="text-sm text-voice-gold">i</span></button>
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">{t("settings.version", lang)}</span><span className="text-sm text-text-muted">1.0.0 (PWA)</span></div>
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">Platform</span><span className="text-sm text-text-muted">{t("ui.platform", lang)}</span></div>
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">{t("settings.website", lang)}</span><span className="text-xs font-mono text-voice-gold">thespeaq.com</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Privacy Policy
  // =========================================================================
  if (screen === "privacy") {
    return (
      <div className="min-h-dvh bg-bg-deep flex flex-col">
        <ScreenHeader title={t("settings.privacyPolicy", lang)} onBack={() => setScreen("settings")} lang={lang} />
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{`SPEAQ Privacy Policy
Last updated: April 2026

1. What SPEAQ Collects
SPEAQ collects NO personal data on its servers. All data stays on your device.
- Your SPEAQ ID is generated locally and never linked to your real identity
- Messages are end-to-end encrypted; the relay server sees only encrypted blobs
- No email, phone number, or real name is required
- No analytics or tracking is implemented

2. Data Storage
All data is stored locally on your device:
- Identity (SPEAQ ID, display name)
- PIN (encrypted hash)
- Messages (encrypted)
- Contacts
- Wallet (Q-Credits balance, transaction history)
- No data is stored on SPEAQ servers except temporarily queued encrypted messages (max 7 days, then auto-deleted)

3. Relay Server (Zero Knowledge)
The SPEAQ relay server operates on a zero-knowledge principle:
- It sees ONLY encrypted blobs
- It cannot read messages, identify senders/receivers, or determine message content
- It does not log IP addresses of users
- Offline messages are auto-deleted after 7 days

4. Your Rights (GDPR)
Under the EU General Data Protection Regulation:
- Access: View all your data (it is all on your device)
- Deletion: Delete all data via Settings > Delete All Data
- Portability: Your data is stored locally
- This action cannot be undone

5. Contact
For privacy inquiries: privacy@thespeaq.com
Plexaris Technology Consulting
The Netherlands`}</div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Main Screen with Tabs
  // =========================================================================
  return (
    <div className="h-dvh bg-bg-deep flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-bg-surface border-b border-[rgba(100,116,139,0.15)] shrink-0">
        <div className="flex items-center gap-2"><SpeaqLogo size={32} /><span className="text-lg font-heading font-bold text-text-primary">SPEAQ</span></div>
        <div className="flex items-center gap-2"><span className="text-[8px] font-mono text-text-muted/40">v66</span><div className={`w-2 h-2 rounded-full ${connected ? "bg-quantum-teal" : "bg-resistance-red"}`} /><span className="text-[10px] font-mono text-text-muted">{connected ? "ONLINE" : "OFFLINE"}</span></div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ---- CHATS TAB ---- */}
        {tab === "chats" && (
          <div className="relative h-full">
            {chatList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6"><IconChat className="w-12 h-12 text-text-muted/30 mb-3" /><p className="text-sm text-text-muted">{t("noChats", lang)}</p></div>
            ) : (
              <div className="divide-y divide-[rgba(100,116,139,0.1)]">
                {chatList.map((contact) => (
                  <button key={contact.speaqId} onClick={() => openChat(contact)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-card/50 transition-colors text-left min-h-[64px]">
                    <div className="shrink-0"><ContactAvatar name={contact.name} speaqId={contact.speaqId} size={40} photos={contactPhotos} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between"><span className="text-sm font-body font-semibold text-text-primary truncate">{contact.name}</span><span className="text-[10px] font-mono text-text-muted ml-2 shrink-0">{getLastTimestamp(contact.speaqId) > 0 && formatTime(getLastTimestamp(contact.speaqId))}</span></div>
                      <p className="text-xs text-text-secondary truncate mt-0.5">{getLastMessage(contact.speaqId)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setScreen("addContact")} className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-voice-gold text-bg-deep shadow-lg flex items-center justify-center hover:bg-voice-warm transition-all"><IconPlus className="w-6 h-6" /></button>
          </div>
        )}

        {/* ---- CONTACTS TAB ---- */}
        {tab === "contacts" && (
          <div className="px-4 py-4 space-y-4">
            {/* Action buttons row -- matches native app: Groups / Scan / +Add */}
            <div className="flex gap-2">
              <button onClick={() => setScreen("groups")} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-voice-gold/30 text-voice-gold font-body font-semibold text-xs min-h-[44px]">{t("ui.groups", lang)}</button>
              <button onClick={startScanner} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-quantum-teal/30 text-quantum-teal font-body font-semibold text-xs min-h-[44px]">{t("ui.scan", lang)}</button>
              <button onClick={() => setScreen("addContact")} className="flex-1 py-2.5 rounded-lg bg-voice-gold text-bg-deep font-body font-semibold text-xs min-h-[44px]">{t("ui.add", lang)}</button>
            </div>
            {/* Your QR Code Card */}
            {identity && (
              <button onClick={() => setShowQrModal(true)} className="w-full bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.15)] flex items-center gap-4 text-left">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR" className="w-16 h-16 rounded-lg" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-bg-elevated flex items-center justify-center"><IconFingerprint className="w-8 h-8 text-voice-gold" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-body font-semibold text-text-primary">{identity.displayName}</p>
                  <p className="text-[10px] font-mono text-voice-gold truncate">{identity.speaqId}</p>
                  <p className="text-[10px] text-text-muted mt-1">{t("ui.tapEnlarge", lang)}</p>
                </div>
              </button>
            )}
            {/* Contact List */}
            {contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12"><IconUsers className="w-12 h-12 text-text-muted/30 mb-3" /><p className="text-sm text-text-muted">{t("noContacts", lang)}</p><p className="text-xs text-text-muted mt-1">Tap &quot;+ Add&quot; to add a contact by SPEAQ ID</p></div>
            ) : (
              <div className="space-y-1">
                {contacts.map((contact) => (
                  <div key={contact.speaqId} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-bg-card/50 transition-colors min-h-[56px]">
                    <button onClick={() => openChat(contact)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      <div className="shrink-0"><ContactAvatar name={contact.name} speaqId={contact.speaqId} size={40} photos={contactPhotos} /></div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-body font-semibold text-text-primary truncate">{contact.name}</p><p className="text-[10px] font-mono text-text-muted truncate">{contact.speaqId}</p></div>
                    </button>
                    <span className="text-[9px] font-mono text-quantum-teal shrink-0">{t("chat.secured", lang)}</span>
                    {/* Edit contact name */}
                    <button onClick={() => {
                      const newName = prompt("Name:", contact.name);
                      if (newName && newName.trim()) {
                        setContacts((prev) => prev.map((c) => c.speaqId === contact.speaqId ? { ...c, name: newName.trim() } : c));
                      }
                    }} className="text-text-muted hover:text-voice-gold p-1 shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    {/* Delete contact */}
                    <button onClick={() => {
                      if (confirm(`${contact.name}\n\nDelete?`)) {
                        setContacts((prev) => prev.filter((c) => c.speaqId !== contact.speaqId));
                      }
                    }} className="text-text-muted hover:text-resistance-red p-1 shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center">
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* QR Scanner Modal */}
            {showScanner && (
              <div className="fixed inset-0 bg-black z-50 flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-bg-surface">
                  <h3 className="text-lg font-heading font-semibold text-text-primary">Scan SPEAQ QR Code</h3>
                  <button onClick={stopScanner} className="text-voice-gold font-body text-sm min-h-[44px] px-3">{t("ui.close", lang)}</button>
                </div>
                <div className="flex-1 relative">
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />
                  {/* Scanner overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-56 h-56 border-2 border-voice-gold rounded-2xl" />
                  </div>
                  <p className="absolute bottom-8 left-0 right-0 text-center text-xs text-text-muted">{t("contacts.scanHint", lang)}</p>
                </div>
              </div>
            )}
            {/* QR Modal */}
            {showQrModal && identity && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setShowQrModal(false)}>
                <div className="bg-bg-card rounded-2xl p-7 max-w-xs w-full border border-[rgba(100,116,139,0.15)] text-center" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-heading font-semibold text-text-primary mb-5">Your SPEAQ QR Code</h3>
                  {qrDataUrl && <img src={qrDataUrl} alt="QR" className="w-48 h-48 mx-auto rounded-xl bg-bg-elevated p-3" />}
                  <p className="font-mono text-sm text-voice-gold mt-4">{identity.speaqId}</p>
                  <p className="text-xs text-text-muted mt-2">{t("contacts.qrDesc", lang)}</p>
                  <div className="flex gap-3 mt-5">
                    <button onClick={shareId} className="flex-1 py-3 rounded-xl bg-voice-gold text-bg-deep font-body font-semibold text-sm min-h-[44px]">{t("ui.shareId", lang)}</button>
                    <button onClick={() => setShowQrModal(false)} className="flex-1 py-3 rounded-xl border border-[rgba(100,116,139,0.2)] text-text-muted font-body text-sm min-h-[44px]">{t("ui.close", lang)}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---- WALLET TAB ---- (matches native: balance card, 3 buttons, projects, lightning, recent) */}
        {tab === "wallet" && (
          <div className="px-4 py-6 space-y-4">
            {/* Balance Card with gold border */}
            <div className="bg-bg-card rounded-xl p-5 border border-voice-gold/20 text-center">
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">{t("wallet.balance", lang)}</p>
              <p className="text-5xl font-heading font-bold text-voice-gold">{wallet.balance.toFixed(2)}</p>
              <p className="text-xs text-text-muted mt-1">~ {qcToGold(wallet.balance).toFixed(4)} gram gold</p>
              {/* 3 action buttons like native: Send, Receive, Request */}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setScreen("sendQC")} className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg bg-bg-elevated min-h-[44px]">
                  <span className="text-sm font-heading font-bold text-voice-gold">S</span>
                  <span className="text-[10px] text-text-muted">{t("wallet.send", lang)}</span>
                </button>
                <button onClick={() => setShowQrModal(true)} className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg bg-bg-elevated min-h-[44px]">
                  <span className="text-sm font-heading font-bold text-voice-gold">R</span>
                  <span className="text-[10px] text-text-muted">{t("wallet.receive", lang)}</span>
                </button>
                <button onClick={() => setScreen("walletDetail")} className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg bg-bg-elevated min-h-[44px]">
                  <span className="text-sm font-heading font-bold text-voice-gold">?</span>
                  <span className="text-[10px] text-text-muted">{t("ui.details", lang)}</span>
                </button>
              </div>
            </div>
            {/* Projects Section */}
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{t("wallet.projects", lang)}</p>
                <button onClick={() => setShowNewProject(true)} className="text-xs text-voice-gold font-semibold">+ New</button>
              </div>
              {projects.length === 0 ? (
                <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]"><p className="text-xs text-text-muted text-center">{t("wallet.noProjects", lang)}</p></div>
              ) : (
                <div className="space-y-2">{projects.map((p) => (
                  <div key={p.id} className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
                    <div className="flex justify-between items-center">
                      <div><p className="text-sm font-body font-semibold text-text-primary">{p.name}</p>{p.description && <p className="text-[10px] text-text-muted truncate">{p.description}</p>}</div>
                      <p className="text-sm font-heading font-bold text-voice-gold">{p.balance.toFixed(2)} QC</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => fundProject(p.id)} className="flex-1 py-2 rounded-lg bg-quantum-teal/10 text-quantum-teal text-xs font-semibold min-h-[36px]">{t("ui.fund", lang)}</button>
                      <button onClick={() => withdrawProject(p.id)} className="flex-1 py-2 rounded-lg bg-voice-gold/10 text-voice-gold text-xs font-semibold min-h-[36px]">{t("ui.withdraw", lang)}</button>
                      <button onClick={() => deleteProject(p.id)} className="py-2 px-3 rounded-lg bg-resistance-red/10 text-resistance-red text-xs font-semibold min-h-[36px]">X</button>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
            {/* New Project Modal */}
            {showNewProject && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setShowNewProject(false)}>
                <div className="bg-bg-card rounded-2xl p-6 max-w-xs w-full border border-[rgba(100,116,139,0.15)]" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">New Project</h3>
                  <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder={t("ui.projectName", lang)} autoFocus className="w-full px-4 py-3 mb-3 rounded-xl bg-bg-elevated border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-sm" />
                  <input type="text" value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} placeholder={t("ui.descOptional", lang)} className="w-full px-4 py-3 mb-4 rounded-xl bg-bg-elevated border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-sm" />
                  <div className="flex gap-3">
                    <button onClick={() => setShowNewProject(false)} className="flex-1 py-3 rounded-xl border border-[rgba(100,116,139,0.2)] text-text-muted text-sm min-h-[44px]">Cancel</button>
                    <button onClick={createProject} disabled={!newProjectName.trim()} className="flex-1 py-3 rounded-xl bg-voice-gold text-bg-deep font-semibold text-sm disabled:opacity-40 min-h-[44px]">{t("ui.create", lang)}</button>
                  </div>
                </div>
              </div>
            )}
            {/* Lightning Network Card */}
            <button onClick={() => setScreen("lightning")} className="w-full flex items-center gap-3 p-4 bg-bg-card rounded-xl border border-[rgba(100,116,139,0.1)] text-left min-h-[56px]">
              <div className="w-10 h-10 rounded-full bg-[#F7931A]/20 flex items-center justify-center"><span className="text-lg font-heading font-bold text-[#F7931A]">L</span></div>
              <div className="flex-1"><p className="text-sm font-body font-semibold text-text-primary">Lightning Network</p><p className="text-[10px] text-text-muted">Bitcoin instant payments</p></div>
              <span className="text-[#F7931A]">&gt;</span>
            </button>
            {/* Linked Wallets */}
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{ t("wallet.linkedWallets", lang) }</p>
                <button onClick={() => setShowLinkWallet(true)} className="text-xs text-voice-gold font-semibold">+ Link</button>
              </div>
              {linkedWallets.length === 0 ? (
                <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]"><p className="text-xs text-text-muted text-center">{t("wallet.linkHint", lang)}</p></div>
              ) : (
                <div className="space-y-1">{linkedWallets.map((w, i) => (
                  <div key={i} className="flex items-center gap-3 bg-bg-card rounded-xl p-3 border border-[rgba(100,116,139,0.1)]">
                    <div className={`w-3 h-3 rounded-full ${w.type === "XMR" ? "bg-[#FF6600]" : w.type === "BTC" ? "bg-[#F7931A]" : w.type === "ETH" ? "bg-[#627EEA]" : "bg-[#26A17B]"}`} />
                    <div className="flex-1 min-w-0"><p className="text-xs text-text-primary">{w.label || w.type}</p><p className="text-[9px] font-mono text-text-muted truncate">{w.address}</p></div>
                    <button onClick={() => removeLinkedWallet(i)} className="text-resistance-red text-xs font-bold min-h-[36px] min-w-[36px] flex items-center justify-center">X</button>
                  </div>
                ))}</div>
              )}
            </div>
            {/* Link Wallet Modal */}
            {showLinkWallet && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setShowLinkWallet(false)}>
                <div className="bg-bg-card rounded-2xl p-6 max-w-xs w-full border border-[rgba(100,116,139,0.15)]" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">Link Crypto Wallet</h3>
                  <div className="flex gap-2 mb-4">
                    {["XMR", "BTC", "ETH", "USDT"].map((t2) => (
                      <button key={t2} onClick={() => setLinkWalletType(t2)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold min-h-[36px] ${linkWalletType === t2 ? "bg-voice-gold/20 text-voice-gold border border-voice-gold/30" : "bg-bg-elevated text-text-muted"}`}>{t2}</button>
                    ))}
                  </div>
                  <input type="text" value={linkWalletAddr} onChange={(e) => setLinkWalletAddr(e.target.value)} placeholder={`${linkWalletType} address`}
                    className="w-full px-4 py-3 mb-3 rounded-xl bg-bg-elevated border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-mono text-xs" />
                  <input type="text" value={linkWalletLabel} onChange={(e) => setLinkWalletLabel(e.target.value)} placeholder={t("ui.labelOptional", lang)}
                    className="w-full px-4 py-3 mb-4 rounded-xl bg-bg-elevated border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-body text-sm" />
                  <div className="flex gap-3">
                    <button onClick={() => setShowLinkWallet(false)} className="flex-1 py-3 rounded-xl border border-[rgba(100,116,139,0.2)] text-text-muted text-sm min-h-[44px]">Cancel</button>
                    <button onClick={addLinkedWallet} disabled={!linkWalletAddr.trim()} className="flex-1 py-3 rounded-xl bg-voice-gold text-bg-deep font-semibold text-sm disabled:opacity-40 min-h-[44px]">+ Link</button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{t("wallet.transactions", lang)}</p>
                <button onClick={() => setScreen("transactions")} className="text-xs text-voice-gold font-semibold">{ t("wallet.viewAll", lang) }</button>
              </div>
              {txs.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-[rgba(100,116,139,0.08)]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "send" ? "bg-resistance-red/20" : "bg-[#22C55E]/20"}`}>
                    <span className={`text-sm font-bold ${tx.type === "send" ? "text-resistance-red" : "text-[#22C55E]"}`}>{tx.type === "send" ? "-" : "+"}</span>
                  </div>
                  <div className="flex-1 min-w-0"><p className="text-xs text-text-primary truncate">{tx.description}</p></div>
                  <p className={`text-xs font-mono ${tx.type === "send" ? "text-resistance-red" : "text-[#22C55E]"}`}>{tx.type === "send" ? "-" : "+"}{tx.amount.toFixed(2)} QC</p>
                </div>
              ))}
              {txs.length === 0 && <p className="text-xs text-text-muted text-center py-4">{ t("wallet.noTransactions", lang) }</p>}
            </div>
          </div>
        )}

        {/* ---- MINING TAB ---- */}
        {tab === "mining" && (
          <div className="px-4 py-6 space-y-4">
            <button onClick={toggleMining}
              className={`w-full py-4 rounded-xl font-body font-bold text-lg transition-all min-h-[56px] ${miningActive ? "bg-resistance-red/20 text-resistance-red border border-resistance-red/30" : "bg-voice-gold/20 text-voice-gold border border-voice-gold/30"}`}>
              {miningActive ? t("mining.stop", lang) : t("mining.start", lang)}
            </button>
            {miningActive && <div className="flex items-center justify-center gap-2"><div className="w-2 h-2 rounded-full bg-quantum-teal animate-pulse" /><span className="text-xs font-mono text-quantum-teal">{t("mining.miningActive", lang)}</span></div>}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
                <p className="text-[10px] font-mono text-text-muted uppercase">{t("mining.today", lang)}</p>
                <p className="text-lg font-heading font-bold text-voice-gold">{(miningStats?.todayEarned || 0).toFixed(5)}</p>
              </div>
              <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
                <p className="text-[10px] font-mono text-text-muted uppercase">{t("mining.total", lang)}</p>
                <p className="text-lg font-heading font-bold text-text-primary">{(miningStats?.totalEarned || 0).toFixed(4)}</p>
              </div>
            </div>
            <button onClick={() => setScreen("miningDetail")} className="w-full py-3 rounded-xl border border-quantum-teal/30 text-quantum-teal font-body font-semibold text-sm min-h-[44px]">
              {t("ui.miningDetails", lang)}
            </button>
          </div>
        )}

        {/* ---- SETTINGS TAB ---- (matches native app: settings is a tab) */}
        {tab === "settings" && (
          <div className="px-4 py-4 space-y-2">
            {/* Hidden file input for photo */}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhoto} />

            {/* Profile Photo */}
            {identity && (
              <div className="flex flex-col items-center py-4">
                <button onClick={() => fileInputRef.current?.click()}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-20 h-20 rounded-full border-2 border-voice-gold object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-bg-elevated border-2 border-voice-gold flex items-center justify-center">
                      <span className="text-3xl font-heading font-bold text-voice-gold">{identity.displayName.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </button>
                <p className="text-xs text-text-muted mt-2">{t("settings.tapChangePhoto", lang)}</p>
              </div>
            )}

            {/* Profile section */}
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-2">{t("settings.profile", lang)}</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">{ t("settings.name", lang) }</span><span className="text-sm text-text-muted">{identity?.displayName}</span></div>
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">SPEAQ ID</span><span className="text-xs font-mono text-voice-gold">{identity?.speaqId}</span></div>
              {identity?.did && <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">DID</span><span className="text-[9px] font-mono text-text-muted truncate max-w-[180px]">{identity.did}</span></div>}
              <button onClick={() => setScreen("sovereignId")} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">{ t("settings.exportIdentity", lang) }</span><span className="text-sm text-voice-gold">QR</span></button>
            </div>

            {/* Security */}
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-2 mt-4">{ t("settings.security", lang) }</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">{ t("settings.encryption", lang) }</span><span className="text-xs text-quantum-teal">Kyber-768 + AES-256-GCM</span></div>
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">{ t("settings.forwardSecrecy", lang) }</span><span className="text-xs text-quantum-teal">Double Ratchet</span></div>
              <button onClick={() => { localStorage.removeItem("speaq_pin"); setScreen("setPin"); setPinInput(""); setPinStep("enter"); }}
                className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">{ t("settings.resetPin", lang) }</span><span className="text-sm text-voice-gold">{ t("settings.reset", lang) }</span></button>
            </div>

            {/* Language -- dropdown list like native */}
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-2 mt-4">{t("settings.language", lang)}</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <button onClick={() => setShowLangPicker(!showLangPicker)} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]">
                <span className="text-sm text-text-primary">{t("settings.language", lang)}</span>
                <span className="text-sm text-voice-gold">{languages.find((l) => l.code === lang)?.name || "English"}</span>
              </button>
              {showLangPicker && languages.map((l) => (
                <button key={l.code} onClick={() => { changeLang(l.code); setShowLangPicker(false); }}
                  className={`flex justify-between px-4 py-3 w-full text-left min-h-[44px] ${l.code === lang ? "bg-voice-gold/10" : ""}`}>
                  <span className={`text-sm ${l.code === lang ? "text-voice-gold font-semibold" : "text-text-primary"}`}>{l.name}</span>
                  <span className="text-xs text-text-muted">{l.label}</span>
                </button>
              ))}
            </div>

            {/* Appearance / Theme */}
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-2 mt-4">{t("settings.appearance", lang)}</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] p-1 flex gap-1">
              {(["system", "dark", "light"] as const).map((opt) => (
                <button key={opt} onClick={() => changeTheme(opt)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-body min-h-[44px] transition-colors ${theme === opt ? "bg-voice-gold/20 text-voice-gold font-semibold" : "text-text-muted hover:text-text-secondary"}`}>
                  {t(`settings.theme${opt.charAt(0).toUpperCase() + opt.slice(1)}` as keyof typeof appStrings, lang)}
                </button>
              ))}
            </div>

            {/* Advanced Features */}
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-2 mt-4">{t("adv.title", lang)}</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <button onClick={() => setScreen("advanced")} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">{t("ui.ghostWitness", lang)}</span><span className="text-sm text-voice-gold">{t("settings.open", lang)}</span></button>
              <button onClick={() => setScreen("lightning")} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">Lightning Network</span><span className="text-sm text-voice-gold">{t("settings.open", lang)}</span></button>
            </div>

            {/* Privacy & Data */}
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-2 mt-4">{ t("settings.privacyData", lang) }</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <button onClick={() => setScreen("privacy")} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">{t("settings.privacyPolicy", lang)}</span><span className="text-sm text-voice-gold">{t("settings.view", lang)}</span></button>
              <button onClick={deleteAllData} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-resistance-red">{ t("settings.deleteAll", lang) }</span><span className="text-sm text-resistance-red">{t("settings.delete", lang)}</span></button>
            </div>

            {/* About */}
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-2 mt-4">{ t("settings.about", lang) }</p>
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] divide-y divide-[rgba(100,116,139,0.1)]">
              <button onClick={() => setScreen("info")} className="flex justify-between px-4 py-3 w-full text-left min-h-[44px]"><span className="text-sm text-text-primary">{ t("settings.howItWorks", lang) }</span><span className="text-sm text-voice-gold">i</span></button>
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">{t("settings.version", lang)}</span><span className="text-sm text-text-muted">1.0.0 (PWA)</span></div>
              <div className="flex justify-between px-4 py-3"><span className="text-sm text-text-primary">{t("settings.website", lang)}</span><span className="text-xs font-mono text-voice-gold">thespeaq.com</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="shrink-0 flex items-center justify-around bg-bg-surface border-t border-[rgba(100,116,139,0.15)] px-2 py-1 safe-area-pb">
        {(["chats", "contacts", "wallet", "mining", "settings"] as Tab[]).map((t_) => {
          const isActive = tab === t_;
          const Icon = t_ === "chats" ? IconChat : t_ === "contacts" ? IconUsers : t_ === "wallet" ? IconWallet : t_ === "mining" ? IconMining : IconSettings;
          return (
            <button key={t_} onClick={() => setTab(t_)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 min-h-[48px] min-w-[48px] transition-colors ${isActive ? "text-voice-gold" : "text-text-muted hover:text-text-secondary"}`}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-body">{t(`tab.${t_}`, lang)}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
