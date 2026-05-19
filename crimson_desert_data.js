// Crimson Desert · Pywel — Database condiviso
// Caricato da: crimson_desert_map.html, crimson_desert_companion.html
// 173 POI raccolti da Fextralife, Game8, PowerPyx, GameSpot, MetaForge, GAMES.GG, VULKK,
//   GameRant, Method.gg, GamesRadar, TheGamer, Sportskeeda, GameDevourer, Magicstark, Pearl Abyss,
//   PCGamer, Nerdschalk, Method, BlogAndGuide, AllThings.How, KeenGamer, eGamersWorld, FandomWire
// Ultimo aggiornamento: 2026-05-05 (Sessione 1 compendio: 19 armi uniche/leggendarie)
//
// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA POI · Campi
// ─────────────────────────────────────────────────────────────────────────────
//   id        string  · identificativo univoco. Per item: "item-<sub>-<slug>"
//                       (es. "item-wpn-darkbringer", "item-arm-crimson-chaser-helm")
//   n         string  · nome visualizzato
//   alt       string  · alias di ricerca (separati da virgola)
//   c         string  · categoria (vedi CATEGORIES)
//   r         string  · regione (Hernand | Pailune | Demeniss | Delesyia | Crimson Desert | Abyss)
//   x, y      number  · coordinate. Default = layout vecchio (rimappato via REGION_REMAP).
//   absolute  bool    · se true, x/y sono coordinate assolute del nuovo layout
//   noMap     bool    · se true, l'entry NON appare come marker sulla mappa
//                       (resta cercabile/listabile nel companion). USO TIPICO: item
//                       senza location precisa (drop boss casuale, vendor rotante,
//                       sistema di crafting puro).
//   mandatory bool    · se true, è storia obbligatoria (boss principale, location
//                       scriptata): il companion lo NASCONDE per default perché il
//                       gioco te lo fa fare per forza. Toggle "Mostra storia
//                       obbligatoria" lo rende visibile.
//   lvl       string  · livello suggerito
//   chap      string  · capitolo storia / sblocco
//   req       string  · prerequisiti narrativi
//   acc       string  · come accedere / dove si trova in dettaglio
//   d         string  · descrizione libera
//   links     array   · [{l: titolo, u: url}, ...] fonti wiki
//
// ─────────────────────────────────────────────────────────────────────────────
// CAMPI EXTRA PER ITEM (categorie weapon/armor/accessory/abysscore/material/
//                       mount/keyitem/manual)
// ─────────────────────────────────────────────────────────────────────────────
//   pg        string[]· PG che possono equipaggiarlo. Valori ammessi:
//                       "Kliff" | "Damiane" | "Oongka" | "any"
//                       Esempi: ["Kliff"], ["Damiane","Kliff"], ["any"]
//   type      string  · sotto-tipo specifico. Tassonomia:
//                       weapon:    "1H sword" | "1H mace" | "1H axe" | "2H sword" |
//                                  "2H axe" | "spear" | "halberd" | "bow" |
//                                  "crossbow" | "dagger" | "rapier" | "pistol" |
//                                  "musket" | "staff" | "cannon"
//                       armor:     "plate helm" | "plate mail" | "plate gloves" |
//                                  "plate boots" | "chain cloak" | "chain gloves" |
//                                  "leather chest" | "cloth robe" | ...
//                       accessory: "ring" | "earring" | "necklace" | "cloak" |
//                                  "bracelet"
//                       abysscore: "attack core" | "defense core" | "skill core" |
//                                  "utility core"
//                       material:  "gem" | "ore" | "bone" | "abyss-artifact" |
//                                  "crafting-material"
//                       mount:     "horse" | "legendary-horse" | "legendary-beast" |
//                                  "dragon" | "bear" | "vehicle"
//                       keyitem:   "mask" | "seal" | "helmet" | "lantern" | "bag" |
//                                  "relic"
//                       manual:    "weapon-manual" | "armor-manual" |
//                                  "alchemy-formula" | "cooking-recipe"
//   rarity    string  · "common" | "uncommon" | "rare" | "epic" | "legendary" | "unique"
//   source   string  · come si ottiene. Valori ammessi:
//                       "chest" | "boss-drop" | "quest-reward" | "world-pickup" |
//                       "vendor" | "craft" | "puzzle-reward" | "story-progression"
//   stats     string  · free-text con statistiche chiave
//                       Es: "13 ATK · 5 slot Abyss · Wind Slash, Destruction I"
//   set       string  · opzionale, ID del set armatura di appartenenza
//                       (raggruppa pezzi: tutti usano lo stesso set)
//
// ─────────────────────────────────────────────────────────────────────────────
// ESEMPIO DI ENTRY ITEM (template, NON popolato — schema di riferimento):
// ─────────────────────────────────────────────────────────────────────────────
//   { id:"item-wpn-darkbringer", n:"Darkbringer", alt:"...", c:"weapon",
//     r:"Pailune", x:200, y:120, absolute:true,
//     pg:["Kliff"], type:"2H sword", rarity:"legendary", source:"chest",
//     stats:"22 ATK · 5 slot Abyss · Ator's Orb (Heavy Attack fires golden orbs)",
//     lvl:"30+", chap:"Cap. 6+", req:"Esplorazione Pailune",
//     acc:"Five-Finger Mountain, NW Pailune. Lodged tra le mascelle del gigante",
//     d:"Spada 2H leggendaria. Sparare orbi dorati con i Heavy Attack.",
//     links:[ {l:"...", u:"..."} ] }
//
// Per item SENZA location precisa, aggiungere noMap:true e omettere x/y/absolute.
// ─────────────────────────────────────────────────────────────────────────────

// Categorie (9 originali + 8 per il compendio item)
const CATEGORIES = {
  // POI di mondo
  city:        { label: "Città principali",        color: "#8b1a1a", icon: "🏰" },
  village:     { label: "Villaggi & accampamenti", color: "#c47b3a", icon: "🏘️" },
  quest:       { label: "Side quest / faction",    color: "#2a8c5e", icon: "📜" },
  collectible: { label: "Tesori & forzieri",       color: "#d4a017", icon: "💰" },
  boss:        { label: "Boss & nemici d'élite",   color: "#5d2a8c", icon: "⚔️" },
  puzzle:      { label: "Enigmi & passaggi segreti", color: "#1f6db5", icon: "🧩" },
  vendor:      { label: "Negozi & vendor",         color: "#7a4a2c", icon: "🛒" },
  bell:        { label: "Campane (Toll of Pywel)", color: "#a87d2c", icon: "🔔" },
  abyss:       { label: "Abyss / cresset",         color: "#3d2a6e", icon: "🌀" },
  // Compendio item (popolato in sessioni successive)
  weapon:      { label: "Armi uniche & leggendarie", color: "#b71c1c", icon: "🗡️" },
  armor:       { label: "Set armatura",            color: "#455a64", icon: "🛡️" },
  accessory:   { label: "Accessori",               color: "#d81b60", icon: "💍" },
  abysscore:   { label: "Abyss Cores & Gears",     color: "#6a1b9a", icon: "🔮" },
  material:    { label: "Materiali rari",          color: "#2e7d32", icon: "🪨" },
  mount:       { label: "Montature & companions",  color: "#5d4037", icon: "🐎" },
  keyitem:     { label: "Key items & inventario",  color: "#ef6c00", icon: "🔑" },
  manual:      { label: "Manuali crafting",        color: "#1565c0", icon: "📖" }
};

// Personaggi giocabili (riferimento; usato per validare il campo pg degli item)
const PLAYABLE_CHARACTERS = {
  Kliff:   { full: "Kliff Macduff",  unlock: "Prologo",  weapons: ["1H sword","1H mace","2H sword","spear","axe","unarmed"] },
  Damiane: { full: "Damiane",        unlock: "Cap. 3",   weapons: ["rapier","pistol","musket","1H axe","1H sword","2H axe","staff"] },
  Oongka:  { full: "Oongka",         unlock: "Cap. 7",   weapons: ["2H axe","cannon","1H axe","crossbow"] }
};

// Helper: compone una descrizione leggibile dai campi strutturati di un item.
// Uso futuro nel rendering. Non altera il dato; ritorna una stringa.
//   Es. composeItemSummary({pg:["Kliff"], type:"2H sword", rarity:"legendary",
//                            source:"chest", stats:"22 ATK · 5 slot Abyss"})
//   → "Spada 2H · Leggendaria · Da forziere · Equipaggiabile da Kliff · 22 ATK · 5 slot Abyss"
function composeItemSummary(item) {
  if (!item) return "";
  const parts = [];
  const TYPE_IT = {
    "1H sword":"Spada 1H","1H mace":"Mazza 1H","1H axe":"Ascia 1H","2H sword":"Spada 2H","2H axe":"Ascia 2H",
    "spear":"Lancia","halberd":"Alabarda","bow":"Arco","crossbow":"Balestra","dagger":"Pugnale",
    "rapier":"Stocco","pistol":"Pistola","musket":"Moschetto","staff":"Bastone","cannon":"Cannone",
    "ring":"Anello","earring":"Orecchino","necklace":"Collana/Amuleto","cloak":"Mantello","bracelet":"Bracciale",
    "horse":"Cavallo","legendary-horse":"Cavallo leggendario","legendary-beast":"Bestia leggendaria",
    "dragon":"Drago","bear":"Orso cavalcabile","vehicle":"Veicolo",
    "mask":"Maschera","seal":"Sigillo","helmet":"Elmo speciale","lantern":"Lanterna","bag":"Borsa inventario","relic":"Reliquia",
    "weapon-manual":"Manuale armi","armor-manual":"Manuale armature","alchemy-formula":"Formula alchemica","cooking-recipe":"Ricetta",
    "gem":"Gemma","ore":"Minerale","bone":"Osso","abyss-artifact":"Abyss Artifact","crafting-material":"Materiale crafting",
    "attack core":"Core offensivo","defense core":"Core difensivo","skill core":"Core skill","utility core":"Core utility"
  };
  const RARITY_IT = { common:"Comune", uncommon:"Non comune", rare:"Raro", epic:"Epico", legendary:"Leggendario", unique:"Unico" };
  const SOURCE_IT = {
    "chest":"Da forziere","boss-drop":"Drop da boss","quest-reward":"Reward quest","world-pickup":"Raccolta libera",
    "vendor":"Da vendor","craft":"Crafting","puzzle-reward":"Reward enigma","story-progression":"Progressione storia"
  };
  if (item.type)    parts.push(TYPE_IT[item.type] || item.type);
  if (item.rarity)  parts.push(RARITY_IT[item.rarity] || item.rarity);
  if (item.source)  parts.push(SOURCE_IT[item.source] || item.source);
  if (item.pg && item.pg.length) {
    const pg = item.pg.includes("any") ? "Tutti" : item.pg.join(", ");
    parts.push("Equipaggiabile da " + pg);
  }
  if (item.stats)   parts.push(item.stats);
  return parts.join(" · ");
}

// Mappatura coordinate: i POI esistenti usano il vecchio layout stilizzato.
// Questa funzione li sposta sul nuovo layout (basato sulla PowerPyx world map: Pailune NW, Crimson Desert NE, Hernand W, Demeniss centro, Delesyia SE).
// I POI con flag absolute:true (es. campane) usano direttamente le nuove coordinate senza rimappa.
const REGION_REMAP = {
  "Hernand":         { from: { x:[380,720], y:[160,400] }, to: { x:[80,340],  y:[210,490] } },
  "Pailune":         { from: { x:[50,540],  y:[30,200]  }, to: { x:[120,540], y:[80,290]  } },
  "Demeniss":        { from: { x:[40,380],  y:[150,400] }, to: { x:[330,620], y:[270,490] } },
  "Delesyia":        { from: { x:[600,970], y:[80,310]  }, to: { x:[600,870], y:[300,520] } },
  "Crimson Desert":  { from: { x:[30,950],  y:[360,670] }, to: { x:[540,910], y:[40,310]  } },
  "Abyss":           { from: { x:[860,940], y:[580,640] }, to: { x:[55,110],  y:[55,110]  } }
};
function mapCoord(p) {
  if (p.absolute) return { x: p.x, y: p.y };
  const m = REGION_REMAP[p.r];
  if (!m) return { x: p.x, y: p.y };
  const tx = (p.x - m.from.x[0]) / (m.from.x[1] - m.from.x[0]);
  const ty = (p.y - m.from.y[0]) / (m.from.y[1] - m.from.y[0]);
  return {
    x: m.to.x[0] + Math.max(0, Math.min(1, tx)) * (m.to.x[1] - m.to.x[0]),
    y: m.to.y[0] + Math.max(0, Math.min(1, ty)) * (m.to.y[1] - m.to.y[0])
  };
}

