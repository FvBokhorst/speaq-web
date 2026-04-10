export type Lang = "en" | "nl" | "fr" | "es" | "ru" | "de" | "sl" | "lg" | "sw";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export interface FaqLabels {
  pageTitle: string;
  subtitle: string;
  backButton: string;
}

export const faqLabels: Record<Lang, FaqLabels> = {
  en: {
    pageTitle: "Frequently Asked Questions",
    subtitle: "Everything you need to know about SPEAQ",
    backButton: "Back to SPEAQ",
  },
  nl: {
    pageTitle: "Veelgestelde vragen",
    subtitle: "Alles wat je moet weten over SPEAQ",
    backButton: "Terug naar SPEAQ",
  },
  fr: {
    pageTitle: "Questions frequemment posees",
    subtitle: "Tout ce que vous devez savoir sur SPEAQ",
    backButton: "Retour a SPEAQ",
  },
  es: {
    pageTitle: "Preguntas frecuentes",
    subtitle: "Todo lo que necesitas saber sobre SPEAQ",
    backButton: "Volver a SPEAQ",
  },
  ru: {
    pageTitle: "Chasto zadavaemye voprosy",
    subtitle: "Vse, chto vam nuzhno znat o SPEAQ",
    backButton: "Nazad k SPEAQ",
  },
  de: {
    pageTitle: "Haufig gestellte Fragen",
    subtitle: "Alles, was Sie uber SPEAQ wissen mussen",
    backButton: "Zuruck zu SPEAQ",
  },
  sl: {
    pageTitle: "Pogosto zastavljena vprasanja",
    subtitle: "Vse, kar morate vedeti o SPEAQ",
    backButton: "Nazaj na SPEAQ",
  },
  lg: {
    pageTitle: "Ebibuuzo ebibuuzibwa ennyo",
    subtitle: "Byonna by'weetaaga okumanya ku SPEAQ",
    backButton: "Dda ku SPEAQ",
  },
  sw: {
    pageTitle: "Maswali yanayoulizwa mara kwa mara",
    subtitle: "Kila kitu unachohitaji kujua kuhusu SPEAQ",
    backButton: "Rudi kwa SPEAQ",
  },
};

const categoryTitles: Record<Lang, [string, string, string, string, string, string, string]> = {
  en: ["Platform", "Security & Privacy", "Wallet & Q-Credits", "Mining", "Blockchain", "Features", "Technical"],
  nl: ["Platform", "Beveiliging & Privacy", "Wallet & Q-Credits", "Mining", "Blockchain", "Functies", "Technisch"],
  fr: ["Plateforme", "Securite et confidentialite", "Portefeuille et Q-Credits", "Minage", "Blockchain", "Fonctionnalites", "Technique"],
  es: ["Plataforma", "Seguridad y privacidad", "Billetera y Q-Credits", "Mineria", "Blockchain", "Funciones", "Tecnico"],
  ru: ["Platforma", "Bezopasnost i konfidentsialnost", "Koshelek i Q-Credits", "Mayning", "Blokcheyn", "Funktsii", "Tekhnicheskoe"],
  de: ["Plattform", "Sicherheit & Datenschutz", "Wallet & Q-Credits", "Mining", "Blockchain", "Funktionen", "Technisch"],
  sl: ["Platforma", "Varnost in zasebnost", "Denarnica in Q-Credits", "Rudarjenje", "Veriga blokov", "Funkcije", "Tehnicno"],
  lg: ["Pulatifomu", "Obukuumi n'ebyama", "Wallet ne Q-Credits", "Okusimba", "Blockchain", "Ebikola", "Tekiniki"],
  sw: ["Jukwaa", "Usalama na faragha", "Pochi na Q-Credits", "Uchimbaji", "Blockchain", "Vipengele", "Kiufundi"],
};

// ─── PLATFORM ───────────────────────────────────────────────────────────────────

const platform: Record<Lang, FaqItem[]> = {
  en: [
    {
      question: "What is SPEAQ?",
      answer: "SPEAQ is the most secure communication and freedom platform in the world. It combines quantum-resistant encryption, censorship resistance, private payments, decentralized mining, and sovereign identity in one app. Chat, call, pay, browse, store, mine - all protected by military-grade encryption that even quantum computers cannot break.",
    },
    {
      question: "Why was SPEAQ created?",
      answer: "SPEAQ was created because the world needs a communication platform that truly belongs to its users. Existing platforms collect your data, scan your messages, comply with government surveillance requests, and can freeze your accounts at will. SPEAQ was built from the ground up with zero-knowledge architecture - we cannot read your messages, even if we wanted to. Your freedom is not a feature. It is the foundation.",
    },
    {
      question: "How is SPEAQ different from WhatsApp, Signal, or Telegram?",
      answer: "WhatsApp is owned by Meta and collects extensive metadata. Telegram does not encrypt group chats by default. Signal is good but still requires a phone number and has no built-in payments or mining. SPEAQ requires no phone number, no email, no real name. It adds a sovereign wallet with gold-backed Q-Credits, Proof of Contribution mining, a Quantum Vault with plausible deniability, Ghost Groups, Witness Mode, Dead Man's Switch, and mesh networking. SPEAQ is not just a messenger - it is a freedom platform.",
    },
    {
      question: "Do I need to register with my phone number or email?",
      answer: "No. SPEAQ generates a cryptographically random SPEAQ ID on your device. It is not linked to your phone number, email, or real name. No one can trace your SPEAQ ID back to you unless you choose to share it. This is true anonymous communication.",
    },
    {
      question: "Is SPEAQ free?",
      answer: "Yes. SPEAQ is free to download and use. All core features - messaging, voice and video calls, file sharing, Quantum Vault, Ghost Groups, Witness Mode, and Dead Man's Switch - are free. You can also earn Q-Credits through Proof of Contribution mining at no cost.",
    },
  ],
  nl: [
    {
      question: "Wat is SPEAQ?",
      answer: "SPEAQ is het meest beveiligde communicatie- en vrijheidsplatform ter wereld. Het combineert kwantumbestendige encryptie, censuurbestendigheid, anonieme betalingen, gedecentraliseerd minen en soevereine identiteit in een app. Chatten, bellen, betalen, browsen, opslaan, minen - alles beschermd door militaire encryptie die zelfs kwantumcomputers niet kunnen kraken.",
    },
    {
      question: "Waarom is SPEAQ gemaakt?",
      answer: "SPEAQ is gemaakt omdat de wereld een communicatieplatform nodig heeft dat echt van de gebruikers is. Bestaande platforms verzamelen je data, scannen je berichten, werken mee aan overheidstoezicht en kunnen je account op elk moment bevriezen. SPEAQ is vanaf de grond opgebouwd met zero-knowledge architectuur - wij kunnen je berichten niet lezen, zelfs niet als we dat zouden willen. Je vrijheid is geen functie. Het is het fundament.",
    },
    {
      question: "Hoe verschilt SPEAQ van WhatsApp, Signal of Telegram?",
      answer: "WhatsApp is eigendom van Meta en verzamelt uitgebreide metadata. Telegram versleutelt groepschats niet standaard. Signal is goed maar vereist nog steeds een telefoonnummer en heeft geen ingebouwde betalingen of mining. SPEAQ vereist geen telefoonnummer, geen e-mail, geen echte naam. Het voegt een soevereine wallet toe met door goud gedekte Q-Credits, Proof of Contribution mining, een Quantum Vault met plausibele ontkenning, Ghost Groups, Witness Mode, Dead Man's Switch en mesh-netwerken. SPEAQ is niet zomaar een messenger - het is een vrijheidsplatform.",
    },
    {
      question: "Moet ik me registreren met mijn telefoonnummer of e-mail?",
      answer: "Nee. SPEAQ genereert een cryptografisch willekeurig SPEAQ ID op je apparaat. Het is niet gekoppeld aan je telefoonnummer, e-mail of echte naam. Niemand kan je SPEAQ ID naar jou herleiden, tenzij je ervoor kiest het te delen. Dit is echte anonieme communicatie.",
    },
    {
      question: "Is SPEAQ gratis?",
      answer: "Ja. SPEAQ is gratis te downloaden en te gebruiken. Alle kernfuncties - berichten, spraak- en videogesprekken, bestandsdeling, Quantum Vault, Ghost Groups, Witness Mode en Dead Man's Switch - zijn gratis. Je kunt ook Q-Credits verdienen via Proof of Contribution mining zonder kosten.",
    },
  ],
  fr: [
    {
      question: "Qu'est-ce que SPEAQ ?",
      answer: "SPEAQ est la plateforme de communication et de liberte la plus securisee au monde. Elle combine un chiffrement resistant aux ordinateurs quantiques, une resistance a la censure, des paiements prives, un minage decentralise et une identite souveraine dans une seule application. Discuter, appeler, payer, naviguer, stocker, miner - le tout protege par un chiffrement de niveau militaire que meme les ordinateurs quantiques ne peuvent pas briser.",
    },
    {
      question: "Pourquoi SPEAQ a-t-il ete cree ?",
      answer: "SPEAQ a ete cree parce que le monde a besoin d'une plateforme de communication qui appartient reellement a ses utilisateurs. Les plateformes existantes collectent vos donnees, scannent vos messages, se conforment aux demandes de surveillance gouvernementale et peuvent geler vos comptes a volonte. SPEAQ a ete construit de zero avec une architecture zero-knowledge - nous ne pouvons pas lire vos messages, meme si nous le voulions. Votre liberte n'est pas une fonctionnalite. C'est le fondement.",
    },
    {
      question: "En quoi SPEAQ est-il different de WhatsApp, Signal ou Telegram ?",
      answer: "WhatsApp appartient a Meta et collecte des metadonnees etendues. Telegram ne chiffre pas les discussions de groupe par defaut. Signal est bon mais necessite toujours un numero de telephone et n'a pas de paiements ni de minage integres. SPEAQ ne necessite ni numero de telephone, ni e-mail, ni vrai nom. Il ajoute un portefeuille souverain avec des Q-Credits adosses a l'or, le minage Proof of Contribution, un Quantum Vault avec deniabilite plausible, des Ghost Groups, le mode Temoin, le Dead Man's Switch et un reseau maille. SPEAQ n'est pas qu'une messagerie - c'est une plateforme de liberte.",
    },
    {
      question: "Dois-je m'inscrire avec mon numero de telephone ou mon e-mail ?",
      answer: "Non. SPEAQ genere un identifiant SPEAQ cryptographiquement aleatoire sur votre appareil. Il n'est lie ni a votre numero de telephone, ni a votre e-mail, ni a votre vrai nom. Personne ne peut remonter jusqu'a vous a partir de votre identifiant SPEAQ, sauf si vous choisissez de le partager. C'est une communication veritablement anonyme.",
    },
    {
      question: "SPEAQ est-il gratuit ?",
      answer: "Oui. SPEAQ est gratuit a telecharger et a utiliser. Toutes les fonctionnalites principales - messagerie, appels vocaux et video, partage de fichiers, Quantum Vault, Ghost Groups, mode Temoin et Dead Man's Switch - sont gratuites. Vous pouvez egalement gagner des Q-Credits grace au minage Proof of Contribution sans aucun cout.",
    },
  ],
  es: [
    {
      question: "Que es SPEAQ?",
      answer: "SPEAQ es la plataforma de comunicacion y libertad mas segura del mundo. Combina cifrado resistente a computadoras cuanticas, resistencia a la censura, pagos privados, mineria descentralizada e identidad soberana en una sola aplicacion. Chatear, llamar, pagar, navegar, almacenar, minar - todo protegido por cifrado de grado militar que ni siquiera las computadoras cuanticas pueden romper.",
    },
    {
      question: "Por que se creo SPEAQ?",
      answer: "SPEAQ fue creado porque el mundo necesita una plataforma de comunicacion que realmente pertenezca a sus usuarios. Las plataformas existentes recopilan tus datos, escanean tus mensajes, cumplen con solicitudes de vigilancia gubernamental y pueden congelar tus cuentas a voluntad. SPEAQ fue construido desde cero con arquitectura de conocimiento cero - no podemos leer tus mensajes, incluso si quisieramos. Tu libertad no es una funcion. Es el fundamento.",
    },
    {
      question: "En que se diferencia SPEAQ de WhatsApp, Signal o Telegram?",
      answer: "WhatsApp es propiedad de Meta y recopila metadatos extensos. Telegram no cifra los chats grupales por defecto. Signal es bueno pero todavia requiere un numero de telefono y no tiene pagos ni mineria integrados. SPEAQ no requiere numero de telefono, ni correo electronico, ni nombre real. Agrega una billetera soberana con Q-Credits respaldados por oro, mineria Proof of Contribution, un Quantum Vault con negacion plausible, Ghost Groups, modo Testigo, Dead Man's Switch y red mesh. SPEAQ no es solo un mensajero - es una plataforma de libertad.",
    },
    {
      question: "Necesito registrarme con mi numero de telefono o correo electronico?",
      answer: "No. SPEAQ genera un ID SPEAQ criptograficamente aleatorio en tu dispositivo. No esta vinculado a tu numero de telefono, correo electronico o nombre real. Nadie puede rastrear tu ID SPEAQ hasta ti, a menos que decidas compartirlo. Esta es una comunicacion verdaderamente anonima.",
    },
    {
      question: "Es SPEAQ gratuito?",
      answer: "Si. SPEAQ es gratuito para descargar y usar. Todas las funciones principales - mensajeria, llamadas de voz y video, uso compartido de archivos, Quantum Vault, Ghost Groups, modo Testigo y Dead Man's Switch - son gratuitas. Tambien puedes ganar Q-Credits a traves de la mineria Proof of Contribution sin costo alguno.",
    },
  ],
  ru: [
    {
      question: "Chto takoe SPEAQ?",
      answer: "SPEAQ - eto samaya bezopasnaya kommunikatsionnaya platforma svobody v mire. Ona ob'edinyaet kvantovoustomchivoe shifrovanie, ustoychivost k tsenzure, privatnye platezhi, detsentralizovannyy mayning i suverennuyu identichnost v odnom prilozhenii. Obshaytes, zvonite, platite, prosmatrivayte, khrante, maynite - vse zashchishcheno shifrovaniem voennogo urovnya, kotoroe dazhe kvantovye kompyutery ne mogut vzlomat.",
    },
    {
      question: "Zachem byl sozdan SPEAQ?",
      answer: "SPEAQ byl sozdan potomu, chto miru nuzhna kommunikatsionnaya platforma, kotoraya deystvitelno prinadlezhit polzovatelyam. Sushchestvuyushchie platformy sobirayut vashi dannye, skaniruyut vashi soobshcheniya, vypolnyayut zaprosy pravitelstvennogo nablyudeniya i mogut zamorozit vashi akkaunty po svoemu zhelaniyu. SPEAQ byl postroen s nulya s arkhitekturoy nulevogo znaniya - my ne mozhem chitat vashi soobshcheniya, dazhe yesli by khoteli. Vasha svoboda - eto ne funktsiya. Eto fundament.",
    },
    {
      question: "Chem SPEAQ otlichaetsya ot WhatsApp, Signal ili Telegram?",
      answer: "WhatsApp prinadlezhit Meta i sobiraet obshirnye metadannye. Telegram ne shifruet gruppovye chaty po umolchaniyu. Signal khorosh, no vse eshche trebuet nomer telefona i ne imeet vstroyennykh platezhey ili mayninga. SPEAQ ne trebuet nomera telefona, elektronnoy pochty ili nastoyashchego imeni. On dobavlyaet suverennyy koshelek s Q-Credits, obespechennymi zolotom, mayning Proof of Contribution, Quantum Vault s pravdopodobnym otpiratelstvom, Ghost Groups, rezhim Svidetelya, Dead Man's Switch i mesh-set. SPEAQ - eto ne prosto messendzher - eto platforma svobody.",
    },
    {
      question: "Nuzhno li registrirovatsya s nomerom telefona ili elektronnoy pochtoy?",
      answer: "Net. SPEAQ generiruet kriptograficheski sluchaynyy SPEAQ ID na vashem ustroystve. On ne privyazan k vashemu nomeru telefona, elektronnoy pochte ili nastoyashchemu imeni. Nikto ne mozhet otsledit vash SPEAQ ID do vas, yesli vy ne reshite im podelitsya. Eto nastoyashchaya anonimnaya svyaz.",
    },
    {
      question: "SPEAQ besplaten?",
      answer: "Da. SPEAQ besplaten dlya skachivaniya i ispolzovaniya. Vse osnovnye funktsii - soobshcheniya, golosovye i videozvonki, obmen faylami, Quantum Vault, Ghost Groups, rezhim Svidetelya i Dead Man's Switch - besplatny. Vy takzhe mozhete zarabatyvat Q-Credits cherez mayning Proof of Contribution bez kakikh-libo zatrat.",
    },
  ],
  de: [
    {
      question: "Was ist SPEAQ?",
      answer: "SPEAQ ist die sicherste Kommunikations- und Freiheitsplattform der Welt. Sie kombiniert quantenresistente Verschlusselung, Zensurresistenz, private Zahlungen, dezentrales Mining und souverane Identitat in einer App. Chatten, telefonieren, bezahlen, surfen, speichern, minen - alles geschutzt durch Verschlusselung auf Militarniveau, die selbst Quantencomputer nicht knacken konnen.",
    },
    {
      question: "Warum wurde SPEAQ geschaffen?",
      answer: "SPEAQ wurde geschaffen, weil die Welt eine Kommunikationsplattform braucht, die wirklich ihren Nutzern gehort. Bestehende Plattformen sammeln Ihre Daten, scannen Ihre Nachrichten, erfullen Uberwachungsanfragen der Regierung und konnen Ihre Konten nach Belieben einfrieren. SPEAQ wurde von Grund auf mit Zero-Knowledge-Architektur aufgebaut - wir konnen Ihre Nachrichten nicht lesen, selbst wenn wir es wollten. Ihre Freiheit ist keine Funktion. Sie ist das Fundament.",
    },
    {
      question: "Wie unterscheidet sich SPEAQ von WhatsApp, Signal oder Telegram?",
      answer: "WhatsApp gehort Meta und sammelt umfangreiche Metadaten. Telegram verschlusselt Gruppenchats nicht standardmassig. Signal ist gut, erfordert aber immer noch eine Telefonnummer und hat keine integrierten Zahlungen oder Mining. SPEAQ erfordert keine Telefonnummer, keine E-Mail, keinen echten Namen. Es bietet eine souverane Wallet mit goldgedeckten Q-Credits, Proof of Contribution Mining, einen Quantum Vault mit plausibler Abstreitbarkeit, Ghost Groups, Zeugenmodus, Dead Man's Switch und Mesh-Netzwerke. SPEAQ ist nicht nur ein Messenger - es ist eine Freiheitsplattform.",
    },
    {
      question: "Muss ich mich mit meiner Telefonnummer oder E-Mail registrieren?",
      answer: "Nein. SPEAQ generiert eine kryptographisch zufallige SPEAQ-ID auf Ihrem Gerat. Sie ist nicht mit Ihrer Telefonnummer, E-Mail oder Ihrem echten Namen verknupft. Niemand kann Ihre SPEAQ-ID zu Ihnen zuruckverfolgen, es sei denn, Sie entscheiden sich, sie zu teilen. Dies ist echte anonyme Kommunikation.",
    },
    {
      question: "Ist SPEAQ kostenlos?",
      answer: "Ja. SPEAQ kann kostenlos heruntergeladen und genutzt werden. Alle Kernfunktionen - Nachrichten, Sprach- und Videoanrufe, Dateifreigabe, Quantum Vault, Ghost Groups, Zeugenmodus und Dead Man's Switch - sind kostenlos. Sie konnen auch Q-Credits durch Proof of Contribution Mining ohne Kosten verdienen.",
    },
  ],
  sl: [
    {
      question: "Kaj je SPEAQ?",
      answer: "SPEAQ je najvarnejsa komunikacijska platforma in platforma svobode na svetu. Zdruzuje kvantno odporno sifriranje, odpornost proti cenzuri, zasebna placila, decentralizirano rudarjenje in suvereno identiteto v eni aplikaciji. Klepetajte, klichite, placujte, brskajte, shranjujte, rudarite - vse zasciteno z vojaskim sifriranjem, ki ga niti kvantni racunalniki ne morejo zlomiti.",
    },
    {
      question: "Zakaj je bil SPEAQ ustvarjen?",
      answer: "SPEAQ je bil ustvarjen, ker svet potrebuje komunikacijsko platformo, ki resnichno pripada uporabnikom. Obstojece platforme zbirajo vase podatke, pregledujejo vasa sporocila, izpolnjujejo zahteve vladnega nadzora in lahko kadarkoli zamrznejo vase racune. SPEAQ je bil zgrajen od temelja z arhitekturo nicelnega znanja - vasih sporocil ne moremo brati, tudi ce bi hoteli. Vasa svoboda ni funkcija. Je temelj.",
    },
    {
      question: "Kako se SPEAQ razlikuje od WhatsApp, Signal ali Telegram?",
      answer: "WhatsApp je v lasti podjetja Meta in zbira obsezne metapodatke. Telegram privzeto ne sifrira skupinskih klepetov. Signal je dober, a se vedno zahteva telefonsko stevilko in nima vgrajenih placil ali rudarjenja. SPEAQ ne zahteva telefonske stevilke, e-poste ali pravega imena. Dodaja suvereno denarnico z zlatom podprtimi Q-Credits, rudarjenje Proof of Contribution, Quantum Vault z verjetnim zanikanjem, Ghost Groups, nacin Price, Dead Man's Switch in omrezje mesh. SPEAQ ni le sporocilnik - je platforma svobode.",
    },
    {
      question: "Ali se moram registrirati s telefonsko stevilko ali e-posto?",
      answer: "Ne. SPEAQ na vasi napravi ustvari kriptografsko nakljuchni SPEAQ ID. Ni povezan z vaso telefonsko stevilko, e-posto ali pravim imenom. Nihce ne more slediti vasemu SPEAQ ID-ju nazaj do vas, razen ce se odlochite, da ga delite. To je prava anonimna komunikacija.",
    },
    {
      question: "Ali je SPEAQ brezplacen?",
      answer: "Da. SPEAQ je brezplacen za prenos in uporabo. Vse osnovne funkcije - sporocanje, glasovni in video klici, deljenje datotek, Quantum Vault, Ghost Groups, nacin Price in Dead Man's Switch - so brezplacne. Prav tako lahko zasluzite Q-Credits z rudarjenjem Proof of Contribution brez stroskov.",
    },
  ],
  lg: [
    {
      question: "SPEAQ kye ki?",
      answer: "SPEAQ ye pulatifomu y'empuliziganya n'eddembe esinga obukuumi ku nsi yonna. Egatta awamu enkola y'okuziyiza ekwatagana ne kkomppyuta z'ekikwantimu, okweziyiza censorship, okusasula mu kyama, okusimba okutasaasaanyiziddwa, n'obumanyirivu obw'obwannannyini mu appu emu. Wogera, kuba, sasula, lambula, tereka, simba - byonna bikunziziddwa enkola y'okuziyiza ey'omutindo gwa magye nga n'ekkomppyuta z'ekikwantimu teziyinza kubimenyaamenya.",
    },
    {
      question: "Lwaki SPEAQ yatondebwa?",
      answer: "SPEAQ yatondebwa kubanga ensi yeetaaga pulatifomu y'empuliziganya eyifa ddala ba bakozesa baayo. Pulatifomu eziriwo zikuŋŋaanya data yo, zisoma obubaka bwo, zikkiriza eby'okukebera bya gavumenti, era ziyinza okukannyiiza akawunti yo nga bwe ziyagala. SPEAQ yazimbibwa okuva mu ntandikwa n'obuzibu bwa zero-knowledge - tetuyinza kusoma bubaka bwo, wadde nga twandiyagadde. Eddembe lyo si kipimo. Ye musingi.",
    },
    {
      question: "SPEAQ eyawukana etya ku WhatsApp, Signal, oba Telegram?",
      answer: "WhatsApp ya Meta era ekuŋŋaanya metadata ennyingi. Telegram tekola nkola y'okuziyiza mu biwandiiko by'ekibinja mu butandisi. Signal nnungi naye ekyetaagisa ennamba y'essimu era terina kusasula oba okusimba okuzimbiddwamu. SPEAQ tekyetaagisa nnamba ya ssimu, email, oba erinnya ly'amazima. Eyongera wallet ey'obwannannyini n'e Q-Credits ezisigamiziddwa ku zabu, okusimba Proof of Contribution, Quantum Vault n'okusobola okugaana, Ghost Groups, Witness Mode, Dead Man's Switch, n'emikutu gya mesh. SPEAQ si messenger bwokka - ye pulatifomu y'eddembe.",
    },
    {
      question: "Nneetaaga okwewandiisa n'ennamba yange ey'essimu oba email?",
      answer: "Nedda. SPEAQ ekola SPEAQ ID eyavuddemu mu ngeri ey'ekyama ku kifo kyo. Tegikunyizibwa ku nnamba yo ey'essimu, email, oba erinnya lyo ery'amazima. Tewali ayinza okugoberera SPEAQ ID yo okutuuka gy'oli okuggyako ng'olondemu okugigabana. Eno y'empuliziganya ey'amaanyi mu bwama.",
    },
    {
      question: "SPEAQ ya bwereere?",
      answer: "Yee. SPEAQ ya bwereere okugulawo n'okukozesa. Ebikola byonna ebikulu - obubaka, okukuba amaloboozi n'ebifaananyi, okugabana fayiro, Quantum Vault, Ghost Groups, Witness Mode, ne Dead Man's Switch - bya bwereere. Osobola n'okufuna Q-Credits okuyita mu kusimba Proof of Contribution awatali ssente.",
    },
  ],
  sw: [
    {
      question: "SPEAQ ni nini?",
      answer: "SPEAQ ni jukwaa la mawasiliano na uhuru lenye usalama zaidi duniani. Linachanganya usimbaji unaostahimili kompyuta za quantum, upinzani wa udhibiti, malipo ya faragha, uchimbaji usio na mamlaka kuu, na utambulisho huru katika programu moja. Soga, piga simu, lipa, vinjari, hifadhi, chimba - yote yamelindwa na usimbaji wa kiwango cha kijeshi ambao hata kompyuta za quantum haziwezi kuvunja.",
    },
    {
      question: "Kwa nini SPEAQ iliundwa?",
      answer: "SPEAQ iliundwa kwa sababu ulimwengu unahitaji jukwaa la mawasiliano ambalo kweli ni la watumiaji wake. Majukwaa yaliyopo yanakusanya data yako, yanasoma ujumbe wako, yanafuata maagizo ya ufuatiliaji wa serikali, na yanaweza kufungia akaunti yako wakati wowote. SPEAQ ilijengwa tangu mwanzo na muundo wa maarifa-sifuri - hatuwezi kusoma ujumbe wako, hata kama tungetaka. Uhuru wako si kipengele. Ni msingi.",
    },
    {
      question: "SPEAQ inatofautiana vipi na WhatsApp, Signal, au Telegram?",
      answer: "WhatsApp inamilikiwa na Meta na inakusanya metadata nyingi. Telegram haisimbaji mazungumzo ya vikundi kwa chaguo-msingi. Signal ni nzuri lakini bado inahitaji nambari ya simu na haina malipo au uchimbaji uliojengwa ndani. SPEAQ haihitaji nambari ya simu, barua pepe, au jina halisi. Inaongeza pochi huru yenye Q-Credits zinazoungwa mkono na dhahabu, uchimbaji wa Proof of Contribution, Quantum Vault yenye ukanushi wa kuaminika, Ghost Groups, Hali ya Shahidi, Dead Man's Switch, na mtandao wa mesh. SPEAQ si mjumbe tu - ni jukwaa la uhuru.",
    },
    {
      question: "Je, ninahitaji kusajiliwa na nambari yangu ya simu au barua pepe?",
      answer: "Hapana. SPEAQ inatengeneza SPEAQ ID ya kisiri kwenye kifaa chako. Haihusishwi na nambari yako ya simu, barua pepe, au jina lako halisi. Hakuna mtu anayeweza kufuatilia SPEAQ ID yako kwako isipokuwa ukichagua kuishiriki. Hii ni mawasiliano ya kweli yasiyo na jina.",
    },
    {
      question: "Je, SPEAQ ni bure?",
      answer: "Ndiyo. SPEAQ ni bure kupakua na kutumia. Vipengele vyote vya msingi - ujumbe, simu za sauti na video, kushiriki faili, Quantum Vault, Ghost Groups, Hali ya Shahidi, na Dead Man's Switch - ni bure. Unaweza pia kupata Q-Credits kupitia uchimbaji wa Proof of Contribution bila gharama yoyote.",
    },
  ],
};

