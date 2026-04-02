import { useState, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────
const VERIFIED_USERS = [
  { id: 1, name: "Marie L.", avatar: "ML", email: "marie@bassy.fr", password: "bassy2024", since: "Jan 2024", role: "admin" },
  { id: 2, name: "Pierre D.", avatar: "PD", email: "pierre@bassy.fr", password: "bassy2024", since: "Fév 2024", role: "asso" },
  { id: 3, name: "Hélène B.", avatar: "HB", email: "helene@bassy.fr", password: "bassy2024", since: "Mars 2024", role: "membre" },
  { id: 4, name: "Jacques R.", avatar: "JR", email: "jacques@bassy.fr", password: "bassy2024", since: "Avr 2024", role: "membre" },
];

const CATEGORIES = [
  { id: "courses", label: "Courses", icon: "🛒" },
  { id: "trajet", label: "Trajets", icon: "🚗" },
  { id: "ecole", label: "École", icon: "🎒" },
  { id: "jardinage", label: "Jardinage", icon: "🌿" },
  { id: "bricolage", label: "Bricolage", icon: "🔧" },
  { id: "autre", label: "Solidarité", icon: "💙" },
];

const INITIAL_OFFERS = [
  { id: 1, authorId: 1, category: "courses", title: "Direction Rumilly jeudi matin", description: "Je pars au Super U de Rumilly vers 9h. Courses légères pour 2-3 familles.", date: "Jeudi 27 mars", time: "9h00", spots: 3, taken: 1 },
  { id: 2, authorId: 2, category: "ecole", title: "Covoiturage école de Seyssel", description: "Je dépose mes enfants chaque matin à Seyssel. Une place dispo lundi.", date: "Lun → Ven", time: "8h15", spots: 1, taken: 0 },
  { id: 3, authorId: 3, category: "jardinage", title: "Don de plants — potager 2024", description: "Plants de courgettes et tomates ! Venez en chercher près du lavoir.", date: "Ce week-end", time: "Libre", spots: 6, taken: 2 },
];

const INITIAL_NEWS = [
  {
    id: 1, authorId: 2, asso: "Foyer Rural de Bassy",
    title: "Vide-grenier annuel — 6 avril",
    body: "Le foyer rural organise son vide-grenier annuel place de l'église. Venez nombreux ! Les emplacements sont à réserver avant le 1er avril auprès du secrétariat. Restauration sur place.",
    date: "22 mars 2025", type: "evenement",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    likes: 12,
  },
  {
    id: 2, authorId: 2, asso: "Association Sportive Bassy",
    title: "Tournoi de pétanque — inscriptions ouvertes",
    body: "L'AS Bassy organise son tournoi de pétanque le dimanche 13 avril. Doublettes et triplettes bienvenus. Inscriptions avant le 5 avril. Lots pour les 3 premiers.",
    date: "20 mars 2025", type: "sport",
    image: null,
    likes: 8,
  },
  {
    id: 3, authorId: 1, asso: "Mairie de Bassy",
    title: "Conseil municipal — compte-rendu mars",
    body: "Le conseil municipal s'est réuni le 15 mars. Ordre du jour : budget 2025, travaux de voirie rue des Alpes, projet de sentier pédestre. Compte-rendu complet disponible en mairie.",
    date: "18 mars 2025", type: "mairie",
    image: null,
    likes: 5,
  },
];

const INITIAL_ALERTS = [
  {
    id: 1, authorId: 1,
    level: "rouge",
    title: "Vague de cambriolages — quartier des Tilleuls",
    body: "3 cambriolages signalés cette semaine chemin des Tilleuls et rue de la Forêt. Les faits se produisent entre 14h et 17h. Signalez tout véhicule suspect au 17 ou via l'appli.",
    date: "24 mars 2025",
    zone: "Chemin des Tilleuls / Rue de la Forêt",
    signalements: 4,
    confirmed: true,
  },
  {
    id: 2, authorId: 3,
    level: "orange",
    title: "Démarchage suspect à domicile",
    body: "Plusieurs habitants ont signalé des individus se présentant comme techniciens EDF sans RDV. Ne laissez pas entrer des inconnus et appelez EDF pour vérifier.",
    date: "21 mars 2025",
    zone: "Tout le village",
    signalements: 7,
    confirmed: false,
  },
  {
    id: 3, authorId: 4,
    level: "jaune",
    title: "Véhicule signalé — Chemin des Alpes",
    body: "Un véhicule (fourgon blanc sans plaque visible) stationne régulièrement le soir au bout du chemin des Alpes. Signalement transmis à la gendarmerie.",
    date: "19 mars 2025",
    zone: "Chemin des Alpes",
    signalements: 2,
    confirmed: false,
  },
];

const NEWS_TYPES = [
  { id: "evenement", label: "Événement", icon: "📅", color: "#2d7a52" },
  { id: "sport", label: "Sport", icon: "⚽", color: "#2b6cb0" },
  { id: "mairie", label: "Mairie", icon: "🏛️", color: "#7b4f12" },
  { id: "culture", label: "Culture", icon: "🎭", color: "#6b2d7a" },
  { id: "autre", label: "Autre", icon: "📢", color: "#5a7a65" },
];

const ALERT_LEVELS = [
  { id: "rouge", label: "Urgent", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", icon: "🔴" },
  { id: "orange", label: "Attention", color: "#d97706", bg: "#fffbeb", border: "#fcd34d", icon: "🟠" },
  { id: "jaune", label: "Info", color: "#b45309", bg: "#fefce8", border: "#fde68a", icon: "🟡" },
];

const INITIAL_CONVERSATIONS = {
  "1-2": {
    id: "1-2", offerId: 1, participants: [1, 2],
    messages: [
      { id: 1, senderId: 2, text: "Bonjour Marie ! Je suis intéressé pour mes courses de jeudi.", ts: "09:12", read: true },
      { id: 2, senderId: 1, text: "Bonjour Pierre ! Bien sûr, qu'est-ce qu'il vous faut ?", ts: "09:15", read: true },
      { id: 3, senderId: 2, text: "Juste du lait et du pain de mie si possible 🙂", ts: "09:17", read: false },
    ]
  }
};

// ─── STYLES ──────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&family=Fraunces:ital,wght@0,600;0,700;1,500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --g1:#1e4d35;--g2:#2d7a52;--g3:#4aab78;--gp:#d4ede1;
  --b1:#1a3a5c;--b2:#2b6cb0;--b3:#4299e1;--bp:#d0e8f7;
  --cream:#f7faf8;--stone:#e8f0eb;--text:#1a2e22;--muted:#5a7a65;
}
body{background:var(--cream);font-family:'Nunito',sans-serif;}

/* LOGIN */
.login-wrap{min-height:100vh;background:linear-gradient(160deg,var(--g1) 0%,var(--b1) 100%);display:flex;align-items:center;justify-content:center;padding:24px 16px;position:relative;overflow:hidden;}
.orb{position:absolute;border-radius:50%;pointer-events:none;}
.login-card{background:rgba(255,255,255,0.97);border-radius:28px;padding:36px 28px;width:100%;max-width:400px;box-shadow:0 24px 80px rgba(0,0,0,0.28);position:relative;z-index:1;animation:slideUp 0.5s cubic-bezier(.34,1.56,.64,1);}
@keyframes slideUp{from{opacity:0;transform:translateY(40px) scale(0.95);}to{opacity:1;transform:translateY(0) scale(1);}}
.login-mountain{font-size:40px;display:block;text-align:center;animation:float 3s ease-in-out infinite;}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
.login-title{font-family:'Fraunces',serif;font-size:26px;color:var(--g1);font-weight:700;text-align:center;margin-top:8px;}
.login-sub{font-size:13px;color:var(--muted);margin-top:4px;font-weight:600;text-align:center;}
.divider{height:1px;background:linear-gradient(90deg,transparent,#ddeee5,transparent);margin:22px 0;}
.f-label{font-size:11px;font-weight:800;color:var(--g2);text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:7px;}
.f-input{width:100%;padding:13px 16px;border:1.5px solid #c8ddd0;border-radius:13px;font-size:15px;font-family:'Nunito',sans-serif;background:var(--cream);color:var(--text);outline:none;transition:border 0.2s,box-shadow 0.2s;}
.f-input:focus{border-color:var(--g2);box-shadow:0 0 0 3px rgba(45,122,82,0.12);background:#fff;}
.f-input.err{border-color:#e05c5c;}
.err-box{background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:11px 14px;font-size:13px;color:#b91c1c;font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
.btn-main{width:100%;padding:15px;background:linear-gradient(135deg,var(--g2),var(--g1));color:#fff;border:none;border-radius:13px;font-size:15px;font-family:'Nunito',sans-serif;font-weight:800;cursor:pointer;box-shadow:0 4px 16px rgba(30,77,53,0.3);transition:all 0.2s;margin-bottom:14px;}
.btn-main:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(30,77,53,0.4);}
.btn-main:disabled{opacity:0.7;cursor:not-allowed;transform:none;}
.info-box{background:var(--bp);border-radius:12px;padding:12px 15px;font-size:12px;color:var(--b1);font-weight:600;line-height:1.6;text-align:center;}
.demo-box{margin-top:18px;padding:14px;background:#f0faf5;border-radius:12px;border:1px dashed #b0d9c0;}
.demo-row{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:8px;cursor:pointer;transition:background 0.15s;margin-bottom:4px;}
.demo-row:hover{background:rgba(45,122,82,0.08);}

/* APP */
.app-wrap{min-height:100vh;background:var(--cream);}
.header{background:linear-gradient(160deg,var(--g1) 0%,var(--b1) 100%);padding:0 16px;position:relative;overflow:hidden;}
.header-inner{max-width:540px;margin:0 auto;padding:20px 0 0;position:relative;}
.user-pill{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,0.12);border-radius:22px;padding:7px 13px;border:1px solid rgba(255,255,255,0.2);cursor:pointer;transition:background 0.2s;}
.user-pill:hover{background:rgba(255,255,255,0.2);}
.stats-row{display:flex;gap:10px;margin-bottom:18px;}
.stat-pill{background:rgba(255,255,255,0.12);border-radius:14px;padding:11px 14px;text-align:center;flex:1;border:1px solid rgba(255,255,255,0.18);}
.nav-tabs{display:flex;overflow-x:auto;scrollbar-width:none;}
.nav-tab{flex-shrink:0;padding:12px 10px;background:transparent;border:none;font-family:'Nunito',sans-serif;font-size:11px;font-weight:700;cursor:pointer;color:rgba(255,255,255,0.5);border-bottom:3px solid transparent;transition:all 0.2s;position:relative;white-space:nowrap;}
.nav-tab.active{color:#fff;border-bottom-color:#7dd9a8;}
.notif-dot{position:absolute;top:7px;right:4px;width:7px;height:7px;border-radius:50%;background:#ff6b6b;border:1.5px solid var(--g1);}

/* CONTENT */
.content{max-width:540px;margin:0 auto;padding:18px 14px 70px;}
.card{background:#fff;border-radius:20px;padding:18px;margin-bottom:12px;border:1px solid #ddeee5;box-shadow:0 2px 10px rgba(30,77,53,0.05);transition:box-shadow 0.25s,transform 0.25s;}
.card:hover{box-shadow:0 5px 24px rgba(30,77,53,0.1);transform:translateY(-1px);}
.avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--g3),var(--b2));color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;}
.verified-badge{display:inline-flex;align-items:center;gap:3px;background:rgba(74,171,120,0.12);color:var(--g3);border-radius:20px;padding:2px 8px;font-size:11px;font-weight:800;}
.cat-badge{display:inline-flex;align-items:center;gap:4px;background:var(--bp);color:var(--b1);border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700;}
.progress-bar{height:5px;background:var(--stone);border-radius:10px;overflow:hidden;}
.progress-fill{height:100%;border-radius:10px;transition:width 0.5s ease;}
.chip{background:var(--stone);border:1.5px solid #c8ddd0;border-radius:20px;padding:6px 13px;font-size:12px;cursor:pointer;font-family:'Nunito',sans-serif;font-weight:600;transition:all 0.2s;white-space:nowrap;color:#2d5040;}
.chip:hover{background:var(--gp);border-color:var(--g3);}
.chip.active{background:var(--g2);color:#fff;border-color:var(--g2);}
.chips-scroll{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:18px;scrollbar-width:none;}
.btn-primary{background:linear-gradient(135deg,var(--g2),var(--g1));color:#fff;border:none;border-radius:11px;padding:10px 18px;font-size:13px;font-family:'Nunito',sans-serif;font-weight:800;cursor:pointer;transition:all 0.2s;box-shadow:0 3px 10px rgba(30,77,53,0.2);}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 5px 16px rgba(30,77,53,0.3);}
.btn-red{background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;border:none;border-radius:11px;padding:10px 18px;font-size:13px;font-family:'Nunito',sans-serif;font-weight:800;cursor:pointer;transition:all 0.2s;box-shadow:0 3px 10px rgba(220,38,38,0.25);}
.btn-red:hover{transform:translateY(-1px);}
.btn-outline{background:transparent;color:var(--g2);border:2px solid var(--g2);border-radius:11px;padding:9px 18px;font-size:13px;font-family:'Nunito',sans-serif;font-weight:700;cursor:pointer;transition:all 0.2s;}
.btn-outline:hover{background:var(--gp);}
.section-title{font-family:'Fraunces',serif;font-size:21px;color:var(--g1);font-weight:700;margin-bottom:3px;}
.section-sub{font-size:13px;color:var(--muted);margin-bottom:18px;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:11px;}
@media(max-width:400px){.grid2{grid-template-columns:1fr;}}
.fab{position:fixed;bottom:22px;right:18px;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--g2),var(--b1));color:#fff;border:none;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(30,77,53,0.38);transition:transform 0.2s;z-index:50;}
.fab:hover{transform:scale(1.1);}
.toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);background:var(--g1);color:#fff;padding:13px 22px;border-radius:13px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;z-index:999;box-shadow:0 6px 22px rgba(30,77,53,0.35);animation:toastIn 0.3s cubic-bezier(.34,1.56,.64,1);white-space:nowrap;}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(18px) scale(0.9);}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1);}}
.fade-up{animation:fadeUp 0.35s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

/* NEWS */
.news-img{width:100%;height:180px;object-fit:cover;border-radius:14px;margin-bottom:14px;display:block;}
.news-type-badge{display:inline-flex;align-items:center;gap:4px;border-radius:20px;padding:3px 10px;font-size:11px;font-weight:800;margin-bottom:8px;}
.like-btn{display:flex;align-items:center;gap:5px;background:var(--stone);border:none;border-radius:20px;padding:7px 13px;font-size:13px;font-family:'Nunito',sans-serif;font-weight:700;cursor:pointer;transition:all 0.2s;color:var(--text);}
.like-btn:hover{background:var(--gp);}
.like-btn.liked{background:#fee2e2;color:#dc2626;}
.upload-zone{border:2px dashed #c8ddd0;border-radius:14px;padding:24px;text-align:center;cursor:pointer;transition:all 0.2s;background:var(--stone);}
.upload-zone:hover{border-color:var(--g2);background:var(--gp);}
.upload-preview{width:100%;border-radius:14px;max-height:200px;object-fit:cover;display:block;}

/* ALERT */
.alert-card{border-radius:18px;padding:18px;margin-bottom:12px;border-left:5px solid;transition:box-shadow 0.2s,transform 0.2s;}
.alert-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.1);transform:translateY(-1px);}
.alert-level{display:inline-flex;align-items:center;gap:5px;border-radius:20px;padding:4px 11px;font-size:12px;font-weight:800;margin-bottom:8px;}
.alert-meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.06);}
.alert-meta-item{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#6b5040;}
.signal-btn{display:flex;align-items:center;gap:5px;background:rgba(220,38,38,0.08);border:1px solid rgba(220,38,38,0.2);border-radius:20px;padding:7px 13px;font-size:12px;font-family:'Nunito',sans-serif;font-weight:700;cursor:pointer;color:#dc2626;transition:all 0.2s;}
.signal-btn:hover{background:rgba(220,38,38,0.14);}
.emergency-banner{background:linear-gradient(135deg,#dc2626,#991b1b);border-radius:16px;padding:16px 18px;margin-bottom:18px;display:flex;align-items:center;gap:12px;}

/* CHAT */
.conv-item{display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:15px;cursor:pointer;transition:background 0.15s;margin-bottom:6px;background:#fff;border:1px solid #ddeee5;box-shadow:0 1px 5px rgba(30,77,53,0.04);}
.conv-item:hover{background:#f4faf7;}
.conv-item.unread{border-left:4px solid var(--g3);}
.conv-preview{font-size:12px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px;}
.chat-panel{position:fixed;top:0;left:0;right:0;bottom:0;background:var(--cream);z-index:200;display:flex;flex-direction:column;animation:slideInUp 0.3s cubic-bezier(.34,1.2,.64,1);}
@keyframes slideInUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
.chat-header{background:linear-gradient(135deg,var(--g1),var(--b1));padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;}
.chat-back{background:rgba(255,255,255,0.15);border:none;border-radius:9px;padding:7px 12px;color:#fff;font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;cursor:pointer;}
.chat-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;}
.msg-row{display:flex;align-items:flex-end;gap:7px;}
.msg-row.mine{flex-direction:row-reverse;}
.bubble{max-width:72%;padding:10px 14px;border-radius:17px;font-size:14px;line-height:1.55;font-family:'Nunito',sans-serif;font-weight:600;}
.bubble.theirs{background:#fff;color:var(--text);border:1px solid #ddeee5;border-bottom-left-radius:4px;box-shadow:0 1px 4px rgba(30,77,53,0.05);}
.bubble.mine{background:linear-gradient(135deg,var(--g2),var(--b2));color:#fff;border-bottom-right-radius:4px;}
.bubble-ts{font-size:10px;opacity:0.6;margin-top:3px;font-weight:600;}
.bubble.mine .bubble-ts{text-align:right;}
.chat-input-row{padding:11px 14px;background:#fff;border-top:1px solid #ddeee5;display:flex;gap:9px;align-items:flex-end;flex-shrink:0;}
.chat-input{flex:1;padding:11px 15px;border:1.5px solid #c8ddd0;border-radius:20px;font-size:14px;font-family:'Nunito',sans-serif;background:var(--cream);color:var(--text);outline:none;resize:none;max-height:90px;transition:border 0.2s;}
.chat-input:focus{border-color:var(--g2);background:#fff;}
.send-btn{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--g2),var(--b1));border:none;color:#fff;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 10px rgba(30,77,53,0.25);transition:transform 0.15s;}
.send-btn:hover{transform:scale(1.08);}
.typing-indicator{display:flex;align-items:center;gap:4px;padding:8px 12px;background:#fff;border-radius:16px;border:1px solid #ddeee5;width:fit-content;}
.typing-dot{width:6px;height:6px;border-radius:50%;background:var(--g3);animation:typingBounce 1.2s infinite;}
.typing-dot:nth-child(2){animation-delay:0.2s;}
.typing-dot:nth-child(3){animation-delay:0.4s;}
@keyframes typingBounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-5px);}}
`;

// ─── HELPERS ─────────────────────────────────────────────
const userOf = id => VERIFIED_USERS.find(u => u.id === id);
const catOf = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[5];
const newsTypeOf = id => NEWS_TYPES.find(t => t.id === id) || NEWS_TYPES[4];
const alertLevelOf = id => ALERT_LEVELS.find(l => l.id === id) || ALERT_LEVELS[2];
const getConvKey = (a, b) => [Math.min(a, b), Math.max(a, b)].join("-");
const now = () => { const d = new Date(); return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`; };

// ─── CHAT PANEL ──────────────────────────────────────────
function ChatPanel({ convKey, conversations, currentUser, onBack, onSend }) {
  const conv = conversations[convKey];
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const otherId = conv.participants.find(id => id !== currentUser.id);
  const other = userOf(otherId);
  const offer = INITIAL_OFFERS.find(o => o.id === conv.offerId);

  useState(() => { setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100); }, []);

  const simulateReply = () => {
    setTyping(true);
    const replies = ["Parfait, merci ! 🙏", "Super, je note ! À bientôt.", "D'accord 😊", "Entendu, on se coordonne ?", "Merci pour le message !"];
    setTimeout(() => {
      setTyping(false);
      onSend(convKey, otherId, replies[Math.floor(Math.random() * replies.length)]);
    }, 1400 + Math.random() * 800);
  };

  const handleSend = () => {
    const t = text.trim(); if (!t) return;
    onSend(convKey, currentUser.id, t); setText("");
    simulateReply();
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <button className="chat-back" onClick={onBack}>← Retour</button>
        <div className="avatar" style={{ width: 34, height: 34, fontSize: 11 }}>{other.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#fff" }}>{other.name}</div>
          {offer && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>📌 {offer.title}</div>}
        </div>
      </div>
      <div className="chat-messages">
        <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", fontWeight: 700, padding: "4px 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Aujourd'hui</div>
        {conv.messages.map(msg => {
          const isMine = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`msg-row ${isMine ? "mine" : ""}`}>
              {!isMine && <div className="avatar" style={{ width: 26, height: 26, fontSize: 10, marginBottom: 4 }}>{other.avatar}</div>}
              <div className={`bubble ${isMine ? "mine" : "theirs"}`}>
                {msg.text}<div className="bubble-ts">{msg.ts}{isMine && " ✓"}</div>
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="msg-row">
            <div className="avatar" style={{ width: 26, height: 26, fontSize: 10, marginBottom: 4 }}>{other.avatar}</div>
            <div className="typing-indicator"><div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-row">
        <textarea ref={inputRef} className="chat-input" placeholder={`Écrire à ${other.name.split(" ")[0]}…`}
          value={text} rows={1}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
        <button className="send-btn" onClick={handleSend}>➤</button>
      </div>
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────
function LoginPage({ onLogin, onRequest }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const doLogin = () => {
    setErr(""); if (!email || !pw) { setErr("Veuillez remplir tous les champs."); return; }
    setLoading(true);
    setTimeout(() => {
      const u = VERIFIED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pw);
      if (u) onLogin(u); else { setErr("Email ou mot de passe incorrect."); setLoading(false); }
    }, 800);
  };
  return (
    <div className="login-wrap">
      <div className="orb" style={{ width: 300, height: 300, background: "radial-gradient(circle,rgba(74,171,120,0.2),transparent 70%)", top: -80, right: -60 }} />
      <div className="login-card">
        <span className="login-mountain">🏔️</span>
        <div className="login-title">Bassy Entraide</div>
        <div className="login-sub">Bassy · Haute-Savoie 74</div>
        <div className="divider" />
        {err && <div className="err-box">⚠️ {err}</div>}
        <div style={{ marginBottom: 16 }}>
          <label className="f-label">Email</label>
          <input className={`f-input ${err ? "err" : ""}`} type="email" placeholder="votre@email.fr" value={email}
            onChange={e => { setEmail(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && doLogin()} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label className="f-label">Mot de passe</label>
          <div style={{ position: "relative" }}>
            <input className={`f-input ${err ? "err" : ""}`} type={showPw ? "text" : "password"} placeholder="••••••••" value={pw}
              onChange={e => { setPw(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && doLogin()} style={{ paddingRight: 44 }} />
            <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#5a7a65" }}>{showPw ? "🙈" : "👁️"}</button>
          </div>
        </div>
        <button className="btn-main" onClick={doLogin} disabled={loading}>{loading ? "Vérification…" : "Se connecter →"}</button>
        <div className="info-box">🔒 Accès réservé aux habitants vérifiés de Bassy.</div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
          Pas encore de compte ? <span style={{ color: "var(--g2)", fontWeight: 800, cursor: "pointer", textDecoration: "underline" }} onClick={onRequest}>Demander l'accès</span>
        </div>
        <div className="demo-box">
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--g2)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>🧪 Comptes démo</div>
          {VERIFIED_USERS.slice(0, 3).map(u => (
            <div key={u.id} className="demo-row" onClick={() => { setEmail(u.email); setPw(u.password); setErr(""); }}>
              <div><div style={{ fontSize: 13, fontWeight: 700 }}>{u.name}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{u.email} · bassy2024</div></div>
              <span style={{ color: "var(--g3)", fontSize: 14 }}>→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────
function MainApp({ user, onLogout }) {
  const [view, setView] = useState("feed");
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [filterCat, setFilterCat] = useState("all");
  const [newOffer, setNewOffer] = useState({ title: "", category: "courses", description: "", date: "", time: "", spots: 1 });
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConv, setActiveConv] = useState(null);

  // News state
  const [news, setNews] = useState(INITIAL_NEWS);
  const [likedNews, setLikedNews] = useState([]);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newNews, setNewNews] = useState({ title: "", asso: "", body: "", type: "evenement", image: null });
  const newsImgRef = useRef(null);

  // Alerts state
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [signaled, setSignaled] = useState([]);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ title: "", body: "", level: "orange", zone: "" });

  const [toast, setToast] = useState(null);
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const unreadCount = Object.values(conversations).filter(c =>
    c.participants.includes(user.id) && c.messages.some(m => m.senderId !== user.id && !m.read)
  ).length;
  const urgentAlerts = alerts.filter(a => a.level === "rouge").length;

  const myConvs = Object.values(conversations).filter(c => c.participants.includes(user.id));

  const openOrCreateConv = offer => {
    if (offer.authorId === user.id) { showToast("C'est votre propre service !"); return; }
    const key = getConvKey(user.id, offer.authorId);
    if (!conversations[key]) {
      setConversations(prev => ({
        ...prev,
        [key]: { id: key, offerId: offer.id, participants: [user.id, offer.authorId], messages: [{ id: Date.now(), senderId: user.id, text: `Bonjour ! Je suis intéressé(e) par votre offre "${offer.title}".`, ts: now(), read: true }] }
      }));
    }
    setActiveConv(key); setView("messages");
  };

  const sendMessage = (convKey, senderId, text) => {
    setConversations(prev => ({
      ...prev,
      [convKey]: { ...prev[convKey], messages: [...prev[convKey].messages, { id: Date.now(), senderId, text, ts: now(), read: senderId === user.id }] }
    }));
  };
  const markRead = convKey => setConversations(prev => ({ ...prev, [convKey]: { ...prev[convKey], messages: prev[convKey].messages.map(m => ({ ...m, read: true })) } }));

  // News
  const handleImageUpload = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setNewNews(n => ({ ...n, image: ev.target.result }));
    reader.readAsDataURL(file);
  };
  const publishNews = () => {
    if (!newNews.title || !newNews.body) { showToast("⚠️ Titre et contenu requis."); return; }
    setNews([{ id: Date.now(), authorId: user.id, asso: newNews.asso || user.name, title: newNews.title, body: newNews.body, type: newNews.type, image: newNews.image, date: "Aujourd'hui", likes: 0 }, ...news]);
    setNewNews({ title: "", asso: "", body: "", type: "evenement", image: null });
    setShowNewsForm(false); showToast("🎉 Actualité publiée !");
  };

  // Alerts
  const publishAlert = () => {
    if (!newAlert.title || !newAlert.body) { showToast("⚠️ Titre et description requis."); return; }
    setAlerts([{ id: Date.now(), authorId: user.id, level: newAlert.level, title: newAlert.title, body: newAlert.body, zone: newAlert.zone || "Village de Bassy", date: "Aujourd'hui", signalements: 1, confirmed: false }, ...alerts]);
    setNewAlert({ title: "", body: "", level: "orange", zone: "" });
    setShowAlertForm(false); showToast("🚨 Alerte publiée !");
  };
  const signalAlert = id => {
    if (signaled.includes(id)) return;
    setSignaled([...signaled, id]);
    setAlerts(alerts.map(a => a.id === id ? { ...a, signalements: a.signalements + 1 } : a));
    showToast("✅ Signalement pris en compte");
  };

  const handlePublishOffer = () => {
    if (!newOffer.title || !newOffer.description) { showToast("⚠️ Titre et description requis."); return; }
    setOffers([{ id: Date.now(), authorId: user.id, category: newOffer.category, title: newOffer.title, description: newOffer.description, date: newOffer.date || "À définir", time: newOffer.time || "À convenir", spots: parseInt(newOffer.spots) || 1, taken: 0 }, ...offers]);
    showToast("🎉 Service publié !"); setNewOffer({ title: "", category: "courses", description: "", date: "", time: "", spots: 1 });
    setTimeout(() => setView("feed"), 1200);
  };

  const filtered = filterCat === "all" ? offers : offers.filter(o => o.category === filterCat);

  return (
    <div className="app-wrap">
      {activeConv && (
        <ChatPanel convKey={activeConv} conversations={conversations} currentUser={user}
          onBack={() => { markRead(activeConv); setActiveConv(null); }} onSend={sendMessage} />
      )}

      {/* Header */}
      <div className="header">
        <div className="orb" style={{ width: 200, height: 200, background: "radial-gradient(circle,rgba(74,171,120,0.18),transparent 70%)", top: -60, right: -40 }} />
        <div className="header-inner">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, color: "#fff", fontWeight: 700 }}>🏔️ Bassy Entraide</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2, fontWeight: 600 }}>Bassy · Haute-Savoie 74</div>
            </div>
            <div className="user-pill" onClick={onLogout}>
              <div className="avatar" style={{ width: 27, height: 27, fontSize: 10 }}>{user.avatar}</div>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>{user.name.split(" ")[0]}</span>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7dd9a8", display: "inline-block" }} />
            </div>
          </div>
          <div className="stats-row">
            {[["14", "Voisins"], ["42", "Services"], ["5", "Actus"]].map(([n, l]) => (
              <div key={l} className="stat-pill">
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 19, color: "#fff", fontWeight: 700 }}>{n}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 1, fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="nav-tabs">
            {[
              { k: "feed", i: "🏡", l: "Services" },
              { k: "publish", i: "＋", l: "Proposer" },
              { k: "news", i: "📰", l: "Actualités" },
              { k: "vigilance", i: "🚨", l: "Vigilance" },
              { k: "messages", i: "💬", l: "Messages" },
              { k: "members", i: "👥", l: "Voisins" },
            ].map(t => (
              <button key={t.k} className={`nav-tab ${view === t.k ? "active" : ""}`} onClick={() => { setView(t.k); setActiveConv(null); }}>
                <span style={{ marginRight: 3 }}>{t.i}</span>{t.l}
                {t.k === "messages" && unreadCount > 0 && <span className="notif-dot" />}
                {t.k === "vigilance" && urgentAlerts > 0 && <span className="notif-dot" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="content">

        {/* ── FEED ── */}
        {view === "feed" && (
          <div className="fade-up">
            <div className="chips-scroll">
              <button className={`chip ${filterCat === "all" ? "active" : ""}`} onClick={() => setFilterCat("all")}>✨ Tous</button>
              {CATEGORIES.map(c => (
                <button key={c.id} className={`chip ${filterCat === c.id ? "active" : ""}`} onClick={() => setFilterCat(c.id)}>{c.icon} {c.label}</button>
              ))}
            </div>
            {filtered.map(offer => {
              const author = userOf(offer.authorId); const c = catOf(offer.category);
              const pct = Math.round((offer.taken / offer.spots) * 100);
              const isFull = offer.taken >= offer.spots; const isMine = offer.authorId === user.id;
              return (
                <div key={offer.id} className="card">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                    <div className="avatar">{author.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, fontSize: 13 }}>{author.name}</span>
                        <span className="verified-badge">✓</span>
                        {isMine && <span style={{ fontSize: 10, fontWeight: 800, background: "#fff3cd", color: "#92620a", borderRadius: 20, padding: "2px 8px" }}>Votre offre</span>}
                      </div>
                    </div>
                    <span className="cat-badge">{c.icon} {c.label}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{offer.title}</h3>
                  <p style={{ fontSize: 13, color: "#4a6255", lineHeight: 1.6, marginBottom: 12 }}>{offer.description}</p>
                  <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "#5a7a65", fontWeight: 600 }}>📅 {offer.date}</span>
                    <span style={{ fontSize: 12, color: "#5a7a65", fontWeight: 600 }}>🕐 {offer.time}</span>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, fontWeight: 700, color: "#5a7a65" }}>
                      <span>{offer.taken}/{offer.spots} place{offer.spots > 1 ? "s" : ""}</span>
                      <span style={{ color: isFull ? "#e05c5c" : "#2d7a52" }}>{isFull ? "Complet" : `${offer.spots - offer.taken} dispo`}</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: isFull ? "#e05c5c" : "linear-gradient(90deg,#2d7a52,#2b6cb0)" }} /></div>
                  </div>
                  {!isMine && !isFull && (
                    <button className="btn-primary" style={{ fontSize: 12, padding: "9px 16px" }} onClick={() => openOrCreateConv(offer)}>💬 Je suis intéressé(e)</button>
                  )}
                  {isFull && !isMine && <span style={{ fontSize: 12, color: "#e05c5c", fontWeight: 800 }}>● Complet</span>}
                </div>
              );
            })}
            <button className="fab" onClick={() => setView("publish")}>＋</button>
          </div>
        )}

        {/* ── PUBLISH ── */}
        {view === "publish" && (
          <div className="fade-up">
            <div className="card" style={{ padding: 22 }}>
              <div className="section-title">Proposer un service</div>
              <div className="section-sub">Aidez un voisin 🌿</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div><label className="f-label">Catégorie</label>
                  <select className="f-input" value={newOffer.category} onChange={e => setNewOffer({ ...newOffer, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                  </select>
                </div>
                <div><label className="f-label">Titre</label><input className="f-input" placeholder="Ex : Je vais à Rumilly samedi…" value={newOffer.title} onChange={e => setNewOffer({ ...newOffer, title: e.target.value })} /></div>
                <div><label className="f-label">Description</label><textarea className="f-input" rows={3} placeholder="Détails, conditions…" value={newOffer.description} onChange={e => setNewOffer({ ...newOffer, description: e.target.value })} /></div>
                <div className="grid2">
                  <div><label className="f-label">Date</label><input className="f-input" type="date" value={newOffer.date} onChange={e => setNewOffer({ ...newOffer, date: e.target.value })} /></div>
                  <div><label className="f-label">Heure</label><input className="f-input" type="time" value={newOffer.time} onChange={e => setNewOffer({ ...newOffer, time: e.target.value })} /></div>
                </div>
                <div><label className="f-label">Places</label><input className="f-input" type="number" min={1} max={20} value={newOffer.spots} onChange={e => setNewOffer({ ...newOffer, spots: e.target.value })} /></div>
                <button className="btn-main" style={{ fontSize: 15 }} onClick={handlePublishOffer}>Publier le service</button>
              </div>
            </div>
          </div>
        )}

        {/* ── NEWS ── */}
        {view === "news" && (
          <div className="fade-up">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div className="section-title">Actualités</div>
              <button className="btn-primary" style={{ fontSize: 12, padding: "8px 14px" }} onClick={() => setShowNewsForm(!showNewsForm)}>
                {showNewsForm ? "✕ Fermer" : "＋ Publier"}
              </button>
            </div>
            <div className="section-sub">Associations & mairie de Bassy</div>

            {/* Publish form */}
            {showNewsForm && (
              <div className="card fade-up" style={{ padding: 20, border: "2px solid var(--gp)", marginBottom: 18 }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, marginBottom: 14, color: "var(--g1)" }}>Nouvelle publication</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div><label className="f-label">Nom de l'association / organisme</label><input className="f-input" placeholder="Foyer Rural de Bassy, Mairie…" value={newNews.asso} onChange={e => setNewNews({ ...newNews, asso: e.target.value })} /></div>
                  <div><label className="f-label">Type</label>
                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                      {NEWS_TYPES.map(t => (
                        <button key={t.id} onClick={() => setNewNews({ ...newNews, type: t.id })}
                          style={{ padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${newNews.type === t.id ? t.color : "#c8ddd0"}`, background: newNews.type === t.id ? t.color : "transparent", color: newNews.type === t.id ? "#fff" : "#5a7a65", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
                          {t.icon} {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div><label className="f-label">Titre</label><input className="f-input" placeholder="Vide-grenier, tournoi, réunion…" value={newNews.title} onChange={e => setNewNews({ ...newNews, title: e.target.value })} /></div>
                  <div><label className="f-label">Contenu</label><textarea className="f-input" rows={4} placeholder="Décrivez l'événement ou l'actualité…" value={newNews.body} onChange={e => setNewNews({ ...newNews, body: e.target.value })} /></div>
                  <div>
                    <label className="f-label">Affiche / Image (optionnel)</label>
                    <input ref={newsImgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                    {newNews.image ? (
                      <div style={{ position: "relative" }}>
                        <img src={newNews.image} alt="preview" className="upload-preview" />
                        <button onClick={() => setNewNews({ ...newNews, image: null })}
                          style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 28, height: 28, color: "#fff", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                      </div>
                    ) : (
                      <div className="upload-zone" onClick={() => newsImgRef.current?.click()}>
                        <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--g2)" }}>Cliquer pour ajouter une affiche</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>JPG, PNG — max 5 Mo</div>
                      </div>
                    )}
                  </div>
                  <button className="btn-main" style={{ fontSize: 14 }} onClick={publishNews}>Publier l'actualité</button>
                </div>
              </div>
            )}

            {/* News list */}
            {news.map(item => {
              const t = newsTypeOf(item.type);
              const isLiked = likedNews.includes(item.id);
              return (
                <div key={item.id} className="card">
                  {item.image && <img src={item.image} alt={item.title} className="news-img" />}
                  <div className="news-type-badge" style={{ background: t.color + "18", color: t.color }}>
                    {t.icon} {t.label}
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, marginBottom: 6, color: "var(--text)", lineHeight: 1.35 }}>{item.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--g2)" }}>🏘️ {item.asso}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>· {item.date}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#4a6255", lineHeight: 1.7, marginBottom: 14 }}>{item.body}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button className={`like-btn ${isLiked ? "liked" : ""}`}
                      onClick={() => {
                        if (!isLiked) { setLikedNews([...likedNews, item.id]); setNews(news.map(n => n.id === item.id ? { ...n, likes: n.likes + 1 } : n)); }
                      }}>
                      {isLiked ? "❤️" : "🤍"} {item.likes}
                    </button>
                    <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>J'aime</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── VIGILANCE ── */}
        {view === "vigilance" && (
          <div className="fade-up">
            {/* Emergency banner */}
            <div className="emergency-banner">
              <div style={{ fontSize: 28, flexShrink: 0 }}>🚨</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Urgence — Composez le 17</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2, fontWeight: 600 }}>Gendarmerie · Sécurité civile : 15 · Pompiers : 18</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div className="section-title">Vigilance</div>
              <button className="btn-red" style={{ fontSize: 12, padding: "8px 14px" }} onClick={() => setShowAlertForm(!showAlertForm)}>
                {showAlertForm ? "✕ Fermer" : "⚠️ Signaler"}
              </button>
            </div>
            <div className="section-sub">Alertes et signalements du village</div>

            {/* Alert form */}
            {showAlertForm && (
              <div className="card fade-up" style={{ padding: 20, border: "2px solid #fca5a5", marginBottom: 18 }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, marginBottom: 14, color: "#991b1b" }}>⚠️ Nouveau signalement</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="f-label">Niveau d'alerte</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {ALERT_LEVELS.map(l => (
                        <button key={l.id} onClick={() => setNewAlert({ ...newAlert, level: l.id })}
                          style={{ flex: 1, padding: "9px 6px", borderRadius: 11, border: `2px solid ${newAlert.level === l.id ? l.color : "#c8ddd0"}`, background: newAlert.level === l.id ? l.bg : "transparent", color: l.color, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.15s" }}>
                          {l.icon} {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div><label className="f-label">Titre</label><input className="f-input" placeholder="Ex : Cambriolage rue des Alpes" value={newAlert.title} onChange={e => setNewAlert({ ...newAlert, title: e.target.value })} /></div>
                  <div><label className="f-label">Zone concernée</label><input className="f-input" placeholder="Rue, quartier, lieu…" value={newAlert.zone} onChange={e => setNewAlert({ ...newAlert, zone: e.target.value })} /></div>
                  <div><label className="f-label">Description</label><textarea className="f-input" rows={4} placeholder="Décrivez ce qui a été observé, à quelle heure, tout détail utile…" value={newAlert.body} onChange={e => setNewAlert({ ...newAlert, body: e.target.value })} /></div>
                  <div style={{ background: "#fffbeb", borderRadius: 10, padding: "10px 13px", fontSize: 12, color: "#92620a", fontWeight: 600 }}>
                    ℹ️ Votre signalement sera visible par tous les membres vérifiés. Pour une urgence, appelez le 17.
                  </div>
                  <button className="btn-red" style={{ width: "100%", padding: 14, fontSize: 14 }} onClick={publishAlert}>Publier le signalement</button>
                </div>
              </div>
            )}

            {/* Alert cards */}
            {alerts.map(alert => {
              const lvl = alertLevelOf(alert.level);
              const author = userOf(alert.authorId);
              const isSignaled = signaled.includes(alert.id);
              return (
                <div key={alert.id} className="alert-card" style={{ background: lvl.bg, borderColor: lvl.color }}>
                  <div className="alert-level" style={{ background: lvl.color + "18", color: lvl.color }}>
                    {lvl.icon} {lvl.label}
                    {alert.confirmed && <span style={{ background: lvl.color, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, marginLeft: 4 }}>Confirmé</span>}
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#1a1a1a", lineHeight: 1.35 }}>{alert.title}</h3>
                  <p style={{ fontSize: 13, color: "#4a3020", lineHeight: 1.65, marginBottom: 0 }}>{alert.body}</p>
                  <div className="alert-meta">
                    <span className="alert-meta-item">📍 {alert.zone}</span>
                    <span className="alert-meta-item">📅 {alert.date}</span>
                    <span className="alert-meta-item">👤 {author?.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontSize: 12, color: lvl.color, fontWeight: 800 }}>
                      ⚠️ {alert.signalements} signalement{alert.signalements > 1 ? "s" : ""}
                    </span>
                    <button className="signal-btn"
                      style={{ opacity: isSignaled ? 0.6 : 1 }}
                      onClick={() => signalAlert(alert.id)}>
                      {isSignaled ? "✓ Signalé" : "+ Je confirme aussi"}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Safety tips */}
            <div style={{ background: "linear-gradient(135deg,var(--g1),var(--b1))", borderRadius: 18, padding: 20, marginTop: 6, color: "#fff" }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🔒 Conseils de sécurité</div>
              {["Ne laissez pas de valeurs visibles dans votre voiture", "Signalez tout véhicule ou comportement suspect au 17", "Fermez portails et volets la nuit", "Échangez vos numéros entre voisins"].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 9, marginBottom: 9, fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
                  <span style={{ color: "#7dd9a8", flexShrink: 0 }}>✓</span>{tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MESSAGES ── */}
        {view === "messages" && (
          <div className="fade-up">
            <div className="section-title">Messages</div>
            <div className="section-sub">Conversations avec vos voisins</div>
            {myConvs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 0", color: "var(--muted)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, color: "var(--g1)", marginBottom: 8 }}>Pas encore de message</div>
                <button className="btn-primary" onClick={() => setView("feed")}>Voir les services</button>
              </div>
            ) : myConvs.map(conv => {
              const otherId = conv.participants.find(id => id !== user.id);
              const other = userOf(otherId);
              const offer = INITIAL_OFFERS.find(o => o.id === conv.offerId);
              const last = conv.messages[conv.messages.length - 1];
              const hasUnread = conv.messages.some(m => m.senderId !== user.id && !m.read);
              return (
                <div key={conv.id} className={`conv-item ${hasUnread ? "unread" : ""}`}
                  onClick={() => { markRead(conv.id); setActiveConv(conv.id); }}>
                  <div style={{ position: "relative" }}>
                    <div className="avatar">{other.avatar}</div>
                    {hasUnread && <span style={{ position: "absolute", top: -2, right: -2, width: 9, height: 9, borderRadius: "50%", background: "#ff6b6b", border: "2px solid #fff" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 800, fontSize: 14 }}>{other.name}</span>
                      {last && <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{last.ts}</span>}
                    </div>
                    {offer && <div style={{ fontSize: 11, color: "var(--g2)", fontWeight: 700, marginTop: 1 }}>📌 {offer.title}</div>}
                    {last && <div className="conv-preview" style={{ fontWeight: hasUnread ? 700 : 400 }}>{last.senderId === user.id ? "Vous : " : ""}{last.text}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── MEMBERS ── */}
        {view === "members" && (
          <div className="fade-up">
            <div className="section-title">Voisins de Bassy</div>
            <div className="section-sub">Communauté vérifiée</div>
            {VERIFIED_USERS.map(m => (
              <div key={m.id} className="card" style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div className="avatar">{m.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "#5a7a65", marginTop: 1 }}>Depuis {m.since}</div>
                </div>
                {m.id === user.id
                  ? <span style={{ fontSize: 10, fontWeight: 800, background: "#fff3cd", color: "#92620a", borderRadius: 20, padding: "3px 9px" }}>Vous</span>
                  : <span className="verified-badge">✓ Vérifié</span>}
              </div>
            ))}
            <div style={{ background: "linear-gradient(135deg,#1e4d35,#1a3a5c)", borderRadius: 18, padding: 22, textAlign: "center", color: "#fff", marginTop: 6 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🏔️</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, marginBottom: 7, fontWeight: 700 }}>Inviter un voisin</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 16, lineHeight: 1.6 }}>Validation manuelle pour garantir la confiance.</p>
              <button className="btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.1)" }}
                onClick={() => showToast("🔗 Lien copié !")}>Copier le lien</button>
            </div>
            <div style={{ marginTop: 18, textAlign: "center" }}>
              <button style={{ background: "none", border: "1.5px solid #c8ddd0", borderRadius: 10, padding: "7px 14px", fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 700, color: "var(--muted)", cursor: "pointer" }} onClick={onLogout}>🚪 Déconnexion</button>
            </div>
          </div>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ─── REQUEST ─────────────────────────────────────────────
function RequestPage({ onBack }) {
  const [f, setF] = useState({ nom: "", email: "", adresse: "" }); const [sent, setSent] = useState(false);
  return (
    <div className="login-wrap">
      <div className="orb" style={{ width: 300, height: 300, background: "radial-gradient(circle,rgba(74,171,120,0.2),transparent 70%)", top: -80, right: -60 }} />
      <div className="login-card">
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 18, display: "flex", alignItems: "center", gap: 5 }}>← Retour</button>
        {!sent ? <>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 36 }}>🤝</span>
            <div className="login-title" style={{ fontSize: 22 }}>Demander l'accès</div>
            <div className="login-sub">Validation par l'administrateur</div>
          </div>
          <div className="divider" />
          {[{ k: "nom", l: "Nom & Prénom", p: "Jean Dupont", t: "text" }, { k: "email", l: "Email", p: "jean@email.fr", t: "email" }, { k: "adresse", l: "Adresse à Bassy", p: "12 chemin des Alpes", t: "text" }].map(x => (
            <div key={x.k} style={{ marginBottom: 15 }}>
              <label className="f-label">{x.l}</label>
              <input className="f-input" type={x.t} placeholder={x.p} value={f[x.k]} onChange={e => setF({ ...f, [x.k]: e.target.value })} />
            </div>
          ))}
          <button className="btn-main" onClick={() => f.nom && f.email && setSent(true)}>Envoyer la demande</button>
        </> : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
            <div className="login-title" style={{ fontSize: 20, marginBottom: 8 }}>Demande envoyée !</div>
            <p style={{ fontSize: 13, color: "#5a7a65", lineHeight: 1.65, marginBottom: 22 }}>L'administrateur validera votre demande sous 24–48h.</p>
            <button className="btn-main" onClick={onBack}>Retour à la connexion</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────
export default function Root() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  return (
    <>
      <style>{STYLES}</style>
      {screen === "login" && <LoginPage onLogin={u => { setUser(u); setScreen("app"); }} onRequest={() => setScreen("request")} />}
      {screen === "request" && <RequestPage onBack={() => setScreen("login")} />}
      {screen === "app" && user && <MainApp user={user} onLogout={() => { setUser(null); setScreen("login"); }} />}
    </>
  );
}