// Costruzione POI database arricchito.
// CAMPI: id, n=nome, c=categoria, r=regione, x,y=coord, lvl=livello suggerito,
//   chap=capitolo storia in cui si sblocca, req=prerequisiti narrativi, acc=condizioni di accesso,
//   d=descrizione, links=fonti wiki.
const POIS = [
// ===== HERNAND =====
{ id:"hernand-town", n:"Hernand Town Center", alt:"Hernand città", c:"city", r:"Hernand", x:540, y:240,
  lvl:"1-15", chap:"Prologo · Cap. 1", req:"Nessuno", acc:"Aperta dall'inizio",
  d:"Hub centrale: vendor, fabbro, stalle, bacheca quest.",
  links:[ {l:"Hernand Map (Game Rant)", u:"https://gamerant.com/map/crimson-desert-complete-hernand-full-interactive-map/"}, {l:"Hernand su Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Hernand"} ] },
{ id:"pororin", n:"Pororin Village", c:"village", r:"Hernand", x:600, y:300,
  lvl:"3-10", chap:"Cap. 1", req:"—", acc:"Aperto",
  d:"Villaggio con quest secondarie iniziali.",
  links:[ {l:"Hernand Map (TheGamer)", u:"https://www.thegamer.com/crimson-desert-hernand-interactive-map-puzzles-loot-locations/"} ] },
{ id:"scholastone", n:"Scholastone Ruins", alt:"Ancient Ruins puzzle Hernand", c:"puzzle", r:"Hernand", x:480, y:340,
  lvl:"8+", chap:"Cap. 1-2", req:"Tutorial Abyss Cresset", acc:"Risolvi puzzle delle statue rotanti",
  d:"Una delle 37 Ancient Ruins. Risolverla attiva un Abyss Cresset.",
  links:[ {l:"Ancient Ruins (GameSpot)", u:"https://www.gamespot.com/gallery/crimson-desert-ancient-ruins-puzzles-abyss-cresset/2900-7617/"} ] },
{ id:"witch-elowen", n:"Strega Elowen", c:"vendor", r:"Hernand", x:660, y:200,
  lvl:"5+", chap:"Cap. 1", req:"Quest 'Il Dono della Strega'", acc:"Avvia quest a Hernand Town",
  d:"Crafting e socketing di Abyss Core.",
  links:[ {l:"Vendors", u:"https://crimsondesertgame.wiki.fextralife.com/Vendors"} ] },
{ id:"hernand-requests", n:"Hernand Requests Board", c:"quest", r:"Hernand", x:560, y:380,
  lvl:"2-15", chap:"Cap. 1+", req:"—", acc:"Aperta",
  d:"Bacheca delle richieste cittadine. Reputazione + ricompense.",
  links:[ {l:"Hernand Requests (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/586181"} ] },
{ id:"silverwood", n:"Foresta di Silverwood", c:"collectible", r:"Hernand", x:430, y:280,
  lvl:"5-12", chap:"Cap. 1", req:"—", acc:"Esplorazione libera",
  d:"Erbe rare, gatherables e nidi di creature.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"riverbend", n:"Riverbend Camp", c:"village", r:"Hernand", x:680, y:330,
  lvl:"6", chap:"Cap. 1", req:"—", acc:"Aperto",
  d:"Pescatori sul fiume. Quest commercio fluviale.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"oakbridge", n:"Imboscata di Oakbridge", c:"quest", r:"Hernand", x:620, y:260,
  lvl:"7", chap:"Cap. 1", req:"—", acc:"Trigger automatico passando il ponte",
  d:"Banditi al ponte: scelta morale tra negoziare o combattere.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"hernand-blacksmith", n:"Fabbro di Hernand", c:"vendor", r:"Hernand", x:560, y:220,
  lvl:"1+", chap:"Cap. 1", req:"—", acc:"Aperta",
  d:"Upgrade armi/armature delle prime fasi.", links:[ {l:"Vendors (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/590884"} ] },
{ id:"hernand-stable", n:"Stalla di Hernand", c:"vendor", r:"Hernand", x:520, y:260,
  lvl:"4+", chap:"Cap. 1", req:"Quest 'Cavalca con il Vento'", acc:"Aperta",
  d:"Equipaggiamento per montature.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"old-mill", n:"Vecchio Mulino", c:"quest", r:"Hernand", x:500, y:300,
  lvl:"9", chap:"Cap. 2", req:"Completa quest principale 'Spettri di Hernand'", acc:"Solo di notte",
  d:"Quest del fantasma del mugnaio.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"chestnut-grove", n:"Bosco dei Castagni", c:"collectible", r:"Hernand", x:640, y:380,
  lvl:"10", chap:"Cap. 1-2", req:"—", acc:"Sconfiggi orso bruno gigante",
  d:"Forziere d'élite custodito da boss minore.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"hernand-cresset-1", n:"Abyss Cresset · Hernand Sud", c:"abyss", r:"Hernand", x:580, y:400,
  lvl:"10", chap:"Cap. 1-2", req:"Tutorial Cresset", acc:"Risolvi puzzle statue rotanti",
  d:"Cresset (1 dei 37). Fast travel + Abyss Artifact.", links:[ {l:"Abyss Restoration (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-abyss-restoration-puzzle-locations-solutions/"} ] },
{ id:"forgotten-shrine", n:"Tempio Dimenticato", c:"puzzle", r:"Hernand", x:450, y:260,
  lvl:"12", chap:"Cap. 2", req:"3 indizi sparsi tra Hernand e Demeniss", acc:"Mural puzzle",
  d:"Mural puzzle multi-area.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"hernand-witch-bounty", n:"Strega Nera (bounty)", alt:"Black Witch", c:"boss", r:"Hernand", x:660, y:340,
  lvl:"14", chap:"Cap. 2", req:"Bounty board attiva", acc:"Solo dopo aver liberato Hernand Sud",
  d:"Boss bounty con evocazioni elementali. Vulnerabile al santo.", links:[ {l:"Bosses Hub (GameRant)", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },
{ id:"hernand-mini-arena", n:"Arena Cittadina", c:"quest", r:"Hernand", x:540, y:200,
  lvl:"5+", chap:"Cap. 1", req:"—", acc:"Iscriviti al banco arena",
  d:"3 round; ricompense oro + armatura leggera.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"hernand-fishing", n:"Molo dei Pescatori", c:"quest", r:"Hernand", x:700, y:340,
  lvl:"3+", chap:"Cap. 1", req:"Canna comprata", acc:"Aperto",
  d:"Mini-game di pesca con ricompense rare.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"silver-mine", n:"Miniera d'Argento", c:"collectible", r:"Hernand", x:610, y:160,
  lvl:"12", chap:"Cap. 2", req:"Sconfiggi i goblin guardiani", acc:"Necessità di torcia",
  d:"Vena d'argento. Loot prezioso.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"hidden-glade", n:"Radura Nascosta (passaggio segreto)", c:"puzzle", r:"Hernand", x:500, y:380,
  lvl:"8", chap:"Cap. 1-2", req:"—", acc:"Libreria girevole nella biblioteca di Hernand",
  d:"Passaggio segreto dietro libreria girevole; camera con tesoro.", links:[ {l:"Secret Passages (TheGamesWiki)", u:"https://thegameswiki.com/crimson-desert/wiki/secret-passages-and-hidden-areas"} ] },
{ id:"reed-devil", n:"Diavolo dei Giunchi (Reed Devil)", alt:"Reed Devil, Diavolo dei Giunchi, Reedwind", c:"boss", r:"Hernand", x:680, y:220,
  lvl:"15-18", chap:"Cap. 3 · Howling Hill", req:"Cap. 2 'Golden Greed' completato · accesso a Reedwind Valley", acc:"Reedwind Valley, vicino a Frozen Soul Mountain (nord-est di Hernand). Boss arena su un campo di erba alta",
  d:"Boss campagna in 3 fasi. Attacchi rapidi: scudo + parry sono fondamentali (Keen Senses lv 2 aiuta). Fase 2: distruggi tutti i totem ASAP con Turning Slash. Cibo abbondante e stamina massimizzata. Ricompense: skill Swift Stab, 600 Hernadian Contribution, Sunset Reed Cloth Gloves.",
  links:[
    {l:"Reed Devil guide (PC Gamer)", u:"https://www.pcgamer.com/games/action/crimson-desert-reed-devil-boss-guide/"},
    {l:"How to Beat Reed Devil (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/585774"},
    {l:"Reed Devil mechanics (TheGamer)", u:"https://www.thegamer.com/crimson-desert-reed-devil-boss-mechanics-preparation-guide/"},
    {l:"VULKK guide", u:"https://vulkk.com/2026/03/22/how-to-defeat-the-reed-devil-in-crimson-desert/"},
    {l:"All Campaign Bosses (GameSpot)", u:"https://www.gamespot.com/gallery/crimson-desert-boss-guide-campaign-bosses-how-to-beat/2900-7613/"}
  ] },

// ===== PAILUNE =====
{ id:"pailune-militia", n:"Pailune Militia HQ", c:"quest", r:"Pailune", x:230, y:120,
  lvl:"18-30", chap:"Cap. 3", req:"Storia: 'L'invito del Comandante'", acc:"Arruolamento Militia",
  d:"27 quest faction. Spina dorsale del nord.",
  links:[ {l:"Pailune Militia Quests (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/588724"} ] },
{ id:"antumbra", n:"Antumbra Order", c:"quest", r:"Pailune", x:340, y:150,
  lvl:"20-32", chap:"Cap. 3-4", req:"Reputazione +500 Pailune", acc:"Iniziato dopo quest 'Lord delle Ombre'",
  d:"17 quest. Lore di Pailune e Abyss.", links:[ {l:"Faction Quests (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/582199"} ] },
{ id:"beighen-tribe", n:"Beighen Tribe (nascosto)", c:"village", r:"Pailune", x:460, y:160,
  lvl:"22", chap:"Cap. 3", req:"—", acc:"Esplorazione zona orientale Pailune",
  d:"Una sola quest. Facile da mancare.", links:[ {l:"Pailune Faction Quests (GAMES.GG)", u:"https://games.gg/crimson-desert/guides/crimson-desert-all-pailune-faction-quests/"} ] },
{ id:"healing-pailune", n:"Healing Pailune", c:"quest", r:"Pailune", x:170, y:140,
  lvl:"20+", chap:"Cap. 3", req:"Quest principale Pailune", acc:"Ingresso Militia",
  d:"Linea narrativa per guarire le terre del nord.", links:[ {l:"Walkthrough (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-healing-pailune-walkthrough/"} ] },
{ id:"snowy-peaks", n:"Picchi Nevosi", c:"collectible", r:"Pailune", x:380, y:80,
  lvl:"25", chap:"Cap. 3-4", req:"Stivali da neve", acc:"Climbing",
  d:"Erbe ghiacciate, minerali, nidi di grifoni.", links:[ {l:"Pailune Map (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map_Pailune"} ] },
{ id:"frozen-lake", n:"Lago Ghiacciato (puzzle)", c:"puzzle", r:"Pailune", x:280, y:140,
  lvl:"22", chap:"Cap. 3", req:"—", acc:"Allinea le rune sulle lastre",
  d:"Puzzle delle rune: rompi nell'ordine corretto.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map_Pailune"} ] },
{ id:"glacier-cavern", n:"Antico Mammut Ghiacciato", alt:"Mammut, glacier mammoth", c:"boss", r:"Pailune", x:200, y:90,
  lvl:"28", chap:"Cap. 3", req:"Healing Pailune step 4", acc:"Ingresso caverna sbloccato",
  d:"Boss mid-game. Vulnerabile al fuoco.", links:[ {l:"Bosses Hub", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },
{ id:"pailune-blacksmith", n:"Fabbro di Pailune", c:"vendor", r:"Pailune", x:300, y:120,
  lvl:"18+", chap:"Cap. 3", req:"—", acc:"Aperto",
  d:"Armi resistenti al freddo, armature pesanti.", links:[ {l:"Vendors (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/590884"} ] },
{ id:"frostpine", n:"Foresta di Frostpine", c:"collectible", r:"Pailune", x:430, y:100,
  lvl:"24", chap:"Cap. 3", req:"—", acc:"Bisogna evitare i lupi mannari",
  d:"Pellicce e ambra blu.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map_Pailune"} ] },
{ id:"abandoned-fort", n:"Forte Abbandonato (passaggio segreto)", c:"puzzle", r:"Pailune", x:120, y:120,
  lvl:"26", chap:"Cap. 3", req:"—", acc:"Pavimento crollato sotto la torre nord",
  d:"Forte con dungeon segreto e baule d'élite.", links:[ {l:"Secret Areas", u:"https://thegameswiki.com/crimson-desert/wiki/secret-passages-and-hidden-areas"} ] },
{ id:"pailune-cresset-1", n:"Cresset · Pailune Ovest", c:"abyss", r:"Pailune", x:90, y:130,
  lvl:"22", chap:"Cap. 3", req:"—", acc:"Risolvi puzzle simbolo lunare",
  d:"Cresset (1 dei 37).", links:[ {l:"PowerPyx", u:"https://www.powerpyx.com/crimson-desert-all-abyss-restoration-puzzle-locations-solutions/"} ] },
{ id:"pailune-cresset-2", n:"Cresset · Pailune Est", c:"abyss", r:"Pailune", x:520, y:130,
  lvl:"24", chap:"Cap. 3", req:"—", acc:"Cascata ghiacciata fusa con torcia magica",
  d:"Cresset nascosto.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map_Pailune"} ] },
{ id:"hunter-camp", n:"Cacciatori di Pailune", c:"village", r:"Pailune", x:380, y:160,
  lvl:"19", chap:"Cap. 3", req:"—", acc:"Aperto",
  d:"Bounty su lupi mannari e bestie nordiche.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map_Pailune"} ] },
{ id:"frozen-tomb", n:"Re Lich (Frozen Tomb)", alt:"Lich King, Re Lich", c:"boss", r:"Pailune", x:160, y:90,
  lvl:"32", chap:"Cap. 4", req:"Antumbra Order step 12", acc:"Sigillo della Tomba completato",
  d:"Boss multi-fase. Resurrezione di scheletri.", links:[ {l:"Bosses Hub", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },
{ id:"snowy-shrine", n:"Santuario della Neve", c:"puzzle", r:"Pailune", x:330, y:90,
  lvl:"24", chap:"Cap. 3", req:"—", acc:"Allinea statue rotanti",
  d:"Cripta con tesoro e Abyss Artifact.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map_Pailune"} ] },
{ id:"pailune-vendor-1", n:"Mercante Itinerante (Pailune)", c:"vendor", r:"Pailune", x:260, y:160,
  lvl:"20+", chap:"Cap. 3", req:"—", acc:"Compare ogni 3 giorni in-game",
  d:"Mappe del tesoro e oggetti rari rotanti.", links:[ {l:"All Shops", u:"https://crimsondb.gg/shops"} ] },
{ id:"pailune-mining", n:"Miniera di Cristallo", c:"collectible", r:"Pailune", x:450, y:140,
  lvl:"26", chap:"Cap. 3-4", req:"Piccone potenziato", acc:"Sigillo Antumbra",
  d:"Cristalli del nord per gioielli incantati.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map_Pailune"} ] },
{ id:"frosthowl", n:"Branco di Frosthowl", c:"boss", r:"Pailune", x:240, y:170,
  lvl:"25", chap:"Cap. 3", req:"—", acc:"Trigger pattugliando il bosco di Frostpine",
  d:"Branco con alpha mutato.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map_Pailune"} ] },
{ id:"pailune-quest-board", n:"Bacheca Militia (taglie)", c:"quest", r:"Pailune", x:200, y:140,
  lvl:"18+", chap:"Cap. 3+", req:"Arruolato Militia", acc:"HQ Pailune",
  d:"Liste taglie e missioni di pattuglia.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map_Pailune"} ] },
{ id:"avalanche-pass", n:"Passo della Valanga", c:"quest", r:"Pailune", x:380, y:120,
  lvl:"26", chap:"Cap. 3-4", req:"Quest 'Mercanti in pericolo'", acc:"Tempo limitato",
  d:"Quest a tempo: salva i mercanti.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map_Pailune"} ] },
{ id:"buried-village", n:"Villaggio Sepolto", c:"collectible", r:"Pailune", x:300, y:170,
  lvl:"27", chap:"Cap. 3-4", req:"—", acc:"Pala da scavo (vendor Pailune)",
  d:"Resti di villaggio sotto la neve. Lore + loot.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map_Pailune"} ] },
{ id:"pailune-restoration", n:"Abyss Restoration · Pailune", c:"abyss", r:"Pailune", x:430, y:170,
  lvl:"24", chap:"Cap. 3", req:"—", acc:"Allinea cubo con runa polare",
  d:"1 dei 40 Abyss Restoration.", links:[ {l:"PowerPyx", u:"https://www.powerpyx.com/crimson-desert-all-abyss-restoration-puzzle-locations-solutions/"} ] },

