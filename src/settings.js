// ============================================================
// KRALN — Settings Panel
// ============////////////////////////////////////////////////

import { Storage } from "./storage.js";

export class SettingsPanel {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.visible = false;
    this.settings = Storage.getSettings();
    this.options = [
      { label: "Volume",    key: "volume",    type: "range", min: 0, max: 1, step: 0.1 },
      { label: "Particles", key: "particles", type: "toggle" },
      { label: "Language",  key: "lang",      type: "cycle", values: ["en", "pt"] },
    ];
    this.selected = 0;
  }

  show() { this.visible = true; }
  hide() { this.visible = false; Storage.setSettings(this.settings); }
  toggle() { this.visible ? this.hide() : this.show(); }

  navigate(dir) {
    this.selected = (this.selected + dir + this.options.length) % this.options.length;
  }

  adjust(dir) {
    const opt = this.options[this.selected];
    if (opt.type === "range") {
      this.settings[opt.key] = Math.min(opt.max, Math.max(opt.min,
        Math.round((this.settings[opt.key] + dir * opt.step) * 10) / 10
      ));
    } else if (opt.type === "toggle") {
      this.settings[opt.key] = !this.settings[opt.key];
    } else if (opt.type === "cycle") {
      const idx = opt.values.indexOf(this.settings[opt.key] || opt.values[0]);
      this.settings[opt.key] = opt.values[(idx + 1) % opt.values.length];
    }
    Storage.setSettings(this.settings);
  }

  getValue(opt) {
    const val = this.settings[opt.key];
    if (opt.type === "range") return `${Math.round(val * 100)}%`;
    if (opt.type === "toggle") return val ? "ON" : "OFF";
    if (opt.type === "cycle") return String(val).toUpperCase();
    return val;
  }

  draw() {
    if (!this.visible) return;
    const { ctx, canvas } = this;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0d0d1a";
    ctx.strokeStyle = "#8b0000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - 160, cy - 140, 320, 280, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#cc2222";
    ctx.font = "bold 24px Georgia, serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 10;
    ctx.fillText("SETTINGS", cx, cy - 90);
    ctx.shadowBlur = 0;

    this.options.forEach((opt, i) => {
      const y = cy - 40 + i * 60;
      const isSelected = i === this.selected;

      ctx.fillStyle = isSelected ? "#1a0a0a" : "#111";
      ctx.strokeStyle = isSelected ? "#ff4444" : "#222";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx - 130, y - 18, 260, 40, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#aaa";
      ctx.font = "14px Georgia";
      ctx.textAlign = "left";
      ctx.fillText(opt.label, cx - 115, y + 6);

      ctx.fillStyle = isSelected ? "#ff6666" : "#666";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "right";
      ctx.fillText(this.getValue(opt), cx + 115, y + 6);
    });

    ctx.restore();
  }
}
