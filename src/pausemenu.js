// ============================================================
// KRALN — Pause Menu
// ============================================================

export class PauseMenu {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.options = ["Resume", "Restart", "Main Menu"];
    this.selected = 0;
    this.visible = false;
  }

  show() { this.visible = true; this.selected = 0; }
  hide() { this.visible = false; }
  toggle() { this.visible ? this.hide() : this.show(); }

  navigate(dir) {
    this.selected = (this.selected + dir + this.options.length) % this.options.length;
  }

  getSelected() {
    return this.options[this.selected];
  }

  draw() {
    if (!this.visible) return;
    const { ctx, canvas } = this;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Overlay
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Panel
    ctx.fillStyle = "#0d0d1a";
    ctx.strokeStyle = "#8b0000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - 140, cy - 130, 280, 260, 8);
    ctx.fill();
    ctx.stroke();

    // Title
    ctx.fillStyle = "#cc2222";
    ctx.font = "bold 28px Georgia, serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 12;
    ctx.fillText("PAUSED", cx, cy - 70);
    ctx.shadowBlur = 0;

    // Options
    this.options.forEach((opt, i) => {
      const y = cy - 20 + i * 55;
      const isSelected = i === this.selected;

      ctx.fillStyle = isSelected ? "#8b0000" : "#1a1a2e";
      ctx.strokeStyle = isSelected ? "#ff4444" : "#333";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx - 100, y - 22, 200, 40, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isSelected ? "#ffffff" : "#888888";
      ctx.font = isSelected ? "bold 16px Georgia" : "16px Georgia";
      ctx.fillText(opt, cx, y + 4);
    });

    ctx.restore();
  }
}