// ─── SECURITY & PRIVACY ────────────────────────────────────────────────────────

const security: Record<Lang, FaqItem[]> = {
  en: [
    {
      question: "How secure is SPEAQ?",
      answer: "SPEAQ uses 9 layers of security, including AES-256 encryption, the Double Ratchet protocol for forward secrecy, Kyber-768 post-quantum key exchange, sealed sender relay, and quantum random number generation. Every message, call, file, and payment is encrypted before it leaves your device. The relay server sees only encrypted blobs - it cannot read content, identify communicating parties, or determine what is being sent.",
    },
    {
      question: "What encryption does SPEAQ use?",
      answer: "SPEAQ uses AES-256 for message encryption (the same standard used by military and intelligence agencies), the Double Ratchet protocol for forward secrecy (every message has a unique key), Kyber-768 for post-quantum key exchange (NIST-approved lattice-based KEM), ML-DSA-65 (FIPS 204) for wallet transaction signing, SPHINCS+ (FIPS 205) for blockchain block signing, SHA-256 for hashing, and HMAC-SHA256 for message authentication.",
    },
    {
      question: "What is quantum-resistant encryption and why does it matter?",
      answer: "Quantum computers will eventually be able to break the encryption used by most apps today (RSA, ECC). This means messages encrypted today could be stored and decrypted in the future - a strategy known as 'harvest now, decrypt later.' SPEAQ uses NIST-approved post-quantum algorithms (Kyber-768, ML-DSA-65, SPHINCS+) that are designed to resist attacks from both classical and quantum computers. Your messages are safe today and in the future.",
    },
    {
      question: "Can anyone read my messages - even SPEAQ itself?",
      answer: "No. SPEAQ uses end-to-end encryption with zero-knowledge architecture. Messages are encrypted on your device before they are sent and can only be decrypted by the intended recipient. The relay server processes only encrypted blobs. We have no keys, no backdoors, and no ability to read your messages. This is a technical guarantee, not a policy promise.",
    },
    {
      question: "What is zero-knowledge architecture?",
      answer: "Zero-knowledge means the server operates without knowing anything about the data it processes. The SPEAQ relay server facilitates message delivery without knowing who is communicating with whom, what is being said, or what files are being shared. It sees only encrypted data that it cannot decrypt. Even if the server were compromised, an attacker would find nothing useful.",
    },
    {
      question: "What is a Sealed Sender?",
      answer: "Sealed Sender means that even the relay server does not know who sent a message. The sender's identity is encrypted inside the message envelope. The server can deliver the message to the recipient but cannot see who it came from. This prevents metadata analysis and traffic correlation attacks.",
    },
    {
      question: "What happens if I lose my phone?",
      answer: "All your data is stored locally on your device. If you lose your phone and have not created an encrypted backup, your data is gone permanently. We recommend using the encrypted backup feature to protect against device loss. Your backup is encrypted with your personal key - we cannot access it.",
    },
    {
      question: "Can governments access my data?",
      answer: "No. Because of our zero-knowledge architecture, we have nothing to provide in response to legal requests. We cannot decrypt your messages. We do not know who you communicate with. We do not store your data on our servers. We will comply with valid legal processes, but the technical reality is that we have nothing useful to hand over.",
    },
    {
      question: "What are the security layers in SPEAQ?",
      answer: "SPEAQ has 9 layers of security:\n\n1. Obfuscation + Mesh - Traffic analysis resistance through mesh networking and data obfuscation\n2. Sealed Sender - Server cannot see who sent a message\n3. AES-256 + Double Ratchet - Military-grade encryption with forward secrecy for every message\n4. HMAC-SHA256 - Message authentication to prevent tampering\n5. Kyber-768 - Post-quantum key exchange resistant to quantum computers\n6. QRNG - Quantum random number generation for true randomness\n7. ML-DSA-65 (FIPS 204) - Quantum-resistant digital signatures for wallet transactions\n8. SPHINCS+ (FIPS 205) - Hash-based signatures for blockchain block signing\n9. Plausible Deniability - Hidden vault layer with no technical proof of existence",
    },
  ],
  nl: [
    {
      question: "Hoe veilig is SPEAQ?",
      answer: "SPEAQ gebruikt 9 beveiligingslagen, waaronder AES-256-encryptie, het Double Ratchet-protocol voor forward secrecy, Kyber-768 post-quantum sleuteluitwisseling, verzegelde afzender-relay en kwantum-willekeurige nummergeneratie. Elk bericht, gesprek, bestand en elke betaling wordt versleuteld voordat het je apparaat verlaat. De relay-server ziet alleen versleutelde blobs - hij kan geen inhoud lezen, communicerende partijen identificeren of bepalen wat er wordt verzonden.",
    },
    {
      question: "Welke encryptie gebruikt SPEAQ?",
      answer: "SPEAQ gebruikt AES-256 voor berichtencryptie (dezelfde standaard als bij militaire en inlichtingendiensten), het Double Ratchet-protocol voor forward secrecy (elk bericht heeft een unieke sleutel), Kyber-768 voor post-quantum sleuteluitwisseling (NIST-goedgekeurde lattice-gebaseerde KEM), ML-DSA-65 (FIPS 204) voor het ondertekenen van wallet-transacties, SPHINCS+ (FIPS 205) voor het ondertekenen van blockchain-blokken, SHA-256 voor hashing en HMAC-SHA256 voor berichtauthenticatie.",
    },
    {
      question: "Wat is kwantumbestendige encryptie en waarom is het belangrijk?",
      answer: "Kwantumcomputers zullen uiteindelijk de encryptie kunnen breken die de meeste apps vandaag gebruiken (RSA, ECC). Dit betekent dat berichten die vandaag versleuteld zijn, in de toekomst opgeslagen en ontsleuteld kunnen worden - een strategie die bekend staat als 'nu oogsten, later ontsleutelen'. SPEAQ gebruikt NIST-goedgekeurde post-quantum algoritmen (Kyber-768, ML-DSA-65, SPHINCS+) die ontworpen zijn om aanvallen van zowel klassieke als kwantumcomputers te weerstaan. Je berichten zijn veilig vandaag en in de toekomst.",
    },
    {
      question: "Kan iemand mijn berichten lezen - zelfs SPEAQ zelf?",
      answer: "Nee. SPEAQ gebruikt end-to-end-encryptie met zero-knowledge architectuur. Berichten worden op je apparaat versleuteld voordat ze worden verzonden en kunnen alleen worden ontsleuteld door de beoogde ontvanger. De relay-server verwerkt alleen versleutelde blobs. Wij hebben geen sleutels, geen achterdeuren en geen mogelijkheid om je berichten te lezen. Dit is een technische garantie, geen beleidsbelofte.",
    },
    {
      question: "Wat is zero-knowledge architectuur?",
      answer: "Zero-knowledge betekent dat de server werkt zonder iets te weten over de data die het verwerkt. De SPEAQ relay-server faciliteert berichtbezorging zonder te weten wie met wie communiceert, wat er gezegd wordt of welke bestanden gedeeld worden. Hij ziet alleen versleutelde data die hij niet kan ontsleutelen. Zelfs als de server gehackt zou worden, zou een aanvaller niets bruikbaars vinden.",
    },
    {
      question: "Wat is een Sealed Sender?",
      answer: "Sealed Sender betekent dat zelfs de relay-server niet weet wie een bericht heeft verzonden. De identiteit van de afzender is versleuteld in de berichtenvelop. De server kan het bericht bij de ontvanger afleveren maar kan niet zien van wie het afkomstig is. Dit voorkomt metadata-analyse en verkeers-correlatie-aanvallen.",
    },
    {
      question: "Wat gebeurt er als ik mijn telefoon verlies?",
      answer: "Al je data wordt lokaal op je apparaat opgeslagen. Als je je telefoon verliest en geen versleutelde back-up hebt gemaakt, is je data permanent verdwenen. We raden aan de versleutelde back-upfunctie te gebruiken om je te beschermen tegen apparaatverlies. Je back-up is versleuteld met je persoonlijke sleutel - wij hebben er geen toegang toe.",
    },
    {
      question: "Kunnen overheden toegang krijgen tot mijn data?",
      answer: "Nee. Vanwege onze zero-knowledge architectuur hebben we niets om te verstrekken als reactie op juridische verzoeken. We kunnen je berichten niet ontsleutelen. We weten niet met wie je communiceert. We slaan je data niet op onze servers op. We zullen geldige juridische procedures naleven, maar de technische realiteit is dat we niets bruikbaars hebben om te overhandigen.",
    },
    {
      question: "Wat zijn de beveiligingslagen in SPEAQ?",
      answer: "SPEAQ heeft 9 beveiligingslagen:\n\n1. Obfuscatie + Mesh - Weerstand tegen verkeersanalyse door mesh-netwerken en data-obfuscatie\n2. Sealed Sender - Server kan niet zien wie een bericht heeft verzonden\n3. AES-256 + Double Ratchet - Militaire encryptie met forward secrecy voor elk bericht\n4. HMAC-SHA256 - Berichtauthenticatie om manipulatie te voorkomen\n5. Kyber-768 - Post-quantum sleuteluitwisseling bestand tegen kwantumcomputers\n6. QRNG - Kwantum-willekeurige nummergeneratie voor echte willekeurigheid\n7. ML-DSA-65 (FIPS 204) - Kwantumbestendige digitale handtekeningen voor wallet-transacties\n8. SPHINCS+ (FIPS 205) - Hash-gebaseerde handtekeningen voor blockchain-blokondertekening\n9. Plausibele Ontkenning - Verborgen kluislaag zonder technisch bewijs van bestaan",
    },
  ],
  fr: [
    {
      question: "A quel point SPEAQ est-il securise ?",
      answer: "SPEAQ utilise 9 couches de securite, notamment le chiffrement AES-256, le protocole Double Ratchet pour la confidentialite persistante, l'echange de cles post-quantique Kyber-768, le relais a expediteur scelle et la generation de nombres aleatoires quantiques. Chaque message, appel, fichier et paiement est chiffre avant de quitter votre appareil. Le serveur relais ne voit que des blobs chiffres - il ne peut pas lire le contenu, identifier les parties communicantes ou determiner ce qui est envoye.",
    },
    {
      question: "Quel chiffrement SPEAQ utilise-t-il ?",
      answer: "SPEAQ utilise AES-256 pour le chiffrement des messages (la meme norme utilisee par les agences militaires et de renseignement), le protocole Double Ratchet pour la confidentialite persistante (chaque message a une cle unique), Kyber-768 pour l'echange de cles post-quantique (KEM base sur les treillis approuve par le NIST), ML-DSA-65 (FIPS 204) pour la signature des transactions de portefeuille, SPHINCS+ (FIPS 205) pour la signature des blocs de la blockchain, SHA-256 pour le hachage et HMAC-SHA256 pour l'authentification des messages.",
    },
    {
      question: "Qu'est-ce que le chiffrement resistant aux quantiques et pourquoi est-ce important ?",
      answer: "Les ordinateurs quantiques seront eventuellement capables de casser le chiffrement utilise par la plupart des applications aujourd'hui (RSA, ECC). Cela signifie que les messages chiffres aujourd'hui pourraient etre stockes et dechiffres a l'avenir - une strategie connue sous le nom de 'recolter maintenant, dechiffrer plus tard'. SPEAQ utilise des algorithmes post-quantiques approuves par le NIST (Kyber-768, ML-DSA-65, SPHINCS+) concus pour resister aux attaques des ordinateurs classiques et quantiques. Vos messages sont en securite aujourd'hui et a l'avenir.",
    },
    {
      question: "Quelqu'un peut-il lire mes messages - meme SPEAQ lui-meme ?",
      answer: "Non. SPEAQ utilise un chiffrement de bout en bout avec une architecture zero-knowledge. Les messages sont chiffres sur votre appareil avant d'etre envoyes et ne peuvent etre dechiffres que par le destinataire prevu. Le serveur relais ne traite que des blobs chiffres. Nous n'avons pas de cles, pas de portes derobees et aucune capacite a lire vos messages. C'est une garantie technique, pas une promesse politique.",
    },
    {
      question: "Qu'est-ce que l'architecture zero-knowledge ?",
      answer: "Zero-knowledge signifie que le serveur fonctionne sans rien savoir des donnees qu'il traite. Le serveur relais SPEAQ facilite la livraison des messages sans savoir qui communique avec qui, ce qui est dit ou quels fichiers sont partages. Il ne voit que des donnees chiffrees qu'il ne peut pas dechiffrer. Meme si le serveur etait compromis, un attaquant ne trouverait rien d'utile.",
    },
    {
      question: "Qu'est-ce qu'un Sealed Sender ?",
      answer: "Sealed Sender signifie que meme le serveur relais ne sait pas qui a envoye un message. L'identite de l'expediteur est chiffree a l'interieur de l'enveloppe du message. Le serveur peut livrer le message au destinataire mais ne peut pas voir de qui il provient. Cela empeche l'analyse des metadonnees et les attaques par correlation de trafic.",
    },
    {
      question: "Que se passe-t-il si je perds mon telephone ?",
      answer: "Toutes vos donnees sont stockees localement sur votre appareil. Si vous perdez votre telephone et n'avez pas cree de sauvegarde chiffree, vos donnees sont definitivement perdues. Nous recommandons d'utiliser la fonction de sauvegarde chiffree pour vous proteger contre la perte d'appareil. Votre sauvegarde est chiffree avec votre cle personnelle - nous ne pouvons pas y acceder.",
    },
    {
      question: "Les gouvernements peuvent-ils acceder a mes donnees ?",
      answer: "Non. En raison de notre architecture zero-knowledge, nous n'avons rien a fournir en reponse aux demandes legales. Nous ne pouvons pas dechiffrer vos messages. Nous ne savons pas avec qui vous communiquez. Nous ne stockons pas vos donnees sur nos serveurs. Nous nous conformerons aux procedures legales valides, mais la realite technique est que nous n'avons rien d'utile a remettre.",
    },
    {
      question: "Quelles sont les couches de securite de SPEAQ ?",
      answer: "SPEAQ dispose de 9 couches de securite :\n\n1. Obfuscation + Mesh - Resistance a l'analyse du trafic grace au reseau maille et a l'obfuscation des donnees\n2. Sealed Sender - Le serveur ne peut pas voir qui a envoye un message\n3. AES-256 + Double Ratchet - Chiffrement de niveau militaire avec confidentialite persistante pour chaque message\n4. HMAC-SHA256 - Authentification des messages pour empecher la falsification\n5. Kyber-768 - Echange de cles post-quantique resistant aux ordinateurs quantiques\n6. QRNG - Generation de nombres aleatoires quantiques pour un veritable hasard\n7. ML-DSA-65 (FIPS 204) - Signatures numeriques resistantes aux quantiques pour les transactions de portefeuille\n8. SPHINCS+ (FIPS 205) - Signatures basees sur le hachage pour la signature des blocs de la blockchain\n9. Deniabilite plausible - Couche de coffre-fort cachee sans preuve technique d'existence",
    },
  ],
  es: [
    {
      question: "Que tan seguro es SPEAQ?",
      answer: "SPEAQ utiliza 9 capas de seguridad, incluyendo cifrado AES-256, el protocolo Double Ratchet para secreto perfecto hacia adelante, intercambio de claves post-cuantico Kyber-768, retransmision con remitente sellado y generacion de numeros aleatorios cuanticos. Cada mensaje, llamada, archivo y pago se cifra antes de salir de tu dispositivo. El servidor de retransmision solo ve blobs cifrados - no puede leer contenido, identificar partes comunicantes ni determinar que se esta enviando.",
    },
    {
      question: "Que cifrado utiliza SPEAQ?",
      answer: "SPEAQ utiliza AES-256 para el cifrado de mensajes (el mismo estandar usado por agencias militares y de inteligencia), el protocolo Double Ratchet para secreto perfecto hacia adelante (cada mensaje tiene una clave unica), Kyber-768 para intercambio de claves post-cuantico (KEM basado en reticulados aprobado por NIST), ML-DSA-65 (FIPS 204) para firmar transacciones de billetera, SPHINCS+ (FIPS 205) para firmar bloques de blockchain, SHA-256 para hashing y HMAC-SHA256 para autenticacion de mensajes.",
    },
    {
      question: "Que es el cifrado resistente a computadoras cuanticas y por que importa?",
      answer: "Las computadoras cuanticas eventualmente podran romper el cifrado usado por la mayoria de las aplicaciones hoy (RSA, ECC). Esto significa que los mensajes cifrados hoy podrian almacenarse y descifrarse en el futuro - una estrategia conocida como 'cosechar ahora, descifrar despues'. SPEAQ usa algoritmos post-cuanticos aprobados por NIST (Kyber-768, ML-DSA-65, SPHINCS+) disenados para resistir ataques de computadoras tanto clasicas como cuanticas. Tus mensajes estan seguros hoy y en el futuro.",
    },
    {
      question: "Puede alguien leer mis mensajes - incluso SPEAQ mismo?",
      answer: "No. SPEAQ usa cifrado de extremo a extremo con arquitectura de conocimiento cero. Los mensajes se cifran en tu dispositivo antes de enviarse y solo pueden ser descifrados por el destinatario previsto. El servidor de retransmision solo procesa blobs cifrados. No tenemos claves, no tenemos puertas traseras y no tenemos capacidad para leer tus mensajes. Esta es una garantia tecnica, no una promesa de politica.",
    },
    {
      question: "Que es la arquitectura de conocimiento cero?",
      answer: "Conocimiento cero significa que el servidor opera sin saber nada sobre los datos que procesa. El servidor de retransmision SPEAQ facilita la entrega de mensajes sin saber quien se comunica con quien, que se dice o que archivos se comparten. Solo ve datos cifrados que no puede descifrar. Incluso si el servidor fuera comprometido, un atacante no encontraria nada util.",
    },
    {
      question: "Que es un Sealed Sender?",
      answer: "Sealed Sender significa que incluso el servidor de retransmision no sabe quien envio un mensaje. La identidad del remitente esta cifrada dentro del sobre del mensaje. El servidor puede entregar el mensaje al destinatario pero no puede ver de quien proviene. Esto previene el analisis de metadatos y los ataques de correlacion de trafico.",
    },
    {
      question: "Que pasa si pierdo mi telefono?",
      answer: "Todos tus datos se almacenan localmente en tu dispositivo. Si pierdes tu telefono y no has creado una copia de seguridad cifrada, tus datos se han perdido permanentemente. Recomendamos usar la funcion de copia de seguridad cifrada para protegerte contra la perdida del dispositivo. Tu copia de seguridad esta cifrada con tu clave personal - nosotros no podemos acceder a ella.",
    },
    {
      question: "Pueden los gobiernos acceder a mis datos?",
      answer: "No. Debido a nuestra arquitectura de conocimiento cero, no tenemos nada que proporcionar en respuesta a solicitudes legales. No podemos descifrar tus mensajes. No sabemos con quien te comunicas. No almacenamos tus datos en nuestros servidores. Cumpliremos con procesos legales validos, pero la realidad tecnica es que no tenemos nada util que entregar.",
    },
    {
      question: "Cuales son las capas de seguridad en SPEAQ?",
      answer: "SPEAQ tiene 9 capas de seguridad:\n\n1. Ofuscacion + Mesh - Resistencia al analisis de trafico mediante redes mesh y ofuscacion de datos\n2. Sealed Sender - El servidor no puede ver quien envio un mensaje\n3. AES-256 + Double Ratchet - Cifrado de grado militar con secreto perfecto hacia adelante para cada mensaje\n4. HMAC-SHA256 - Autenticacion de mensajes para prevenir manipulacion\n5. Kyber-768 - Intercambio de claves post-cuantico resistente a computadoras cuanticas\n6. QRNG - Generacion de numeros aleatorios cuanticos para aleatoriedad verdadera\n7. ML-DSA-65 (FIPS 204) - Firmas digitales resistentes a cuanticas para transacciones de billetera\n8. SPHINCS+ (FIPS 205) - Firmas basadas en hash para firmar bloques de blockchain\n9. Negacion plausible - Capa de boveda oculta sin prueba tecnica de existencia",
    },
  ],
  ru: [
    {
      question: "Naskolko bezopasen SPEAQ?",
      answer: "SPEAQ ispolzuet 9 urovney bezopasnosti, vklyuchaya shifrovanie AES-256, protokol Double Ratchet dlya pryamoy sekretnosi, postkvantovyy obmen klyuchami Kyber-768, retranslyatsiyu s zapechatannym otpravitelem i generatsiyu kvantovykh sluchaynykh chisel. Kazhdoe soobshchenie, zvonok, fayl i platezh shifruyutsya do togo, kak pokinut vashe ustroystvo. Server-retranslyator vidit tolko zashifrovannye bloby - on ne mozhet chitat soderzhimoe, identifitsirovat obshchayushchiesya storony ili opredelit, chto otpravlyaetsya.",
    },
    {
      question: "Kakoe shifrovanie ispolzuet SPEAQ?",
      answer: "SPEAQ ispolzuet AES-256 dlya shifrovaniya soobshcheniy (tot zhe standart, chto ispolzuyetsya voennymi i razvedyvatelnymi sluzhbami), protokol Double Ratchet dlya pryamoy sekretnosti (kazhdoe soobshchenie imeet unikalnyy klyuch), Kyber-768 dlya postkvantovogo obmena klyuchami (KEM na osnove reshetok, odobrennyy NIST), ML-DSA-65 (FIPS 204) dlya podpisaniya tranzaktsiy koshelka, SPHINCS+ (FIPS 205) dlya podpisaniya blokov blokcheyna, SHA-256 dlya kheshirovaniya i HMAC-SHA256 dlya autentifikatsii soobshcheniy.",
    },
    {
      question: "Chto takoe kvantovoustomchivoe shifrovanie i pochemu eto vazhno?",
      answer: "Kvantovye kompyutery v konechnom itoge smogut vzlomat shifrovanie, ispolzuemoe bolshinstvom prilozheniy segodnya (RSA, ECC). Eto oznachaet, chto soobshcheniya, zashifrovannye segodnya, mogut byt sokhraneny i rasshifrovany v budushchem - strategiya, izvestnaya kak 'sobirat seychas, rasshifrovat pozhe'. SPEAQ ispolzuet postkvantovye algoritmy, odobrennye NIST (Kyber-768, ML-DSA-65, SPHINCS+), kotorye prednaznacheny dlya soprotivleniya atakam kak klassicheskikh, tak i kvantovykh kompyuterov. Vashi soobshcheniya v bezopasnosti segodnya i v budushchem.",
    },
    {
      question: "Mozhet li kto-to chitat moi soobshcheniya - dazhe sam SPEAQ?",
      answer: "Net. SPEAQ ispolzuet skvoznoe shifrovanie s arkhitekturoy nulevogo znaniya. Soobshcheniya shifruyutsya na vashem ustroystve pered otpravkoy i mogut byt rasshifrovany tolko predpolagaemym poluchatelem. Server-retranslyator obrabatyvaet tolko zashifrovannye bloby. U nas net klyuchey, net zadnikh dverey i net vozmozhnosti chitat vashi soobshcheniya. Eto tekhnicheskaya garantiya, a ne politicheskoe obeshchanie.",
    },
    {
      question: "Chto takoe arkhitektura nulevogo znaniya?",
      answer: "Nulevoe znanie oznachaet, chto server rabotaet, nichego ne znaya o dannykh, kotorye on obrabatyvaet. Server-retranslyator SPEAQ oblegchaet dostavku soobshcheniy, ne znaya, kto s kem obshchaetsya, chto govoritsya ili kakie fayly peredayutsya. On vidit tolko zashifrovannye dannye, kotorye ne mozhet rasshifrovat. Dazhe yesli server budet skomprommetirovan, zloomyshlennik ne naydet nichego poleznogo.",
    },
    {
      question: "Chto takoe Sealed Sender?",
      answer: "Sealed Sender oznachaet, chto dazhe server-retranslyator ne znaet, kto otpravil soobshchenie. Lichnost otpravitelya zashifrovana vnutri konverta soobshcheniya. Server mozhet dostavit soobshchenie poluchatelyu, no ne mozhet videt, ot kogo ono prishlo. Eto predotvrashchaet analiz metadannykh i ataki korrelyatsii trafika.",
    },
    {
      question: "Chto budet, yesli ya poteryayu telefon?",
      answer: "Vse vashi dannye khranyatsya lokalno na vashem ustroystve. Yesli vy poteryaete telefon i ne sozdali zashifrovannuyu rezervnuyu kopiyu, vashi dannye budut poteryany navsegda. My rekomenduem ispolzovat funktsiyu zashifrovannogo rezervnogo kopirovaniya dlya zashchity ot poteri ustroystva. Vasha rezervnaya kopiya zashifrovana vashim lichnym klyuchom - my ne mozhem poluchit k ney dostup.",
    },
    {
      question: "Mogut li pravitelstva poluchit dostup k moim dannym?",
      answer: "Net. Iz-za nashey arkhitektury nulevogo znaniya nam nechego predostavit v otvet na yuridicheskie zaprosy. My ne mozhem rasshifrovat vashi soobshcheniya. My ne znaem, s kem vy obshchaetes. My ne khranim vashi dannye na nashikh serverakh. My budem soblyudat deystvitelnye yuridicheskie protsessy, no tekhnicheskaya realnost takova, chto nam nechego poleznogo peredat.",
    },
    {
      question: "Kakiye urovni bezopasnosti yest v SPEAQ?",
      answer: "SPEAQ imeet 9 urovney bezopasnosti:\n\n1. Obfuskatsiya + Mesh - Ustoychivost k analizu trafika cherez mesh-seti i obfuskatsiyu dannykh\n2. Sealed Sender - Server ne mozhet videt, kto otpravil soobshchenie\n3. AES-256 + Double Ratchet - Shifrovanie voennogo urovnya s pryamoy sekretnostyu dlya kazhdogo soobshcheniya\n4. HMAC-SHA256 - Autentifikatsiya soobshcheniy dlya predotvrashcheniya poddelki\n5. Kyber-768 - Postkvantovyy obmen klyuchami, ustoychivy k kvantovym kompyuteram\n6. QRNG - Generatsiya kvantovykh sluchaynykh chisel dlya istinnoy sluchaynosti\n7. ML-DSA-65 (FIPS 204) - Kvantovoustomchivye tsifrovye podpisi dlya tranzaktsiy koshelka\n8. SPHINCS+ (FIPS 205) - Podpisi na osnove kheshey dlya podpisaniya blokov blokcheyna\n9. Pravdopodobnoe otpiratelstvo - Skrytyy uroven khranilishcha bez tekhnicheskikh dokazatelstv sushchestvovaniya",
    },
  ],
  de: [
    {
      question: "Wie sicher ist SPEAQ?",
      answer: "SPEAQ verwendet 9 Sicherheitsschichten, darunter AES-256-Verschlusselung, das Double-Ratchet-Protokoll fur Vorwartsgeheimnis, Kyber-768 Post-Quanten-Schlusselaustausch, versiegeltes Absender-Relay und quantenzufallige Zahlengenerierung. Jede Nachricht, jeder Anruf, jede Datei und jede Zahlung wird verschlusselt, bevor sie Ihr Gerat verlasst. Der Relay-Server sieht nur verschlusselte Blobs - er kann keine Inhalte lesen, kommunizierende Parteien identifizieren oder bestimmen, was gesendet wird.",
    },
    {
      question: "Welche Verschlusselung verwendet SPEAQ?",
      answer: "SPEAQ verwendet AES-256 fur die Nachrichtenverschlusselung (derselbe Standard wie bei Militar- und Geheimdiensten), das Double-Ratchet-Protokoll fur Vorwartsgeheimnis (jede Nachricht hat einen einzigartigen Schlussel), Kyber-768 fur Post-Quanten-Schlusselaustausch (NIST-genehmigtes gitterbasiertes KEM), ML-DSA-65 (FIPS 204) fur die Signierung von Wallet-Transaktionen, SPHINCS+ (FIPS 205) fur die Signierung von Blockchain-Blocken, SHA-256 fur Hashing und HMAC-SHA256 fur die Nachrichtenauthentifizierung.",
    },
    {
      question: "Was ist quantenresistente Verschlusselung und warum ist sie wichtig?",
      answer: "Quantencomputer werden irgendwann in der Lage sein, die Verschlusselung zu brechen, die die meisten Apps heute verwenden (RSA, ECC). Das bedeutet, dass heute verschlusselte Nachrichten gespeichert und in Zukunft entschlusselt werden konnten - eine Strategie, die als 'jetzt ernten, spater entschlusseln' bekannt ist. SPEAQ verwendet NIST-genehmigte Post-Quanten-Algorithmen (Kyber-768, ML-DSA-65, SPHINCS+), die entwickelt wurden, um Angriffen von sowohl klassischen als auch Quantencomputern zu widerstehen. Ihre Nachrichten sind heute und in Zukunft sicher.",
    },
    {
      question: "Kann jemand meine Nachrichten lesen - sogar SPEAQ selbst?",
      answer: "Nein. SPEAQ verwendet Ende-zu-Ende-Verschlusselung mit Zero-Knowledge-Architektur. Nachrichten werden auf Ihrem Gerat verschlusselt, bevor sie gesendet werden, und konnen nur vom vorgesehenen Empfanger entschlusselt werden. Der Relay-Server verarbeitet nur verschlusselte Blobs. Wir haben keine Schlussel, keine Hinterturren und keine Moglichkeit, Ihre Nachrichten zu lesen. Dies ist eine technische Garantie, kein politisches Versprechen.",
    },
    {
      question: "Was ist Zero-Knowledge-Architektur?",
      answer: "Zero-Knowledge bedeutet, dass der Server arbeitet, ohne etwas uber die Daten zu wissen, die er verarbeitet. Der SPEAQ Relay-Server erleichtert die Nachrichtenzustellung, ohne zu wissen, wer mit wem kommuniziert, was gesagt wird oder welche Dateien geteilt werden. Er sieht nur verschlusselte Daten, die er nicht entschlusseln kann. Selbst wenn der Server kompromittiert wurde, wurde ein Angreifer nichts Nutzliches finden.",
    },
    {
      question: "Was ist ein Sealed Sender?",
      answer: "Sealed Sender bedeutet, dass selbst der Relay-Server nicht weiss, wer eine Nachricht gesendet hat. Die Identitat des Absenders ist in der Nachrichtenhulle verschlusselt. Der Server kann die Nachricht an den Empfanger zustellen, kann aber nicht sehen, von wem sie stammt. Dies verhindert Metadatenanalyse und Verkehrskorrelationsangriffe.",
    },
    {
      question: "Was passiert, wenn ich mein Telefon verliere?",
      answer: "Alle Ihre Daten werden lokal auf Ihrem Gerat gespeichert. Wenn Sie Ihr Telefon verlieren und kein verschlusseltes Backup erstellt haben, sind Ihre Daten dauerhaft verloren. Wir empfehlen die Verwendung der verschlusselten Backup-Funktion zum Schutz vor Gerateverlust. Ihr Backup ist mit Ihrem personlichen Schlussel verschlusselt - wir konnen nicht darauf zugreifen.",
    },
    {
      question: "Konnen Regierungen auf meine Daten zugreifen?",
      answer: "Nein. Aufgrund unserer Zero-Knowledge-Architektur haben wir nichts, was wir als Antwort auf rechtliche Anfragen bereitstellen konnten. Wir konnen Ihre Nachrichten nicht entschlusseln. Wir wissen nicht, mit wem Sie kommunizieren. Wir speichern Ihre Daten nicht auf unseren Servern. Wir werden gultigen rechtlichen Verfahren nachkommen, aber die technische Realitat ist, dass wir nichts Nutzliches zu ubergeben haben.",
    },
    {
      question: "Welche Sicherheitsschichten hat SPEAQ?",
      answer: "SPEAQ hat 9 Sicherheitsschichten:\n\n1. Verschleierung + Mesh - Widerstand gegen Verkehrsanalyse durch Mesh-Netzwerke und Datenverschleierung\n2. Sealed Sender - Server kann nicht sehen, wer eine Nachricht gesendet hat\n3. AES-256 + Double Ratchet - Verschlusselung auf Militarniveau mit Vorwartsgeheimnis fur jede Nachricht\n4. HMAC-SHA256 - Nachrichtenauthentifizierung zur Verhinderung von Manipulation\n5. Kyber-768 - Post-Quanten-Schlusselaustausch resistent gegen Quantencomputer\n6. QRNG - Quantenzufallige Zahlengenerierung fur echte Zufalligkeit\n7. ML-DSA-65 (FIPS 204) - Quantenresistente digitale Signaturen fur Wallet-Transaktionen\n8. SPHINCS+ (FIPS 205) - Hash-basierte Signaturen fur Blockchain-Block-Signierung\n9. Plausible Abstreitbarkeit - Versteckte Tresorschicht ohne technischen Existenznachweis",
    },
  ],
  sl: [
    {
      question: "Kako varen je SPEAQ?",
      answer: "SPEAQ uporablja 9 varnostnih plasti, vkljuchno s sifriranjem AES-256, protokolom Double Ratchet za vnaprejsnjo skrivnost, postkvantno izmenjavo kljuchev Kyber-768, zapechatenem posiljateljem in kvantno generacijo nakljuchnih stevilk. Vsako sporocilo, klic, datoteka in placilo je sifrirano, preden zapusti vaso napravo. Posredovalni streznik vidi samo sifrirane blob-e - ne more brati vsebine, identificirati komunicirajochih strank ali dolociti, kaj se possilja.",
    },
    {
      question: "Katero sifriranje uporablja SPEAQ?",
      answer: "SPEAQ uporablja AES-256 za sifriranje sporocil (enak standard kot ga uporabljajo vojaske in obvescevalne agencije), protokol Double Ratchet za vnaprejsnjo skrivnost (vsako sporocilo ima edinstven kljuc), Kyber-768 za postkvantno izmenjavo kljuchev (NIST-odobren mrezhno osnovan KEM), ML-DSA-65 (FIPS 204) za podpisovanje transakcij denarnice, SPHINCS+ (FIPS 205) za podpisovanje blokov verige blokov, SHA-256 za zgoschevanje in HMAC-SHA256 za avtentikacijo sporocil.",
    },
    {
      question: "Kaj je kvantno odporno sifriranje in zakaj je pomembno?",
      answer: "Kvantni racunalniki bodo sochasoma lahko zlomili sifriranje, ki ga vecina aplikacij danes uporablja (RSA, ECC). To pomeni, da bi se sporocila, sifrirana danes, lahko shranila in desifrirala v prihodnosti - strategija, znana kot 'pozhni zdaj, desifriraj pozneje'. SPEAQ uporablja NIST-odobrene postkvantne algoritme (Kyber-768, ML-DSA-65, SPHINCS+), zasnovane za odpornost proti napadom tako klasicnih kot kvantnih racunalnikov. Vasa sporocila so varna danes in v prihodnosti.",
    },
    {
      question: "Ali lahko kdorkoli bere moja sporocila - celo SPEAQ sam?",
      answer: "Ne. SPEAQ uporablja sifriranje od konca do konca z arhitekturo nicelnega znanja. Sporocila so sifrirana na vasi napravi, preden so poslana, in jih lahko desifra samo predvideni prejemnik. Posredovalni streznik obdeluje samo sifrirane blob-e. Nimamo kljuchev, nimamo zadnjih vrat in nimamo moznosti brati vasih sporocil. To je tehnicna garancija, ne politicna obljuba.",
    },
    {
      question: "Kaj je arhitektura nicelnega znanja?",
      answer: "Nicelno znanje pomeni, da streznik deluje, ne da bi karkoli vedel o podatkih, ki jih obdeluje. Posredovalni streznik SPEAQ olajsa dostavo sporocil, ne da bi vedel, kdo komunicira s kom, kaj se govori ali katere datoteke se delijo. Vidi samo sifrirane podatke, ki jih ne more desifrirati. Tudi ce bi bil streznik kompromitiran, napadalec ne bi nasel nicesar koristnega.",
    },
    {
      question: "Kaj je Sealed Sender?",
      answer: "Sealed Sender pomeni, da niti posredovalni streznik ne ve, kdo je poslal sporocilo. Identiteta posiljatelja je sifrirana znotraj ovojnice sporocila. Streznik lahko dostavi sporocilo prejemniku, vendar ne more videti, od koga prihaja. To preprechuje analizo metapodatkov in napade korelacije prometa.",
    },
    {
      question: "Kaj se zgodi, ce izgubim telefon?",
      answer: "Vsi vasi podatki so shranjeni lokalno na vasi napravi. Ce izgubite telefon in niste ustvarili sifrirane varnostne kopije, so vasi podatki trajno izgubljeni. Priporocamo uporabo funkcije sifrirane varnostne kopije za zaschito pred izgubo naprave. Vasa varnostna kopija je sifrirana z vasim osebnim kljucem - mi do nje ne moremo dostopati.",
    },
    {
      question: "Ali lahko vlade dostopajo do mojih podatkov?",
      answer: "Ne. Zaradi nase arhitekture nicelnega znanja nimamo nicesar, kar bi lahko zagotovili v odgovor na pravne zahteve. Ne moremo desifrirati vasih sporocil. Ne vemo, s kom komunicirate. Vasih podatkov ne hranimo na nasih streznikih. Upostevali bomo veljavne pravne postopke, vendar je tehnicna realnost, da nimamo nicesar koristnega za izrocitev.",
    },
    {
      question: "Katere so varnostne plasti v SPEAQ?",
      answer: "SPEAQ ima 9 varnostnih plasti:\n\n1. Zameglitev + Mesh - Odpornost proti analizi prometa z omrezjem mesh in zameglitvijo podatkov\n2. Sealed Sender - Streznik ne more videti, kdo je poslal sporocilo\n3. AES-256 + Double Ratchet - Vojasko sifriranje z vnaprejsnjo skrivnostjo za vsako sporocilo\n4. HMAC-SHA256 - Avtentikacija sporocil za preprechevanje ponarejanja\n5. Kyber-768 - Postkvantna izmenjava kljuchev, odporna proti kvantnim racunalnikom\n6. QRNG - Kvantna generacija nakljuchnih stevilk za pravo nakljuchnost\n7. ML-DSA-65 (FIPS 204) - Kvantno odporne digitalne podpise za transakcije denarnice\n8. SPHINCS+ (FIPS 205) - Podpisi na osnovi zgoscevanja za podpisovanje blokov verige blokov\n9. Verjetno zanikanje - Skrita plast trezorja brez tehnicnega dokaza o obstoju",
    },
  ],
  lg: [
    {
      question: "SPEAQ ekuumiddwa etya?",
      answer: "SPEAQ ekozesa ebitundu 9 eby'obukuumi, ng'omuli enkola y'okuziyiza AES-256, empeereza ya Double Ratchet olw'obukyama obw'omu maaso, okukyusakyusa ebisumuluzo ebya Kyber-768 ebikwatagana ne kkomppyuta z'ekikwantimu, sealed sender relay, n'okukola ennamba z'akasirise ez'ekikwantimu. Buli bubaka, okukuba, fayiro, n'okusasula biziyizibwa ng'ebinava ku kifo kyo. Seva erabira blobs eziziyiziddwa byokka - teyinza kusoma ebirimu, okumanya abantu abawogeraga, oba okumanya ky'otumiddwa.",
    },
    {
      question: "Enkola ki ey'okuziyiza SPEAQ gy'ekozesa?",
      answer: "SPEAQ ekozesa AES-256 okuziyiza obubaka (ekikola kye kimu nga kya magye n'eby'obuteeso), empeereza ya Double Ratchet olw'obukyama obw'omu maaso (buli bubaka bulina ekisumuluzo ekyenjawulo), Kyber-768 olw'okukyusakyusa ebisumuluzo ebikwatagana ne kkomppyuta z'ekikwantimu (KEM esigamiziddwa ku lattice, ekakasiziddwa NIST), ML-DSA-65 (FIPS 204) okusayina eby'enfuna mu wallet, SPHINCS+ (FIPS 205) okusayina blocks za blockchain, SHA-256 olw'okukola hash, ne HMAC-SHA256 olw'okukakasa obubaka.",
    },
    {
      question: "Enkola y'okuziyiza ekwatagana ne kkomppyuta z'ekikwantimu kye ki era lwaki kikulu?",
      answer: "Kkomppyuta z'ekikwantimu zinaajja okuyinza okumenyaamenya enkola y'okuziyiza ey'appu ezisinga leero (RSA, ECC). Kino kitegeeza nti obubaka obuziyiziddwa leero buyinza okutereka n'okumenyuulwa mu biseera eby'omu maaso - empeereza emanyiddwa nga 'kuŋŋaanya kati, okumenyuula oluvannyuma.' SPEAQ ekozesa algorithm z'omu maaso eza kkomppyuta z'ekikwantimu, ezikakasiziddwa NIST (Kyber-768, ML-DSA-65, SPHINCS+) ezitondeddwa okweziyiza okulumba okuva mu kkomppyuta eza bulijjo n'eza ekikwantimu. Obubaka bwo bukuumiddwa leero ne mu biseera eby'omu maaso.",
    },
    {
      question: "Waliwo ayinza okusoma obubaka bwange - ne SPEAQ yennyini?",
      answer: "Nedda. SPEAQ ekozesa enkola y'okuziyiza okuva ku nkomerero okutuuka ku nkomerero n'obuzibu bwa zero-knowledge. Obubaka buziyizibwa ku kifo kyo ng'tebunnatumibwa era buyinza kumenyuulwa oyo gwoteekeddwa yekka. Seva erabira blobs eziziyiziddwa byokka. Tetulina bisumuluzo, tetulina nnyiriri z'emabega, era tetuyinza kusoma bubaka bwo. Eno y'obukakasa bwa tekiniki, si kw'ekisuubizo kya mateeka.",
    },
    {
      question: "Obuzibu bwa zero-knowledge kye ki?",
      answer: "Zero-knowledge kitegeeza nti seva ekola nga temanyiddwa kintu kyonna ku data gy'erabira. Seva ya SPEAQ eyambisa okutumibwa kw'obubaka nga temanyiddwa ani awogeraga ne ani, kiki eky'ogambwa, oba fayiro ki ezigabanwa. Eraba data enziyize byokka ezisobola kumenyuula. Wadde nga seva yandibadde ekwatiddwa, omulabe tandifunye kintu kya mugaso.",
    },
    {
      question: "Sealed Sender kye ki?",
      answer: "Sealed Sender kitegeeza nti ne seva temanyi ani eyatumye obubaka. Obumanyirivu bw'oyo eyatumye buziyiziddwa munda wa enveloppu y'obubaka. Seva esobola okutuusa obubaka eri oyo aguufunidde naye tesobola kulaba we buvudde. Kino kiziyiza okwekenneenya kwa metadata n'okulumba okugatta traffic.",
    },
    {
      question: "Kiki ekibaawo singa nfiirwa essimu yange?",
      answer: "Data yo yonna eterekeddwa ku kifo kyo. Bw'ofiirwa essimu yo era ng'otakoze backup enziyize, data yo egenze ddala. Tukuwa amagezi okukozesa ekikola eky'okukola backup enziyize okukunuulira ku kufiirwa eky'okuterekamu. Backup yo eziyiziddwa n'ekisumuluzo kyo eky'obwannannyini - ffe tetuyinza kugifuna.",
    },
    {
      question: "Gavumenti ziyinza okufuna data yange?",
      answer: "Nedda. Olw'obuzibu bwaffe obwa zero-knowledge, tetulina kye tuyinza okuwa mu kuddamu eby'etteeka. Tetuyinza kumenyuula bubaka bwo. Tetumanya ani gw'owogeraga naye. Tetutereka data yo ku seva zaffe. Tunaagobereranga enkola z'amateeka ezisaana, naye amazima ga tekiniki gali nti tetulina kintu kya mugaso kye tuyinza okuwa.",
    },
    {
      question: "Ebitundu by'obukuumi mu SPEAQ bye biruwa?",
      answer: "SPEAQ erina ebitundu 9 eby'obukuumi:\n\n1. Obfuscation + Mesh - Okweziyiza okwekenneenya kwa traffic okuyita mu mikutu gya mesh n'obfuscation y'adata\n2. Sealed Sender - Seva tesobola kulaba ani eyatumye obubaka\n3. AES-256 + Double Ratchet - Enkola y'okuziyiza ey'amagye n'obukyama obw'omu maaso ku buli bubaka\n4. HMAC-SHA256 - Okukakasa obubaka okuziyiza okukyusakyusa\n5. Kyber-768 - Okukyusakyusa ebisumuluzo okw'omu maaso okukwatagana ne kkomppyuta z'ekikwantimu\n6. QRNG - Okukola ennamba z'akasirise eza kwantimu olw'akasirise ak'amazima\n7. ML-DSA-65 (FIPS 204) - Okusayina kwe digital okukwatagana ne kwantimu ku by'enfuna mu wallet\n8. SPHINCS+ (FIPS 205) - Okusayina okusigamiziddwa ku hash ku blocks za blockchain\n9. Plausible Deniability - Ekitundu eky'ekyama ekitaliiko bukakasa bwa tekiniki nti kiliwo",
    },
  ],
  sw: [
    {
      question: "SPEAQ ina usalama kiasi gani?",
      answer: "SPEAQ inatumia tabaka 9 za usalama, ikiwa ni pamoja na usimbaji wa AES-256, itifaki ya Double Ratchet kwa usiri wa mbele, kubadilishana funguo za baada ya quantum Kyber-768, relay ya mtumaji aliyefungwa, na uzalishaji wa nambari za nasibu za quantum. Kila ujumbe, simu, faili, na malipo yanasimbwa kabla ya kutoka kwenye kifaa chako. Seva ya relay inaona blobs zilizosimbwa tu - haiwezi kusoma maudhui, kutambua wahusika, au kuamua kinachotumwa.",
    },
    {
      question: "SPEAQ inatumia usimbaji gani?",
      answer: "SPEAQ inatumia AES-256 kwa usimbaji wa ujumbe (kiwango sawa kinachotumiwa na mashirika ya kijeshi na ujasusi), itifaki ya Double Ratchet kwa usiri wa mbele (kila ujumbe una funguo ya kipekee), Kyber-768 kwa kubadilishana funguo za baada ya quantum (KEM inayotegemea lattice iliyoidhinishwa na NIST), ML-DSA-65 (FIPS 204) kwa kusaini miamala ya pochi, SPHINCS+ (FIPS 205) kwa kusaini vitalu vya blockchain, SHA-256 kwa hashing, na HMAC-SHA256 kwa uthibitisho wa ujumbe.",
    },
    {
      question: "Usimbaji unaostahimili quantum ni nini na kwa nini ni muhimu?",
      answer: "Kompyuta za quantum hatimaye zitaweza kuvunja usimbaji unaotumiwa na programu nyingi leo (RSA, ECC). Hii ina maana ujumbe uliosimbwa leo unaweza kuhifadhiwa na kufunguliwa siku zijazo - mkakati unaojulikana kama 'vuna sasa, fungua baadaye'. SPEAQ inatumia algoriti za baada ya quantum zilizoidhinishwa na NIST (Kyber-768, ML-DSA-65, SPHINCS+) zilizoundwa kustahimili mashambulizi kutoka kwa kompyuta za kawaida na za quantum. Ujumbe wako ni salama leo na siku zijazo.",
    },
    {
      question: "Je, mtu yeyote anaweza kusoma ujumbe wangu - hata SPEAQ yenyewe?",
      answer: "Hapana. SPEAQ inatumia usimbaji wa mwisho hadi mwisho na muundo wa maarifa-sifuri. Ujumbe unasimbwa kwenye kifaa chako kabla ya kutumwa na unaweza kufunguliwa tu na mpokeaji aliyekusudiwa. Seva ya relay inashughulikia blobs zilizosimbwa tu. Hatuna funguo, hatuna milango ya nyuma, na hatuna uwezo wa kusoma ujumbe wako. Hii ni dhamana ya kiufundi, si ahadi ya sera.",
    },
    {
      question: "Muundo wa maarifa-sifuri ni nini?",
      answer: "Maarifa-sifuri ina maana seva inafanya kazi bila kujua chochote kuhusu data inayoshughulikia. Seva ya relay ya SPEAQ inawezesha utoaji wa ujumbe bila kujua nani anawasiliana na nani, nini kinasemwa, au faili gani zinashirikiwa. Inaona data iliyosimbwa tu ambayo haiwezi kuifungua. Hata kama seva ingekuwa imeathiriwa, mshambuliaji asingetoa kitu cha manufaa.",
    },
    {
      question: "Sealed Sender ni nini?",
      answer: "Sealed Sender ina maana hata seva ya relay haijui ni nani aliyetuma ujumbe. Utambulisho wa mtumaji umesimbwa ndani ya bahasha ya ujumbe. Seva inaweza kutoa ujumbe kwa mpokeaji lakini haiwezi kuona ulitoka kwa nani. Hii inazuia uchambuzi wa metadata na mashambulizi ya uhusiano wa trafiki.",
    },
    {
      question: "Nini kitatokea nikipoteza simu yangu?",
      answer: "Data yako yote imehifadhiwa ndani ya kifaa chako. Ukipoteza simu yako na hukuunda nakala ya chelezo iliyosimbwa, data yako imepotea kabisa. Tunapendekeza kutumia kipengele cha nakala ya chelezo iliyosimbwa kulinda dhidi ya kupoteza kifaa. Nakala yako ya chelezo imesimbwa kwa funguo yako ya kibinafsi - hatuwezi kuifikia.",
    },
    {
      question: "Je, serikali zinaweza kufikia data yangu?",
      answer: "Hapana. Kwa sababu ya muundo wetu wa maarifa-sifuri, hatuna kitu cha kutoa kama jibu la maombi ya kisheria. Hatuwezi kufungua ujumbe wako. Hatujui unawasiliana na nani. Hatuhifadhi data yako kwenye seva zetu. Tutafuata michakato halali ya kisheria, lakini ukweli wa kiufundi ni kwamba hatuna kitu cha manufaa cha kukabidhi.",
    },
    {
      question: "Ni tabaka zipi za usalama katika SPEAQ?",
      answer: "SPEAQ ina tabaka 9 za usalama:\n\n1. Uficho + Mesh - Upinzani wa uchambuzi wa trafiki kupitia mtandao wa mesh na uficho wa data\n2. Sealed Sender - Seva haiwezi kuona nani aliyetuma ujumbe\n3. AES-256 + Double Ratchet - Usimbaji wa kiwango cha kijeshi wenye usiri wa mbele kwa kila ujumbe\n4. HMAC-SHA256 - Uthibitisho wa ujumbe kuzuia uharibifu\n5. Kyber-768 - Kubadilishana funguo za baada ya quantum kinachostahimili kompyuta za quantum\n6. QRNG - Uzalishaji wa nambari za nasibu za quantum kwa nasibu ya kweli\n7. ML-DSA-65 (FIPS 204) - Saini za kidijitali zinazostahimili quantum kwa miamala ya pochi\n8. SPHINCS+ (FIPS 205) - Saini zinazotegemea hash kwa kusaini vitalu vya blockchain\n9. Ukanushi wa kuaminika - Tabaka ya hazina iliyofichwa bila ushahidi wa kiufundi wa kuwepo",
    },
  ],
};

