
// KRALN — Save & Storage System



const KEYS = {

  HIGH_SCORE: "kraln_high_score",

  BEST_LEVEL:  "kraln_best_level",

  LANG:        "kraln_lang",

  SETTINGS:    "kraln_settings",

};

export const Storage = {

  // High Score

  getHighScore() {

    return parseInt(localStorage.getItem(KEYS.HIGH_SCORE) || "0", 10);

  },

  setHighScore(score) {

    const current = this.getHighScore();

    if (score > current) {

      localStorage.setItem(KEYS.HIGH_SCORE, score);

      return true; // novo recorde!

    }

    return false;

  },

  // Best Level

  getBestLevel() {

    return parseInt(localStorage.getItem(KEYS.BEST_LEVEL) || "1", 10);

  },

  setBestLevel(level) {

    const current = this.getBestLevel();

    if (level > current) {

      localStorage.setItem(KEYS.BEST_LEVEL, level);

    }

  },

  // Language

  getLang() {

    return localStorage.getItem(KEYS.LANG) || "en";

  },

  setLang(lang) {

    localStorage.setItem(KEYS.LANG, lang);

  },

  // Settings

  getSettings() {

    const raw = localStorage.getItem(KEYS.SETTINGS);

    return raw ? JSON.parse(raw) : { volume: 0.7, particles: true };

  },

  setSettings(settings) {

    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));

  },

  // Reset tudo

  clearAll() {

    Object.values(KEYS).forEach(k => localStorage.removeItem(k));

  },

};

