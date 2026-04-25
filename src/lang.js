//  KRALN — Language System

const LANGS = {
  en: {
    // Tutorial
    tut_title: "HOW TO SURVIVE",
    tut_obj_title: "🎯 OBJECTIVE",
    tut_obj: "Descend into the cursed depths of Kraln. But also deeper into madness.",
    tut_ctrl_title: "🎮 CONTROLS",
    tut_controls: [
      ["A / ←", "Move Left"],
      ["D / →", "Move Right"],
      ["W / ↑ / Space", "Jump"],
      ["S / ↓", "Crouch / Drop"],
      ["X", "Cast Spell"],
      ["C", "Parry / Shield"],
      ["1 / 2 / 3 / 4", "Switch Staff"],
      ["E", "Interact"],
      ["Shift", "Dash"],
      ["P / Esc", "Pause"],
    ],
    tut_staff_title: "🔮 STAVES & MAGIC",
    tut_staves: [
      { icon: "🦴", name: "Bone Staff", desc: "Fires bone shards. Fast, low mana cost." },
      { icon: "🔥", name: "Fire Staff", desc: "Launches fireballs. Burns enemies over time." },
      { icon: "❄️", name: "Frost Staff", desc: "Ice bolts that slow and freeze foes." },
      { icon: "⚡", name: "Lightning Staff", desc: "Chain lightning. Hits multiple enemies." },
      { icon: "☠️", name: "Shadow Staff", desc: "Void beams that drain enemy life." },
      { icon: "🌿", name: "Poison Staff", desc: "Toxic spores. Stacks poison damage." },
    ],
    tut_lvl_title: "⚔️ LEVELS",
    tut_lvl: "Each level has a unique objective: survive a wave, slay the boss, collect cursed relics, or escape before the darkness consumes you. Difficulty increases with every floor — more enemies, faster attacks, stronger bosses, and deadly traps. Find new staves and upgrades along the way.",
    btn_start: "⚡ BEGIN YOUR DESCENT",
    btn_next_lvl: "NEXT LEVEL ▶",
    btn_retry: "↺ RETRY",
    btn_menu: "MENU",
    lu_title: "LEVEL COMPLETE!",
    go_title: "YOU DIED",
    go_msgs: [
      "The darkness consumed you.",
      "Kraln claims another soul.",
      "The abyss swallows you whole.",
      "Your light fades into nothing.",
      "The horrors prevail.",
    ],
    // HUD
    hud_level: "LEVEL",
    hud_score: "SCORE",
    hud_boss_prefix: "BOSS — ",
    // Messages
    msg_new_staff: "New staff acquired:",
    msg_health_orb: "Health restored!",
    msg_mana_orb: "Mana restored!",
    msg_level_obj: [
      "Objective: Survive the graveyard. Slay all undead.",
      "Objective: Destroy the cursed altar before time runs out.",
      "Objective: Collect 3 Soul Shards from fallen demons.",
      "Objective: Defeat the Lich King and his spectral army.",
      "Objective: Escape the collapsing crypt. Reach the exit!",
    ],
    menu_subtitle: "INTO THE DARK",
    credits_btn: "✦ CREDITS",
    play_btn: "▶ PLAY",
    lang_btn: "🌐 Language",
  },

  pt: {
    tut_title: "COMO SOBREVIVER",
    tut_obj_title: "🎯 OBJETIVO",
    tut_obj: "Desça às profundezas amaldiçoadas de Kraln. Cada nível esconde um objetivo sombrio — elimine a corrupção, sobreviva aos horrores e desvende os segredos do abismo. Cada nível concluído te mergulha mais fundo na loucura.",
    tut_ctrl_title: "🎮 CONTROLES",
    tut_controls: [
      ["A / ←", "Mover Esquerda"],
      ["D / →", "Mover Direita"],
      ["W / ↑ / Espaço", "Pular"],
      ["S / ↓", "Agachar / Descer"],
      ["X", "Lançar Magia"],
      ["C", "Aparar / Escudo"],
      ["1 / 2 / 3 / 4", "Trocar Cajado"],
      ["E", "Interagir"],
      ["Shift", "Correr"],
      ["P / Esc", "Pausar"],
    ],
    tut_staff_title: "🔮 CAJADOS & MAGIA",
    tut_staves: [
      { icon: "🦴", name: "Cajado de Osso", desc: "Dispara fragmentos de osso. Rápido, pouco mana." },
      { icon: "🔥", name: "Cajado de Fogo", desc: "Lança bolas de fogo. Queima inimigos ao longo do tempo." },
      { icon: "❄️", name: "Cajado de Gelo", desc: "Projéteis de gelo que lentificam e congelam inimigos." },
      { icon: "⚡", name: "Cajado de Raio", desc: "Raio em cadeia. Atinge múltiplos inimigos." },
      { icon: "☠️", name: "Cajado das Sombras", desc: "Feixes do vazio que drenam a vida dos inimigos." },
      { icon: "🌿", name: "Cajado de Veneno", desc: "Esporos tóxicos. Acumula dano de veneno." },
    ],
    tut_lvl_title: "⚔️ NÍVEIS",
    tut_lvl: "Cada nível tem um objetivo único: sobreviva a uma onda, derrote o chefe, colete relíquias amaldiçoadas ou escape antes que a escuridão te consuma. A dificuldade aumenta a cada andar — mais inimigos, ataques mais rápidos, chefes mais fortes e armadilhas mortais. Encontre novos cajados e melhorias ao longo do caminho.",
    btn_start: "⚡ INICIAR SUA DESCIDA",
    btn_next_lvl: "PRÓXIMO NÍVEL ▶",
    btn_retry: "↺ TENTAR NOVAMENTE",
    btn_menu: "MENU",
    lu_title: "NÍVEL COMPLETO!",
    go_title: "VOCÊ MORREU",
    go_msgs: [
      "A escuridão te consumiu.",
      "Kraln reivindica mais uma alma.",
      "O abismo te engole por completo.",
      "Sua luz se apaga no nada.",
      "Os horrores prevalecem.",
    ],
    hud_level: "NÍVEL",
    hud_score: "PONTOS",
    hud_boss_prefix: "CHEFE — ",
    msg_new_staff: "Novo cajado obtido:",
    msg_health_orb: "Vida restaurada!",
    msg_mana_orb: "Mana restaurada!",
    msg_level_obj: [
      "Objetivo: Sobreviva ao cemitério. Elimine todos os mortos-vivos.",
      "Objetivo: Destrua o altar amaldiçoado antes que o tempo acabe.",
      "Objetivo: Colete 3 Fragmentos de Alma de demônios derrotados.",
      "Objetivo: Derrote o Rei Lich e seu exército espectral.",
      "Objetivo: Fuja da cripta desmoronando. Alcance a saída!",
    ],
    menu_subtitle: "NAS TREVAS",
    credits_btn: "✦ CRÉDITOS",
    play_btn: "▶ JOGAR",
    lang_btn: "🌐 Idioma",
  }
};