// ─── WALLET & Q-CREDITS ────────────────────────────────────────────────────────

const wallet: Record<Lang, FaqItem[]> = {
  en: [
    {
      question: "What are Q-Credits?",
      answer: "Q-Credits (QC) are SPEAQ's internal currency, pegged to gold: 1 QC = 0.01 gram of gold. This means the value of your Q-Credits is tied to real, physical gold - not to any government currency that can be printed or inflated. Maximum supply: 21,000,000 QC, fixed forever. Total gold backing: 210 kg.",
    },
    {
      question: "Why are Q-Credits backed by gold?",
      answer: "Gold has been a store of value for thousands of years. By pegging Q-Credits to gold, we protect users from inflation and currency manipulation. The gold peg is a floor, not a ceiling - if demand for QC exceeds supply, the price can rise above the gold peg. Early adopters benefit most from this scarcity-driven appreciation.",
    },
    {
      question: "How many Q-Credits will ever exist?",
      answer: "Maximum supply is 21,000,000 QC, enforced by code, not by policy. This is fixed forever, like Bitcoin. The smallest unit is 1 Spark = 0.00000001 QC (like Bitcoin's satoshi). If adoption grows, people simply use smaller units. The system scales infinitely.",
    },
    {
      question: "What is a Sovereign Wallet?",
      answer: "Your SPEAQ wallet is sovereign - it operates entirely on your device. Your private keys are generated locally and never leave your device. Not even SPEAQ can access them. No intermediary, no central authority, no backdoor. You have full control over your Q-Credits. No one can freeze, confiscate, or block your funds.",
    },
    {
      question: "What is ML-DSA-65 (FIPS 204)?",
      answer: "ML-DSA-65 is a NIST-approved post-quantum digital signature algorithm (FIPS 204). SPEAQ generates an ML-DSA-65 signing keypair on your device when you first open the wallet. This keypair is your sovereign on-chain identity. When you send Q-Credits, the transaction is signed with your personal quantum-resistant key and verified by the blockchain network. Even quantum computers cannot forge your signature.",
    },
    {
      question: "Can I send Q-Credits to other people?",
      answer: "Yes. You can send Q-Credits to any SPEAQ user by entering their SPEAQ ID. Transactions are peer-to-peer, signed with your ML-DSA-65 private key, and verified by the blockchain network. No bank, no intermediary, no approval needed. Transactions are typically confirmed within 30 seconds.",
    },
    {
      question: "How do on-chain transactions work?",
      answer: "When you send Q-Credits, your wallet creates a transaction signed with your ML-DSA-65 private key. This transaction is broadcast to the SPEAQ Chain network where validators verify the signature and check your balance. Once included in a block (every 30 seconds), the transaction is final and immutable. The entire process is quantum-resistant.",
    },
  ],
  nl: [
    {
      question: "Wat zijn Q-Credits?",
      answer: "Q-Credits (QC) zijn de interne valuta van SPEAQ, gekoppeld aan goud: 1 QC = 0,01 gram goud. Dit betekent dat de waarde van je Q-Credits gekoppeld is aan echt, fysiek goud - niet aan een overheidsvaluta die geprint of geinfleerd kan worden. Maximale voorraad: 21.000.000 QC, voor altijd vastgelegd. Totale gouddekking: 210 kg.",
    },
    {
      question: "Waarom zijn Q-Credits gedekt door goud?",
      answer: "Goud is al duizenden jaren een waardeopslag. Door Q-Credits aan goud te koppelen, beschermen we gebruikers tegen inflatie en valutamanipulatie. De goudkoppeling is een bodem, geen plafond - als de vraag naar QC het aanbod overstijgt, kan de prijs boven de goudkoppeling stijgen. Vroege gebruikers profiteren het meest van deze schaarste-gedreven waardevermeerdering.",
    },
    {
      question: "Hoeveel Q-Credits zullen er ooit bestaan?",
      answer: "De maximale voorraad is 21.000.000 QC, afgedwongen door code, niet door beleid. Dit is voor altijd vastgelegd, net als Bitcoin. De kleinste eenheid is 1 Spark = 0,00000001 QC (zoals Bitcoin's satoshi). Als adoptie groeit, gebruiken mensen simpelweg kleinere eenheden. Het systeem schaalt oneindig.",
    },
    {
      question: "Wat is een Soevereine Wallet?",
      answer: "Je SPEAQ-wallet is soeverein - hij werkt volledig op je apparaat. Je privesleutels worden lokaal gegenereerd en verlaten nooit je apparaat. Zelfs SPEAQ kan er niet bij. Geen tussenpersoon, geen centrale autoriteit, geen achterdeur. Je hebt volledige controle over je Q-Credits. Niemand kan je tegoeden bevriezen, in beslag nemen of blokkeren.",
    },
    {
      question: "Wat is ML-DSA-65 (FIPS 204)?",
      answer: "ML-DSA-65 is een door NIST goedgekeurd post-quantum digitaal handtekeningalgoritme (FIPS 204). SPEAQ genereert een ML-DSA-65 handtekeningsleutelpaar op je apparaat wanneer je de wallet voor het eerst opent. Dit sleutelpaar is je soevereine on-chain identiteit. Wanneer je Q-Credits verstuurt, wordt de transactie ondertekend met je persoonlijke kwantumbestendige sleutel en geverifieerd door het blockchain-netwerk. Zelfs kwantumcomputers kunnen je handtekening niet vervalsen.",
    },
    {
      question: "Kan ik Q-Credits naar andere mensen sturen?",
      answer: "Ja. Je kunt Q-Credits naar elke SPEAQ-gebruiker sturen door hun SPEAQ ID in te voeren. Transacties zijn peer-to-peer, ondertekend met je ML-DSA-65 privesleutel en geverifieerd door het blockchain-netwerk. Geen bank, geen tussenpersoon, geen goedkeuring nodig. Transacties worden doorgaans binnen 30 seconden bevestigd.",
    },
    {
      question: "Hoe werken on-chain transacties?",
      answer: "Wanneer je Q-Credits verstuurt, maakt je wallet een transactie aan die ondertekend is met je ML-DSA-65 privesleutel. Deze transactie wordt uitgezonden naar het SPEAQ Chain netwerk waar validators de handtekening verifieren en je saldo controleren. Eenmaal opgenomen in een blok (elke 30 seconden), is de transactie definitief en onveranderlijk. Het hele proces is kwantumbestendig.",
    },
  ],
  fr: [
    {
      question: "Que sont les Q-Credits ?",
      answer: "Les Q-Credits (QC) sont la monnaie interne de SPEAQ, indexee sur l'or : 1 QC = 0,01 gramme d'or. Cela signifie que la valeur de vos Q-Credits est liee a de l'or reel et physique - pas a une monnaie gouvernementale qui peut etre imprimee ou inflatee. Offre maximale : 21 000 000 QC, fixee pour toujours. Couverture totale en or : 210 kg.",
    },
    {
      question: "Pourquoi les Q-Credits sont-ils adosses a l'or ?",
      answer: "L'or est une reserve de valeur depuis des milliers d'annees. En indexant les Q-Credits sur l'or, nous protegeons les utilisateurs de l'inflation et de la manipulation monetaire. L'indexation sur l'or est un plancher, pas un plafond - si la demande de QC depasse l'offre, le prix peut monter au-dessus de l'indexation sur l'or. Les premiers adoptants beneficient le plus de cette appreciation liee a la rarete.",
    },
    {
      question: "Combien de Q-Credits existeront-ils jamais ?",
      answer: "L'offre maximale est de 21 000 000 QC, imposee par le code, pas par la politique. C'est fixe pour toujours, comme Bitcoin. La plus petite unite est 1 Spark = 0,00000001 QC (comme le satoshi de Bitcoin). Si l'adoption croit, les gens utilisent simplement des unites plus petites. Le systeme evolue a l'infini.",
    },
    {
      question: "Qu'est-ce qu'un portefeuille souverain ?",
      answer: "Votre portefeuille SPEAQ est souverain - il fonctionne entierement sur votre appareil. Vos cles privees sont generees localement et ne quittent jamais votre appareil. Meme SPEAQ ne peut pas y acceder. Pas d'intermediaire, pas d'autorite centrale, pas de porte derobee. Vous avez le controle total de vos Q-Credits. Personne ne peut geler, confisquer ou bloquer vos fonds.",
    },
    {
      question: "Qu'est-ce que ML-DSA-65 (FIPS 204) ?",
      answer: "ML-DSA-65 est un algorithme de signature numerique post-quantique approuve par le NIST (FIPS 204). SPEAQ genere une paire de cles de signature ML-DSA-65 sur votre appareil lorsque vous ouvrez le portefeuille pour la premiere fois. Cette paire de cles est votre identite souveraine sur la chaine. Lorsque vous envoyez des Q-Credits, la transaction est signee avec votre cle personnelle resistante aux quantiques et verifiee par le reseau blockchain. Meme les ordinateurs quantiques ne peuvent pas falsifier votre signature.",
    },
    {
      question: "Puis-je envoyer des Q-Credits a d'autres personnes ?",
      answer: "Oui. Vous pouvez envoyer des Q-Credits a n'importe quel utilisateur SPEAQ en saisissant son identifiant SPEAQ. Les transactions sont de pair a pair, signees avec votre cle privee ML-DSA-65 et verifiees par le reseau blockchain. Pas de banque, pas d'intermediaire, pas d'approbation necessaire. Les transactions sont generalement confirmees dans les 30 secondes.",
    },
    {
      question: "Comment fonctionnent les transactions sur la chaine ?",
      answer: "Lorsque vous envoyez des Q-Credits, votre portefeuille cree une transaction signee avec votre cle privee ML-DSA-65. Cette transaction est diffusee sur le reseau SPEAQ Chain ou les validateurs verifient la signature et controlent votre solde. Une fois incluse dans un bloc (toutes les 30 secondes), la transaction est finale et immuable. L'ensemble du processus est resistant aux quantiques.",
    },
  ],
  es: [
    {
      question: "Que son los Q-Credits?",
      answer: "Los Q-Credits (QC) son la moneda interna de SPEAQ, vinculada al oro: 1 QC = 0,01 gramos de oro. Esto significa que el valor de tus Q-Credits esta ligado a oro real y fisico - no a ninguna moneda gubernamental que pueda imprimirse o inflarse. Suministro maximo: 21.000.000 QC, fijo para siempre. Respaldo total en oro: 210 kg.",
    },
    {
      question: "Por que los Q-Credits estan respaldados por oro?",
      answer: "El oro ha sido una reserva de valor durante miles de anos. Al vincular los Q-Credits al oro, protegemos a los usuarios de la inflacion y la manipulacion monetaria. La vinculacion al oro es un piso, no un techo - si la demanda de QC supera la oferta, el precio puede subir por encima de la vinculacion al oro. Los primeros adoptantes se benefician mas de esta apreciacion impulsada por la escasez.",
    },
    {
      question: "Cuantos Q-Credits existiran alguna vez?",
      answer: "El suministro maximo es de 21.000.000 QC, impuesto por codigo, no por politica. Esto es fijo para siempre, como Bitcoin. La unidad mas pequena es 1 Spark = 0,00000001 QC (como el satoshi de Bitcoin). Si la adopcion crece, la gente simplemente usa unidades mas pequenas. El sistema escala infinitamente.",
    },
    {
      question: "Que es una billetera soberana?",
      answer: "Tu billetera SPEAQ es soberana - opera completamente en tu dispositivo. Tus claves privadas se generan localmente y nunca salen de tu dispositivo. Ni siquiera SPEAQ puede acceder a ellas. Sin intermediarios, sin autoridad central, sin puerta trasera. Tienes control total sobre tus Q-Credits. Nadie puede congelar, confiscar o bloquear tus fondos.",
    },
    {
      question: "Que es ML-DSA-65 (FIPS 204)?",
      answer: "ML-DSA-65 es un algoritmo de firma digital post-cuantico aprobado por NIST (FIPS 204). SPEAQ genera un par de claves de firma ML-DSA-65 en tu dispositivo cuando abres la billetera por primera vez. Este par de claves es tu identidad soberana en la cadena. Cuando envias Q-Credits, la transaccion se firma con tu clave personal resistente a cuanticas y es verificada por la red blockchain. Ni siquiera las computadoras cuanticas pueden falsificar tu firma.",
    },
    {
      question: "Puedo enviar Q-Credits a otras personas?",
      answer: "Si. Puedes enviar Q-Credits a cualquier usuario de SPEAQ ingresando su ID SPEAQ. Las transacciones son de persona a persona, firmadas con tu clave privada ML-DSA-65 y verificadas por la red blockchain. Sin banco, sin intermediario, sin aprobacion necesaria. Las transacciones se confirman generalmente en 30 segundos.",
    },
    {
      question: "Como funcionan las transacciones en la cadena?",
      answer: "Cuando envias Q-Credits, tu billetera crea una transaccion firmada con tu clave privada ML-DSA-65. Esta transaccion se transmite a la red SPEAQ Chain donde los validadores verifican la firma y comprueban tu saldo. Una vez incluida en un bloque (cada 30 segundos), la transaccion es final e inmutable. Todo el proceso es resistente a cuanticas.",
    },
  ],
  ru: [
    {
      question: "Chto takoe Q-Credits?",
      answer: "Q-Credits (QC) - eto vnutrennyaya valyuta SPEAQ, privyazannaya k zolotu: 1 QC = 0,01 gramma zolota. Eto oznachaet, chto stoimost vashikh Q-Credits privyazana k realnomu, fizicheskomu zolotu - ne k kakoy-libo gosudarstvennoy valyute, kotoruyu mozhno pechatat ili inflatirovat. Maksimalnoe predlozhenie: 21 000 000 QC, fiksirovano navsegda. Obshchee obespechenie zolotom: 210 kg.",
    },
    {
      question: "Pochemu Q-Credits obespecheny zolotom?",
      answer: "Zoloto bylo khranilishchem stoimosti tysyachi let. Privyazyvaya Q-Credits k zolotu, my zashchishchaem polzovateley ot inflyatsii i valyutnoy manipulyatsii. Privyazka k zolotu - eto pol, a ne potolok - yesli spros na QC prevysit predlozhenie, tsena mozhet vyrasti vyshe privyazki k zolotu. Rannie polzovateli poluchayut naibolshuyu vygodu ot etogo rosta, obuslovlennogo defitsitom.",
    },
    {
      question: "Skolko Q-Credits kogda-libo budet sushchestvovat?",
      answer: "Maksimalnoe predlozhenie sostavlyaet 21 000 000 QC, obespechennoe kodom, a ne politikoy. Eto fiksirovano navsegda, kak Bitcoin. Naimenshaya edinitsa - 1 Spark = 0,00000001 QC (kak satoshi u Bitcoin). Yesli prinyatie rastet, lyudi prosto ispolzuyut menshie edinitsy. Sistema masshtabiruetsya beskonechno.",
    },
    {
      question: "Chto takoe suverennyy koshelek?",
      answer: "Vash koshelek SPEAQ suveren - on rabotaet polnostyu na vashem ustroystve. Vashi privatnye klyuchi generiruyutsya lokalno i nikogda ne pokidayut vashe ustroystvo. Dazhe SPEAQ ne mozhet poluchit k nim dostup. Nikakikh posrednikov, nikakoy tsentralnoy vlasti, nikakikh zadnikh dverey. U vas polnyy kontrol nad vashimi Q-Credits. Nikto ne mozhet zamorozit, konfiskovat ili zablokirovat vashi sredstva.",
    },
    {
      question: "Chto takoe ML-DSA-65 (FIPS 204)?",
      answer: "ML-DSA-65 - eto odobrennyy NIST postkvantovyy algoritm tsifrovoy podpisi (FIPS 204). SPEAQ generiruet paru klyuchey podpisi ML-DSA-65 na vashem ustroystve, kogda vy vpervye otkryvaete koshelek. Eta para klyuchey - vasha suverennaya identichnost v blokcheyne. Kogda vy otpravlyaete Q-Credits, tranzaktsiya podpisyvaetsya vashim lichnym kvantovoustomchivym klyuchom i proveryaetsya setyu blokcheyna. Dazhe kvantovye kompyutery ne mogut poddelat vashu podpis.",
    },
    {
      question: "Mogu li ya otpravlyat Q-Credits drugim lyudyam?",
      answer: "Da. Vy mozhete otpravlyat Q-Credits lyubomu polzovatelyu SPEAQ, vvedya ikh SPEAQ ID. Tranzaktsii proiskhodyat napryamuyu, podpisyvayutsya vashim privatnym klyuchom ML-DSA-65 i proveryayutsya setyu blokcheyna. Bez banka, bez posrednika, bez odobreniya. Tranzaktsii obychno podtverzhdayutsya v techenie 30 sekund.",
    },
    {
      question: "Kak rabotayut tranzaktsii v blokcheyne?",
      answer: "Kogda vy otpravlyaete Q-Credits, vash koshelek sozdaet tranzaktsiyu, podpisannuyu vashim privatnym klyuchom ML-DSA-65. Eta tranzaktsiya translruetsya v set SPEAQ Chain, gde validatory proveryayut podpis i proveryayut vash balans. Posle vklyucheniya v blok (kazhdye 30 sekund) tranzaktsiya yavlyaetsya okonchatelnoy i neizmennoy. Ves protsess kvantovoustomchiv.",
    },
  ],
  de: [
    {
      question: "Was sind Q-Credits?",
      answer: "Q-Credits (QC) sind die interne Wahrung von SPEAQ, an Gold gebunden: 1 QC = 0,01 Gramm Gold. Das bedeutet, dass der Wert Ihrer Q-Credits an echtes, physisches Gold gebunden ist - nicht an eine Staatswahrung, die gedruckt oder inflationiert werden kann. Maximale Menge: 21.000.000 QC, fur immer festgelegt. Gesamte Golddeckung: 210 kg.",
    },
    {
      question: "Warum sind Q-Credits durch Gold gedeckt?",
      answer: "Gold ist seit Tausenden von Jahren ein Wertaufbewahrungsmittel. Durch die Bindung von Q-Credits an Gold schutzen wir Nutzer vor Inflation und Wahrungsmanipulation. Die Goldbindung ist ein Boden, keine Decke - wenn die Nachfrage nach QC das Angebot ubersteigt, kann der Preis uber die Goldbindung steigen. Fruhe Nutzer profitieren am meisten von dieser knappheitsgetriebenen Wertsteigerung.",
    },
    {
      question: "Wie viele Q-Credits wird es jemals geben?",
      answer: "Die maximale Menge betragt 21.000.000 QC, durchgesetzt durch Code, nicht durch Politik. Dies ist fur immer festgelegt, wie bei Bitcoin. Die kleinste Einheit ist 1 Spark = 0,00000001 QC (wie Bitcoins Satoshi). Wenn die Akzeptanz wachst, verwenden die Menschen einfach kleinere Einheiten. Das System skaliert unbegrenzt.",
    },
    {
      question: "Was ist eine souverane Wallet?",
      answer: "Ihre SPEAQ-Wallet ist souveran - sie arbeitet vollstandig auf Ihrem Gerat. Ihre privaten Schlussel werden lokal generiert und verlassen nie Ihr Gerat. Nicht einmal SPEAQ kann darauf zugreifen. Kein Vermittler, keine zentrale Behorde, keine Hintertur. Sie haben die volle Kontrolle uber Ihre Q-Credits. Niemand kann Ihre Mittel einfrieren, beschlagnahmen oder blockieren.",
    },
    {
      question: "Was ist ML-DSA-65 (FIPS 204)?",
      answer: "ML-DSA-65 ist ein von NIST genehmigter Post-Quanten-Algorithmus fur digitale Signaturen (FIPS 204). SPEAQ generiert ein ML-DSA-65 Signaturschlusselpaar auf Ihrem Gerat, wenn Sie die Wallet zum ersten Mal offnen. Dieses Schlusselpaar ist Ihre souverane On-Chain-Identitat. Wenn Sie Q-Credits senden, wird die Transaktion mit Ihrem personlichen quantenresistenten Schlussel signiert und vom Blockchain-Netzwerk verifiziert. Selbst Quantencomputer konnen Ihre Signatur nicht falschen.",
    },
    {
      question: "Kann ich Q-Credits an andere Personen senden?",
      answer: "Ja. Sie konnen Q-Credits an jeden SPEAQ-Nutzer senden, indem Sie dessen SPEAQ-ID eingeben. Transaktionen sind Peer-to-Peer, mit Ihrem privaten ML-DSA-65-Schlussel signiert und vom Blockchain-Netzwerk verifiziert. Keine Bank, kein Vermittler, keine Genehmigung erforderlich. Transaktionen werden typischerweise innerhalb von 30 Sekunden bestatigt.",
    },
    {
      question: "Wie funktionieren On-Chain-Transaktionen?",
      answer: "Wenn Sie Q-Credits senden, erstellt Ihre Wallet eine Transaktion, die mit Ihrem privaten ML-DSA-65-Schlussel signiert ist. Diese Transaktion wird an das SPEAQ Chain-Netzwerk gesendet, wo Validatoren die Signatur verifizieren und Ihren Kontostand prufen. Sobald sie in einem Block enthalten ist (alle 30 Sekunden), ist die Transaktion endgultig und unveranderlich. Der gesamte Prozess ist quantenresistent.",
    },
  ],
  sl: [
    {
      question: "Kaj so Q-Credits?",
      answer: "Q-Credits (QC) so notranja valuta SPEAQ, vezana na zlato: 1 QC = 0,01 grama zlata. To pomeni, da je vrednost vasih Q-Credits vezana na pravo, fizichno zlato - ne na nobeno vladno valuto, ki jo je mogoche tiskati ali inflirati. Najvechja zalogo: 21.000.000 QC, fiksirana za vedno. Skupna zlata podpora: 210 kg.",
    },
    {
      question: "Zakaj so Q-Credits podprti z zlatom?",
      answer: "Zlato je bilo sredstvo za shranjevanje vrednosti ze tisoche let. Z vezavo Q-Credits na zlato schitimo uporabnike pred inflacijo in valutno manipulacijo. Vezava na zlato je tla, ne strop - che povprasevanje po QC preseze ponudbo, se lahko cena dvigne nad vezavo na zlato. Zgodnji uporabniki imajo najvechjo korist od te s pomanjkanjem pogojene rasti vrednosti.",
    },
    {
      question: "Koliko Q-Credits bo kdaj obstajalo?",
      answer: "Najvechja zalogo je 21.000.000 QC, uveljavljena s kodo, ne s politiko. To je fiksno za vedno, kot Bitcoin. Najmanjsa enota je 1 Spark = 0,00000001 QC (kot Bitcoinov satoshi). Che prevzem raste, ljudje preprosto uporabljajo manjse enote. Sistem se neskochno razteza.",
    },
    {
      question: "Kaj je suverena denarnica?",
      answer: "Vasa SPEAQ denarnica je suverena - deluje povsem na vasi napravi. Vasi zasebni kljuchi se generirajo lokalno in nikoli ne zapustijo vase naprave. Niti SPEAQ ne more dostopati do njih. Brez posrednika, brez centralne oblasti, brez zadnjih vrat. Imate popoln nadzor nad svojimi Q-Credits. Nihche ne more zamrzniti, zaschi ali blokirati vasih sredstev.",
    },
    {
      question: "Kaj je ML-DSA-65 (FIPS 204)?",
      answer: "ML-DSA-65 je NIST-odobren postkvantni algoritem digitalnega podpisa (FIPS 204). SPEAQ generira par kljuchev za podpisovanje ML-DSA-65 na vasi napravi, ko prvicho odprete denarnico. Ta par kljuchev je vasa suverena identiteta na verigi. Ko posiljate Q-Credits, se transakcija podpise z vasim osebnim kvantno odpornim kljuchem in jo preveri omrezje verige blokov. Niti kvantni racunalniki ne morejo ponarediti vasega podpisa.",
    },
    {
      question: "Ali lahko posiljam Q-Credits drugim ljudem?",
      answer: "Da. Q-Credits lahko posiljate kateremukoli uporabniku SPEAQ, tako da vnesete njegov SPEAQ ID. Transakcije so neposredne, podpisane z vasim zasebnim kljuchem ML-DSA-65 in preverjene s strani omrezja verige blokov. Brez banke, brez posrednika, brez potrebnega dovoljenja. Transakcije so obichajno potrjene v 30 sekundah.",
    },
    {
      question: "Kako delujejo transakcije na verigi?",
      answer: "Ko posiljate Q-Credits, vasa denarnica ustvari transakcijo, podpisano z vasim zasebnim kljuchem ML-DSA-65. Ta transakcija se oddaja v omrezje SPEAQ Chain, kjer validatorji preverijo podpis in preverijo vase stanje. Ko je vkljuchena v blok (vsakih 30 sekund), je transakcija konchna in nespremenljiva. Celoten postopek je kvantno odporen.",
    },
  ],
  lg: [
    {
      question: "Q-Credits bye ki?",
      answer: "Q-Credits (QC) ye ssente za munda mu SPEAQ, ezisibiddwa ku zabu: 1 QC = 0.01 guraamu ya zabu. Kino kitegeeza nti omuwendo gwa Q-Credits zo gusibiddwa ku zabu eyamazima, eyagezebwa - si ku ssente za gavumenti eziyinza okumpibwa oba okubbulwa omuwendo. Obungi bw'okusinga: 21,000,000 QC, bukakasiddwa emirembe gyonna. Zabu yonna eyeziyizibwa: 210 kg.",
    },
    {
      question: "Lwaki Q-Credits zizimbiddwa ku zabu?",
      answer: "Zabu yabadde ekitereka eky'omuwendo okumala emyaka enkumi n'enkumi. Okusiba Q-Credits ku zabu, tukunuulira abakozesa okuva mu kubbulwa omuwendo n'okukyusakyusa ssente. Okusibwa ku zabu kwe wansi, si waggulu - singa okwagala QC kukira ekiweebwa, omuwendo guyinza okweyongera waggulu w'okusibwa ku zabu. Abasooka bakozesa basinga okuganyulwa mu kulinnya kuno okutwalibwa obukeekerezi.",
    },
    {
      question: "Q-Credits mmeka ezinaabaawo emirembe gyonna?",
      answer: "Obungi bw'okusinga bwe 21,000,000 QC, okukakasiziddwa koodi, si mateeka. Kino kikakasiddwa emirembe gyonna, nga Bitcoin. Ekitundu ekisinga obukeekerezi ye 1 Spark = 0.00000001 QC (nga satoshi ya Bitcoin). Singa okukozesebwa kukula, abantu bakozesa ebitundu ebitono. Sisitemu enjuunyuula mu ngeri etaterekerezeka.",
    },
    {
      question: "Sovereign Wallet kye ki?",
      answer: "Wallet yo eya SPEAQ ya bwannannyini - ekola yonna ku kifo kyo. Ebisumuluzo byo eby'ekyama bikola mu kifo kyo era tebivaamu. Ne SPEAQ teyinza kubifuna. Tewali mu makkati, tewali bw'obuyinza obukulembeddwa, tewali nnyiriri y'emabega. Olina obufuzi obujjuvu ku Q-Credits zo. Tewali ayinza okusitula, okutwala, oba okuziyiza ssente zo.",
    },
    {
      question: "ML-DSA-65 (FIPS 204) kye ki?",
      answer: "ML-DSA-65 ye algorithm y'okusayina ey'omu maaso ey'ekikwantimu ekakasiziddwa NIST (FIPS 204). SPEAQ ekola keypair y'okusayina eya ML-DSA-65 ku kifo kyo ng'oggula wallet omulundi ogusooka. Keypair eno ye bumanyirivu bwo obw'obwannannyini ku chain. Bw'otuma Q-Credits, transaction esayinibwa n'ekisumuluzo kyo eky'obwannannyini ekikwatagana ne kwantimu era ekakasizibwa omukutu gwa blockchain. Ne kkomppyuta z'ekikwantimu teziyinza kuvviira okusayina kwo.",
    },
    {
      question: "Nsobola okutuma Q-Credits eri abantu abalala?",
      answer: "Yee. Osobola okutuma Q-Credits eri buli akozesa SPEAQ ng'oyingiza SPEAQ ID yaabwe. Transactions ziri wakati wa bantu babiri, zisayiniddwa n'ekisumuluzo kyo eky'ekyama ekya ML-DSA-65, era zikakasizibwa omukutu gwa blockchain. Tewali banka, tewali mu makkati, tewali kukakasa kukyetagisa. Transactions zitera okukakasizibwa mu sekkendi 30.",
    },
    {
      question: "Transactions ku chain zikola ztya?",
      answer: "Bw'otuma Q-Credits, wallet yo ekola transaction esayiniddwa n'ekisumuluzo kyo eky'ekyama ekya ML-DSA-65. Transaction eno etumibwa ku mukutu gwa SPEAQ Chain nga validators bakakasa okusayina era bakebera balance yo. Bwe yangemebwa mu block (buli sekkendi 30), transaction eziyizibwa era tekyuusikibwa. Enkola yonna ekwatagana ne kkomppyuta z'ekikwantimu.",
    },
  ],
  sw: [
    {
      question: "Q-Credits ni nini?",
      answer: "Q-Credits (QC) ni sarafu ya ndani ya SPEAQ, iliyofungwa na dhahabu: 1 QC = 0.01 gramu ya dhahabu. Hii ina maana thamani ya Q-Credits zako imefungwa na dhahabu halisi - si sarafu yoyote ya serikali inayoweza kuchapishwa au kuongezwa mfumuko. Ugavi wa juu zaidi: 21,000,000 QC, umewekwa milele. Dhahabu yote ya msaada: 210 kg.",
    },
    {
      question: "Kwa nini Q-Credits zinategemezwa na dhahabu?",
      answer: "Dhahabu imekuwa hifadhi ya thamani kwa maelfu ya miaka. Kwa kufunga Q-Credits na dhahabu, tunalinda watumiaji kutokana na mfumuko wa bei na udanganyifu wa sarafu. Kifungo cha dhahabu ni sakafu, si dari - ikiwa mahitaji ya QC yanazidi ugavi, bei inaweza kupanda juu ya kifungo cha dhahabu. Watumiaji wa mapema wananufaika zaidi na kupanda kwa thamani kunakosababishwa na uhaba.",
    },
    {
      question: "Q-Credits ngapi zitakuwepo milele?",
      answer: "Ugavi wa juu ni 21,000,000 QC, unaotekelezwa na msimbo, si sera. Hii imewekwa milele, kama Bitcoin. Kitengo kidogo zaidi ni 1 Spark = 0.00000001 QC (kama satoshi ya Bitcoin). Ikiwa matumizi yanakua, watu wanatumia vitengo vidogo tu. Mfumo unakua bila kikomo.",
    },
    {
      question: "Pochi huru ni nini?",
      answer: "Pochi yako ya SPEAQ ni huru - inafanya kazi kabisa kwenye kifaa chako. Funguo zako za faragha zinatengenezwa ndani na hazitoki kwenye kifaa chako kamwe. Hata SPEAQ haiwezi kuzifikia. Hakuna mpatanishi, hakuna mamlaka kuu, hakuna mlango wa nyuma. Una udhibiti kamili wa Q-Credits zako. Hakuna mtu anayeweza kufungia, kunyang'anya, au kuzuia fedha zako.",
    },
    {
      question: "ML-DSA-65 (FIPS 204) ni nini?",
      answer: "ML-DSA-65 ni algoriti ya saini ya kidijitali ya baada ya quantum iliyoidhinishwa na NIST (FIPS 204). SPEAQ inatengeneza jozi ya funguo za kusaini za ML-DSA-65 kwenye kifaa chako unapofungua pochi kwa mara ya kwanza. Jozi hii ya funguo ni utambulisho wako huru kwenye mnyororo. Unapotuma Q-Credits, muamala unasainiwa na funguo yako ya kibinafsi inayostahimili quantum na kuthibitishwa na mtandao wa blockchain. Hata kompyuta za quantum haziwezi kughushi saini yako.",
    },
    {
      question: "Je, ninaweza kutuma Q-Credits kwa watu wengine?",
      answer: "Ndiyo. Unaweza kutuma Q-Credits kwa mtumiaji yeyote wa SPEAQ kwa kuingiza SPEAQ ID yao. Miamala ni ya mtu kwa mtu, imesainiwa na funguo yako ya faragha ya ML-DSA-65, na kuthibitishwa na mtandao wa blockchain. Hakuna benki, hakuna mpatanishi, hakuna idhini inayohitajika. Miamala kawaida inathibitishwa ndani ya sekunde 30.",
    },
    {
      question: "Miamala kwenye mnyororo inafanyaje kazi?",
      answer: "Unapotuma Q-Credits, pochi yako inaunda muamala uliosainiwa na funguo yako ya faragha ya ML-DSA-65. Muamala huu unatangazwa kwenye mtandao wa SPEAQ Chain ambapo wathibitishaji wanathibitisha saini na kuangalia salio lako. Baada ya kuingizwa katika kitalu (kila sekunde 30), muamala ni wa mwisho na hauwezi kubadilishwa. Mchakato wote unastahimili quantum.",
    },
  ],
};

