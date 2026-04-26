// ============================================================
// KRALN — Particle Pool (Object Pooling)
// ============================================================

class Particle {
  constructor() {
    this.active = false;
    this.reset();
  }

  reset() {
    this.x       = 0;
    this.y       = 0;
    this.vx      = 0;
    this.vy      = 0;
    this.life    = 0;
    this.maxLife = 1;
    this.size    = 3;
    this.color   = "#ff4444";
    this.gravity = 0.2;
    this.alpha   = 1;
    this.active  = false;
  }

  init(x, y, vx, vy, size, color, life, gravity = 0.2) {
    this.x       = x;
    this.y       = y;
    this.vx      = vx;
    this.vy      = vy;
    this.size    = size;
    this.color   = color;
    this.life    = life;
    this.maxLife = life;
    this.gravity = gravity;
    this.alpha   = 1;
    this.active  = true;
  }

  update() {
    this.x    += this.vx;
    this.y    += this.vy;
    this.vy   += this.gravity;
    this.vx   *= 0.97;
    this.life--;
    this.alpha = this.life / this.maxLife;
    if (this.life <= 0) this.active = false;
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.5, this.size * this.alpha), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ============================================================

export class ParticlePool {
  constructor(maxSize = 300) {
    this.pool   = Array.from({ length: maxSize }, () => new Particle());
    this.active = [];
  }

  // Pega uma partícula inativa do pool
  _acquire() {
    return this.pool.find(p => !p.active) || null;
  }

  spawn(x, y, options = {}) {
    const p = this._acquire();
    if (!p) return; // pool cheio, ignora

    const {
      vx      = (Math.random() - 0.5) * 4,
      vy      = (Math.random() - 0.5) * 4 - 2,
      size    = Math.random() * 3 + 1,
      color   = "#ff4444",
      life    = Math.floor(Math.random() * 20 + 20),
      gravity = 0.2,
    } = options;

    p.init(x, y, vx, vy, size, color, life, gravity);
  }

  // Emite um burst de partículas de uma vez
  burst(x, y, count = 12, options = {}) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = Math.random() * 3 + 1;
      this.spawn(x, y, {
        ...options,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }
  }

  // Presets prontos por tipo de inimigo
  enemyDeath(x, y, type = "default") {
    const presets = {
      ghost:    { color: "#aaaaff", gravity: -0.05, count: 10 },
      skeleton: { color: "#e0d8c0", gravity: 0.3,   count: 14 },
      demon:    { color: "#ff2200", gravity: 0.15,  count: 16 },
      bat:      { color: "#663399", gravity: 0.1,   count: 8  },
      wraith:   { color: "#00ffcc", gravity: -0.08, count: 12 },
      zombie:   { color: "#336600", gravity: 0.25,  count: 14 },
      default:  { color: "#ff4444", gravity: 0.2,   count: 12 },
    };
    const preset = presets[type] || presets.default;
    this.burst(x, y, preset.count, {
      color:   preset.color,
      gravity: preset.gravity,
      life:    35,
      size:    3,
    });
  }

  update() {
    this.pool.forEach(p => { if (p.active) p.update(); });
  }

  draw(ctx) {
    this.pool.forEach(p => { if (p.active) p.draw(ctx); });
  }

  activeCount() {
    return this.pool.filter(p => p.active).length;
  }
}