// ===== DEMENISS =====
{ id:"demeniss-capital", n:"Capitale di Demeniss", c:"city", r:"Demeniss", x:200, y:280,
  lvl:"15-40", chap:"Cap. 2-5", req:"Lasciapassare", acc:"Disponibile dopo Cap. 2",
  d:"Sede del potere politico di Pywel.",
  links:[ {l:"Demeniss Bound Walkthrough", u:"https://camzillasmom.com/crimson-desert-demeniss-bound-questline-walkthrough/"}, {l:"Demeniss Map (TheGamer)", u:"https://www.thegamer.com/crimson-desert-demeniss-interactive-map-secrets-chests-ore-locations/"} ] },
{ id:"demeniss-politics", n:"Pailune's Politics", c:"quest", r:"Demeniss", x:140, y:320,
  lvl:"22-30", chap:"Cap. 3-4", req:"Cap. 3 della storia", acc:"Quest 'Sussurri al Senato'",
  d:"8 quest sulle lotte di potere Pailune-Demeniss.", links:[ {l:"Faction Quests", u:"https://game8.co/games/Crimson-Desert/archives/582199"} ] },
{ id:"demeniss-armory", n:"Armeria militare", c:"vendor", r:"Demeniss", x:280, y:340,
  lvl:"15+", chap:"Cap. 2", req:"—", acc:"Aperta dopo aver portato lasciapassare",
  d:"Upgrade armi/armature/gioielli alto livello.", links:[ {l:"Vendor Locations", u:"https://game8.co/games/Crimson-Desert/archives/590884"} ] },
{ id:"demeniss-secrets", n:"Cripte sotterranee (passaggi segreti)", c:"puzzle", r:"Demeniss", x:120, y:260,
  lvl:"20+", chap:"Cap. 2-3", req:"Chiave del custode", acc:"Libreria girevole nel palazzo",
  d:"Passaggi segreti, librerie girevoli, dungeon nascosti.", links:[ {l:"Secret Passages", u:"https://thegameswiki.com/crimson-desert/wiki/secret-passages-and-hidden-areas"} ] },
{ id:"demeniss-senate", n:"Senato di Demeniss", c:"quest", r:"Demeniss", x:180, y:260,
  lvl:"22", chap:"Cap. 3", req:"Aver completato 'Demeniss Bound' step 3", acc:"Solo durante udienze",
  d:"Quest politiche con scelte ramificate.", links:[ {l:"Walkthrough Demeniss Bound", u:"https://camzillasmom.com/crimson-desert-demeniss-bound-questline-walkthrough/"} ] },
{ id:"royal-palace", n:"Palazzo Reale", c:"city", r:"Demeniss", x:230, y:250,
  lvl:"25+", chap:"Cap. 4", req:"Demeniss Bound completata", acc:"Stealth section o invito",
  d:"Stealth section per recuperare un documento.", links:[ {l:"Walkthrough", u:"https://camzillasmom.com/crimson-desert-demeniss-bound-questline-walkthrough/"} ] },
{ id:"military-camp-n", n:"Campo Militare Nord", c:"village", r:"Demeniss", x:100, y:240,
  lvl:"18", chap:"Cap. 2-3", req:"—", acc:"Aperto",
  d:"Avamposto al confine con Pailune.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"military-camp-s", n:"Campo Militare Sud", c:"village", r:"Demeniss", x:280, y:380,
  lvl:"30", chap:"Cap. 4-5", req:"—", acc:"Aperto",
  d:"Forte sulla via per il deserto.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"demeniss-confess", n:"Confessionale", c:"vendor", r:"Demeniss", x:170, y:300,
  lvl:"qualsiasi", chap:"Cap. 2+", req:"Aver criminale notation", acc:"Aperto",
  d:"Servizio per saldare taglie criminali.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"demeniss-witch", n:"Strega della Capitale", c:"vendor", r:"Demeniss", x:230, y:330,
  lvl:"25+", chap:"Cap. 3", req:"Quest segreta nelle cripte", acc:"Aperta dopo Demeniss Bound",
  d:"Crafting avanzato e Abyss Core di alto rango.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Vendors"} ] },
{ id:"demeniss-cresset-1", n:"Cresset della Cripta", c:"abyss", r:"Demeniss", x:130, y:300,
  lvl:"24", chap:"Cap. 3", req:"Chiave del custode", acc:"Risolvi puzzle 4 lanterne",
  d:"Cresset attivabile.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"demeniss-cresset-2", n:"Cresset Reale", c:"abyss", r:"Demeniss", x:240, y:280,
  lvl:"30", chap:"Cap. 4", req:"Stealth nel palazzo", acc:"Sotterraneo",
  d:"Cresset nei sotterranei del palazzo.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"demeniss-bounty-1", n:"Cavaliere Caduto", alt:"Fallen Knight", c:"boss", r:"Demeniss", x:280, y:300,
  lvl:"32", chap:"Cap. 4", req:"Bacheca taglie Demeniss", acc:"Solo dopo le 22:00 in-game",
  d:"Ex cavaliere reale corrotto dall'Abyss.", links:[ {l:"Bosses", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },
{ id:"demeniss-mine", n:"Miniera di Ferro", c:"collectible", r:"Demeniss", x:90, y:340,
  lvl:"22", chap:"Cap. 3", req:"Ordini ufficiali", acc:"Permesso militare",
  d:"Vena di ferro grezzo.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"demeniss-stable", n:"Stalla Reale", c:"vendor", r:"Demeniss", x:240, y:340,
  lvl:"20+", chap:"Cap. 3", req:"Reputazione corte", acc:"Aperto",
  d:"Cavalli di razza, barding pesante.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"underground-arena", n:"Fight Club sotterraneo", c:"quest", r:"Demeniss", x:170, y:340,
  lvl:"25+", chap:"Cap. 3", req:"Indizio in taverna", acc:"Password dei combattenti",
  d:"Underground fight club. Scommesse e oro.", links:[ {l:"Secret Areas", u:"https://thegameswiki.com/crimson-desert/wiki/secret-passages-and-hidden-areas"} ] },
{ id:"demeniss-collectible", n:"Crafting Manual del Saggio", c:"collectible", r:"Demeniss", x:160, y:380,
  lvl:"qualsiasi", chap:"Cap. 3", req:"—", acc:"Libreria del Senato",
  d:"Crafting Manual nascosto in libreria.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"demeniss-restoration", n:"Abyss Restoration · Demeniss", c:"abyss", r:"Demeniss", x:200, y:360,
  lvl:"26", chap:"Cap. 3-4", req:"—", acc:"Cripte sotterranee",
  d:"1 dei 40 Abyss Restoration.", links:[ {l:"PowerPyx", u:"https://www.powerpyx.com/crimson-desert-all-abyss-restoration-puzzle-locations-solutions/"} ] },
{ id:"demeniss-puzzle-2", n:"Enigma del Re Vecchio", c:"puzzle", r:"Demeniss", x:140, y:260,
  lvl:"28", chap:"Cap. 4", req:"3 indizi (Hernand, Pailune, Demeniss)", acc:"Mural puzzle",
  d:"Mural puzzle multi-area.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"demeniss-vendor-rare", n:"Mercante d'Arte", c:"vendor", r:"Demeniss", x:220, y:300,
  lvl:"30+", chap:"Cap. 3-4", req:"—", acc:"Stock rotante settimanale",
  d:"Oggetti unici rotanti.", links:[ {l:"Shops (CrimsonDB)", u:"https://crimsondb.gg/shops"} ] },

// ===== DELESYIA =====
{ id:"delesyia-hub", n:"Capitale di Delesyia", c:"city", r:"Delesyia", x:800, y:160,
  lvl:"30-50", chap:"Cap. 5", req:"Storia Cap. 4 completa", acc:"Lasciapassare tecnologico",
  d:"Centro tecnologico. Robot, automi.",
  links:[ {l:"Delesyia (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Delesyia"} ] },
{ id:"delesyia-mech", n:"Officine Meccaniche", c:"vendor", r:"Delesyia", x:880, y:220,
  lvl:"35+", chap:"Cap. 5", req:"—", acc:"Aperta",
  d:"Componenti meccanici e crafting tools avanzati.", links:[ {l:"All Shops", u:"https://crimsondb.gg/shops"} ] },
{ id:"delesyia-bosses", n:"Boss Meccanici (zona)", c:"boss", r:"Delesyia", x:720, y:230,
  lvl:"38-45", chap:"Cap. 5", req:"—", acc:"Resistenze elementali consigliate",
  d:"Boss robotici sparsi. Resistenze specifiche.", links:[ {l:"Bosses Hub", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },
{ id:"delesyia-collect", n:"Componenti Rari Delesyia", c:"collectible", r:"Delesyia", x:920, y:170,
  lvl:"40", chap:"Cap. 5", req:"—", acc:"Rare drops dai robot d'élite",
  d:"Ingranaggi, circuiti unici per crafting.", links:[ {l:"MetaForge", u:"https://metaforge.app/crimson-desert/map/main"} ] },
{ id:"delesyia-lab", n:"Laboratorio Centrale", c:"quest", r:"Delesyia", x:780, y:140,
  lvl:"35", chap:"Cap. 5", req:"Reputazione Delesyia +200", acc:"Quest 'Esperimento Etico'",
  d:"Quest line scientifica con scelta morale.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Delesyia"} ] },
{ id:"delesyia-foundry", n:"Fonderia di Pywel", c:"vendor", r:"Delesyia", x:830, y:200,
  lvl:"40+", chap:"Cap. 5", req:"Componenti rari", acc:"Aperta",
  d:"Forgiatura di armi tecnologiche e gemme energetiche.", links:[ {l:"Shops", u:"https://crimsondb.gg/shops"} ] },
{ id:"delesyia-clockwork", n:"Torre dell'Orologio (puzzle)", c:"puzzle", r:"Delesyia", x:870, y:130,
  lvl:"38", chap:"Cap. 5", req:"—", acc:"Allinea ingranaggi in 4 piani",
  d:"Puzzle a ingranaggi multilivello.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Delesyia"} ] },
{ id:"delesyia-village-1", n:"Villaggio degli Inventori", c:"village", r:"Delesyia", x:740, y:200,
  lvl:"30", chap:"Cap. 5", req:"—", acc:"Aperto",
  d:"Casa degli ingegneri eccentrici.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Delesyia"} ] },
{ id:"delesyia-village-2", n:"Borgo dei Cyborg", c:"village", r:"Delesyia", x:920, y:230,
  lvl:"35", chap:"Cap. 5", req:"Aver completato 'Esperimento Etico'", acc:"Aperto",
  d:"Comunità con impianti meccanici.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Delesyia"} ] },
{ id:"delesyia-cresset-1", n:"Cresset Meccanico", c:"abyss", r:"Delesyia", x:850, y:260,
  lvl:"38", chap:"Cap. 5", req:"—", acc:"Risolvi clockwork puzzle",
  d:"Cresset attivabile.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Delesyia"} ] },
{ id:"delesyia-bounty", n:"Automa Impazzito (bounty)", c:"boss", r:"Delesyia", x:790, y:280,
  lvl:"42", chap:"Cap. 5", req:"Bounty board Delesyia", acc:"Solo di giorno",
  d:"Golem meccanico fuori controllo.", links:[ {l:"Bosses", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },
{ id:"delesyia-hidden", n:"Officina Segreta", c:"puzzle", r:"Delesyia", x:920, y:140,
  lvl:"38", chap:"Cap. 5", req:"—", acc:"Mosaico tecnologico nel laboratorio",
  d:"Officina nascosta dietro mosaico.", links:[ {l:"Secret Areas", u:"https://thegameswiki.com/crimson-desert/wiki/secret-passages-and-hidden-areas"} ] },
{ id:"delesyia-vendor-2", n:"Negozio di Curiosità", c:"vendor", r:"Delesyia", x:760, y:170,
  lvl:"30+", chap:"Cap. 5", req:"—", acc:"Aperto",
  d:"Automazioni minori e gadget per esplorazione.", links:[ {l:"Shops", u:"https://crimsondb.gg/shops"} ] },
{ id:"delesyia-restoration", n:"Abyss Restoration · Delesyia", c:"abyss", r:"Delesyia", x:900, y:280,
  lvl:"40", chap:"Cap. 5", req:"—", acc:"Tema meccanico",
  d:"1 dei 40 Abyss Restoration.", links:[ {l:"PowerPyx", u:"https://www.powerpyx.com/crimson-desert-all-abyss-restoration-puzzle-locations-solutions/"} ] },
{ id:"delesyia-quest-2", n:"Esperimento Etico", c:"quest", r:"Delesyia", x:820, y:240,
  lvl:"35", chap:"Cap. 5", req:"Storia Cap. 5", acc:"Trigger nel Lab Centrale",
  d:"Quest morale: salva i soggetti o lasciali andare.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Delesyia"} ] },
{ id:"delesyia-collect-2", n:"Schema Antico (Crafting Manual)", c:"collectible", r:"Delesyia", x:760, y:240,
  lvl:"qualsiasi", chap:"Cap. 5", req:"—", acc:"Forziere d'élite nel laboratorio",
  d:"Crafting manual perduto.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Delesyia"} ] },