// ─── MINING ─────────────────────────────────────────────────────────────────────

const mining: Record<Lang, FaqItem[]> = {
  en: [
    {
      question: "What is Proof of Contribution?",
      answer: "Proof of Contribution is SPEAQ's mining mechanism. Instead of wasting electricity solving mathematical puzzles (like Bitcoin), you earn Q-Credits by contributing useful work to the network: relaying messages, validating transactions, storing encrypted data, translating the app, onboarding new users, and more.",
    },
    {
      question: "How is this different from Bitcoin mining?",
      answer: "Bitcoin mining requires expensive hardware and enormous amounts of electricity to solve meaningless mathematical puzzles. SPEAQ mining runs on your phone and rewards you for doing useful work that strengthens the network. No special hardware needed. No electricity wasted. Your contribution has real value.",
    },
    {
      question: "How much can I earn?",
      answer: "Current mining rewards are approximately 0.02 to 0.05 QC per day (equivalent to 0.02 to 0.05 grams of gold). In many countries, this represents significant income. Early miners earn more before halving events reduce rewards. The earlier you start, the more you accumulate.",
    },
    {
      question: "What are the 7 ways to mine?",
      answer: "1. Relay Mining - relay encrypted messages through the network\n2. Mesh Mining - act as a Bluetooth/WiFi mesh node for offline connectivity\n3. Bridge Mining - serve as a cash-to-QC exchange agent in your community\n4. Validation Mining - validate transaction proofs on the blockchain\n5. Storage Mining - store encrypted data fragments for the network\n6. Translation Mining - translate the app into new languages\n7. Onboarding Mining - bring new active users to the network",
    },
    {
      question: "What is halving?",
      answer: "Every 2,100,000 QC mined by the network, mining rewards are cut in half. This creates increasing scarcity and protects the value of existing Q-Credits. The system supports approximately 960 miners initially, decreasing with each halving. Total mining timeline: 40+ years before all 21 million QC are mined. Early miners earn the most.",
    },
    {
      question: "What is C+ signed mining?",
      answer: "Before the SPEAQ Chain blockchain launches, all mining happens locally on your device. Every mining reward is double-signed: (1) you sign with your private key, proving your identity, and (2) the relay server co-signs as a witness, proving the work actually happened. Both signatures are stored in your mining ledger. When the blockchain launches, only entries with both signatures are accepted. This makes fraud impossible - you cannot fake the relay's signature, and the relay only signs when you actually contribute.",
    },
  ],
  nl: [
    {
      question: "Wat is Proof of Contribution?",
      answer: "Proof of Contribution is het miningmechanisme van SPEAQ. In plaats van elektriciteit te verspillen aan het oplossen van wiskundige puzzels (zoals Bitcoin), verdien je Q-Credits door nuttig werk bij te dragen aan het netwerk: berichten doorsturen, transacties valideren, versleutelde data opslaan, de app vertalen, nieuwe gebruikers verwelkomen en meer.",
    },
    {
      question: "Hoe verschilt dit van Bitcoin mining?",
      answer: "Bitcoin mining vereist dure hardware en enorme hoeveelheden elektriciteit om zinloze wiskundige puzzels op te lossen. SPEAQ mining draait op je telefoon en beloont je voor nuttig werk dat het netwerk versterkt. Geen speciale hardware nodig. Geen elektriciteit verspild. Jouw bijdrage heeft echte waarde.",
    },
    {
      question: "Hoeveel kan ik verdienen?",
      answer: "Huidige miningbeloningen zijn ongeveer 0,02 tot 0,05 QC per dag (equivalent aan 0,02 tot 0,05 gram goud). In veel landen is dit een aanzienlijk inkomen. Vroege miners verdienen meer voordat halveringsgebeurtenissen de beloningen verminderen. Hoe eerder je begint, hoe meer je opbouwt.",
    },
    {
      question: "Wat zijn de 7 manieren om te minen?",
      answer: "1. Relay Mining - versleutelde berichten doorsturen via het netwerk\n2. Mesh Mining - optreden als Bluetooth/WiFi mesh-knooppunt voor offline connectiviteit\n3. Bridge Mining - dienen als contant-naar-QC wisselagent in je gemeenschap\n4. Validation Mining - transactiebewijzen valideren op de blockchain\n5. Storage Mining - versleutelde datafragmenten opslaan voor het netwerk\n6. Translation Mining - de app vertalen naar nieuwe talen\n7. Onboarding Mining - nieuwe actieve gebruikers naar het netwerk brengen",
    },
    {
      question: "Wat is halvering?",
      answer: "Elke 2.100.000 QC die door het netwerk worden gemined, worden de miningbeloningen gehalveerd. Dit creiert toenemende schaarste en beschermt de waarde van bestaande Q-Credits. Het systeem ondersteunt aanvankelijk ongeveer 960 miners, afnemend bij elke halvering. Totale miningtijdlijn: 40+ jaar voordat alle 21 miljoen QC zijn gemined. Vroege miners verdienen het meest.",
    },
    {
      question: "Wat is C+ ondertekende mining?",
      answer: "Voordat de SPEAQ Chain blockchain wordt gelanceerd, vindt alle mining lokaal op je apparaat plaats. Elke miningbeloning wordt dubbel ondertekend: (1) jij ondertekent met je privesleutel, wat je identiteit bewijst, en (2) de relay-server mede-ondertekent als getuige, wat bewijst dat het werk daadwerkelijk heeft plaatsgevonden. Beide handtekeningen worden opgeslagen in je mining-grootboek. Wanneer de blockchain wordt gelanceerd, worden alleen items met beide handtekeningen geaccepteerd. Dit maakt fraude onmogelijk - je kunt de handtekening van de relay niet vervalsen, en de relay ondertekent alleen wanneer je daadwerkelijk bijdraagt.",
    },
  ],
  fr: [
    {
      question: "Qu'est-ce que la Preuve de Contribution ?",
      answer: "La Preuve de Contribution est le mecanisme de minage de SPEAQ. Au lieu de gaspiller de l'electricite a resoudre des puzzles mathematiques (comme Bitcoin), vous gagnez des Q-Credits en contribuant un travail utile au reseau : relayer des messages, valider des transactions, stocker des donnees chiffrees, traduire l'application, accueillir de nouveaux utilisateurs, et plus encore.",
    },
    {
      question: "En quoi est-ce different du minage de Bitcoin ?",
      answer: "Le minage de Bitcoin necessite du materiel couteux et d'enormes quantites d'electricite pour resoudre des puzzles mathematiques inutiles. Le minage SPEAQ fonctionne sur votre telephone et vous recompense pour un travail utile qui renforce le reseau. Pas de materiel special necessaire. Pas d'electricite gaspillee. Votre contribution a une valeur reelle.",
    },
    {
      question: "Combien puis-je gagner ?",
      answer: "Les recompenses de minage actuelles sont d'environ 0,02 a 0,05 QC par jour (equivalent a 0,02 a 0,05 gramme d'or). Dans de nombreux pays, cela represente un revenu significatif. Les mineurs precoces gagnent davantage avant que les evenements de division par deux ne reduisent les recompenses. Plus vous commencez tot, plus vous accumulez.",
    },
    {
      question: "Quelles sont les 7 facons de miner ?",
      answer: "1. Relay Mining - relayer des messages chiffres a travers le reseau\n2. Mesh Mining - agir comme noeud mesh Bluetooth/WiFi pour la connectivite hors ligne\n3. Bridge Mining - servir d'agent d'echange especes-QC dans votre communaute\n4. Validation Mining - valider les preuves de transaction sur la blockchain\n5. Storage Mining - stocker des fragments de donnees chiffrees pour le reseau\n6. Translation Mining - traduire l'application dans de nouvelles langues\n7. Onboarding Mining - amener de nouveaux utilisateurs actifs sur le reseau",
    },
    {
      question: "Qu'est-ce que le halving ?",
      answer: "Tous les 2 100 000 QC mines par le reseau, les recompenses de minage sont divisees par deux. Cela cree une rarete croissante et protege la valeur des Q-Credits existants. Le systeme prend en charge environ 960 mineurs initialement, diminuant a chaque halving. Calendrier total de minage : plus de 40 ans avant que les 21 millions de QC soient mines. Les mineurs precoces gagnent le plus.",
    },
    {
      question: "Qu'est-ce que le minage signe C+ ?",
      answer: "Avant le lancement de la blockchain SPEAQ Chain, tout le minage se fait localement sur votre appareil. Chaque recompense de minage est doublement signee : (1) vous signez avec votre cle privee, prouvant votre identite, et (2) le serveur relais cosigne en tant que temoin, prouvant que le travail a reellement eu lieu. Les deux signatures sont stockees dans votre registre de minage. Lors du lancement de la blockchain, seules les entrees avec les deux signatures sont acceptees. Cela rend la fraude impossible - vous ne pouvez pas falsifier la signature du relais, et le relais ne signe que lorsque vous contribuez reellement.",
    },
  ],
  es: [
    {
      question: "Que es la Prueba de Contribucion?",
      answer: "La Prueba de Contribucion es el mecanismo de mineria de SPEAQ. En lugar de desperdiciar electricidad resolviendo rompecabezas matematicos (como Bitcoin), ganas Q-Credits contribuyendo trabajo util a la red: retransmitiendo mensajes, validando transacciones, almacenando datos cifrados, traduciendo la aplicacion, incorporando nuevos usuarios y mas.",
    },
    {
      question: "En que se diferencia de la mineria de Bitcoin?",
      answer: "La mineria de Bitcoin requiere hardware costoso y enormes cantidades de electricidad para resolver rompecabezas matematicos sin sentido. La mineria de SPEAQ funciona en tu telefono y te recompensa por hacer trabajo util que fortalece la red. No se necesita hardware especial. No se desperdicia electricidad. Tu contribucion tiene valor real.",
    },
    {
      question: "Cuanto puedo ganar?",
      answer: "Las recompensas de mineria actuales son aproximadamente de 0,02 a 0,05 QC por dia (equivalente a 0,02 a 0,05 gramos de oro). En muchos paises, esto representa un ingreso significativo. Los mineros tempranos ganan mas antes de que los eventos de reduccion a la mitad reduzcan las recompensas. Cuanto antes empieces, mas acumulas.",
    },
    {
      question: "Cuales son las 7 formas de minar?",
      answer: "1. Relay Mining - retransmitir mensajes cifrados a traves de la red\n2. Mesh Mining - actuar como nodo mesh Bluetooth/WiFi para conectividad sin internet\n3. Bridge Mining - servir como agente de intercambio de efectivo a QC en tu comunidad\n4. Validation Mining - validar pruebas de transacciones en la blockchain\n5. Storage Mining - almacenar fragmentos de datos cifrados para la red\n6. Translation Mining - traducir la aplicacion a nuevos idiomas\n7. Onboarding Mining - traer nuevos usuarios activos a la red",
    },
    {
      question: "Que es el halving?",
      answer: "Cada 2.100.000 QC minados por la red, las recompensas de mineria se reducen a la mitad. Esto crea una escasez creciente y protege el valor de los Q-Credits existentes. El sistema soporta aproximadamente 960 mineros inicialmente, disminuyendo con cada halving. Linea de tiempo total de mineria: mas de 40 anos antes de que todos los 21 millones de QC sean minados. Los mineros tempranos ganan mas.",
    },
    {
      question: "Que es la mineria firmada C+?",
      answer: "Antes del lanzamiento de la blockchain SPEAQ Chain, toda la mineria ocurre localmente en tu dispositivo. Cada recompensa de mineria tiene doble firma: (1) tu firmas con tu clave privada, demostrando tu identidad, y (2) el servidor de retransmision cofirma como testigo, demostrando que el trabajo realmente ocurrio. Ambas firmas se almacenan en tu libro de mineria. Cuando se lance la blockchain, solo se aceptan las entradas con ambas firmas. Esto hace imposible el fraude - no puedes falsificar la firma del relay, y el relay solo firma cuando realmente contribuyes.",
    },
  ],
  ru: [
    {
      question: "Chto takoe Proof of Contribution?",
      answer: "Proof of Contribution - eto mekhanizm mayninga SPEAQ. Vmesto togo chtoby tratit elektrichestvo na reshenie matematicheskikh golovolomok (kak Bitcoin), vy zarabatyvaete Q-Credits, vnoskya poleznyy vklad v set: retranslyatsiya soobshcheniy, validatsiya tranzaktsiy, khranenie zashifrovannykh dannykh, perevod prilozheniya, privlechenie novykh polzovateley i mnogoe drugoe.",
    },
    {
      question: "Chem eto otlichaetsya ot mayninga Bitcoin?",
      answer: "Mayning Bitcoin trebuet dorogogo oborudovaniya i ogromnoye kolichestvo elektrichestva dlya resheniya bessyslennykh matematicheskikh golovolomok. Mayning SPEAQ rabotaet na vashem telefone i voznagrazhdat vas za poleznuyu rabotu, kotoraya ukreplyaet set. Nikakogo spetsialnogo oborudovaniya ne trebuetsya. Nikakogo rastrachivaniya elektrichestva. Vash vklad imeet realnuyu tsennost.",
    },
    {
      question: "Skolko ya mogu zarabotat?",
      answer: "Tekushchie nagrady za mayning sostavlyayut priblizitelno ot 0,02 do 0,05 QC v den (ekvivalent ot 0,02 do 0,05 gramma zolota). Vo mnogikh stranakh eto predstavlyaet znachitelnyy dokhod. Rannie maynery zarabatyvayut bolshe do togo, kak sobytiya khalvinga umenshat nagrady. Chem ranshe vy nachnyote, tem bolshe vy nakopite.",
    },
    {
      question: "Kakiye 7 sposobov mayninga sushchestvuyut?",
      answer: "1. Relay Mining - retranslyatsiya zashifrovannykh soobshcheniy cherez set\n2. Mesh Mining - rabota v kachestve uzla Bluetooth/WiFi mesh dlya oflayn-svyazi\n3. Bridge Mining - rabota v kachestve agenta po obmenu nalichnykh na QC v vashem soobshchestve\n4. Validation Mining - validatsiya dokazatelstv tranzaktsiy v blokcheyne\n5. Storage Mining - khranenie fragmentov zashifrovannykh dannykh dlya seti\n6. Translation Mining - perevod prilozheniya na novye yazyki\n7. Onboarding Mining - privlechenie novykh aktivnykh polzovateley v set",
    },
    {
      question: "Chto takoe khalving?",
      answer: "Kazhdye 2 100 000 QC, dobytyye setyu, nagrady za mayning sokratshchayutsya vdvoe. Eto sozdaet rastuschiy defitsit i zaschischaet stoimost suschestvuyuschikh Q-Credits. Sistema podderzhet priblizitelno 960 maynerov izachalno, umenshayas s kazhdym khalvingom. Obschiy srok mayninga: 40+ let do togo, kak vse 21 million QC budut dobyty. Rannie maynery zarabatyvayut bolshe vsego.",
    },
    {
      question: "Chto takoe C+ podpisannyy mayning?",
      answer: "Do zapuska blokcheyna SPEAQ Chain ves mayning proiskhodit lokalno na vashem ustroystve. Kazhdaya nagrada za mayning podpisyvaetsya dvazhdy: (1) vy podpisyvaete svoim privatnym klyuchom, podtvershdaya svoyu lichnost, i (2) server-retranslyator soobrazno podpisyvaet kak svidetel, podtvershdaya, chto rabota deystvitelno byla vypolnena. Obe podpisi khranyatsya v vashem mayningovom zhurnale. Kogda blokcheyn zapustitsya, prinimsyutsya tolko zapisi s obieimi podpisyami. Eto delaet moshennichestvo nevozmoshnym - vy ne mozhete poddelat podpis retranslyatora, a retranslyator podpisyvaet tolko togda, kogda vy deystvitelno vnosite vklad.",
    },
  ],
  de: [
    {
      question: "Was ist Proof of Contribution?",
      answer: "Proof of Contribution ist der Mining-Mechanismus von SPEAQ. Anstatt Strom zu verschwenden, um mathematische Ratsel zu losen (wie Bitcoin), verdienen Sie Q-Credits, indem Sie nutzliche Arbeit zum Netzwerk beitragen: Nachrichten weiterleiten, Transaktionen validieren, verschlusselte Daten speichern, die App ubersetzen, neue Nutzer einbinden und mehr.",
    },
    {
      question: "Wie unterscheidet sich das vom Bitcoin-Mining?",
      answer: "Bitcoin-Mining erfordert teure Hardware und enorme Mengen an Strom, um sinnlose mathematische Ratsel zu losen. SPEAQ-Mining lauft auf Ihrem Telefon und belohnt Sie fur nutzliche Arbeit, die das Netzwerk starkt. Keine spezielle Hardware erforderlich. Kein Strom verschwendet. Ihr Beitrag hat echten Wert.",
    },
    {
      question: "Wie viel kann ich verdienen?",
      answer: "Aktuelle Mining-Belohnungen betragen ungefahr 0,02 bis 0,05 QC pro Tag (entspricht 0,02 bis 0,05 Gramm Gold). In vielen Landern stellt dies ein bedeutendes Einkommen dar. Fruhe Miner verdienen mehr, bevor Halbierungsereignisse die Belohnungen reduzieren. Je fruher Sie beginnen, desto mehr sammeln Sie an.",
    },
    {
      question: "Was sind die 7 Moglichkeiten zu minen?",
      answer: "1. Relay Mining - verschlusselte Nachrichten durch das Netzwerk weiterleiten\n2. Mesh Mining - als Bluetooth/WiFi-Mesh-Knoten fur Offline-Konnektivitat fungieren\n3. Bridge Mining - als Bargeld-zu-QC-Tauschagentur in Ihrer Gemeinde dienen\n4. Validation Mining - Transaktionsnachweise auf der Blockchain validieren\n5. Storage Mining - verschlusselte Datenfragmente fur das Netzwerk speichern\n6. Translation Mining - die App in neue Sprachen ubersetzen\n7. Onboarding Mining - neue aktive Nutzer ins Netzwerk bringen",
    },
    {
      question: "Was ist Halving?",
      answer: "Alle 2.100.000 QC, die vom Netzwerk gemined werden, werden die Mining-Belohnungen halbiert. Dies schafft zunehmende Knappheit und schutzt den Wert bestehender Q-Credits. Das System unterstutzt anfanglich etwa 960 Miner, abnehmend mit jedem Halving. Gesamte Mining-Zeitlinie: uber 40 Jahre, bevor alle 21 Millionen QC gemined sind. Fruhe Miner verdienen am meisten.",
    },
    {
      question: "Was ist C+ signiertes Mining?",
      answer: "Vor dem Start der SPEAQ Chain Blockchain findet alles Mining lokal auf Ihrem Gerat statt. Jede Mining-Belohnung wird doppelt signiert: (1) Sie signieren mit Ihrem privaten Schlussel, was Ihre Identitat beweist, und (2) der Relay-Server mit-signiert als Zeuge, was beweist, dass die Arbeit tatsachlich stattgefunden hat. Beide Signaturen werden in Ihrem Mining-Hauptbuch gespeichert. Beim Start der Blockchain werden nur Eintrage mit beiden Signaturen akzeptiert. Das macht Betrug unmoglich - Sie konnen die Signatur des Relays nicht falschen, und das Relay signiert nur, wenn Sie tatsachlich beitragen.",
    },
  ],
  sl: [
    {
      question: "Kaj je Dokaz prispevka?",
      answer: "Dokaz prispevka je mehanizem rudarjenja SPEAQ. Namesto troshenja elektrike za reshevanje matematichnih ugank (kot Bitcoin), zasluzite Q-Credits s prispevanjem koristnega dela omrezju: posredovanje sporocil, potrjevanje transakcij, shranjevanje shifriranih podatkov, prevajanje aplikacije, vkljuchevanje novih uporabnikov in vech.",
    },
    {
      question: "Kako se to razlikuje od rudarjenja Bitcoin?",
      answer: "Rudarjenje Bitcoin zahteva drago opremo in ogromne kolichine elektrike za reshevanje nesmiselnih matematichnih ugank. Rudarjenje SPEAQ deluje na vashem telefonu in vas nagrajuje za koristno delo, ki krepini omrezje. Brez posebne opreme. Brez zapravljene elektrike. Vas prispevek ima resnichno vrednost.",
    },
    {
      question: "Koliko lahko zasluzim?",
      answer: "Trenutne nagrade za rudarjenje so priblizno 0,02 do 0,05 QC na dan (kar ustreza 0,02 do 0,05 grama zlata). V mnogih drzavah to predstavlja znaten prihodek. Zgodnji rudarji zasluzijo vech, preden dogodki razpolovitve zmanjshajo nagrade. Prej ko zachnete, vech nakopichite.",
    },
    {
      question: "Katerih 7 nachinov rudarjenja obstaja?",
      answer: "1. Relay Mining - posredovanje shifriranih sporocil prek omrezja\n2. Mesh Mining - delovanje kot Bluetooth/WiFi mesh vozhliche za povezljivost brez spleta\n3. Bridge Mining - delovanje kot agent za zamenjavo gotovine v QC v vashi skupnosti\n4. Validation Mining - potrjevanje dokazov transakcij na verigi blokov\n5. Storage Mining - shranjevanje shifriranih podatkovnih fragmentov za omrezje\n6. Translation Mining - prevajanje aplikacije v nove jezike\n7. Onboarding Mining - pripeljite nove aktivne uporabnike v omrezje",
    },
    {
      question: "Kaj je razpolovitev?",
      answer: "Vsakih 2.100.000 QC, ki jih omrezje izrudari, se nagrade za rudarjenje prepolovijo. To ustvarja naraschajoco redkost in schiti vrednost obstojecih Q-Credits. Sistem podpira priblizno 960 rudarjev na zachetku, ki se zmanjshuje z vsako razpolovitvijo. Skupna chasovnica rudarjenja: vech kot 40 let, preden je vseh 21 milijonov QC izrudarjenih. Zgodnji rudarji zasluzijo najvech.",
    },
    {
      question: "Kaj je C+ podpisano rudarjenje?",
      answer: "Pred zagonom verige blokov SPEAQ Chain se vse rudarjenje izvaja lokalno na vasi napravi. Vsaka nagrada za rudarjenje je dvojno podpisana: (1) vi podpishete s svojim zasebnim kljuchem, kar dokazuje vasho identiteto, in (2) posredovalni streznik sopodpishe kot pricha, kar dokazuje, da se je delo dejansko zgodilo. Oba podpisa sta shranjena v vasem rudarskem dnevniku. Ko se veriga blokov zagene, so sprejeti samo vnosi z obema podpisoma. To onemogocha goljufijo - ne morete ponarediti podpisa posredovalnika, posrednik pa podpishe samo, ko dejansko prispevate.",
    },
  ],
  lg: [
    {
      question: "Proof of Contribution kye ki?",
      answer: "Proof of Contribution ye nkola y'okusimba eya SPEAQ. Mu kifo ky'okusaanyawo amasannyalaze ng'osolvinga puzzles za mathematiki (nga Bitcoin), ofuna Q-Credits ng'oteekayo omulimu ogugasa ku mukutu: okuserengesa obubaka, okukakasa transactions, okutereka data enziyize, okuvvuunula appu, okuleeta abakozesa abapya, n'ebirala.",
    },
    {
      question: "Kino kyawukana kitya ku kusimba kwa Bitcoin?",
      answer: "Okusimba kwa Bitcoin kyetaaga ebyuma eby'obbeeyi n'amasannyalaze amangi ennyo okusolvinga puzzles za mathematiki ezitalina makulu. Okusimba kwa SPEAQ kukola ku ssimu yo era kukuwa empeera olw'okukola omulimu ogugasa oguzzaawo omukutu. Tewali byuma byenjawulo bikyetagisa. Tewali masannyalaze gasaanyizibwa. Ky'oteeka kirina omuwendo ogw'amazima.",
    },
    {
      question: "Nsobola kufuna mmeka?",
      answer: "Empeera z'okusimba ez'omu kiseera kino ziri wakati wa 0.02 okutuuka ku 0.05 QC olunaku (ekigerannyisibwa na 0.02 okutuuka ku 0.05 guraamu za zabu). Mu nsi nnyingi, kino kisigamizira ennyingiza ey'omugaso. Abasimba abasooka bafuna ennyo ng'ebifo by'okugabanyaamu ebitannatuuka. Bw'osooka mangu, bw'otereka ennyo.",
    },
    {
      question: "Engeri 7 ez'okusimba ziri ki?",
      answer: "1. Relay Mining - okuserengesa obubaka obuziyize mu mukutu\n2. Mesh Mining - okukola nga node ya Bluetooth/WiFi mesh olw'okuyungibwa awatali internet\n3. Bridge Mining - okukola ng'omukozi w'okukyusa ssente eza mu ngalo mu QC mu kitundu kyo\n4. Validation Mining - okukakasa ebikakasibwa by'entunda ku blockchain\n5. Storage Mining - okutereka ebitundu by'adata enziyize ku mukutu\n6. Translation Mining - okuvvuunula appu mu nnimi empya\n7. Onboarding Mining - okuleeta abakozesa abapya abakola ku mukutu",
    },
    {
      question: "Halving kye ki?",
      answer: "Buli 2,100,000 QC ezisimbiddwa omukutu, empeera z'okusimba zigabanyizibwa mu bibiri. Kino kitonda obukeekerezi obweyongera era kikunuulira omuwendo gwa Q-Credits eziriwo. Sisitemu ewagira abasimba nga 960 mu ntandikwa, okukendeeranga buli halving. Obudde bwonna obw'okusimba: emyaka 40+ ng'a Q-Credits zonna 21 million tezinnasimbwa. Abasimba abasooka basinga okufuna.",
    },
    {
      question: "C+ signed mining kye ki?",
      answer: "Ng'a blockchain ya SPEAQ Chain tennalondebwa, okusimba kwonna kukola ku kifo kyo. Buli mpeera y'okusimba esayinibwa emirundi ebiri: (1) ggwe osayina n'ekisumuluzo kyo eky'ekyama, ng'okakasa obumanyirivu bwo, era (2) seva erabira esayina wamu ng'omujulizi, ng'ekakasa nti omulimu gwakolebwa ddala. Okusayina kwombi kuterekebbwa mu ledger yo ey'okusimba. Blockchain bw'enaatandika, entries ezilina okusayina kwombi byokka ze zenzikirizebbwa. Kino kisalako obulimba - toyinza kulyasemba okusayina kwa relay, era relay esayina bw'okoze ddala.",
    },
  ],
  sw: [
    {
      question: "Uthibitisho wa Mchango ni nini?",
      answer: "Uthibitisho wa Mchango ni utaratibu wa uchimbaji wa SPEAQ. Badala ya kupoteza umeme kutatua mafumbo ya hesabu (kama Bitcoin), unapata Q-Credits kwa kuchangia kazi muhimu kwa mtandao: kusambaza ujumbe, kuthibitisha miamala, kuhifadhi data iliyosimbwa, kutafsiri programu, kuingiza watumiaji wapya, na zaidi.",
    },
    {
      question: "Hii inatofautiana vipi na uchimbaji wa Bitcoin?",
      answer: "Uchimbaji wa Bitcoin unahitaji vifaa vya gharama kubwa na kiasi kikubwa cha umeme kutatua mafumbo ya hesabu yasiyo na maana. Uchimbaji wa SPEAQ unafanya kazi kwenye simu yako na unakuthawabisha kwa kufanya kazi muhimu inayoimarisha mtandao. Hakuna vifaa maalum vinavyohitajika. Hakuna umeme unaopotezwa. Mchango wako una thamani halisi.",
    },
    {
      question: "Ninaweza kupata kiasi gani?",
      answer: "Zawadi za sasa za uchimbaji ni takriban 0.02 hadi 0.05 QC kwa siku (sawa na 0.02 hadi 0.05 gramu za dhahabu). Katika nchi nyingi, hii inawakilisha mapato muhimu. Wachimbaji wa mapema wanapata zaidi kabla ya matukio ya kugawanya kupunguza zawadi. Kadri unavyoanza mapema, ndivyo unavyokusanya zaidi.",
    },
    {
      question: "Njia 7 za kuchimba ni zipi?",
      answer: "1. Relay Mining - kusambaza ujumbe uliosimbwa kupitia mtandao\n2. Mesh Mining - kufanya kazi kama nodi ya Bluetooth/WiFi mesh kwa muunganisho nje ya mtandao\n3. Bridge Mining - kufanya kazi kama wakala wa kubadilisha pesa taslimu kuwa QC katika jamii yako\n4. Validation Mining - kuthibitisha uthibitisho wa miamala kwenye blockchain\n5. Storage Mining - kuhifadhi vipande vya data vilivyosimbwa kwa mtandao\n6. Translation Mining - kutafsiri programu katika lugha mpya\n7. Onboarding Mining - kuleta watumiaji wapya hai kwenye mtandao",
    },
    {
      question: "Kugawanya ni nini?",
      answer: "Kila QC 2,100,000 zinazochimbwa na mtandao, zawadi za uchimbaji zinapunguzwa kwa nusu. Hii inaunda uhaba unaongezeka na kulinda thamani ya Q-Credits zilizopo. Mfumo unasaidia takriban wachimbaji 960 mwanzoni, ukipungua na kila kugawanya. Muda wa jumla wa uchimbaji: miaka 40+ kabla ya QC milioni 21 zote kuchimbwa. Wachimbaji wa mapema wanapata zaidi.",
    },
    {
      question: "Uchimbaji uliosainiwa C+ ni nini?",
      answer: "Kabla ya blockchain ya SPEAQ Chain kuzinduliwa, uchimbaji wote unafanyika ndani ya kifaa chako. Kila zawadi ya uchimbaji inasainiwa mara mbili: (1) unasaini kwa funguo yako ya faragha, ukithibitisha utambulisho wako, na (2) seva ya relay inasaini pamoja kama shahidi, ikithibitisha kazi kweli ilitokea. Saini zote mbili zinahifadhiwa katika daftari lako la uchimbaji. Blockchain inapozinduliwa, maingizo yenye saini zote mbili pekee yanakubaliwa. Hii inafanya udanganyifu kuwa hauwezekani - huwezi kughushi saini ya relay, na relay inasaini tu unapochangia kweli.",
    },
  ],
};

