// ============================================================
// KRALN — Combo Multiplier System
// ============================================================

export class ComboSystem {
  constructor() {
    this.count = 0;
    this.timer = 0;
    this.maxTimer = 120; // frames até resetar
    this.multiplier = 1;
    this.displayAlpha = 0;
    this.lastScore = 0;
  }

  hit() {
    this.count++;
    this.timer = this.maxTimer;
    this.multiplier = this.getMultiplier();
    this.displayAlpha = 1;
  }

  getMultiplier() {
    if (this.count >= 20) return 5;
    if (this.count >= 10) return 4;
    if (this.count >= 6)  return 3;
    if (this.count >= 3)  return 2;
    return 1;
  }

  getLabel() {
    if (this.count >= 20) return "LEGENDARY";
    if (this.count >= 10) return "UNSTOPPABLE";
    if (this.count >= 6)  return "RAMPAGE";
    if (this.count >= 3)  return "COMBO";
    return "";
  }

  apply(baseScore) {
    return baseScore * this.multiplier;
  }

  update() {
    if (this.timer > 0) {
      this.timer--;
    } else {
      this.count = 0;
      this.multiplier = 1;
    }
    if (this.displayAlpha > 0) this.displayAlpha -= 0.015;
  }

  draw(ctx, canvas) {
    if (this.count < 3 || this.displayAlpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.displayAlpha;

    const cx = canvas.width - 120;
    const cy = 80;
    const label = this.getLabel();

    ctx.fillStyle = "#ff4444";
    ctx.font = `bold 13px monospace`;
    ctx.textAlign = "center";
    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 8;
    ctx.fillText(label, cx, cy - 16);

    ctx.font = `bold 28px Georgia`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`x${this.multiplier}`, cx, cy + 10);

    ctx.font = `12px monospace`;
    ctx.fillStyle = "#aaa";
    ctx.shadowBlur = 0;
    ctx.fillText(`${this.count} kills`, cx, cy + 28);

    // Timer bar
    const barW = 80;
    const fill = (this.timer / this.maxTimer) * barW;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(cx - barW / 2, cy + 36, barW, 4);
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(cx - barW / 2, cy + 36, fill, 4);

    ctx.restore();
  }
}