let currentLang = 'en';

function t(key) {
  return LANGS[currentLang][key] || LANGS['en'][key] || key;
}

function selectLang(lang) {
  currentLang = lang;
  applyLang();
  showScreen('menu-screen');
}

function switchLang() {
  currentLang = currentLang === 'en' ? 'pt' : 'en';
  applyLang();
}



function applyLang() {
  const L = LANGS[currentLang];
  // Tutorial
  document.getElementById('tut-title').textContent = L.tut_title;
  document.getElementById('tut-obj-title').textContent = L.tut_obj_title;
  document.getElementById('tut-obj-text').textContent = L.tut_obj;
  document.getElementById('tut-ctrl-title').textContent = L.tut_ctrl_title;
  document.getElementById('tut-staff-title').textContent = L.tut_staff_title;
  document.getElementById('tut-lvl-title').textContent = L.tut_lvl_title;
  document.getElementById('tut-lvl-text').textContent = L.tut_lvl;

  const ctrlEl = document.getElementById('tut-controls');
  ctrlEl.innerHTML = L.tut_controls.map(([k,v]) =>
    `<div class="ctrl-row"><span class="ctrl-key">${k}</span><span>${v}</span></div>`
  ).join('');

  const stavesEl = document.getElementById('tut-staves');
  stavesEl.innerHTML = L.tut_staves.map(s =>
    `<div class="staff-item"><span class="staff-icon">${s.icon}</span><span class="staff-name">${s.name}</span> — ${s.desc}</div>`
  ).join('');

  // Buttons
  document.getElementById('btn-start-game').textContent = L.btn_start;
  document.getElementById('btn-next-lvl').textContent = L.btn_next_lvl;
  document.getElementById('btn-restart').textContent = L.btn_retry;
  document.getElementById('btn-go-menu').textContent = L.btn_menu;
  document.getElementById('btn-back-credits').textContent = '← BACK';
  document.getElementById('btn-play').textContent = L.play_btn;
  document.getElementById('btn-credits').textContent = L.credits_btn;
  document.getElementById('btn-lang').textContent = L.lang_btn;
  document.getElementById('menu-subtitle').textContent = L.menu_subtitle;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.style.display = 'none';
    s.classList.remove('active');
  });
  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'flex';
    target.classList.add('active');
  }
}

function showTutorial() {
  applyLang();
  showScreen('tutorial-screen');
}

function showCredits() {
  showScreen('credits-screen');
}

function goMenu() {
  if (window.gameInstance) window.gameInstance.stop();
  showScreen('menu-screen');
}