// ─── BLOCKCHAIN ─────────────────────────────────────────────────────────────────

const blockchain: Record<Lang, FaqItem[]> = {
  en: [
    {
      question: "Does SPEAQ have its own blockchain?",
      answer: "Yes. SPEAQ has its own quantum-resistant blockchain called SPEAQ Chain. It is purpose-built for secure communication and sovereign finance. Blocks are produced every 30 seconds by validators selected through Proof of Contribution. Each block is dual-signed with ML-DSA-65 (FIPS 204) and SPHINCS+ (FIPS 205) for maximum quantum resistance.",
    },
    {
      question: "Why build a new blockchain instead of using Ethereum or Bitcoin?",
      answer: "Existing blockchains are not quantum-resistant. Their signature schemes (ECDSA, EdDSA) will be broken by quantum computers. SPEAQ Chain uses NIST-approved post-quantum cryptography from the ground up. It is also optimized for SPEAQ's specific needs: fast block times (30 seconds), Proof of Contribution consensus, and integration with the SPEAQ messaging protocol. Building on someone else's chain would compromise both security and sovereignty.",
    },
    {
      question: "How are blocks produced?",
      answer: "Blocks are produced every 30 seconds by validators selected through Proof of Contribution. Each block is dual-signed with ML-DSA-65 (FIPS 204) for transaction-level signatures and SPHINCS+ (FIPS 205) for block-level signatures. This dual-signature approach provides defense in depth - even if one algorithm is compromised, the other remains secure.",
    },
    {
      question: "How does validator selection work?",
      answer: "Validators are selected based on their Proof of Contribution score, which reflects their ongoing useful work for the network (relaying messages, storing data, validating transactions). This is not Proof of Stake where the richest get richer - it rewards actual contribution. Validators rotate to prevent centralization.",
    },
    {
      question: "What is finality?",
      answer: "Finality means a transaction cannot be reversed once confirmed. On SPEAQ Chain, transactions achieve finality when included in a block (every 30 seconds). Once finalized, a transaction is permanently recorded on the blockchain and cannot be altered, reversed, or censored by anyone - including SPEAQ itself.",
    },
  ],
  nl: [
    {
      question: "Heeft SPEAQ een eigen blockchain?",
      answer: "Ja. SPEAQ heeft een eigen kwantumbestendige blockchain genaamd SPEAQ Chain. Het is speciaal gebouwd voor veilige communicatie en soevereine financien. Blokken worden elke 30 seconden geproduceerd door validators die geselecteerd zijn via Proof of Contribution. Elk blok is dubbel ondertekend met ML-DSA-65 (FIPS 204) en SPHINCS+ (FIPS 205) voor maximale kwantumbestendigheid.",
    },
    {
      question: "Waarom een nieuwe blockchain bouwen in plaats van Ethereum of Bitcoin te gebruiken?",
      answer: "Bestaande blockchains zijn niet kwantumbestendig. Hun handtekeningschema's (ECDSA, EdDSA) zullen worden gebroken door kwantumcomputers. SPEAQ Chain gebruikt NIST-goedgekeurde post-quantum cryptografie vanaf de basis. Het is ook geoptimaliseerd voor de specifieke behoeften van SPEAQ: snelle bloktijden (30 seconden), Proof of Contribution consensus en integratie met het SPEAQ-berichtenprotocol. Bouwen op de keten van iemand anders zou zowel beveiliging als soevereiniteit in gevaar brengen.",
    },
    {
      question: "Hoe worden blokken geproduceerd?",
      answer: "Blokken worden elke 30 seconden geproduceerd door validators die geselecteerd zijn via Proof of Contribution. Elk blok is dubbel ondertekend met ML-DSA-65 (FIPS 204) voor handtekeningen op transactieniveau en SPHINCS+ (FIPS 205) voor handtekeningen op blokniveau. Deze dubbele-handtekeningbenadering biedt diepgaande verdediging - zelfs als een algoritme gecompromitteerd is, blijft het andere veilig.",
    },
    {
      question: "Hoe werkt validatorselectie?",
      answer: "Validators worden geselecteerd op basis van hun Proof of Contribution-score, die hun lopende nuttige werk voor het netwerk weerspiegelt (berichten doorsturen, data opslaan, transacties valideren). Dit is geen Proof of Stake waarbij de rijksten rijker worden - het beloont daadwerkelijke bijdrage. Validators roteren om centralisatie te voorkomen.",
    },
    {
      question: "Wat is finaliteit?",
      answer: "Finaliteit betekent dat een transactie niet ongedaan kan worden gemaakt nadat deze is bevestigd. Op SPEAQ Chain bereiken transacties finaliteit wanneer ze in een blok worden opgenomen (elke 30 seconden). Eenmaal gefinaliseerd wordt een transactie permanent vastgelegd op de blockchain en kan door niemand worden gewijzigd, teruggedraaid of gecensureerd - inclusief SPEAQ zelf.",
    },
  ],
  fr: [
    {
      question: "SPEAQ a-t-il sa propre blockchain ?",
      answer: "Oui. SPEAQ possede sa propre blockchain resistante aux quantiques appelee SPEAQ Chain. Elle est specialement concue pour la communication securisee et la finance souveraine. Les blocs sont produits toutes les 30 secondes par des validateurs selectionnes via la Preuve de Contribution. Chaque bloc est doublement signe avec ML-DSA-65 (FIPS 204) et SPHINCS+ (FIPS 205) pour une resistance maximale aux quantiques.",
    },
    {
      question: "Pourquoi construire une nouvelle blockchain au lieu d'utiliser Ethereum ou Bitcoin ?",
      answer: "Les blockchains existantes ne sont pas resistantes aux quantiques. Leurs schemas de signature (ECDSA, EdDSA) seront brises par les ordinateurs quantiques. SPEAQ Chain utilise la cryptographie post-quantique approuvee par le NIST des la base. Elle est egalement optimisee pour les besoins specifiques de SPEAQ : temps de bloc rapides (30 secondes), consensus par Preuve de Contribution et integration avec le protocole de messagerie SPEAQ. Construire sur la chaine de quelqu'un d'autre compromettrait a la fois la securite et la souverainete.",
    },
    {
      question: "Comment les blocs sont-ils produits ?",
      answer: "Les blocs sont produits toutes les 30 secondes par des validateurs selectionnes via la Preuve de Contribution. Chaque bloc est doublement signe avec ML-DSA-65 (FIPS 204) pour les signatures au niveau des transactions et SPHINCS+ (FIPS 205) pour les signatures au niveau des blocs. Cette approche de double signature fournit une defense en profondeur - meme si un algorithme est compromis, l'autre reste securise.",
    },
    {
      question: "Comment fonctionne la selection des validateurs ?",
      answer: "Les validateurs sont selectionnes en fonction de leur score de Preuve de Contribution, qui reflete leur travail utile continu pour le reseau (relayer des messages, stocker des donnees, valider des transactions). Ce n'est pas du Proof of Stake ou les plus riches deviennent plus riches - cela recompense la contribution reelle. Les validateurs alternent pour empecher la centralisation.",
    },
    {
      question: "Qu'est-ce que la finalite ?",
      answer: "La finalite signifie qu'une transaction ne peut pas etre annulee une fois confirmee. Sur SPEAQ Chain, les transactions atteignent la finalite lorsqu'elles sont incluses dans un bloc (toutes les 30 secondes). Une fois finalisee, une transaction est enregistree de maniere permanente sur la blockchain et ne peut etre modifiee, annulee ou censuree par personne - y compris SPEAQ lui-meme.",
    },
  ],
  es: [
    {
      question: "Tiene SPEAQ su propia blockchain?",
      answer: "Si. SPEAQ tiene su propia blockchain resistente a cuanticas llamada SPEAQ Chain. Esta especificamente construida para comunicacion segura y finanzas soberanas. Los bloques se producen cada 30 segundos por validadores seleccionados a traves de Prueba de Contribucion. Cada bloque tiene doble firma con ML-DSA-65 (FIPS 204) y SPHINCS+ (FIPS 205) para maxima resistencia cuantica.",
    },
    {
      question: "Por que construir una nueva blockchain en lugar de usar Ethereum o Bitcoin?",
      answer: "Las blockchains existentes no son resistentes a cuanticas. Sus esquemas de firma (ECDSA, EdDSA) seran rotos por computadoras cuanticas. SPEAQ Chain usa criptografia post-cuantica aprobada por NIST desde la base. Tambien esta optimizada para las necesidades especificas de SPEAQ: tiempos de bloque rapidos (30 segundos), consenso de Prueba de Contribucion e integracion con el protocolo de mensajeria SPEAQ. Construir sobre la cadena de otro comprometeria tanto la seguridad como la soberania.",
    },
    {
      question: "Como se producen los bloques?",
      answer: "Los bloques se producen cada 30 segundos por validadores seleccionados a traves de Prueba de Contribucion. Cada bloque tiene doble firma con ML-DSA-65 (FIPS 204) para firmas a nivel de transaccion y SPHINCS+ (FIPS 205) para firmas a nivel de bloque. Este enfoque de doble firma proporciona defensa en profundidad - incluso si un algoritmo se ve comprometido, el otro permanece seguro.",
    },
    {
      question: "Como funciona la seleccion de validadores?",
      answer: "Los validadores se seleccionan basandose en su puntuacion de Prueba de Contribucion, que refleja su trabajo util continuo para la red (retransmitir mensajes, almacenar datos, validar transacciones). Esto no es Prueba de Participacion donde los mas ricos se hacen mas ricos - recompensa la contribucion real. Los validadores rotan para prevenir la centralizacion.",
    },
    {
      question: "Que es la finalidad?",
      answer: "Finalidad significa que una transaccion no puede ser revertida una vez confirmada. En SPEAQ Chain, las transacciones alcanzan la finalidad cuando se incluyen en un bloque (cada 30 segundos). Una vez finalizada, una transaccion se registra permanentemente en la blockchain y no puede ser alterada, revertida o censurada por nadie - incluyendo SPEAQ mismo.",
    },
  ],
  ru: [
    {
      question: "Yest li u SPEAQ sobstvennyy blokcheyn?",
      answer: "Da. SPEAQ imeet sobstvennyy kvantovoustomchivyy blokcheyn pod nazvaniem SPEAQ Chain. On spetsialno sozdan dlya bezopasnoy svyazi i suverennykh finansov. Bloki sozdayutsya kazhdye 30 sekund validatorami, vybrannymi cherez Proof of Contribution. Kazhdyy blok podpisyvaetsya dvazhdy s pomoshchyu ML-DSA-65 (FIPS 204) i SPHINCS+ (FIPS 205) dlya maksimalnoy kvantovoustomchivosti.",
    },
    {
      question: "Zachem stroit novyy blokcheyn vmesto ispolzovaniya Ethereum ili Bitcoin?",
      answer: "Sushchestvuyushchie blokcheyny ne yavlyayutsya kvantovoustomchivymi. Ikh skhemy podpisi (ECDSA, EdDSA) budut vzlomany kvantovymi kompyuterami. SPEAQ Chain ispolzuet odobrennuyu NIST postkvantovuyu kriptografiyu s samogo nachala. On takzhe optimizirovan pod spetsificheskie potrebnosti SPEAQ: bystroe vremya blokov (30 sekund), konsensus Proof of Contribution i integratsiya s protokolom soobshcheniy SPEAQ. Stroitelstvo na chuzhom blokcheyne postavilo by pod ugrozu kak bezopasnost, tak i suverenitet.",
    },
    {
      question: "Kak sozdayutsya bloki?",
      answer: "Bloki sozdayutsya kazhdye 30 sekund validatorami, vybrannymi cherez Proof of Contribution. Kazhdyy blok podpisyvaetsya dvazhdy: ML-DSA-65 (FIPS 204) dlya podpisey na urovne tranzaktsiy i SPHINCS+ (FIPS 205) dlya podpisey na urovne blokov. Etot podkhod s dvoynoy podpisyu obespechyvaet glubinnuyu zashchitu - dazhe yesli odin algoritm budet skompromettirovan, drugoy ostanetsya bezopasnym.",
    },
    {
      question: "Kak rabotaet vybor validatorov?",
      answer: "Validatory vybirayutsya na osnove ikh otsenki Proof of Contribution, kotoraya otrazhaet ikh tekushchuyu poleznuyu rabotu dlya seti (retranslyatsiya soobshcheniy, khranenie dannykh, validatsiya tranzaktsiy). Eto ne Proof of Stake, gde bogatye stanovyatsya bogache - eto voznagrazhcaet realnyy vklad. Validatory rotiruyutsya dlya predotvrashcheniya tsentralizatsii.",
    },
    {
      question: "Chto takoe finalnost?",
      answer: "Finalnost oznachaet, chto tranzaktsiya ne mozhet byt otmenena posle podtverzhdeniya. V SPEAQ Chain tranzaktsii dostigayut finalnosti pri vklyuchenii v blok (kazhdye 30 sekund). Posle finalizatsii tranzaktsiya navechno zapisyvaetsya v blokcheyne i ne mozhet byt izmenena, otmenena ili podvergnutatsenzure kem-libo - vklyuchaya sam SPEAQ.",
    },
  ],
  de: [
    {
      question: "Hat SPEAQ eine eigene Blockchain?",
      answer: "Ja. SPEAQ hat eine eigene quantenresistente Blockchain namens SPEAQ Chain. Sie ist speziell fur sichere Kommunikation und souverane Finanzen gebaut. Blocke werden alle 30 Sekunden von Validatoren produziert, die uber Proof of Contribution ausgewahlt werden. Jeder Block wird doppelt signiert mit ML-DSA-65 (FIPS 204) und SPHINCS+ (FIPS 205) fur maximale Quantenresistenz.",
    },
    {
      question: "Warum eine neue Blockchain bauen, anstatt Ethereum oder Bitcoin zu verwenden?",
      answer: "Bestehende Blockchains sind nicht quantenresistent. Ihre Signaturverfahren (ECDSA, EdDSA) werden von Quantencomputern gebrochen werden. SPEAQ Chain verwendet von Grund auf NIST-genehmigte Post-Quanten-Kryptographie. Sie ist auch fur die spezifischen Bedurfnisse von SPEAQ optimiert: schnelle Blockzeiten (30 Sekunden), Proof of Contribution-Konsens und Integration mit dem SPEAQ-Nachrichtenprotokoll. Auf der Kette eines anderen zu bauen, wurde sowohl Sicherheit als auch Souveranitat gefahrden.",
    },
    {
      question: "Wie werden Blocke produziert?",
      answer: "Blocke werden alle 30 Sekunden von Validatoren produziert, die uber Proof of Contribution ausgewahlt werden. Jeder Block wird doppelt signiert mit ML-DSA-65 (FIPS 204) fur Signaturen auf Transaktionsebene und SPHINCS+ (FIPS 205) fur Signaturen auf Blockebene. Dieser Doppelsignatur-Ansatz bietet Tiefenverteidigung - selbst wenn ein Algorithmus kompromittiert wird, bleibt der andere sicher.",
    },
    {
      question: "Wie funktioniert die Validatorauswahl?",
      answer: "Validatoren werden basierend auf ihrem Proof of Contribution-Score ausgewahlt, der ihre laufende nutzliche Arbeit fur das Netzwerk widerspiegelt (Nachrichten weiterleiten, Daten speichern, Transaktionen validieren). Dies ist kein Proof of Stake, bei dem die Reichsten reicher werden - es belohnt tatsachlichen Beitrag. Validatoren rotieren, um Zentralisierung zu verhindern.",
    },
    {
      question: "Was ist Finalitat?",
      answer: "Finalitat bedeutet, dass eine Transaktion nicht ruckgangig gemacht werden kann, sobald sie bestatigt ist. Auf der SPEAQ Chain erreichen Transaktionen Finalitat, wenn sie in einen Block aufgenommen werden (alle 30 Sekunden). Nach der Finalisierung wird eine Transaktion dauerhaft in der Blockchain aufgezeichnet und kann von niemandem geandert, ruckgangig gemacht oder zensiert werden - einschliesslich SPEAQ selbst.",
    },
  ],
  sl: [
    {
      question: "Ali ima SPEAQ svojo verigo blokov?",
      answer: "Da. SPEAQ ima svojo kvantno odporno verigo blokov, imenovano SPEAQ Chain. Namensko je zgrajena za varno komunikacijo in suverene finance. Bloki se proizvajajo vsakih 30 sekund s strani validatorjev, izbranih prek Dokaza prispevka. Vsak blok je dvojno podpisan z ML-DSA-65 (FIPS 204) in SPHINCS+ (FIPS 205) za najvechjo kvantno odpornost.",
    },
    {
      question: "Zakaj graditi novo verigo blokov namesto uporabe Ethereum ali Bitcoin?",
      answer: "Obstojece verige blokov niso kvantno odporne. Njihove podpisne sheme (ECDSA, EdDSA) bodo zlomljene s kvantnimi racunalniki. SPEAQ Chain uporablja od NIST odobreno postkvantno kriptografijo od samega zachetka. Optimizirana je tudi za specificne potrebe SPEAQ: hitri chasi blokov (30 sekund), konsenz z Dokazom prispevka in integracija s protokolom SPEAQ za sporocanje. Gradnja na verigi nekoga drugega bi ogrozila tako varnost kot suverenost.",
    },
    {
      question: "Kako se bloki proizvajajo?",
      answer: "Bloki se proizvajajo vsakih 30 sekund s strani validatorjev, izbranih prek Dokaza prispevka. Vsak blok je dvojno podpisan z ML-DSA-65 (FIPS 204) za podpise na ravni transakcij in SPHINCS+ (FIPS 205) za podpise na ravni blokov. Ta pristop z dvojnim podpisom zagotavlja obrambo v globino - tudi che je en algoritem kompromitiran, drugi ostane varen.",
    },
    {
      question: "Kako deluje izbira validatorjev?",
      answer: "Validatorji so izbrani na podlagi njihovega rezultata Dokaza prispevka, ki odrazha njihovo tekoce koristno delo za omrezje (posredovanje sporocil, shranjevanje podatkov, potrjevanje transakcij). To ni Dokaz deleza, kjer najbogatejshi postajajo she bogatejshi - nagrajuje dejanski prispevek. Validatorji se izmenjujejo, da se preprechi centralizacija.",
    },
    {
      question: "Kaj je konchnost?",
      answer: "Konchnost pomeni, da transakcije ni mogoche razveljaviti, ko je potrjena. Na SPEAQ Chain transakcije dosezejo konchnost, ko so vkljuchene v blok (vsakih 30 sekund). Ko je zakljuchena, je transakcija trajno zapisana na verigi blokov in je nihche ne more spremeniti, razveljaviti ali cenzurirati - vkljuchno s SPEAQ samim.",
    },
  ],
  lg: [
    {
      question: "SPEAQ erina blockchain yaayo?",
      answer: "Yee. SPEAQ erina blockchain yaayo ekwatagana ne kkomppyuta z'ekikwantimu eyitibwa SPEAQ Chain. Yazimbibwa enduusi olw'empuliziganya ey'obukuumi n'eby'enfuna eby'obwannannyini. Blocks zikola buli sekkendi 30 validators abalonddeddwa okuyita mu Proof of Contribution. Buli block esayiniddwa emirundi ebiri ne ML-DSA-65 (FIPS 204) ne SPHINCS+ (FIPS 205) olw'okukwatagana ne kwantimu okw'ekitundu eky'waggulu.",
    },
    {
      question: "Lwaki ozimba blockchain empya mu kifo ky'okukozesa Ethereum oba Bitcoin?",
      answer: "Blockchain eziriwo tekwatagana ne kkomppyuta z'ekikwantimu. Enkola zaabwe ez'okusayina (ECDSA, EdDSA) zinaajja okumenyuulwa kkomppyuta z'ekikwantimu. SPEAQ Chain ekozesa enkola ey'omu maaso ey'ekikwantimu ekakasiziddwa NIST okuva ku musingi. Era eyongezeddwa obulungi olw'ebyetaagisa SPEAQ: ebiseera bya blocks eby'amangu (sekkendi 30), okukkiriziganya Proof of Contribution, n'okugatta n'empeereza y'obubaka ya SPEAQ. Okuzimba ku chain ya mulala wandiyize obukuumi n'obwannannyini.",
    },
    {
      question: "Blocks zikola ztya?",
      answer: "Blocks zikola buli sekkendi 30 validators abalonddeddwa okuyita mu Proof of Contribution. Buli block esayiniddwa emirundi ebiri ne ML-DSA-65 (FIPS 204) ku transaction n'e SPHINCS+ (FIPS 205) ku block. Enkola eno ey'okusayina emirundi ebiri ewaayo okukuumibwa okw'omunda - wadde algorithm emu n'eyonoonebwa, endala ekuumibwa.",
    },
    {
      question: "Okulondebwa kwa validators kukola kutya?",
      answer: "Validators balonddebwa okusinziira ku bubonero bwabwe obwa Proof of Contribution, obulagira omulimu gwabwe ogugasa ogweyongera ku mukutu (okuserengesa obubaka, okutereka data, okukakasa transactions). Kino si Proof of Stake omugagga w'ayongera obugagga - kino kiwa empeera okuwayo okw'amazima. Validators bakyusakyusa okulemesa okufuubirira mu kifo kimu.",
    },
    {
      question: "Finality kye ki?",
      answer: "Finality kitegeeza nti transaction tesobola kuzzibwayo bwe yanakakasizibwa. Ku SPEAQ Chain, transactions zituuka ku finality bwe zangemebwa mu block (buli sekkendi 30). Bwe yanakakasizibwa, transaction eterekebbwa emirembe gyonna ku blockchain era tesobola kukyusibwa, okuzzibwayo, oba okuziyizibwa muntu yenna - ne SPEAQ yennyini.",
    },
  ],
  sw: [
    {
      question: "Je, SPEAQ ina blockchain yake yenyewe?",
      answer: "Ndiyo. SPEAQ ina blockchain yake yenyewe inayostahimili quantum inayoitwa SPEAQ Chain. Imejengwa mahsusi kwa mawasiliano salama na fedha huru. Vitalu vinaundwa kila sekunde 30 na wathibitishaji waliochaguliwa kupitia Uthibitisho wa Mchango. Kila kitalu kina saini mbili za ML-DSA-65 (FIPS 204) na SPHINCS+ (FIPS 205) kwa upinzani wa juu wa quantum.",
    },
    {
      question: "Kwa nini kujenga blockchain mpya badala ya kutumia Ethereum au Bitcoin?",
      answer: "Blockchain zilizopo hazistahimili quantum. Mipango yao ya saini (ECDSA, EdDSA) itavunjwa na kompyuta za quantum. SPEAQ Chain inatumia kriptografia ya baada ya quantum iliyoidhinishwa na NIST tangu mwanzo. Pia imeandaliwa kwa mahitaji mahsusi ya SPEAQ: nyakati za haraka za vitalu (sekunde 30), makubaliano ya Uthibitisho wa Mchango, na ujumuishaji na itifaki ya ujumbe ya SPEAQ. Kujenga juu ya mnyororo wa mtu mwingine kungehatarisha usalama na uhuru.",
    },
    {
      question: "Vitalu vinaundwaje?",
      answer: "Vitalu vinaundwa kila sekunde 30 na wathibitishaji waliochaguliwa kupitia Uthibitisho wa Mchango. Kila kitalu kina saini mbili za ML-DSA-65 (FIPS 204) kwa saini za kiwango cha muamala na SPHINCS+ (FIPS 205) kwa saini za kiwango cha kitalu. Mbinu hii ya saini mbili inatoa ulinzi wa kina - hata algoriti moja ikiathiriwa, nyingine inabaki salama.",
    },
    {
      question: "Uchaguzi wa wathibitishaji unafanyaje kazi?",
      answer: "Wathibitishaji wanachaguliwa kulingana na alama zao za Uthibitisho wa Mchango, inayoonyesha kazi yao ya kuendelea yenye manufaa kwa mtandao (kusambaza ujumbe, kuhifadhi data, kuthibitisha miamala). Hii si Uthibitisho wa Hisa ambapo matajiri wanazidi kutajirika - inathawabishia mchango halisi. Wathibitishaji wanabadilishana ili kuzuia uwekaji katikati.",
    },
    {
      question: "Ukamilifu ni nini?",
      answer: "Ukamilifu una maana muamala hauwezi kurudishwa baada ya kuthibitishwa. Kwenye SPEAQ Chain, miamala inafikia ukamilifu inapoingizwa katika kitalu (kila sekunde 30). Baada ya kukamilishwa, muamala unarekodiwa milele kwenye blockchain na hauwezi kubadilishwa, kurudishwa, au kudhibitiwa na mtu yeyote - ikiwa ni pamoja na SPEAQ yenyewe.",
    },
  ],
};

