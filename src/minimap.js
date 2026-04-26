// ============================================================
// KRALN — Minimap / Level Progress Indicator
// ============================================================

export class Minimap {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx    = ctx;
    this.w      = 160;
    this.h      = 10;
    this.x      = canvas.width / 2 - 80;
    this.y      = 12;
    this.alpha  = 0.85;
  }

  // entities: { player, enemies, items }
  // worldWidth: largura total do nível em pixels
  draw(player, enemies = [], items = [], worldWidth = 3000) {
    const { ctx } = this;
    const { x, y, w, h } = this;

    ctx.save();
    ctx.globalAlpha = this.alpha;

    // Fundo
    ctx.fillStyle = "#0a0a0f";
    ctx.strokeStyle = "#8b0000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - 4, y - 4, w + 8, h + 8, 4);
    ctx.fill();
    ctx.stroke();

    // Barra de progresso do nível
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(x, y, w, h);

    // Progresso preenchido
    const progress = Math.min(1, player.x / (worldWidth - 200));
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, "#8b0000");
    grad.addColorStop(1, "#ff4444");
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w * progress, h);

    // Inimigos no mapa
    enemies.forEach(e => {
      if (e.dead) return;
      const ex = x + (e.x / worldWidth) * w;
      ctx.fillStyle = "#ff2200";
      ctx.fillRect(ex - 1, y, 2, h);
    });

    // Itens no mapa
    items.forEach(it => {
      if (it.collected) return;
      const ix = x + (it.x / worldWidth) * w;
      ctx.fillStyle = "#ffdd00";
      ctx.fillRect(ix - 1, y + 2, 2, h - 4);
    });

    // Player
    const px = x + (player.x / worldWidth) * w;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 4;
    ctx.fillRect(px - 2, y - 1, 4, h + 2);
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = "#666";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.floor(progress * 100)}%`, x + w / 2, y + h + 14);

    ctx.restore();
  }
}
