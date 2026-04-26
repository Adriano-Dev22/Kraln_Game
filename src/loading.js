
// KRALN — Loading Screen



export class LoadingScreen {

  constructor(canvas, ctx) {

    this.canvas = canvas;

    this.ctx = ctx;

    this.progress = 0;

    this.target = 0;

    this.done = false;

    this.alpha = 1;

    this.steps = [

      "Summoning darkness...",

      "Raising the dead...",

      "Forging magic staves...",

      "Opening the crypt...",

      "Awakening the Lich...",

      "Enter if you dare...",

    ];

    this.currentStep = 0;

  }

  setProgress(value) {

    this.target = Math.min(value, 100);

  }

  update() {

    if (this.progress < this.target) {

      this.progress += 1.2;

      this.currentStep = Math.floor((this.progress / 100) * this.steps.length);

    }

    if (this.progress >= 100 && !this.done) {

      this.done = true;

    }

    if (this.done && this.alpha > 0) {

      this.alpha -= 0.02;

    }

  }

  draw() {

    if (this.alpha <= 0) return;

    const { ctx, canvas } = this;

    const cx = canvas.width / 2;

    const cy = canvas.height / 2;

    // Background

    ctx.save();

    ctx.globalAlpha = this.alpha;

    ctx.fillStyle = "#0a0a0f";

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title

    ctx.fillStyle = "#8b0000";

    ctx.font = "bold 52px Georgia, serif";

    ctx.textAlign = "center";

    ctx.shadowColor = "#ff0000";

    ctx.shadowBlur = 20;

    ctx.fillText("KRALN", cx, cy - 80);

    ctx.shadowBlur = 0;

    ctx.fillStyle = "#666";

    ctx.font = "16px Georgia, serif";

    ctx.fillText("Into the Dark", cx, cy - 52);

    // Progress bar background

    const barW = 300;

    const barH = 6;

    const barX = cx - barW / 2;

    const barY = cy + 10;

    ctx.fillStyle = "#1a1a2e";

    ctx.fillRect(barX, barY, barW, barH);

    // Progress bar fill

    const fillW = (this.progress / 100) * barW;

    const gradient = ctx.createLinearGradient(barX, 0, barX + barW, 0);

    gradient.addColorStop(0, "#8b0000");

    gradient.addColorStop(1, "#ff4444");

    ctx.fillStyle = gradient;

    ctx.fillRect(barX, barY, fillW, barH);

    // Step text

    const step = this.steps[Math.min(this.currentStep, this.steps.length - 1)];

    ctx.fillStyle = "#888";

    ctx.font = "13px monospace";

    ctx.fillText(step, cx, cy + 40);

    // Percentage

    ctx.fillStyle = "#444";

    ctx.font = "12px monospace";

    ctx.fillText(`${Math.floor(this.progress)}%`, cx, cy + 60);

    ctx.restore();

  }

  isFinished() {

    return this.alpha <= 0;

  }

}