// ─── FEATURES ───────────────────────────────────────────────────────────────────

const features: Record<Lang, FaqItem[]> = {
  en: [
    {
      question: "What are Ghost Groups?",
      answer: "Ghost Groups are invisible group chats. Members cannot see who else is in the group. The server has no record of the group existing. Messages are sent individually to each member through separate encrypted channels. This protects activists, journalists, and anyone who needs to communicate without a visible group structure. There is no group metadata to subpoena.",
    },
    {
      question: "What is Witness Mode?",
      answer: "Witness Mode creates tamper-proof evidence. When you record something in Witness Mode, it is timestamped and hashed with SHA-256. The hash cryptographically proves that the content existed at that exact moment and has not been modified since. Use this for documenting human rights violations, corruption, police misconduct, or any situation where evidence must be preserved and verified.",
    },
    {
      question: "What is the Dead Man's Switch?",
      answer: "If you do not check in within your set interval, a pre-configured message is automatically sent to your chosen contacts. This protects journalists, activists, and whistleblowers. If something happens to you, your emergency contacts will be notified automatically. The switch is entirely configurable - you set the interval, the message, and the recipients.",
    },
    {
      question: "What is the Quantum Vault?",
      answer: "The Quantum Vault stores your sensitive files (photos, documents, notes) with encryption on your device. It has two layers: a visible layer accessible with your normal PIN, and a hidden layer accessible only with a separate secret PIN. If someone forces you to open your phone, the hidden layer is completely invisible - there is no technical proof it exists. This is called plausible deniability.",
    },
    {
      question: "Does SPEAQ work without internet?",
      answer: "Yes. SPEAQ includes mesh networking capability. When internet is unavailable, SPEAQ can relay messages through nearby devices using Bluetooth and WiFi Direct, creating a local mesh network. This is critical in areas with censored or disrupted internet, during natural disasters, or in remote locations. Messages hop from device to device until they reach the internet or the recipient directly.",
    },
  ],
  nl: [
    {
      question: "Wat zijn Ghost Groups?",
      answer: "Ghost Groups zijn onzichtbare groepschats. Leden kunnen niet zien wie er nog meer in de groep zit. De server heeft geen registratie dat de groep bestaat. Berichten worden individueel naar elk lid verstuurd via afzonderlijke versleutelde kanalen. Dit beschermt activisten, journalisten en iedereen die moet communiceren zonder een zichtbare groepsstructuur. Er is geen groepsmetadata om op te vragen.",
    },
    {
      question: "Wat is Witness Mode?",
      answer: "Witness Mode creert manipulatiebestendig bewijs. Wanneer je iets opneemt in Witness Mode, wordt het voorzien van een tijdstempel en gehasht met SHA-256. De hash bewijst cryptografisch dat de inhoud op dat exacte moment bestond en sindsdien niet is gewijzigd. Gebruik dit voor het documenteren van mensenrechtenschendingen, corruptie, politiemisbruik of elke situatie waarin bewijs bewaard en geverifieerd moet worden.",
    },
    {
      question: "Wat is de Dead Man's Switch?",
      answer: "Als je niet incheckt binnen je ingestelde interval, wordt een vooraf geconfigureerd bericht automatisch verzonden naar je gekozen contacten. Dit beschermt journalisten, activisten en klokkenluiders. Als er iets met je gebeurt, worden je noodcontacten automatisch op de hoogte gesteld. De schakelaar is volledig configureerbaar - je stelt het interval, het bericht en de ontvangers in.",
    },
    {
      question: "Wat is de Quantum Vault?",
      answer: "De Quantum Vault slaat je gevoelige bestanden op (foto's, documenten, notities) met encryptie op je apparaat. Het heeft twee lagen: een zichtbare laag toegankelijk met je normale PIN, en een verborgen laag die alleen toegankelijk is met een aparte geheime PIN. Als iemand je dwingt je telefoon te openen, is de verborgen laag volledig onzichtbaar - er is geen technisch bewijs dat deze bestaat. Dit heet plausibele ontkenning.",
    },
    {
      question: "Werkt SPEAQ zonder internet?",
      answer: "Ja. SPEAQ beschikt over mesh-netwerkfunctionaliteit. Wanneer internet niet beschikbaar is, kan SPEAQ berichten doorsturen via apparaten in de buurt met behulp van Bluetooth en WiFi Direct, waardoor een lokaal mesh-netwerk wordt gecreeerd. Dit is cruciaal in gebieden met gecensureerd of verstoord internet, tijdens natuurrampen of op afgelegen locaties. Berichten springen van apparaat naar apparaat totdat ze het internet of de ontvanger direct bereiken.",
    },
  ],
  fr: [
    {
      question: "Que sont les Ghost Groups ?",
      answer: "Les Ghost Groups sont des discussions de groupe invisibles. Les membres ne peuvent pas voir qui d'autre est dans le groupe. Le serveur n'a aucun enregistrement de l'existence du groupe. Les messages sont envoyes individuellement a chaque membre via des canaux chiffres separes. Cela protege les activistes, les journalistes et tous ceux qui ont besoin de communiquer sans structure de groupe visible. Il n'y a pas de metadonnees de groupe a citer en justice.",
    },
    {
      question: "Qu'est-ce que le mode Temoin ?",
      answer: "Le mode Temoin cree des preuves inviolables. Lorsque vous enregistrez quelque chose en mode Temoin, il est horodate et hache avec SHA-256. Le hash prouve cryptographiquement que le contenu existait a ce moment precis et n'a pas ete modifie depuis. Utilisez-le pour documenter les violations des droits de l'homme, la corruption, les bavures policieres ou toute situation ou les preuves doivent etre preservees et verifiees.",
    },
    {
      question: "Qu'est-ce que le Dead Man's Switch ?",
      answer: "Si vous ne vous manifestez pas dans l'intervalle defini, un message pre-configure est automatiquement envoye a vos contacts choisis. Cela protege les journalistes, les activistes et les lanceurs d'alerte. Si quelque chose vous arrive, vos contacts d'urgence seront automatiquement notifies. Le commutateur est entierement configurable - vous definissez l'intervalle, le message et les destinataires.",
    },
    {
      question: "Qu'est-ce que le Quantum Vault ?",
      answer: "Le Quantum Vault stocke vos fichiers sensibles (photos, documents, notes) avec chiffrement sur votre appareil. Il a deux couches : une couche visible accessible avec votre code PIN normal, et une couche cachee accessible uniquement avec un code PIN secret separe. Si quelqu'un vous force a ouvrir votre telephone, la couche cachee est completement invisible - il n'y a aucune preuve technique de son existence. Cela s'appelle la deniabilite plausible.",
    },
    {
      question: "SPEAQ fonctionne-t-il sans internet ?",
      answer: "Oui. SPEAQ inclut une capacite de reseau maille. Lorsque l'internet n'est pas disponible, SPEAQ peut relayer des messages via les appareils proches en utilisant Bluetooth et WiFi Direct, creant un reseau maille local. C'est crucial dans les zones avec un internet censure ou perturbe, lors de catastrophes naturelles ou dans des endroits isoles. Les messages passent d'appareil en appareil jusqu'a ce qu'ils atteignent l'internet ou le destinataire directement.",
    },
  ],
  es: [
    {
      question: "Que son los Ghost Groups?",
      answer: "Los Ghost Groups son chats de grupo invisibles. Los miembros no pueden ver quien mas esta en el grupo. El servidor no tiene registro de la existencia del grupo. Los mensajes se envian individualmente a cada miembro a traves de canales cifrados separados. Esto protege a activistas, periodistas y cualquier persona que necesite comunicarse sin una estructura de grupo visible. No hay metadatos de grupo que se puedan solicitar judicialmente.",
    },
    {
      question: "Que es el modo Testigo?",
      answer: "El modo Testigo crea evidencia a prueba de manipulacion. Cuando grabas algo en modo Testigo, se marca con fecha y hora y se hashea con SHA-256. El hash prueba criptograficamente que el contenido existia en ese momento exacto y no ha sido modificado desde entonces. Usalo para documentar violaciones de derechos humanos, corrupcion, mala conducta policial o cualquier situacion donde la evidencia debe preservarse y verificarse.",
    },
    {
      question: "Que es el Dead Man's Switch?",
      answer: "Si no te registras dentro de tu intervalo establecido, un mensaje preconfigurado se envia automaticamente a tus contactos elegidos. Esto protege a periodistas, activistas y denunciantes. Si algo te sucede, tus contactos de emergencia seran notificados automaticamente. El interruptor es completamente configurable - tu estableces el intervalo, el mensaje y los destinatarios.",
    },
    {
      question: "Que es el Quantum Vault?",
      answer: "El Quantum Vault almacena tus archivos sensibles (fotos, documentos, notas) con cifrado en tu dispositivo. Tiene dos capas: una capa visible accesible con tu PIN normal, y una capa oculta accesible solo con un PIN secreto separado. Si alguien te obliga a abrir tu telefono, la capa oculta es completamente invisible - no hay prueba tecnica de que exista. Esto se llama negacion plausible.",
    },
    {
      question: "Funciona SPEAQ sin internet?",
      answer: "Si. SPEAQ incluye capacidad de red mesh. Cuando no hay internet disponible, SPEAQ puede retransmitir mensajes a traves de dispositivos cercanos usando Bluetooth y WiFi Direct, creando una red mesh local. Esto es critico en areas con internet censurado o interrumpido, durante desastres naturales o en ubicaciones remotas. Los mensajes saltan de dispositivo en dispositivo hasta que llegan a internet o al destinatario directamente.",
    },
  ],
  ru: [
    {
      question: "Chto takoe Ghost Groups?",
      answer: "Ghost Groups - eto nevidimye gruppovye chaty. Uchastniki ne mogut videt, kto eshche nakhoditsya v gruppe. Server ne imeet zapisi o sushchestvovanii gruppy. Soobshcheniya otpravlyayutsya individualno kazhdomu uchastinku cherez otdelnye zashifrovannye kanaly. Eto zashchishchaet aktivistov, zhurnalistov i vsekh, komu nuzhno obshchatsya bez vidimoy gruppovoy struktury. Net gruppovykh metadannykh, kotorye mozhno zaprosity cherez sud.",
    },
    {
      question: "Chto takoe rezhim Svidetelya?",
      answer: "Rezhim Svidetelya sozdaet zashchishchennye ot poddelki dokazatelstva. Kogda vy zapisyvaete chto-to v rezhime Svidetelya, eto poluchaet vremennnuyu metku i kheshiruetsya s pomoshchyu SHA-256. Khesh kriptograficheski dokazyvaet, chto soderzhimoe sushchestvovalo v etot tochnyy moment i ne bylo izmeneno s tekh por. Ispolzuyte eto dlya dokumentirovaniya narusheniy prav cheloveka, korruptsii, nepravomernykh deystviy politsii ili lyuboy situatsii, gde dokazatelstva dolzhny byt sokhraneny i provereny.",
    },
    {
      question: "Chto takoe Dead Man's Switch?",
      answer: "Yesli vy ne otmetites v techenie ustanovlennogo intervala, predvaritelno nastroennoe soobshchenie avtomaticheski otpravlyaetsya vashim vybrannym kontaktam. Eto zashchishchaet zhurnalistov, aktivistov i informatorov. Yesli chto-to sluchitsya s vami, vashi avariynye kontakty budut avtomaticheski uvedomleny. Pereklyuchatel polnostyu nastpaivaemyy - vy ustanavlivaete interval, soobshchenie i poluchateley.",
    },
    {
      question: "Chto takoe Quantum Vault?",
      answer: "Quantum Vault khranit vashi konfidentsialnye fayly (fotografii, dokumenty, zametki) s shifrovaniyem na vashem ustroystve. On imeet dva urovnya: vidimyy uroven, dostupnyy s vashim obychnym PIN-kodom, i skrytyy uroven, dostupnyy tolko s otdelnym sekretnym PIN-kodom. Yesli kto-to zastavit vas otkryt telefon, skrytyy uroven polnostyu nevidim - net tekhnicheskikh dokazatelstv yego sushchestvovaniya. Eto nazyvayetsya pravdopodobnym otpiratelstvom.",
    },
    {
      question: "Rabotaet li SPEAQ bez interneta?",
      answer: "Da. SPEAQ vklyuchaet vozmozhnost mesh-seti. Kogda internet nedostupen, SPEAQ mozhet retranslirovat soobshcheniya cherez blizhayshie ustroystva s pomoshchyu Bluetooth i WiFi Direct, sozdavaya lokalnuyu mesh-set. Eto kriticheski vazhno v rayonakh s tsenzurirovannym ili narushyennym internetom, vo vremya stikhiynykh bedstviy ili v otdalennykh mestakh. Soobshcheniya peredayutsya ot ustroystva k ustroystvu, poka ne dostignut interneta ili poluchatelya napryamuyu.",
    },
  ],
  de: [
    {
      question: "Was sind Ghost Groups?",
      answer: "Ghost Groups sind unsichtbare Gruppenchats. Mitglieder konnen nicht sehen, wer sonst in der Gruppe ist. Der Server hat keinen Nachweis uber die Existenz der Gruppe. Nachrichten werden einzeln an jedes Mitglied uber separate verschlusselte Kanale gesendet. Dies schutzt Aktivisten, Journalisten und alle, die ohne sichtbare Gruppenstruktur kommunizieren mussen. Es gibt keine Gruppenmetadaten, die vorgeladen werden konnen.",
    },
    {
      question: "Was ist der Zeugenmodus?",
      answer: "Der Zeugenmodus erstellt manipulationssichere Beweise. Wenn Sie etwas im Zeugenmodus aufzeichnen, wird es mit einem Zeitstempel versehen und mit SHA-256 gehasht. Der Hash beweist kryptographisch, dass der Inhalt zu diesem exakten Zeitpunkt existierte und seitdem nicht verandert wurde. Verwenden Sie dies zur Dokumentation von Menschenrechtsverletzungen, Korruption, Polizeimissbrauch oder jeder Situation, in der Beweise gesichert und verifiziert werden mussen.",
    },
    {
      question: "Was ist der Dead Man's Switch?",
      answer: "Wenn Sie sich nicht innerhalb Ihres eingestellten Intervalls melden, wird eine vorkonfigurierte Nachricht automatisch an Ihre ausgewahlten Kontakte gesendet. Dies schutzt Journalisten, Aktivisten und Whistleblower. Wenn Ihnen etwas zustosst, werden Ihre Notfallkontakte automatisch benachrichtigt. Der Schalter ist vollstandig konfigurierbar - Sie legen das Intervall, die Nachricht und die Empfanger fest.",
    },
    {
      question: "Was ist der Quantum Vault?",
      answer: "Der Quantum Vault speichert Ihre sensiblen Dateien (Fotos, Dokumente, Notizen) verschlusselt auf Ihrem Gerat. Er hat zwei Schichten: eine sichtbare Schicht, die mit Ihrer normalen PIN zuganglich ist, und eine versteckte Schicht, die nur mit einer separaten geheimen PIN zuganglich ist. Wenn jemand Sie zwingt, Ihr Telefon zu offnen, ist die versteckte Schicht vollig unsichtbar - es gibt keinen technischen Beweis fur ihre Existenz. Dies nennt man plausible Abstreitbarkeit.",
    },
    {
      question: "Funktioniert SPEAQ ohne Internet?",
      answer: "Ja. SPEAQ beinhaltet Mesh-Netzwerk-Fahigkeit. Wenn kein Internet verfugbar ist, kann SPEAQ Nachrichten uber nahe gelegene Gerate mittels Bluetooth und WiFi Direct weiterleiten und so ein lokales Mesh-Netzwerk erstellen. Dies ist entscheidend in Gebieten mit zensiertem oder gestortem Internet, bei Naturkatastrophen oder an abgelegenen Orten. Nachrichten springen von Gerat zu Gerat, bis sie das Internet oder den Empfanger direkt erreichen.",
    },
  ],
  sl: [
    {
      question: "Kaj so Ghost Groups?",
      answer: "Ghost Groups so nevidni skupinski klepeti. Chlani ne morejo videti, kdo drug je v skupini. Streznik nima zapisa o obstoju skupine. Sporocila se posiljajo posamezno vsakemu chlanu prek lochenih shifriranih kanalov. To schiti aktiviste, novinarje in vse, ki morajo komunicirati brez vidne skupinske strukture. Ni skupinskih metapodatkov, ki bi jih lahko zahtevali s sodnim nalogom.",
    },
    {
      question: "Kaj je nachin Price?",
      answer: "Nachin Price ustvarja dokazila, odporna proti poseganju. Ko nekaj posnamete v nachinu Price, je casovno ozhnacheno in zgoscheno s SHA-256. Zgoscena vrednost kriptografsko dokazuje, da je vsebina obstajala v tochno tistem trenutku in od takrat ni bila spremenjena. Uporabite to za dokumentiranje krsitev clovekovih pravic, korupcije, policijskega zlorabljanja ali katerekoli situacije, kjer je treba dokazila ohraniti in preveriti.",
    },
    {
      question: "Kaj je Dead Man's Switch?",
      answer: "Che se ne prijavite v nastavljenem intervalu, se vnaprej nastavljeno sporocilo samodejno poslje vasim izbranim stikom. To schiti novinarje, aktiviste in prijavitelje nepravilnosti. Che se vam kaj zgodi, bodo vasi nujni stiki samodejno obvescheni. Stikalo je povsem nastavljivo - nastavite interval, sporocilo in prejemnike.",
    },
    {
      question: "Kaj je Quantum Vault?",
      answer: "Quantum Vault hrani vase obchutljive datoteke (fotografije, dokumente, zapiske) s shifriranjem na vasi napravi. Ima dve plasti: vidno plast, dostopno z vasho obichajno PIN kodo, in skrito plast, dostopno le z locheno skrivno PIN kodo. Che vas nekdo prisili odpreti telefon, je skrita plast povsem nevidna - ni tehnichemga dokaza, da obstaja. To se imenuje verjetno zanikanje.",
    },
    {
      question: "Ali SPEAQ deluje brez interneta?",
      answer: "Da. SPEAQ vkljuchuje zmoznost omrezja mesh. Ko internet ni na voljo, lahko SPEAQ posreduje sporocila prek blizhnjih naprav z uporabo Bluetooth in WiFi Direct ter ustvari lokalno omrezje mesh. To je kljuchno na obmochjih s cenzuriranim ali prekinjenim internetom, med naravnimi nesrechami ali na oddaljenih lokacijah. Sporocila skachejo od naprave do naprave, dokler ne dosezejo interneta ali prejemnika neposredno.",
    },
  ],
  lg: [
    {
      question: "Ghost Groups bye ki?",
      answer: "Ghost Groups bye biwandiiko by'ekibinja ebitalabiika. Memmba tasobola kulaba ani omulala ali mu kibinja. Seva terina rkifo ekiraga nti ekibinja kiriwo. Obubaka butumibwa mu buli muntu ku nnyiriri enziyize ez'enjawulo. Kino kikunuulira ab'okujemereza, abawandiisi b'amawulire, na buli omu ayeetaaga okuwuliziganya awatali nkuluze y'ekibinja erabika. Tewali metadata y'ekibinja eyinza okwetaagisibwa mu kkooti.",
    },
    {
      question: "Witness Mode kye ki?",
      answer: "Witness Mode etonda obujulizi obutakyusakyusika. Bw'oterekera ekintu mu Witness Mode, kifunirwa obudde era kihashizibwa ne SHA-256. Hash ekakasa mu nkola y'ekikryptogurafu nti ebirimu byaliwo mu kiseera ekyo kituufu era tebikyuusibwa okuva olwo. Kino kikozese okuwandiisa okumenya ku eddembe ly'obuntubulamu, obubbi, okukozesa obubi kwa poliisi, oba buli mbeera mwe obujulizi bulina okutereka n'okukakasizibwa.",
    },
    {
      question: "Dead Man's Switch kye ki?",
      answer: "Bw'otogenda kufuna mu kiseera kyo ky'ooteese, obubaka obwateekeddwa butumibwa mu ngeri ey'okukyuuka eri abantu b'olondemu. Kino kikunuulira abawandiisi b'amawulire, ab'okujemereza, n'abo abalanga ebibi. Ekintu bwe kiba ku ggwe, abantu bo ab'obuyamba bategeezibwa mu ngeri ey'okukyuuka. Ekipimo kino kiteekekwa ddala - oteekawo kiseera, obubaka, n'abo abafuna.",
    },
    {
      question: "Quantum Vault kye ki?",
      answer: "Quantum Vault etereka fayiro zo ez'ekyama (ebifaananyi, ebiwandiiko, ebiwandiikiddwa) n'enkola y'okuziyiza ku kifo kyo. Erina ebitundu bibiri: ekitundu ekirabika ekifunibwa ne PIN yo eya bulijjo, n'ekitundu ekyekisiddwa ekifunibwa ne PIN y'ekyama ey'enjawulo. Omuntu bw'akuwalirizira okuggulawo essimu yo, ekitundu ekyekisiddwa tekirabika ddala - tewali bukakasa bwa tekiniki nti kiriwo. Kino kiyitibwa plausible deniability.",
    },
    {
      question: "SPEAQ ekola awatali internet?",
      answer: "Yee. SPEAQ erina obuyinza bw'omukutu gwa mesh. Internet bw'etaba, SPEAQ esobola okuserengesa obubaka okuyita mu bifo ebirabirana okukozesa Bluetooth ne WiFi Direct, ng'etonda omukutu gwa mesh ogwa wano. Kino kikulu ennyo mu bitundu omuli internet eziyiziddwa oba ekwatiddwa, mu biseera by'ekyekabiiro, oba mu bifo eby'ewala. Obubaka bubuuka okuva ku kifo okutuuka ku kifo okutuuka bwe butuuka ku internet oba oyo ayina okubufuna butereevu.",
    },
  ],
  sw: [
    {
      question: "Ghost Groups ni nini?",
      answer: "Ghost Groups ni mazungumzo ya kikundi yasiyoonekana. Wanachama hawawezi kuona ni nani mwingine yuko kwenye kikundi. Seva haina rekodi ya kikundi kuwepo. Ujumbe unatumwa kibinafsi kwa kila mwanachama kupitia njia tofauti zilizosimbwa. Hii inalinda wanaharakati, waandishi wa habari, na mtu yeyote anayehitaji kuwasiliana bila muundo wa kikundi unaoonekana. Hakuna metadata ya kikundi inayoweza kuombwa mahakamani.",
    },
    {
      question: "Hali ya Shahidi ni nini?",
      answer: "Hali ya Shahidi inaunda ushahidi usioweza kubadilishwa. Unaporekodia kitu katika Hali ya Shahidi, kinawekwa muhuri wa wakati na kupitishwa hash ya SHA-256. Hash inathibitisha kwa njia ya kisiri kwamba maudhui yalikuwepo wakati huo hasa na hayajabadilishwa tangu wakati huo. Tumia hii kwa kuandika ukiukaji wa haki za binadamu, ufisadi, matendo mabaya ya polisi, au hali yoyote ambapo ushahidi lazima uhifadhiwe na kuthibitishwa.",
    },
    {
      question: "Dead Man's Switch ni nini?",
      answer: "Ikiwa hujajisajili ndani ya muda wako uliowekwa, ujumbe uliowekwa mapema unatumwa kiotomatiki kwa mawasiliano yako uliyochagua. Hii inalinda waandishi wa habari, wanaharakati, na wafichuaji. Ikiwa kitu kinatokea kwako, mawasiliano yako ya dharura yataarifiwa kiotomatiki. Swichi inaweza kusanidiwa kabisa - unaweka muda, ujumbe, na wapokeaji.",
    },
    {
      question: "Quantum Vault ni nini?",
      answer: "Quantum Vault inahifadhi faili zako nyeti (picha, hati, maandishi) kwa usimbaji kwenye kifaa chako. Ina tabaka mbili: tabaka inayoonekana inayopatikana kwa PIN yako ya kawaida, na tabaka iliyofichwa inayopatikana tu kwa PIN ya siri tofauti. Mtu akikulazimisha kufungua simu yako, tabaka iliyofichwa haionekani kabisa - hakuna ushahidi wa kiufundi kwamba ipo. Hii inaitwa ukanushi wa kuaminika.",
    },
    {
      question: "Je, SPEAQ inafanya kazi bila internet?",
      answer: "Ndiyo. SPEAQ inajumuisha uwezo wa mtandao wa mesh. Wakati internet haipatikani, SPEAQ inaweza kusambaza ujumbe kupitia vifaa vilivyo karibu kwa kutumia Bluetooth na WiFi Direct, kuunda mtandao wa mesh wa ndani. Hii ni muhimu katika maeneo yenye internet iliyodhibitiwa au iliyokatizwa, wakati wa majanga ya asili, au katika maeneo ya mbali. Ujumbe unaruka kutoka kifaa hadi kifaa hadi ufikie internet au mpokeaji moja kwa moja.",
    },
  ],
};