// ===== CRIMSON DESERT =====
{ id:"varnia", n:"Varnia (città santa)", c:"city", r:"Crimson Desert", x:600, y:480,
  lvl:"35-50", chap:"Cap. 6", req:"Pellegrinaggio iniziato", acc:"Tappa finale del cammino",
  d:"Città santa. Templi, quest religiose.", links:[ {l:"Locations Guide", u:"https://consolepulse.com/multiplatform/crimson-desert/guides/crimson-desert-locations-guide"} ] },
{ id:"urdavah", n:"Urdavah (gateway)", c:"village", r:"Crimson Desert", x:430, y:520,
  lvl:"32", chap:"Cap. 6", req:"—", acc:"Aperto",
  d:"Villaggio gateway sulla via di pellegrinaggio.", links:[ {l:"All Region Locations", u:"https://game8.co/games/Crimson-Desert/archives/591407"} ] },
{ id:"arcosa", n:"Arcosa (villaggio prospero)", c:"village", r:"Crimson Desert", x:280, y:560,
  lvl:"35", chap:"Cap. 6", req:"—", acc:"Aperto",
  d:"Mercato e quest sui briganti.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"tommaso", n:"Tommaso (Tashkalp)", c:"village", r:"Crimson Desert", x:730, y:600,
  lvl:"40", chap:"Cap. 6-7", req:"—", acc:"Aperto",
  d:"Avamposto chiave del deserto orientale.", links:[ {l:"Map Guide (G FUEL)", u:"https://gfuel.com/blogs/news/crimson-desert-map-full-region-map-cities-and-more"} ] },
{ id:"hoenmark-ruins", n:"Beloth the Darksworn (Hoenmark Ruins)", alt:"Beloth Darksworn, Hoenmark", c:"boss", r:"Crimson Desert", x:840, y:480,
  lvl:"45", chap:"Cap. 7", req:"Aver completato 'Heart of the Desert' + Cresset di Tashkalp", acc:"Ingresso rovine sigillato fino alla quest",
  d:"Boss endgame durissimo. Build equilibrata, anti-debuff.", links:[ {l:"PC Gamer guide", u:"https://www.pcgamer.com/games/action/crimson-desert-guide/"}, {l:"Bosses Hub", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },
{ id:"contrib-shops", n:"Contribution Shops (faction)", c:"vendor", r:"Crimson Desert", x:520, y:600,
  lvl:"qualsiasi", chap:"Cap. 6+", req:"Contribution points di fazione", acc:"Più sedi sparse",
  d:"Negozi che accettano contribution points.", links:[ {l:"Faction Merchants (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-contribution-shop-locations-faction-merchants/"} ] },
{ id:"desert-treasures", n:"Mappe del Tesoro", c:"collectible", r:"Crimson Desert", x:380, y:620,
  lvl:"30+", chap:"Cap. 6+", req:"Mappa nel proprio inventario", acc:"Forzieri protetti da nemici d'élite",
  d:"Forzieri rari nelle dune.", links:[ {l:"Full Map (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-full-world-map/"} ] },
{ id:"desert-bandits", n:"Accampamenti banditi", c:"boss", r:"Crimson Desert", x:660, y:550,
  lvl:"35-45", chap:"Cap. 6+", req:"—", acc:"Bounty disponibili",
  d:"Camp con leader d'élite.", links:[ {l:"Locations Guide", u:"https://consolepulse.com/multiplatform/crimson-desert/guides/crimson-desert-locations-guide"} ] },
{ id:"oasis-1", n:"Oasi del Cammello", c:"village", r:"Crimson Desert", x:340, y:480,
  lvl:"32", chap:"Cap. 6", req:"—", acc:"Aperta",
  d:"Caravanserie e mercanti itineranti.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"oasis-2", n:"Oasi delle Palme", c:"village", r:"Crimson Desert", x:570, y:560,
  lvl:"34", chap:"Cap. 6", req:"—", acc:"Aperta",
  d:"Quest di pellegrini.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"oasis-3", n:"Pozza dello Sciacallo", c:"village", r:"Crimson Desert", x:790, y:530,
  lvl:"38", chap:"Cap. 7", req:"—", acc:"Avamposto contrabbandieri",
  d:"Mercato nero.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"sand-temple-1", n:"Tempio della Sabbia (puzzle)", c:"puzzle", r:"Crimson Desert", x:460, y:580,
  lvl:"36", chap:"Cap. 6", req:"—", acc:"Rotate la statua centrale per i raggi",
  d:"Tempio sepolto con puzzle dei raggi.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"sand-temple-2", n:"Tempio del Sole (puzzle)", c:"puzzle", r:"Crimson Desert", x:660, y:600,
  lvl:"38", chap:"Cap. 7", req:"—", acc:"Mural puzzle giorno→tramonto",
  d:"Mural puzzle ciclico.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"crimson-cresset-1", n:"Cresset di Varnia", c:"abyss", r:"Crimson Desert", x:610, y:500,
  lvl:"36", chap:"Cap. 6", req:"—", acc:"Sotterranei del tempio",
  d:"Cresset attivabile.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"crimson-cresset-2", n:"Cresset di Arcosa", c:"abyss", r:"Crimson Desert", x:300, y:580,
  lvl:"36", chap:"Cap. 6", req:"—", acc:"Mercato sotterraneo",
  d:"Cresset attivabile.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"crimson-cresset-3", n:"Cresset di Tashkalp", c:"abyss", r:"Crimson Desert", x:760, y:580,
  lvl:"40", chap:"Cap. 7", req:"Quest 'Heart of the Desert'", acc:"Rovine pre-deserto",
  d:"Cresset attivabile.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"crimson-cresset-4", n:"Cresset di Hoenmark", c:"abyss", r:"Crimson Desert", x:850, y:500,
  lvl:"45", chap:"Cap. 7-endgame", req:"Beloth sconfitto", acc:"Dopo aver battuto il boss",
  d:"Cresset attivabile post-Beloth.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"sand-shark", n:"Squalo di Sabbia (world boss)", alt:"Sand Shark, Squalo Sabbia", c:"boss", r:"Crimson Desert", x:520, y:640,
  lvl:"40", chap:"Cap. 6-7", req:"—", acc:"Spawn casuale tra dune",
  d:"World boss che emerge dalle dune. Vulnerabile alla folgore.", links:[ {l:"Bosses", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },
{ id:"desert-vendor-1", n:"Carovana del Deserto", c:"vendor", r:"Crimson Desert", x:400, y:540,
  lvl:"30+", chap:"Cap. 6+", req:"—", acc:"Stock rotante",
  d:"Mercanti nomadi.", links:[ {l:"Shops", u:"https://crimsondb.gg/shops"} ] },
{ id:"desert-vendor-2", n:"Bazar di Varnia", c:"vendor", r:"Crimson Desert", x:620, y:470,
  lvl:"30+", chap:"Cap. 6", req:"—", acc:"Aperto",
  d:"+20 vendor specializzati nel bazar.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"desert-vendor-3", n:"Mercato Nero di Arcosa", c:"vendor", r:"Crimson Desert", x:260, y:570,
  lvl:"35+", chap:"Cap. 6", req:"Reputazione neutra/banditi", acc:"Password",
  d:"Oggetti illegali e contrabbando.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"desert-blacksmith", n:"Fabbro del Deserto", c:"vendor", r:"Crimson Desert", x:580, y:490,
  lvl:"35+", chap:"Cap. 6", req:"—", acc:"Aperto",
  d:"Scimitarre e armature leggere.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"forgotten-pyramid", n:"Piramide Dimenticata (mega dungeon)", c:"puzzle", r:"Crimson Desert", x:870, y:560,
  lvl:"42+", chap:"Cap. 7", req:"Mappa speciale del fabbro di Tommaso", acc:"4 livelli di puzzle e trappole",
  d:"Mega dungeon: 4 livelli con trappole.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"crimson-bounty-1", n:"Re dei Banditi", alt:"Bandit King", c:"boss", r:"Crimson Desert", x:480, y:620,
  lvl:"42", chap:"Cap. 7", req:"Bounty board Arcosa", acc:"Solo dopo 5 camp puliti",
  d:"Leader della più grande gang.", links:[ {l:"Bosses", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },
{ id:"crimson-bounty-2", n:"Mercenario Nero", c:"boss", r:"Crimson Desert", x:780, y:480,
  lvl:"43", chap:"Cap. 7", req:"Bounty board", acc:"Spawn notturno",
  d:"Mercenario rinnegato.", links:[ {l:"Bosses", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },
{ id:"sand-shrine-1", n:"Santuario della Pietra", c:"collectible", r:"Crimson Desert", x:200, y:570,
  lvl:"35", chap:"Cap. 6", req:"Offerta richiesta (oggetto)", acc:"Statua antica",
  d:"Reward raro a fronte di offerta.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"sand-shrine-2", n:"Santuario della Luna", c:"collectible", r:"Crimson Desert", x:710, y:530,
  lvl:"38", chap:"Cap. 6-7", req:"—", acc:"Solo di notte",
  d:"Frammento di Abyss Core.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"pilgrimage-stop-1", n:"Sosta Pellegrini Sud", c:"quest", r:"Crimson Desert", x:430, y:580,
  lvl:"33", chap:"Cap. 6", req:"—", acc:"Aperta",
  d:"Quest pellegrini con scelta morale.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"pilgrimage-stop-2", n:"Sosta Pellegrini Nord", c:"quest", r:"Crimson Desert", x:570, y:530,
  lvl:"35", chap:"Cap. 6", req:"Sosta Sud completata", acc:"Aperta",
  d:"Aiuto pellegrini malati.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"crimson-restoration-1", n:"Abyss Restoration · Deserto Centro", c:"abyss", r:"Crimson Desert", x:500, y:560,
  lvl:"38", chap:"Cap. 6", req:"—", acc:"Cubo allineamento sole/luna",
  d:"1 dei 40 Abyss Restoration.", links:[ {l:"PowerPyx", u:"https://www.powerpyx.com/crimson-desert-all-abyss-restoration-puzzle-locations-solutions/"} ] },
{ id:"crimson-restoration-2", n:"Abyss Restoration · Tashkalp", c:"abyss", r:"Crimson Desert", x:700, y:620,
  lvl:"40", chap:"Cap. 7", req:"—", acc:"Tema sabbioso",
  d:"1 dei 40 Abyss Restoration.", links:[ {l:"PowerPyx", u:"https://www.powerpyx.com/crimson-desert-all-abyss-restoration-puzzle-locations-solutions/"} ] },
{ id:"crimson-collectible-1", n:"Tesoro del Faraone", c:"collectible", r:"Crimson Desert", x:840, y:600,
  lvl:"45", chap:"Cap. 7", req:"Piramide Dimenticata completata", acc:"Trappole multiple",
  d:"Forziere leggendario.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"crimson-collectible-2", n:"Frammento di Meteorite", c:"collectible", r:"Crimson Desert", x:380, y:460,
  lvl:"40", chap:"Cap. 6-7", req:"—", acc:"Cratere di impatto",
  d:"Materiale unico per crafting cosmico.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },
{ id:"crimson-quest-1", n:"Caccia al Drago Cremisi", alt:"Crimson Dragon, Drago Rosso", c:"boss", r:"Crimson Desert", x:560, y:640,
  lvl:"50", chap:"Cap. 7-endgame", req:"Tutte le quest principali del deserto", acc:"Quest finale 'Cremisi'",
  d:"Drago rosso che soggioga le dune. Endgame.", links:[ {l:"Bosses Hub", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },
{ id:"crimson-mini-arena", n:"Arena del Deserto (Coliseum Varnia)", c:"quest", r:"Crimson Desert", x:610, y:520,
  lvl:"35+", chap:"Cap. 6+", req:"—", acc:"Iscrizione al banco arena",
  d:"Sfide a ondate per glory points.", links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Crimson_Desert"} ] },

// ===== CAMPANE — Toll of Pywel (sblocca la mappa, fog of war) =====
// 8 campane sparse, ognuna è una quest della Priorin Forest Guardians faction.
// Suonarle disnebbia la mappa: priorità nelle prime ore. Coordinate assolute (assolute:true).
{ id:"bell-hernand", n:"🔔 Toll of Hernand", alt:"Toll of Hernand, campana Hernand, clocktower", c:"bell", r:"Hernand", x:240, y:380, absolute:true,
  lvl:"qualsiasi", chap:"Cap. 1+", req:"Nessuno", acc:"Nord di Hernand Town, ovest della taverna principale, dentro la torre dell'orologio",
  d:"Una delle 8 campane del Toll of Pywel. Suonarla disnebbia la mappa di Hernand. Quest faction Priorin Forest Guardians.",
  links:[
    {l:"Toll of Pywel guide (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-bell-locations-toll-of-pywel/"},
    {l:"Bell locations (Method.gg)", u:"https://www.method.gg/crimson-desert/crimson-desert-bell-tower-locations-how-to-clear-the-map-fog"},
    {l:"All 8 Bells (GAMES.GG)", u:"https://games.gg/crimson-desert/guides/crimson-desert-bell-locations/"}
  ] },
{ id:"bell-scholastone", n:"🔔 Toll of Scholastone", alt:"Toll of Scholastone, campana Scholastone Institute", c:"bell", r:"Hernand", x:170, y:460, absolute:true,
  lvl:"qualsiasi", chap:"Cap. 1+ (consigliata Cap. 4)", req:"—", acc:"Sud-ovest di Hernand, in cima al monte di Scholastone Institute. Sali fino al cortile superiore, vai al pagoda alla fine del giardino, poi scala alla piattaforma alta",
  d:"Posizione elevata nel campus. Spesso visitata insieme alla quest 'Forbidden Knowledge' (Tenebrum).",
  links:[ {l:"Toll of Pywel (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-bell-locations-toll-of-pywel/"} ] },
{ id:"bell-calphade", n:"🔔 Toll of Calphade", alt:"Toll of Calphade, Thalwynd, Church of Calphade", c:"bell", r:"Hernand", x:140, y:300, absolute:true,
  lvl:"qualsiasi", chap:"Cap. 1+", req:"—", acc:"Villaggio di Thalwynd, NW di Deepfog Basin. Vai al nord del centro abitato → Church of Calphade → scala fino in cima alla guglia",
  d:"Campana della chiesa di Calphade. Una delle più rapide da prendere in early-game.",
  links:[ {l:"Toll of Pywel (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-bell-locations-toll-of-pywel/"} ] },
{ id:"bell-demeniss", n:"🔔 Toll of Demeniss", alt:"Toll of Demeniss, campana capitale, cathedral clocktower", c:"bell", r:"Demeniss", x:470, y:380, absolute:true,
  lvl:"qualsiasi", chap:"Cap. 2+ (Demeniss accessibile)", req:"Lasciapassare per Demeniss", acc:"Capitale di Demeniss, torre dell'orologio più alta vicino alla cattedrale. Usa l'asta della bandiera che pende fuori, mettici peso → il meccanismo abbassa la campana → torna in cima e suonala",
  d:"Meccanica unica: la campana è normalmente troppo alta, va abbassata col contrappeso prima di poterla suonare.",
  links:[ {l:"Toll of Pywel (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-bell-locations-toll-of-pywel/"} ] },
{ id:"bell-delesyia", n:"🔔 Toll of Delesyia", alt:"Toll of Delesyia, capitale Delesyia clocktower", c:"bell", r:"Delesyia", x:680, y:380, absolute:true,
  lvl:"qualsiasi", chap:"Cap. 5+ (Delesyia accessibile)", req:"Cap. 4-5 della storia", acc:"Capitale di Delesyia (SE della mappa), torre dell'orologio nella parte NW della città. Nessun meccanismo speciale",
  d:"La più semplice del set: salita diretta alla torre, suono.",
  links:[ {l:"Toll of Pywel (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-bell-locations-toll-of-pywel/"} ] },
{ id:"bell-tommaso", n:"🔔 Toll of Tommaso (Tashkalp)", alt:"Toll of Tommaso, Tashkalp capital", c:"bell", r:"Crimson Desert", x:780, y:200, absolute:true,
  lvl:"qualsiasi", chap:"Cap. 1+ (raggiungibile esplorando)", req:"—", acc:"Capitale di Tashkalp (Crimson Desert NE). Trovala in città, nessun requisito speciale",
  d:"Tecnicamente raggiungibile presto se si attraversa il deserto, anche prima della storia in zona.",
  links:[ {l:"Toll of Pywel (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-bell-locations-toll-of-pywel/"} ] },
{ id:"bell-varnia", n:"🔔 Toll of Varnia", alt:"Toll of Varnia, palazzo cupola, holy city", c:"bell", r:"Crimson Desert", x:870, y:60, absolute:true,
  lvl:"qualsiasi", chap:"Cap. 1+ (lungo viaggio)", req:"—", acc:"Estremo NE della mappa, oltre il Crimson Desert. Cerca il palazzo con grande cupola; sali sotto la cupola, trova la leva rotante in cima e azionala → i pannelli si aprono e la campana scende in posizione suonabile",
  d:"La più lontana e spettacolare. Meccanica della cupola che si apre. Vista panoramica eccezionale.",
  links:[ {l:"Toll of Pywel (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-bell-locations-toll-of-pywel/"} ] },
{ id:"bell-pailune", n:"🔔 Toll of Pailune (LATE)", alt:"Toll of Pailune, red tower, docks", c:"bell", r:"Pailune", x:380, y:170, absolute:true,
  lvl:"32+", chap:"Cap. 7 · Homecoming (dopo 'Resolution')", req:"Liberazione di Pailune nella storia principale", acc:"Centro di Pailune, scala la torre rossa vicino ai moli e suona",
  d:"L'unica campana gated dalla storia: tutte le altre 7 si possono prendere in una sola passata già da Cap. 1, questa solo dopo aver liberato Pailune al Cap. 7.",
  links:[ {l:"Toll of Pywel (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-bell-locations-toll-of-pywel/"} ] },

// ===== STORIA PRINCIPALE Cap. 1-8 (boss campagna + location chiave) =====
// Verificati su Game8, Fextralife, GameSpot, PowerPyx, GAMES.GG, VULKK
{ id:"myurdin-tutorial", n:"Myurdin (tutorial)", alt:"Myurdin, primo boss", c:"boss", r:"Hernand", x:520, y:200, mandatory:true,
  lvl:"1", chap:"Prologo / Cap. 1", req:"Inizio gioco", acc:"Tutorial combat — sconfitta scriptata",
  d:"Primo boss del tutorial. Sconfigge Kliff (è progressione narrativa, non si vince). Riappare per il rematch al Cap. 7 a Silverwolf.",
  links:[ {l:"All Campaign Bosses (GameSpot)", u:"https://www.gamespot.com/gallery/crimson-desert-boss-guide-campaign-bosses-how-to-beat/2900-7613/"} ] },
{ id:"matthias-hernand", n:"Matthias (For Honor)", alt:"Matthias, cavaliere armatura, knight", c:"boss", r:"Hernand", x:548, y:235, mandatory:true,
  lvl:"3-5", chap:"Cap. 1 · The First Encounter", req:"Storia: arrivo a Hernand", acc:"Hernand Town Square — duello scriptato",
  d:"Primo vero boss della storia. Cavaliere in armatura splendente che sfida Kliff in quanto Greymane. Drop: skill Pump Kick (utile per tutto il gioco).",
  links:[
    {l:"Chapter 1 Walkthrough (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/585170"},
    {l:"All Campaign Bosses (GameSpot)", u:"https://www.gamespot.com/gallery/crimson-desert-boss-guide-campaign-bosses-how-to-beat/2900-7613/"}
  ] },
{ id:"kailok-hornsplitter", n:"Kailok the Hornsplitter", alt:"Kailok, Hornsplitter, mercante d'oro, Goldleaf", c:"boss", r:"Hernand", x:644, y:280, mandatory:true,
  lvl:"8-10", chap:"Cap. 2 · Golden Greed", req:"Quest 'Golden Greed' attiva", acc:"Goldleaf Guildhouse — combattimento finale del capitolo",
  d:"Re mercante corrotto leader dei Goldleaf. Spadone arcano che spara linee di danno con i fendenti. Primo boss davvero impegnativo. Drop: Sword of the Lord (ottima fino a metà gioco) + Abyss Gears.",
  links:[
    {l:"Hornsplitter guide (GamesRadar)", u:"https://www.gamesradar.com/games/rpg/crimson-desert-hornsplitter-kailok/"},
    {l:"How to Beat Hornsplitter (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/585808"},
    {l:"VULKK guide", u:"https://vulkk.com/2026/03/21/how-to-defeat-kaliok-hornsplitter-crimson-desert/"}
  ] },
{ id:"howling-hill", n:"Howling Hill (base Greymane)", alt:"Greymane Clan, Shakatu, Marquis Serkis", c:"city", r:"Hernand", x:500, y:340, mandatory:true,
  lvl:"10-15", chap:"Cap. 3 · Howling Hill", req:"Cap. 2 completato", acc:"Aperta dopo riconquista di Hernand",
  d:"Hub del clan Greymane ricostruito da Kliff con Shakatu e Marquis Serkis. Quartier generale narrativo da Cap. 3 in poi.",
  links:[ {l:"Chapter 3 Walkthrough (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/586592"} ] },
{ id:"frozen-soul-mountain", n:"Frozen Soul Mountain", c:"collectible", r:"Hernand", x:700, y:200,
  lvl:"15+", chap:"Cap. 3", req:"—", acc:"Confine NE Hernand/Pailune",
  d:"Montagna che fa da riferimento geografico per Reedwind Valley. Apre la transizione visiva verso Pailune.",
  links:[ {l:"Fextralife", u:"https://crimsondesertgame.wiki.fextralife.com/Interactive_Map"} ] },
{ id:"tenebrum", n:"Tenebrum", alt:"Tenebrum boss aereo, Forbidden Knowledge", c:"boss", r:"Hernand", x:485, y:332, mandatory:true,
  lvl:"20-22", chap:"Cap. 4 · The Price of Knowledge", req:"Quest 'Forbidden Knowledge' attiva", acc:"Scholastone Institute, plaza centrale",
  d:"Boss aereo che vola attorno alla plaza. Strategia: tieni L1+R1 per Blinding Flash → R1 per marcare il punto debole quadrato; vai al centro (pavimento mancante) e doppio Square/X per saltare e attivare le ali; correnti d'aria ti spingono su; colpisci con Force Palm (R3) durante le pause di carica. ~3 Force Palm a segno per neutralizzarlo.",
  links:[ {l:"Tenebrum (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Tenebrum"} ] },
{ id:"draven-crowcaller", n:"Draven the Crowcaller", alt:"Crowcaller, Draven, corvo nero, ombra", c:"boss", r:"Demeniss", x:210, y:330, mandatory:true,
  lvl:"26-28", chap:"Cap. 5 · Guest Unbidden", req:"Aver investigato a Muckroot Ranch", acc:"Inseguilo da Muckroot Ranch fino a Demeniss (3 fasi progressive)",
  d:"Boss in 3 fasi progressivamente più dure. Ammantato di tenebra, si dissolve in particelle nere per chiudere distanza. Considerato uno dei highlight della campagna.",
  links:[
    {l:"Crowcaller (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Draven_the_Crowcaller"},
    {l:"Chapter 5 boss guide (Method)", u:"https://www.method.gg/crimson-desert/crimson-desert-chapter-5-walkthrough-kearush-the-slayer-boss-guide"}
  ] },
{ id:"kearush-slayer", n:"Kearush the Slayer", alt:"Kearush", c:"boss", r:"Demeniss", x:180, y:300,
  lvl:"26", chap:"Cap. 5 · Guest Unbidden (Black and White arc)", req:"Sub-arc Black and White attivo", acc:"Demeniss, sotterranei",
  d:"Mini-boss della questline politica di Cap. 5. Anticamera al Crowcaller.",
  links:[ {l:"Method.gg boss guide", u:"https://www.method.gg/crimson-desert/crimson-desert-chapter-5-walkthrough-kearush-the-slayer-boss-guide"} ] },
{ id:"pailune-castle", n:"Pailune Castle", alt:"castello Pailune, Blue Fangs, Torstein", c:"city", r:"Pailune", x:280, y:115, mandatory:true,
  lvl:"32+", chap:"Cap. 7 · Homecoming", req:"Cap. 6 completato", acc:"Riconquista del nord, sub-arc Dawn Mist",
  d:"Castello di Pailune. Hub del Cap. 7 con Torstein e i Blue Fangs della resistenza.",
  links:[
    {l:"Chapter 7 Walkthrough (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/587752"},
    {l:"Counterattack (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-the-counterattack-chapter-7-walkthrough/"}
  ] },
{ id:"ludvig-boss", n:"Ludvig (Lonely Jackals)", alt:"Ludvig, One Armed Ludvig", c:"boss", r:"Pailune", x:285, y:120, mandatory:true,
  lvl:"32-34", chap:"Cap. 7 · Homecoming", req:"Quest 'Lonely Jackals'", acc:"Pailune Castle",
  d:"Boss in 2 fasi distinte con barre di vita separate. Dopo la prima si trasforma drammaticamente. Più duro qui rispetto alla versione 'Awakened' della quest finale del Cap. 7. Salva i migliori healing supplies per il primo incontro.",
  links:[
    {l:"Ludvig (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Ludvig"},
    {l:"How to Beat Ludvig (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/587740"}
  ] },
{ id:"awakened-ludvig", n:"Awakened Ludvig (Time to Face Justice)", c:"boss", r:"Pailune", x:288, y:122,
  lvl:"34", chap:"Cap. 7 · Twisted Fate sub-arc", req:"Aver sconfitto Ludvig nella prima fase di 'Lonely Jackals'", acc:"Quest 'Time to Face Justice'",
  d:"Versione potenziata: Ludvig consuma un umano imprigionato per ottenere potere oscuro. Drop: 2000 Pailunese Contribution EXP.",
  links:[ {l:"Awakened Ludvig (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Awakened_Ludvig"} ] },
{ id:"myurdin-silverwolf", n:"Myurdin (Silverwolf rematch)", alt:"Myurdin rematch", c:"boss", r:"Pailune", x:325, y:78, mandatory:true,
  lvl:"35", chap:"Cap. 7 · Homecoming finale", req:"Aver raggiunto la cima di Silverwolf Mountain", acc:"Battaglia finale del capitolo",
  d:"Rematch contro Myurdin a fine Cap. 7. Chiude il cerchio narrativo aperto dal tutorial.",
  links:[ {l:"Chapter 7 (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-the-counterattack-chapter-7-walkthrough/"} ] },
{ id:"hexe-marie", n:"Hexe Marie (Witch of the Sanctuary)", alt:"Hexe Marie, witch, strega santuario", c:"boss", r:"Demeniss", x:115, y:285,
  lvl:"32+", chap:"Side boss · disponibile dal Cap. 5-7", req:"Quest del santuario", acc:"Hexe Sanctuary, Demeniss",
  d:"Strega potente con incantesimi a area. Side boss famoso, non obbligatorio.",
  links:[
    {l:"Hexe Marie (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Hexe_Marie"},
    {l:"Hexe Marie (TheGamer)", u:"https://www.thegamer.com/crimson-desert-hexe-marie-boss-mechanics-preparation-guide/"}
  ] },
{ id:"saigord-staglord", n:"Saigord the Staglord", alt:"Staglord, Saigord, signore dei cervi", c:"boss", r:"Pailune", x:160, y:60,
  lvl:"30+", chap:"Side boss · disponibile da Cap. 7", req:"Esplorazione Savage Peaks", acc:"Snowy ruins di Savage Peaks (NW Pailune)",
  d:"Boss del nord nelle rovine innevate. Combattente d'élite di tipo cervo umanoide.",
  links:[ {l:"Saigord (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Saigord_the_Staglord"} ] },
{ id:"master-du", n:"Master Du", alt:"Master Du, Cloister Enlightenment", c:"boss", r:"Delesyia", x:740, y:170,
  lvl:"35+", chap:"Side boss · disponibile da Cap. 6+", req:"Cloister of Enlightenment sbloccato", acc:"Camera interna del Cloister",
  d:"Boss melee di alto livello nel chiostro. Stile combattimento marziale.",
  links:[ {l:"Bosses Hub (GameRant)", u:"https://gamerant.com/crimson-desert-guide-hub-quests-puzzles-weapons-armor-bosses/"} ] },

// ===== ABYSS =====
{ id:"abyss-hub", n:"Portale Abyss", c:"abyss", r:"Abyss", x:900, y:600,
  lvl:"15+", chap:"Cap. 2+", req:"Tutorial Abyss Cresset", acc:"Si entra dai Cresset",
  d:"Ingresso alla dimensione separata.", links:[ {l:"Origin of Thoughts (GAMES.GG)", u:"https://games.gg/crimson-desert/guides/crimson-desert-origin-of-thoughts-abyss-puzzle-solution/"} ] },
{ id:"abyss-cressets-all", n:"Tutti gli Abyss Cresset (37)", c:"abyss", r:"Abyss", x:870, y:580,
  lvl:"variabile", chap:"Cap. 1-7", req:"Risolvi i puzzle delle Ancient Ruins", acc:"Sparsi nelle 5 regioni",
  d:"37 Cresset. Ognuno è un fast travel + Abyss Artifact.", links:[ {l:"GameSpot Guide", u:"https://www.gamespot.com/gallery/crimson-desert-ancient-ruins-puzzles-abyss-cresset/2900-7617/"} ] },
{ id:"abyss-restoration-all", n:"Tutte le Abyss Restoration (40)", c:"abyss", r:"Abyss", x:930, y:620,
  lvl:"variabile", chap:"Cap. 2-endgame", req:"—", acc:"Sparsi nelle 5 regioni",
  d:"40 puzzle. Trofeo 'Conqueror of the Abysses' a completamento totale.", links:[ {l:"PowerPyx full guide", u:"https://www.powerpyx.com/crimson-desert-all-abyss-restoration-puzzle-locations-solutions/"} ] },

// ===== NEW POWER BOSSES — Primal Frenzy / Beast Slayer (7 boss) =====
// Categoria sblocata al Cap. 12. Sconfiggi tutti i 7 → trofeo "Beast Slayer" + sfida "Primal Frenzy".
// Coordinate assolute (absolute:true).
{ id:"np-skevald", n:"Skevald, the Carrion King", alt:"Skevald, Carrion King, re carogna, Hyena Den", c:"boss", r:"Crimson Desert", x:820, y:230, absolute:true,
  lvl:"45+", chap:"Cap. 12+ (sblocco categoria New Power)", req:"Bounty notice 'Skevald, the Carrion King' presa a Tashkalp Town da Tommaso", acc:"Hyena Den, sud-est di Tashkalp. Leggi la bounty per attivare la Faction Quest",
  d:"Re iena gigante. Boss del deserto orientale. 1 dei 7 New Power Bosses richiesti per il trofeo Beast Slayer.",
  links:[
    {l:"All New Power Bosses (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-new-power-boss-locations/"},
    {l:"Skevald guide (Sportskeeda)", u:"https://www.sportskeeda.com/esports/how-track-skevald-carrion-king-crimson-desert"},
    {l:"New Power Challenges (GameRant)", u:"https://gamerant.com/crimson-desert-new-power-challenges-primal-frenzy-bosses-locations/"}
  ] },
{ id:"np-black-fang", n:"Black Fang (Lupo leggendario)", alt:"Black Fang, lupo nero, Forest of Wolves", c:"boss", r:"Hernand", x:200, y:280, absolute:true,
  lvl:"40+", chap:"Cap. 12+ (categoria New Power)", req:"Faction Quest a Hernand: 'Bared Fang'", acc:"Forest of Wolves, Hernandian Territory. Traccialo con la Lanterna equipaggiata",
  d:"Lupo gigante in 2 fasi accompagnato da un branco. Porta Recovery Items. 1 dei 7 New Power Bosses.",
  links:[
    {l:"Bared Fang walkthrough (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-bared-fang-walkthrough/"},
    {l:"All New Power Bosses (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-new-power-boss-locations/"}
  ] },
{ id:"np-white-horn", n:"White Horn (yeti delle nevi)", alt:"White Horn, yeti, Snowhaven Hearth, Argent Peaks", c:"boss", r:"Pailune", x:140, y:100, absolute:true,
  lvl:"45+", chap:"Cap. 12+ (categoria New Power)", req:"Quest 'Deep-Rotted Sorrow' (Skoghorn Tribe), parte dalla Skoghorn Farm. Quest finale: 'White Horn of Snowhaven Hearth'", acc:"Argent Peaks ghiacciate, west edge della mappa, vicino a Snowhaven Hearth",
  d:"Yeti in 3 fasi durissimo. Una delle sfide più toste delle New Power. 1 dei 7 New Power Bosses.",
  links:[
    {l:"All New Power Bosses (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-new-power-boss-locations/"},
    {l:"All Pailune Faction Quests (GAMES.GG)", u:"https://games.gg/crimson-desert/guides/crimson-desert-all-pailune-faction-quests/"}
  ] },
{ id:"np-karanda", n:"Karanda (Regina dei Cieli)", alt:"Karanda, harpy queen, Queen of the Skies, Harpy Nest", c:"boss", r:"Pailune", x:340, y:160, absolute:true,
  lvl:"42+", chap:"Cap. 12+ (categoria New Power)", req:"Quest 'Queen of the Skies'", acc:"Harpy Nest in cima alla montagna centrale di Pailune",
  d:"Arpia gigante volante. Molti attacchi ad area dall'alto. 1 dei 7 New Power Bosses.",
  links:[
    {l:"Karanda guide (GameRant)", u:"https://gamerant.com/crimson-desert-karanda-boss-guide-location/"},
    {l:"All New Power Bosses (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-new-power-boss-locations/"}
  ] },
{ id:"np-queen-spider", n:"Queen Spider (Arboria Castle)", alt:"Queen Spider, regina ragno, Queen's Nest, Arboria", c:"boss", r:"Hernand", x:200, y:340, absolute:true,
  lvl:"42+", chap:"Cap. 12+ (categoria New Power)", req:"Quest 'Queen's Nest' (House Celeste tab). Richiede alta reputazione con la Hernand Faction", acc:"Rovine di Arboria Castle",
  d:"Aracnide gigante che nidifica nelle rovine. Plunge attacks consigliati per breakare il guscio. 1 dei 7 New Power Bosses.",
  links:[
    {l:"Queen Spider guide (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/590085"},
    {l:"All New Power Bosses (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-new-power-boss-locations/"}
  ] },
{ id:"np-queen-stoneback", n:"Queen Stoneback Crab", alt:"Queen Stoneback, granchio gigante, Stoneback Crab Wetlands, Redfox Trading Post", c:"boss", r:"Delesyia", x:710, y:380, absolute:true,
  lvl:"42+", chap:"Cap. 12+ (categoria New Power)", req:"Quest faction Delesyia attiva", acc:"Stoneback Crab Wetlands, direttamente a NORD del Redfox Trading Post in Delesyia",
  d:"Granchio gigante con guscio corazzato. Mid-air plunge attacks per rompere il guscio. 1 dei 7 New Power Bosses.",
  links:[
    {l:"Queen Stoneback guide (GameRant)", u:"https://gamerant.com/crimson-desert-queen-stoneback-crab-boss-location-how-to-beat/"},
    {l:"Stoneback & Bismuth (Escorenews)", u:"https://escorenews.com/en/article/77322-how-to-beat-queen-stoneback-bismuth-oreback-crab-bosses-in-crimson-desert"}
  ] },
{ id:"np-queen-bismuth", n:"Queen Bismuth Oreback Crab", alt:"Queen Bismuth, Oreback, Valley of Grief, Forebearer's Barrens, Well of Enlightenment", c:"boss", r:"Crimson Desert", x:680, y:170, absolute:true,
  lvl:"45+", chap:"Cap. 12+ (categoria New Power)", req:"Completare faction quests del deserto fino a sbloccare 'War Song of the Dusk' (aiuto città goblin)", acc:"Valley of Grief, Crimson Desert. Sud della 'F' di 'Forebearer's Barrens'. Direttamente a sud del Well of Enlightenment",
  d:"Variante più rara e pericolosa del granchio. Drop materiale endgame Bismuth. 1 dei 7 New Power Bosses.",
  links:[
    {l:"Queen Bismuth guide (GameRant)", u:"https://gamerant.com/crimson-desert-queen-bismuth-crab-location-how-to-beat/"},
    {l:"Queen Bismuth (Crimson Desert tools)", u:"https://crimsondesert.gaming.tools/bosses/middleboss_landspider_bismuthqueen_1"}
  ] },

// ===== HOUSE ALFONSO QUESTLINE — Dark Fog Lantern =====
// Linea narrativa che sblocca la Dark Fog Lantern: rivela memory fragments, illusory walls,
// hidden clues, sealed Abyss Artifacts, blue glows e ghost holograms.
{ id:"alfonso-transcendent", n:"Quest 'Transcendent Structure' (Dark Fog Lantern)", alt:"Dark Fog Lantern quest, Transcendent Structure, Baron Alfonso, House Alfonso", c:"quest", r:"Hernand", x:230, y:330, absolute:true,
  lvl:"15+", chap:"Cap. 2+ (dopo 'The Weight of Legacy')", req:"Completata 'The Weight of Legacy' (House Alfonso)", acc:"Hernand: parla con Baron Alfonso, indaga la struttura, parla con gli scout, consegna il rapporto, check con Local Informant",
  d:"~24 min, difficoltà normale. REWARD: Dark Fog Lantern (lanterna unica). Tappa fondamentale per iniziare la caccia ai segreti, illusory walls e Abyss Artifacts sigillati.",
  links:[
    {l:"Transcendent Structure walkthrough (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/589370"},
    {l:"Dark Fog Lantern guide (GameDevourer)", u:"https://gamedevourer.com/crimson-desert-what-is-the-dark-fog-lantern/"},
    {l:"House Alfonso quests (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/588722"}
  ] },
{ id:"alfonso-house-spears", n:"Quest 'House of Spears'", alt:"House of Spears, Alfonso questline", c:"quest", r:"Hernand", x:240, y:370, absolute:true,
  lvl:"18+", chap:"Cap. 2+", req:"Completata 'Transcendent Structure'", acc:"Hernand · Quest board House Alfonso",
  d:"Seconda quest della linea narrativa di House Alfonso. Approfondisce il lore della casata e prepara al boss finale.",
  links:[ {l:"House Alfonso quests (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/588722"} ] },
{ id:"alfonso-speartip", n:"Quest 'On the Speartip Once Again' + Bleed Warspike Commander", alt:"Bleed Warspike Commander, Speartip Once Again, Alfonso boss", c:"boss", r:"Hernand", x:250, y:400, absolute:true,
  lvl:"22+", chap:"Cap. 2-3", req:"Completata 'House of Spears'", acc:"Hernand · Quest finale linea Alfonso",
  d:"Quest finale di House Alfonso. Boss: Bleed Warspike Commander (sanguinamento + lance corazzate). Drop equipaggiamento di pregio + manual parts.",
  links:[
    {l:"House Alfonso quests (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/588722"},
    {l:"House Alfonso (TheGamesWiki)", u:"https://thegameswiki.com/crimson-desert/wiki/house-alfonso-quests"}
  ] },

// ===== PATCH 1.04.00 (Pearl Abyss · 23 aprile 2026) =====
// Storage rework, Hard Mode, boss rematches, nuovi pet, housing.
{ id:"patch104-heuklang", n:"Abyss Heuklang (taming pet)", alt:"Abyss Heuklang, chimera nera, pet patch 1.04, taming Trust 100", c:"abyss", r:"Abyss", x:90, y:90, absolute:true,
  lvl:"qualsiasi (post-patch 1.04)", chap:"Cap. 2+ (Abyss accessibile)", req:"Patch 1.04.00 installata", acc:"Trova un Abyss Heuklang nell'Abyss e usa il sistema Trust degli altri pet (0 → 100)",
  d:"Nuovo pet aggiunto col patch del 23 aprile 2026: chimera nera 'tenera' addomesticabile come gli altri pet. Una volta arrivati a 100 Trust si registra come compagno.",
  links:[
    {l:"How to Tame the Abyss Heuklang (Method.gg)", u:"https://www.method.gg/crimson-desert/abyss-heuklang-how-to-tame-the-cute-black-chimera-pet-in-crimson-desert"},
    {l:"Patch 1.04.00 notes (Pearl Abyss)", u:"https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=84"}
  ] },
{ id:"patch104-kuku-cooler", n:"Kuku Cooler (storage cibo)", alt:"Kuku Cooler, Enhanced Kuku Cooler, food storage 330 slot", c:"vendor", r:"Hernand", x:280, y:280, absolute:true,
  lvl:"qualsiasi (post-patch 1.04)", chap:"Cap. 1+", req:"Patch 1.04.00 + housing system", acc:"Quest dedicata per ottenere il Kuku Cooler base; Enhanced Kuku Cooler è craftabile",
  d:"Nuova storage box per cibi e ingredienti. Enhanced ha 330 slot. Gli ingredienti dentro sono usabili per cucinare anche se non li hai in inventario.",
  links:[
    {l:"How to get Kuku Cooler (xboxplay)", u:"https://xboxplay.games/crimson-desert/how-to-get-the-kuku-cooler-in-crimson-desert-72644"},
    {l:"Patch 1.04 notes (VULKK)", u:"https://vulkk.com/2026/04/23/crimson-desert-1-04-00-patch-notes-better-storage-new-pets-difficulty-modes/"}
  ] },
{ id:"patch104-hard-mode", n:"Hard Mode + Boss Rematches", alt:"difficoltà difficile, Hard Mode, boss rematches, Combat Challenges", c:"boss", r:"Hernand", x:500, y:340, absolute:true,
  lvl:"qualsiasi", chap:"Qualsiasi (post-patch 1.04)", req:"Patch 1.04.00", acc:"Menu opzioni: scegli Easy/Normal/Hard. Boss rematch dal Combat Challenges board (es. Howling Hill)",
  d:"Hard Mode aggiunge nuovi combat patterns ai boss specifici, +damage subito, riduce gli i-frame del rotolamento, riduce la finestra di parry/dodge e rende i nemici più aggressivi. Boss rematch sblocca il rifight di tutti i boss campagna.",
  links:[
    {l:"Patch 1.04 (XP Gained)", u:"https://xpgained.co.uk/patch-notes/crimson-desert-patch-notes-1-04-00-23rd-april-2026"},
    {l:"Roadmap Apr-Jun 2026 (Method)", u:"https://www.method.gg/crimson-desert/crimson-desert-roadmap-from-april-to-june-2026-crimson-desert-dev-update"},
    {l:"Biggest update yet (GameSpot)", u:"https://www.gamespot.com/articles/crimson-desert-biggest-update-yet-completely-reworks-how-you-play/1100-6539568/"}
  ] },
{ id:"patch104-hostile-remnants", n:"Hostile Remnants (riconquista)", alt:"hostile remnants, location reclaim, dynamic events", c:"quest", r:"Crimson Desert", x:660, y:200, absolute:true,
  lvl:"variabile", chap:"Da Cap. 7+ (location liberate)", req:"Aver liberato almeno una location nella storia + patch 1.04", acc:"I remnants riprendono dinamicamente le location liberate; controlla le tue location 'safe'",
  d:"Sistema dinamico di riconquista: i nemici tornano a occupare i territori liberati, dandoti motivi per re-difenderli ripetutamente. Roll-out graduale aprile-giugno 2026.",
  links:[ {l:"Roadmap Apr-Jun 2026 (Method)", u:"https://www.method.gg/crimson-desert/crimson-desert-roadmap-from-april-to-june-2026-crimson-desert-dev-update"} ] },

// ===== SECRET PLACES (60 Cresset) — riferimento generale =====
{ id:"secret-places-all", n:"Tutti i Secret Places (60 Abyss Cressets)", alt:"Secret Places Challenge, Pilgrim of Wonders, Abyss Cressets 60", c:"abyss", r:"Abyss", x:20, y:20, absolute:true,
  lvl:"variabile", chap:"Cap. 1-endgame", req:"Esplorazione (Force Palm aerial e Gliding consigliati)", acc:"Sparsi nelle 5 regioni: Hernand (13), Demeniss, Delesyia, Pailune, Crimson Desert (18)",
  d:"60 Cresset/Secret Places totali. Trofeo 'Pilgrim of Wonders' a 100%. Ogni discovery dà 1 Skill Point (Abyss Artifact) + Fast Travel. Aggiornato dalle ultime patch a 60 (vs i 37 originali del lancio).",
  links:[
    {l:"All 60 Secret Places (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-all-secret-places-locations/"},
    {l:"All Secret Places (GAMES.GG)", u:"https://games.gg/crimson-desert/guides/crimson-desert-all-secret-places-challenge-locations/"},
    {l:"Secret Places (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/586783"}
  ] },

// ╔═════════════════════════════════════════════════════════════════════════╗
// ║  COMPENDIO · ARMI UNICHE & LEGGENDARIE — Sessione 1 (19 voci)            ║
// ║  ID convention: item-wpn-<slug>                                          ║
// ║  Coord absolute:true sul layout 1000x700, regione approssimativa.        ║
// ╚═════════════════════════════════════════════════════════════════════════╝

// ───── Spade (1H + 2H) ─────
{ id:"item-wpn-sword-of-the-lord", n:"Sword of the Lord", alt:"spada del signore, drop Kailok, Hornsplitter, Cap.2 reward, Wind Slash", c:"weapon", r:"Hernand", x:200, y:320, absolute:true,
  pg:["Kliff"], type:"1H sword", rarity:"legendary", source:"boss-drop",
  stats:"13 ATK · 3 slot Abyss · Wind Slash (proiettile a distanza), Destruction I, Gale I",
  lvl:"8-10", chap:"Cap. 2", req:"Quest 'Golden Greed' attiva", acc:"Drop di Kailok the Hornsplitter al Goldleaf Guildhouse, fine Cap. 2",
  d:"Prima arma leggendaria. Wind Slash dà a una 1H sword il range di un'arma a distanza. Resta competitiva fino al Cap. 5.",
  links:[
    {l:"Sword of the Lord (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/587141"},
    {l:"Sword of the Lord (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Sword_of_the_Lord"}
  ] },

{ id:"item-wpn-hwando", n:"Hwando", alt:"katana, spada giapponese, Lioncrest Manor, Hernand chest", c:"weapon", r:"Hernand", x:140, y:240, absolute:true,
  pg:["Kliff"], type:"2H sword", rarity:"unique", source:"chest",
  stats:"19 ATK · 5 slot Abyss (3 pre-loaded: Insight I, Stamina Transference, Destruction I)",
  lvl:"5+", chap:"Cap. 1-2", req:"Una chiave (loot bandits, Back Alley Shop, o tavolo al 2° piano del manor)", acc:"Lioncrest Manor (NW Hernand). Edificio annesso a sinistra del manor: finestra senza vetro sul lato ovest, scala il muro, drop dentro, sali al 2° piano, apri porta chiusa con la chiave",
  d:"Una delle migliori 2H da early-mid game. Velocità + 5 slot Abyss totali = scaling enorme.",
  links:[
    {l:"Hwando (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/588141"},
    {l:"Lioncrest Manor entry (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/587653"}
  ] },

{ id:"item-wpn-darkbringer", n:"Darkbringer", alt:"spada oscura, White Wastes Sanctuary, skeleton sword, Pailune giant", c:"weapon", r:"Pailune", x:170, y:100, absolute:true,
  pg:["Kliff"], type:"2H sword", rarity:"legendary", source:"world-pickup",
  stats:"22 ATK · 5 slot Abyss · Ator's Orb (Heavy Attack spara orbi dorati a distanza)",
  lvl:"30+", chap:"Cap. 6+ (raggiungibile prima esplorando)", req:"Resistenza al freddo + esplorazione N Pailune", acc:"White Wastes Sanctuary, NW Pailune (ovest di Silver Wolf Mountain, NE di Five-Finger Mountain). Cerca i corvi che girano sopra l'area, sali fino al gigante scheletro semi-sepolto, prendi la spada incastrata tra le mascelle del cranio. Nessun boss, nessun puzzle",
  d:"Una delle armi più potenti dell'open world: si prende senza combattere. Ator's Orb la rende viable fino a fine gioco.",
  links:[
    {l:"Darkbringer (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-darkbringer-sword-location/"},
    {l:"Darkbringer (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/589312"}
  ] },

{ id:"item-wpn-frozen-anguish", n:"Frozen Anguish", alt:"angoscia gelata, Spire of Frost, ghiaccio Demeniss", c:"weapon", r:"Demeniss", x:380, y:280, absolute:true,
  pg:["Kliff"], type:"2H sword", rarity:"legendary", source:"chest",
  stats:"25 ATK (pre-refined Lv4) · 3 slot Abyss · Stamina Siphon Lv1, Attack Speed 1, Attack 1",
  lvl:"20+", chap:"Cap. 5+", req:"Resistenza al freddo Lv10+ (Frostcursed Plate Armor + Cloak nelle vicinanze)", acc:"Spire of Frost, Eye of Ice in N Demeniss. Entra, rompi il ghiaccio sulla lanterna interna per aprire la porta principale, forziere sotto la scala. Non serve completare il puzzle",
  d:"Spada 2H pre-raffinata Lv4: numeri tipici di mid-game ma puoi prenderla presto. Stamina Siphon ti rigenera barra mentre colpisci. Nonostante il nome, niente danno ghiaccio elementale.",
  links:[
    {l:"Frozen Anguish (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/589340"},
    {l:"Spire of Frost walkthrough (PowerPyx)", u:"https://www.powerpyx.com/crimson-desert-spire-of-frost-walkthrough/"}
  ] },

{ id:"item-wpn-knightlords-sword", n:"Knightlord's Sword", alt:"spada del signore cavaliere, House Byron, Dark Justiciar, Crescent Lake", c:"weapon", r:"Demeniss", x:480, y:380, absolute:true,
  pg:["Kliff"], type:"1H sword", rarity:"unique", source:"quest-reward",
  stats:"18 ATK · Crit Rate Lv1 · Attack Speed Lv2 · Refinement scalabile fino a +10 · Pre-loaded: Insight I, Life Transference, Swift I",
  lvl:"30+", chap:"Cap. 8 · The Dark Justiciar", req:"Faction quest 'The Dark Justiciar' (House Byron)", acc:"Quest line di House Byron in Cap. 8. La spada è sull'altare a Crescent Lake, Demeniss. Interagisci per aggiungerla all'inventario, niente boss, niente puzzle",
  d:"Mid-tier 1H sword del Cap. 8. Combo fluida tra Crit + Attack Speed. Buona per sustain con Life Transference pre-equipaggiato.",
  links:[
    {l:"Knightlord's Sword (BlogAndGuide)", u:"https://www.blogandguide.com/crimson-desert-knightlords-sword-location/"},
    {l:"Knightlord's Sword (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Knightlord's_Sword"}
  ] },

{ id:"item-wpn-alabaster-curved-sword", n:"Alabaster Curved Sword", alt:"spada curva alabastro, Varnia bridge, ponte santo", c:"weapon", r:"Crimson Desert", x:560, y:260, absolute:true,
  pg:["Kliff"], type:"1H sword", rarity:"unique", source:"chest",
  stats:"Statistiche da verificare in-game · forziere decorato",
  lvl:"35+", chap:"Cap. 6+", req:"—", acc:"Caverna nei dintorni della città di Varnia (Crimson Desert), entrata in città. Sciami di pipistrelli aggressivi nel tunnel principale, forziere decorato in fondo al tunnel",
  d:"Spada nominata in onore del ponte di alabastro che porta a Varnia. Loot da caverna con bat swarm.",
  links:[ {l:"Alabaster Curved Sword (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Alabaster_Curved_Sword"} ] },

// ───── Lance / Alabarde ─────
{ id:"item-wpn-soul-spear", n:"Soul Spear", alt:"lancia delle anime, Antumbra Ritual Grounds, Tomb of Frozen Souls, Argent Peaks", c:"weapon", r:"Hernand", x:120, y:260, absolute:true,
  pg:["Kliff"], type:"spear", rarity:"legendary", source:"world-pickup",
  stats:"27 ATK (più alta della categoria) · Soul Projectiles automatici quando finisci un nemico (cooldown 10s)",
  lvl:"15+", chap:"Cap. 3+ (Force Palm aerial / Gliding richiesti)", req:"Skill Force Palm + Gliding", acc:"Antumbra Ritual Grounds nelle Argent Peaks, NW di Hernand city (caverna sul fianco della falesia, vicino alla 'H' della scritta Hernand). Passa il Warpriest all'entrata (combatti o evita), prosegui per il cancello aperto fino al ponte rotto, salta e plana giù di 2 livelli, raccogli la lancia al centro",
  d:"Lancia 2H con la più alta base ATK del gioco a parità di tier. Effetto Soul Projectiles quando finisce un nemico = mob clearing pazzesco.",
  links:[
    {l:"Soul Spear (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/588553"},
    {l:"Soul Spear (PC Gamer)", u:"https://www.pcgamer.com/games/action/crimson-desert-soul-spear-location/"}
  ] },

{ id:"item-wpn-vow-of-the-dead-king", n:"Vow of the Dead King", alt:"voto del re morto, alabarda, Frostveiled Castle Ruins, Pailune halberd", c:"weapon", r:"Pailune", x:300, y:100, absolute:true,
  pg:["Kliff"], type:"halberd", rarity:"legendary", source:"chest",
  stats:"14-35 ATK (refinement Lv1→max) · Crit Rate Lv3 · +4% damage a Humanoidi/Walkers/Mighty Foes",
  lvl:"22+", chap:"Cap. 4+", req:"Esplorazione N Pailune", acc:"Frostveiled Castle Ruins, N Pailune (tra i picchi vicino Silverwolf Mountain, est di Wayward Woods). Pulisci i banditi in superficie, scendi le scale, naviga le trappole (spuntoni / gap / fuoco), accendi la lanterna spenta accanto alla camera sbarrata in fondo al corridoio per abbassare il cancello",
  d:"Alabarda con bonus damage TRIPLO (Humanoidi + Walkers + Mighty) che la rende rilevante quasi sempre. Crit Rate 3 di base.",
  links:[
    {l:"Vow of the Dead King (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/590395"},
    {l:"Vow of the Dead King (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Vow_of_the_Dead_King"}
  ] },

{ id:"item-wpn-electro-mecha-spear", n:"Electro-Mecha Spear", alt:"lancia elettro-meccanica, cyber spear, Regent's Rise, Gorthak", c:"weapon", r:"Delesyia", x:610, y:330, absolute:true,
  pg:["Kliff"], type:"spear", rarity:"unique", source:"chest",
  stats:"Statistiche da verificare in-game · cyberpunk theme",
  lvl:"30+", chap:"Cap. 6+", req:"Skill Force Palm (R3)", acc:"Forziere dentro recinto di legno a Regent's Rise, lungo il sentiero est di Gorthak Territory in NW Delesyia. Vai a nord della 'L' in 'Delesyia'. Distruggi le tavole con Force Palm, apri il forziere",
  d:"Lancia con estetica cyberpunk-meccanica, una rarità nel mondo medievale di Pywel. Tematica unica.",
  links:[
    {l:"Electro-Mecha Spear (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/594749"},
    {l:"Electro-Mecha Spear (GameRant)", u:"https://gamerant.com/crimson-desert-electro-mecha-spear-location-stats/"}
  ] },

// ───── Archi ─────
{ id:"item-wpn-noble-mans-bow", n:"Noble Man's Bow", alt:"arco del nobile, Valgrind Tomb, Pailune chest, mighty foes bonus", c:"weapon", r:"Pailune", x:380, y:130, absolute:true,
  pg:["Kliff"], type:"bow", rarity:"legendary", source:"chest",
  stats:"18 ATK · 3 slot Abyss · +40% damage a Mighty Foes",
  lvl:"15+", chap:"Cap. 3+", req:"—", acc:"Valgrind Tomb, N Pailune (sotto la 'N' di Pailune sulla mappa). Apertura piccola sulla parete di destra prima di entrare nella stanza con la tomba: accovacciati per entrare nella stanza nascosta, forziere dentro",
  d:"Arco con il +40% damage più alto del gioco contro Mighty Foes (boss/élite). Build ad arco crit + bonus stacks pesantemente.",
  links:[
    {l:"Noble Man's Bow (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/590109"},
    {l:"Noble Man's Bow (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Noble_Man's_Bow"}
  ] },

{ id:"item-wpn-golden-knotted-ancestral-bow", n:"Golden-Knotted Ancestral Bow", alt:"arco ancestrale annodato d'oro, Pailune Ancestor's Ruins, dungeon Silver Wolf", c:"weapon", r:"Pailune", x:320, y:90, absolute:true,
  pg:["Kliff"], type:"bow", rarity:"legendary", source:"chest",
  stats:"19 ATK (Refinement Lv3 di base) · 5 slot Abyss (3 pre-loaded: Attack 2, Critical Rate 1, Health Siphon Lv1) · Health Siphon su ogni hit",
  lvl:"22+", chap:"Cap. 4+", req:"—", acc:"Pailune Ancestor's Ruins, N Silver Wolf Mountain (allinea il cursore sopra la 'I' di Pailune). In una radura forestale, cerca un'apertura rettangolare di pietra a livello del terreno, mimetizzata da muschio. Dungeon con 3 sezioni di trappole (pavimento crollante, lame, bracieri oscillanti) — pazienza > velocità",
  d:"Forse il miglior arco mid-game: pre-refined Lv3, Health Siphon di base, 5 slot totali. Imbattibile per sostenibilità in PvE.",
  links:[
    {l:"Golden-Knotted Ancestral Bow (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/590169"},
    {l:"Golden-Knotted Ancestral Bow (Method.gg)", u:"https://www.method.gg/crimson-desert/how-to-get-the-golden-knotted-ancestral-bow-in-crimson-desert"}
  ] },

{ id:"item-wpn-warspike-bow", n:"Warspike Bow", alt:"arco di Fort Warspike, Walter Lanford, Bleed Bandits leader", c:"weapon", r:"Hernand", x:250, y:400, absolute:true,
  pg:["Kliff"], type:"bow", rarity:"unique", source:"boss-drop",
  stats:"Crit-focused (statistiche precise da verificare) · Pre-loaded Abyss Gear",
  lvl:"22+", chap:"Cap. 2-3", req:"Quest line House Alfonso 'On the Speartip Once Again'", acc:"Drop di Bleed Warspike Commander (Walter Lanford), boss della quest finale di House Alfonso a Fort Warspike, Hernand",
  d:"Arco crit-rate del leader dei Bleed Bandits. Companion del Warspike Spear (drop dello stesso boss).",
  links:[
    {l:"Warspike Bow (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/591544"},
    {l:"Warspike Bow (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Warspike_Bow"}
  ] },

// ───── Pugnali ─────
{ id:"item-wpn-kylus-dagger", n:"Kylus Dagger", alt:"pugnale Kylus, Stag Lord reward, Oakenshield Manor, Woman Lost Husband", c:"weapon", r:"Hernand", x:200, y:340, absolute:true,
  pg:["Kliff","Damiane"], type:"dagger", rarity:"unique", source:"quest-reward",
  stats:"14 ATK · Speed Lv3",
  lvl:"15+", chap:"Cap. 3+", req:"Aver sconfitto Saigord the Staglord", acc:"Reward della faction quest 'Woman Who Lost Her Husband' a Oakenshield Manor, città di Hernand. Parla con la donna NPC dopo aver battuto Staglord",
  d:"Pugnale veloce, ottimo per stealth executions e burst attacks. Speed Lv3 base.",
  links:[
    {l:"Kylus Dagger (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/589151"}
  ] },

{ id:"item-wpn-goblin-king-dagger", n:"Goblin King's Treasure Dagger", alt:"pugnale del re goblin, Mudridge Cabin, burst damage dagger", c:"weapon", r:"Hernand", x:90, y:380, absolute:true,
  pg:["Kliff","Damiane"], type:"dagger", rarity:"legendary", source:"chest",
  stats:"Burst damage focus (statistiche precise da verificare in-game) · Top priority per stealth + burst build",
  lvl:"18+", chap:"Cap. 3+", req:"—", acc:"Forziere sotto Mudridge Cabin (Hernand). Cerca l'accesso al sotterraneo dentro la cabina",
  d:"Top-tier per qualsiasi build di pugnale: massimo burst damage del tier.",
  links:[
    {l:"Goblin King's Dagger (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/588856"},
    {l:"Goblin King's Dagger (GameRant)", u:"https://gamerant.com/crimson-desert-how-to-get-goblin-kings-treasure-dagger-location/"}
  ] },

// ───── Stocco / Armi Damiane ─────
{ id:"item-wpn-fallen-kingdom-rapier", n:"Fallen Kingdom's Rapier", alt:"stocco regno caduto, Icemoor Castle Ruins, Damiane only rapier", c:"weapon", r:"Hernand", x:90, y:300, absolute:true,
  pg:["Damiane"], type:"rapier", rarity:"legendary", source:"world-pickup",
  stats:"18 ATK (la più alta base damage della categoria dagger/rapier)",
  lvl:"22+", chap:"Cap. 3+ (Damiane sbloccata)", req:"Damiane unlocked (Cap. 3)", acc:"Stanza posteriore di Icemoor Castle Ruins, W Hernand. Lo stocco è appoggiato a un barile dietro il forziere che contiene il Leather Cloak of the Fallen Kingdom",
  d:"SOLO Damiane. Stocco con la più alta base damage della sua categoria. Pickup gratuito senza boss.",
  links:[
    {l:"Fallen Kingdom's Rapier (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/588858"},
    {l:"Fallen Kingdom's Rapier (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Fallen_Kingdom's_Rapier"}
  ] },

{ id:"item-wpn-royal-oath", n:"Royal Oath", alt:"giuramento reale, stocco Thorel, Royal Tomb Demeniss, Glory in Ruins", c:"weapon", r:"Demeniss", x:560, y:380, absolute:true,
  pg:["Damiane"], type:"rapier", rarity:"legendary", source:"quest-reward",
  stats:"Alta ATK · 3 slot Abyss pre-loaded (Swift, Insight, Destruction) — tutte offensive",
  lvl:"30+", chap:"Cap. 5+", req:"Side quest 'Glory in Ruins' a Demeniss completata", acc:"Royal Tomb appena est della città di Demeniss. Spada nella tomba, a destra del sarcofago in fondo",
  d:"Stocco usato nelle cerimonie di incoronazione della casata Thorel. Build perfetta per Damiane: Swift + Insight + Destruction già equipaggiati.",
  links:[
    {l:"Royal Oath (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Royal_Oath"}
  ] },

{ id:"item-wpn-caliburns-mercy-pistol", n:"Caliburn's Mercy Pistol", alt:"misericordia di Caliburn, Fort Musket, top floor pistola Demeniss", c:"weapon", r:"Demeniss", x:570, y:300, absolute:true,
  pg:["Damiane"], type:"pistol", rarity:"legendary", source:"world-pickup",
  stats:"La più alta base ATK della categoria pistola",
  lvl:"30+", chap:"Cap. 5+", req:"Mask equipaggiata (per stealing senza essere attaccato)", acc:"Top floor di Fort Musket, NE Demeniss. Sul tavolo del piano superiore — è un oggetto da stealing, ti serve la Thief's Mask",
  d:"Pistola per Damiane con ATK più alto del tier. Richiede stealth (Mask) per il pickup.",
  links:[
    {l:"Caliburn's Mercy Pistol (Fextralife)", u:"https://crimsondesertgame.wiki.fextralife.com/Caliburn's_Mercy_Pistol"}
  ] },

{ id:"item-wpn-demenissian-hero-musket", n:"Demenissian Hero's Musket", alt:"moschetto eroe demenissiano, Lost Song Cave, waterfall cave musket", c:"weapon", r:"Demeniss", x:340, y:340, absolute:true,
  pg:["Damiane"], type:"musket", rarity:"legendary", source:"chest",
  stats:"Alta ATK + crit rate · 3 slot Abyss pre-loaded (Energy Drain, Destruction, Swift)",
  lvl:"30+", chap:"Cap. 5+", req:"Skill Stab", acc:"Lost Song Cave, dietro una cascata in NW Serpent Marsh, Demeniss. Usa Stab davanti alla cascata per attraversare l'acqua, poi forziere dentro",
  d:"Moschetto endgame per Damiane: damage + crit + 3 abyss gears offensive. Setup completo.",
  links:[
    {l:"Demenissian Hero's Musket (Game8)", u:"https://game8.co/games/Crimson-Desert/archives/591782"}
  ] },

// ───── Asce / Armi Oongka ─────
{ id:"item-wpn-double-headed-axe-of-greed", n:"Double-Headed Axe of Greed", alt:"ascia bifronte dell'avidità, Steel Mountains shipwreck, Demeniss Southern Cliff", c:"weapon", r:"Demeniss", x:330, y:470, absolute:true,
  pg:["Oongka","Kliff"], type:"1H axe", rarity:"legendary", source:"world-pickup",
  stats:"Alta crit rate · Insight Abyss Gear pre-equipaggiato",
  lvl:"30+", chap:"Cap. 6+", req:"—", acc:"Demeniss Southern Cliff Shipwreck, vicino alle Steel Mountains. Spiaggia pericolosa, bisogna setacciare i detriti del relitto",
  d:"Ascia 1H crit-focused. Eccellente in dual-wield con un'altra ascia. Particolarmente forte per Oongka.",
  links:[
    {l:"Double-Headed Axe of Greed (BlogAndGuide)", u:"https://www.blogandguide.com/crimson-desert-double-headed-axe-of-greed-location-stats-and-effects-explained/"},
    {l:"Double-Headed Axe of Greed (GameRant)", u:"https://gamerant.com/crimson-desert-how-to-get-double-headed-axe-of-greed-location/"}
  ] }
];