// ─── TECHNICAL ──────────────────────────────────────────────────────────────────

const technical: Record<Lang, FaqItem[]> = {
  en: [
    {
      question: "What NIST certifications does SPEAQ use?",
      answer: "SPEAQ implements multiple NIST-approved post-quantum cryptographic standards: Kyber-768 (FIPS 203) for key encapsulation, ML-DSA-65 (FIPS 204) for digital signatures on wallet transactions, and SPHINCS+ (FIPS 205) for hash-based signatures on blockchain blocks. These are the same standards recommended for protecting classified government communications.",
    },
    {
      question: "Has the protocol been formally verified?",
      answer: "Yes. SPEAQ's cryptographic protocols have been formally verified using ProVerif, a mathematical proof tool for cryptographic protocols. We have proven 24 security properties across 7 protocol models, including wallet key secrecy, transaction privacy, block authentication, and full end-to-end system verification. All 24 properties returned TRUE. In addition, the Rust blockchain implementation includes 113 unit tests. The protocol uses NIST-certified primitives (AES-256, SHA-256, Kyber-768, ML-DSA-65, SPHINCS+) and the Double Ratchet Protocol. We believe in security through transparency, not obscurity.",
    },
    {
      question: "Is SPEAQ open source?",
      answer: "The SPEAQ cryptographic protocol specification will be published openly for security review. The client applications are planned to be open-sourced after the initial launch period to allow independent verification of our security claims. We believe users should be able to verify, not just trust.",
    },
    {
      question: "What is the SPEAQ Chain?",
      answer: "SPEAQ Chain is SPEAQ's purpose-built quantum-resistant blockchain. It tracks Q-Credit balances, processes transactions, and ensures no one can create money from nothing. Maximum supply: 21,000,000 QC, enforced by code. Blocks every 30 seconds. Dual-signed with ML-DSA-65 and SPHINCS+. Validators selected by Proof of Contribution, not by wealth. It is the financial backbone of the SPEAQ freedom platform.",
    },
  ],
  nl: [
    {
      question: "Welke NIST-certificeringen gebruikt SPEAQ?",
      answer: "SPEAQ implementeert meerdere door NIST goedgekeurde post-quantum cryptografische standaarden: Kyber-768 (FIPS 203) voor sleutelinkapseling, ML-DSA-65 (FIPS 204) voor digitale handtekeningen bij wallet-transacties en SPHINCS+ (FIPS 205) voor hash-gebaseerde handtekeningen op blockchain-blokken. Dit zijn dezelfde standaarden die aanbevolen worden voor het beschermen van geclassificeerde overheidscommunicatie.",
    },
    {
      question: "Is het protocol formeel geverifieerd?",
      answer: "Ja. De cryptografische protocollen van SPEAQ zijn formeel geverifieerd met ProVerif, een wiskundig bewijsgereedschap voor cryptografische protocollen. We hebben 24 beveiligingseigenschappen bewezen over 7 protocolmodellen, waaronder wallet-sleutelgeheimhouding, transactieprivacy, blokauthenticatie en volledige end-to-end systeemverificatie. Alle 24 eigenschappen retourneerden TRUE. Daarnaast bevat de Rust blockchain-implementatie 113 unit tests. Het protocol gebruikt NIST-gecertificeerde primitieven (AES-256, SHA-256, Kyber-768, ML-DSA-65, SPHINCS+) en het Double Ratchet Protocol.",
    },
    {
      question: "Is SPEAQ open source?",
      answer: "De SPEAQ cryptografische protocolspecificatie zal openlijk worden gepubliceerd voor beveiligingsreviwie. De clienttoepassingen zijn gepland om open source te worden na de initiele lanceringsperiode om onafhankelijke verificatie van onze beveiligingsclaims mogelijk te maken. Wij geloven dat gebruikers moeten kunnen verifieren, niet alleen vertrouwen.",
    },
    {
      question: "Wat is de SPEAQ Chain?",
      answer: "SPEAQ Chain is de speciaal gebouwde kwantumbestendige blockchain van SPEAQ. Het houdt Q-Credit saldi bij, verwerkt transacties en zorgt ervoor dat niemand geld uit het niets kan creeren. Maximale voorraad: 21.000.000 QC, afgedwongen door code. Blokken elke 30 seconden. Dubbel ondertekend met ML-DSA-65 en SPHINCS+. Validators geselecteerd door Proof of Contribution, niet door rijkdom. Het is de financiele ruggengraat van het SPEAQ vrijheidsplatform.",
    },
  ],
  fr: [
    {
      question: "Quelles certifications NIST SPEAQ utilise-t-il ?",
      answer: "SPEAQ implemente plusieurs normes cryptographiques post-quantiques approuvees par le NIST : Kyber-768 (FIPS 203) pour l'encapsulation de cles, ML-DSA-65 (FIPS 204) pour les signatures numeriques sur les transactions de portefeuille, et SPHINCS+ (FIPS 205) pour les signatures basees sur le hachage sur les blocs de la blockchain. Ce sont les memes normes recommandees pour proteger les communications gouvernementales classifiees.",
    },
    {
      question: "Le protocole a-t-il ete formellement verifie ?",
      answer: "Oui. Les protocoles cryptographiques de SPEAQ ont ete formellement verifies avec ProVerif, un outil de preuve mathematique pour les protocoles cryptographiques. Nous avons prouve 24 proprietes de securite sur 7 modeles de protocoles. Tous les 24 ont retourne TRUE. L'implementation Rust comprend 113 tests unitaires. Le protocole utilise des primitives certifiees NIST (AES-256, SHA-256, Kyber-768, ML-DSA-65, SPHINCS+) et le protocole Double Ratchet.",
    },
    {
      question: "SPEAQ est-il open source ?",
      answer: "La specification du protocole cryptographique SPEAQ sera publiee ouvertement pour examen de securite. Les applications clientes sont prevues pour etre rendues open source apres la periode de lancement initiale afin de permettre une verification independante de nos revendications de securite. Nous croyons que les utilisateurs devraient pouvoir verifier, pas seulement faire confiance.",
    },
    {
      question: "Qu'est-ce que la SPEAQ Chain ?",
      answer: "SPEAQ Chain est la blockchain resistante aux quantiques specialement concue par SPEAQ. Elle suit les soldes de Q-Credits, traite les transactions et garantit que personne ne peut creer de l'argent a partir de rien. Offre maximale : 21 000 000 QC, imposee par le code. Blocs toutes les 30 secondes. Double signature avec ML-DSA-65 et SPHINCS+. Validateurs selectionnes par Preuve de Contribution, pas par la richesse. C'est l'epine dorsale financiere de la plateforme de liberte SPEAQ.",
    },
  ],
  es: [
    {
      question: "Que certificaciones NIST utiliza SPEAQ?",
      answer: "SPEAQ implementa multiples estandares criptograficos post-cuanticos aprobados por NIST: Kyber-768 (FIPS 203) para encapsulacion de claves, ML-DSA-65 (FIPS 204) para firmas digitales en transacciones de billetera, y SPHINCS+ (FIPS 205) para firmas basadas en hash en bloques de blockchain. Estos son los mismos estandares recomendados para proteger comunicaciones gubernamentales clasificadas.",
    },
    {
      question: "Ha sido el protocolo formalmente verificado?",
      answer: "Si. Los protocolos criptograficos de SPEAQ han sido verificados formalmente con ProVerif, una herramienta de prueba matematica. Hemos probado 24 propiedades de seguridad en 7 modelos de protocolo. Todos retornaron TRUE. La implementacion Rust incluye 113 pruebas unitarias. El protocolo usa primitivas certificadas por NIST (AES-256, SHA-256, Kyber-768, ML-DSA-65, SPHINCS+) y el Protocolo Double Ratchet.",
    },
    {
      question: "Es SPEAQ de codigo abierto?",
      answer: "La especificacion del protocolo criptografico de SPEAQ sera publicada abiertamente para revision de seguridad. Las aplicaciones cliente estan planificadas para ser de codigo abierto despues del periodo de lanzamiento inicial para permitir la verificacion independiente de nuestras afirmaciones de seguridad. Creemos que los usuarios deberian poder verificar, no solo confiar.",
    },
    {
      question: "Que es la SPEAQ Chain?",
      answer: "SPEAQ Chain es la blockchain resistente a cuanticas construida especificamente por SPEAQ. Rastrea los saldos de Q-Credits, procesa transacciones y asegura que nadie pueda crear dinero de la nada. Suministro maximo: 21.000.000 QC, impuesto por codigo. Bloques cada 30 segundos. Doble firma con ML-DSA-65 y SPHINCS+. Validadores seleccionados por Prueba de Contribucion, no por riqueza. Es la columna vertebral financiera de la plataforma de libertad SPEAQ.",
    },
  ],
  ru: [
    {
      question: "Kakie sertifikaty NIST ispolzuet SPEAQ?",
      answer: "SPEAQ realizuet neskolko postkvantovykh kriptograficheskikh standartov, odobrennykh NIST: Kyber-768 (FIPS 203) dlya inkapsulatsii klyuchey, ML-DSA-65 (FIPS 204) dlya tsifrovykh podpisey na tranzaktsiyakh koshelka i SPHINCS+ (FIPS 205) dlya podpisey na osnove kheshey na blokakh blokcheyna. Eto te zhe standarty, kotorye rekomenduyutsya dlya zashchity sekretnykh pravitelstvennykh kommunikatsiy.",
    },
    {
      question: "Byl li protokol formalno verificirovan?",
      answer: "Da. Kriptograficheskie protokoly SPEAQ formalno verificirovany s pomoshchyu ProVerif - matematicheskogo instrumenta dokazatelstva. Dokazano 24 svoystva bezopasnosti v 7 modelyakh protokolov. Vse 24 vernuli TRUE. Realizatsiya na Rust vklyuchaet 113 unit-testov. Protokol ispolzuet NIST-sertifitsirovannye primitivy (AES-256, SHA-256, Kyber-768, ML-DSA-65, SPHINCS+) i protokol Double Ratchet.",
    },
    {
      question: "Yavlyaetsya li SPEAQ otkrytym ishodnym kodom?",
      answer: "Spetsifikatsiya kriptograficheskogo protokola SPEAQ budet opublikovana otkryto dlya obzora bezopasnosti. Kliyentskie prilozheniya planiruetsya sdelat otkrytymi posle nachalnogo perioda zapuska, chtoby obespechit nezavisimuyu proverku nashikh zayavleniy o bezopasnosti. My verim, chto polzovateli dolzhny imet vozmozhnost proveryat, a ne prosto doveryat.",
    },
    {
      question: "Chto takoe SPEAQ Chain?",
      answer: "SPEAQ Chain - eto spetsialno postroennyy kvantovoustomchivyy blokcheyn SPEAQ. On otslezhivaet balansy Q-Credits, obrabatyvaet tranzaktsii i garantiruet, chto nikto ne mozhet sozdat dengi iz nichego. Maksimalnoe predlozhenie: 21 000 000 QC, obespechennoe kodom. Bloki kazhdye 30 sekund. Dvoynaya podpis s pomoshchyu ML-DSA-65 i SPHINCS+. Validatory vybirayutsya po Proof of Contribution, a ne po bogatstvu. Eto finansovyy khrebet platformy svobody SPEAQ.",
    },
  ],
  de: [
    {
      question: "Welche NIST-Zertifizierungen verwendet SPEAQ?",
      answer: "SPEAQ implementiert mehrere von NIST genehmigte Post-Quanten-kryptographische Standards: Kyber-768 (FIPS 203) fur Schlusselverkapselung, ML-DSA-65 (FIPS 204) fur digitale Signaturen bei Wallet-Transaktionen und SPHINCS+ (FIPS 205) fur hash-basierte Signaturen auf Blockchain-Blocken. Dies sind dieselben Standards, die zum Schutz klassifizierter Regierungskommunikation empfohlen werden.",
    },
    {
      question: "Wurde das Protokoll formal verifiziert?",
      answer: "Ja. Die kryptographischen Protokolle von SPEAQ wurden mit ProVerif formal verifiziert - einem mathematischen Beweiswerkzeug. 24 Sicherheitseigenschaften wurden uber 7 Protokollmodelle bewiesen. Alle 24 ergaben TRUE. Die Rust-Implementierung umfasst 113 Unit-Tests. Das Protokoll verwendet NIST-zertifizierte Primitive (AES-256, SHA-256, Kyber-768, ML-DSA-65, SPHINCS+) und das Double Ratchet Protocol.",
    },
    {
      question: "Ist SPEAQ Open Source?",
      answer: "Die SPEAQ kryptographische Protokollspezifikation wird offen fur Sicherheitsuberprufung veroffentlicht. Die Client-Anwendungen sind geplant, nach der anfanglichen Startphase Open Source zu werden, um eine unabhangige Uberprufung unserer Sicherheitsaussagen zu ermoglichen. Wir glauben, dass Nutzer verifizieren konnen sollten, nicht nur vertrauen.",
    },
    {
      question: "Was ist die SPEAQ Chain?",
      answer: "SPEAQ Chain ist die speziell gebaute quantenresistente Blockchain von SPEAQ. Sie verfolgt Q-Credit-Kontostande, verarbeitet Transaktionen und stellt sicher, dass niemand Geld aus dem Nichts erschaffen kann. Maximale Menge: 21.000.000 QC, durch Code durchgesetzt. Blocke alle 30 Sekunden. Doppelt signiert mit ML-DSA-65 und SPHINCS+. Validatoren werden nach Proof of Contribution ausgewahlt, nicht nach Reichtum. Sie ist das finanzielle Ruckgrat der SPEAQ-Freiheitsplattform.",
    },
  ],
  sl: [
    {
      question: "Katere certifikate NIST uporablja SPEAQ?",
      answer: "SPEAQ implementira vech postkvantnih kriptografskih standardov, odobrenih s strani NIST: Kyber-768 (FIPS 203) za enkapsulacijo kljuchev, ML-DSA-65 (FIPS 204) za digitalne podpise pri transakcijah denarnice in SPHINCS+ (FIPS 205) za podpise na osnovi zgoscevanja na blokih verige blokov. To so isti standardi, priporocheni za zaschito tajnih vladnih komunikacij.",
    },
    {
      question: "Ali je bil protokol formalno preverjen?",
      answer: "Da. Kriptografski protokoli SPEAQ so bili formalno preverjeni s ProVerif - matematicnim orodjem za dokazovanje. 24 varnostnih lastnosti je bilo dokazanih v 7 modelih protokolov. Vseh 24 je vrnilo TRUE. Implementacija v Rustu vkljucuje 113 unit testov. Protokol uporablja NIST-certificirane primitive (AES-256, SHA-256, Kyber-768, ML-DSA-65, SPHINCS+) in protokol Double Ratchet.",
    },
    {
      question: "Ali je SPEAQ odprtokoden?",
      answer: "Specifikacija kriptografskega protokola SPEAQ bo javno objavljena za varnostni pregled. Klientske aplikacije so nacrtovane za odprtokodnost po zachetnem obdobju zagona, da se omogochi neodvisno preverjanje nasih varnostnih trditev. Verjamemo, da bi morali uporabniki imeti moznost preverjanja, ne le zaupanja.",
    },
    {
      question: "Kaj je SPEAQ Chain?",
      answer: "SPEAQ Chain je namensko zgrajena kvantno odporna veriga blokov SPEAQ. Sledi stanjem Q-Credits, obdeluje transakcije in zagotavlja, da nihche ne more ustvariti denarja iz nichesar. Najvechja zalogo: 21.000.000 QC, uveljavljena s kodo. Bloki vsakih 30 sekund. Dvojno podpisani z ML-DSA-65 in SPHINCS+. Validatorji izbrani po Dokazu prispevka, ne po bogastvu. Je financhna hrbtenica platforme svobode SPEAQ.",
    },
  ],
  lg: [
    {
      question: "SPEAQ ekozesa ebikakasibwa ki ebya NIST?",
      answer: "SPEAQ ekozesa standdaadi eziwera ez'omu maaso ez'ekikwantimu, ezikakasiziddwa NIST: Kyber-768 (FIPS 203) olw'okusiba ebisumuluzo, ML-DSA-65 (FIPS 204) olw'okusayina kwe digital ku by'enfuna mu wallet, ne SPHINCS+ (FIPS 205) olw'okusayina okusigamiziddwa ku hash ku blocks za blockchain. Zino ze standdaadi zemu eziwebwa okukuuma empuliziganya za gavumenti ez'ekyama.",
    },
    {
      question: "Empeereza yakakasizibwa mu ngeri ensungiddwa?",
      answer: "Yee. Enkola z'ekikryptogurafu eza SPEAQ zakakasizibwa mu ngeri ensungiddwa nga bakozesa ProVerif - ekintu ky'okukakasa mu bwa kiyonkimu. Ebika 24 eby'obukuumi byakakasizibwa mu mitindo 7 gy'enkola. Byonna 24 byaddizaayo TRUE. Enteekateeka ya Rust erimu okugezesa 113 okw'ebitundu. Enkola ekozesa ebisinziiro ebisunguddwa NIST (AES-256, SHA-256, Kyber-768, ML-DSA-65, SPHINCS+) n'Enkola ya Double Ratchet.",
    },
    {
      question: "SPEAQ ya open source?",
      answer: "Ennyonyoola y'empeereza y'ekikryptogurafu ya SPEAQ enajjulizibwa mu lubangululu olw'okukebera obukuumi. Appu z'abantu ziteekeddwa okufuulibwa open source oluvannyuma lw'ekiseera eky'okutandika okukozesebwa okusobola abwekusu okukakasa eby'obukuumi bye tusuubiza. Tukkiriza nti abakozesa basaanidde okuyinza okukakasa, si kukkiriza bwokka.",
    },
    {
      question: "SPEAQ Chain kye ki?",
      answer: "SPEAQ Chain ye blockchain eya SPEAQ eyazimbibwa enduusi ekwatagana ne kkomppyuta z'ekikwantimu. Egoberera balance za Q-Credits, erabira transactions, era ekakasa nti tewali ayinza okukola ssente okuva mu bwereere. Obungi bw'okusinga: 21,000,000 QC, okukakasiziddwa koodi. Blocks buli sekkendi 30. Ezisayiniddwa emirundi ebiri ne ML-DSA-65 ne SPHINCS+. Validators balonddebwa Proof of Contribution, si bugagga. Ye mugongo gw'eby'enfuna ogwa pulatifomu y'eddembe ya SPEAQ.",
    },
  ],
  sw: [
    {
      question: "SPEAQ inatumia vyeti vipi vya NIST?",
      answer: "SPEAQ inatekeleza viwango vingi vya kriptografia vya baada ya quantum vilivyoidhinishwa na NIST: Kyber-768 (FIPS 203) kwa ufungaji wa funguo, ML-DSA-65 (FIPS 204) kwa saini za kidijitali kwenye miamala ya pochi, na SPHINCS+ (FIPS 205) kwa saini zinazotegemea hash kwenye vitalu vya blockchain. Hivi ni viwango sawa vinavyopendekezwa kwa kulinda mawasiliano ya siri ya serikali.",
    },
    {
      question: "Je, itifaki imethibitishwa rasmi?",
      answer: "Ndiyo. Itifaki za kriptografia za SPEAQ zimethibitishwa rasmi kwa kutumia ProVerif - chombo cha uthibitisho wa kihisabati. Sifa 24 za usalama zimethibitishwa katika mifano 7 ya itifaki. Zote 24 zilirudisha TRUE. Utekelezaji wa Rust una majaribio 113 ya vitengo. Itifaki inatumia misingi iliyoidhinishwa na NIST (AES-256, SHA-256, Kyber-768, ML-DSA-65, SPHINCS+) na Itifaki ya Double Ratchet.",
    },
    {
      question: "Je, SPEAQ ni chanzo wazi?",
      answer: "Maelezo ya itifaki ya kriptografia ya SPEAQ yatachapishwa kwa uwazi kwa mapitio ya usalama. Programu za mteja zimepangwa kuwa chanzo wazi baada ya kipindi cha awali cha uzinduzi ili kuruhusu uthibitisho huru wa madai yetu ya usalama. Tunaamini watumiaji wanapaswa kuweza kuthibitisha, si kuamini tu.",
    },
    {
      question: "SPEAQ Chain ni nini?",
      answer: "SPEAQ Chain ni blockchain ya SPEAQ iliyojengwa mahsusi inayostahimili quantum. Inafuatilia salio za Q-Credits, inashughulikia miamala, na kuhakikisha hakuna mtu anayeweza kuunda pesa kutoka kwa hakuna kitu. Ugavi wa juu: 21,000,000 QC, unaotekelezwa na msimbo. Vitalu kila sekunde 30. Saini mbili za ML-DSA-65 na SPHINCS+. Wathibitishaji wanachaguliwa kwa Uthibitisho wa Mchango, si kwa utajiri. Ni uti wa mgongo wa kifedha wa jukwaa la uhuru la SPEAQ.",
    },
  ],
};

// ─── ASSEMBLY ───────────────────────────────────────────────────────────────────

export function getFaqData(lang: Lang): FaqCategory[] {
  const titles = categoryTitles[lang];
  return [
    { title: titles[0], items: platform[lang] },
    { title: titles[1], items: security[lang] },
    { title: titles[2], items: wallet[lang] },
    { title: titles[3], items: mining[lang] },
    { title: titles[4], items: blockchain[lang] },
    { title: titles[5], items: features[lang] },
    { title: titles[6], items: technical[lang] },
  ];
}
