// ============================================================
// KRALN — Enemy Death Animations
// ============================================================

class DeathAnimation {
  constructor(x, y, type) {
    this.x       = x;
    this.y       = y;
    this.type    = type;
    this.timer   = 0;
    this.done    = false;
    this.particles = [];
    this._init();
  }

  _init() {
    const configs = {
      ghost: {
        count: 10, color: "#aaaaff",
        rise: true, size: 4, life: 50,
      },
      skeleton: {
        count: 14, color: "#e0d8c0",
        rise: false, size: 3, life: 40,
      },
      demon: {
        count: 18, color: "#ff2200",
        rise: false, size: 5, life: 45,
      },
      bat: {
        count: 8, color: "#663399",
        rise: false, size: 2, life: 30,
      },
      wraith: {
        count: 12, color: "#00ffcc",
        rise: true, size: 3, life: 55,
      },
      zombie: {
        count: 14, color: "#336600",
        rise: false, size: 4, life: 42,
      },
    };

    const cfg = configs[this.type] || configs.skeleton;

    for (let i = 0; i < cfg.count; i++) {
      const angle = (Math.PI * 2 * i) / cfg.count;
      const speed = Math.random() * 2.5 + 0.5;
      this.particles.push({
        x:    this.x,
        y:    this.y,
        vx:   Math.cos(angle) * speed,
        vy:   cfg.rise
                ? -Math.random() * 2 - 0.5
                : Math.sin(angle) * speed - 1,
        size: cfg.size * (Math.random() * 0.5 + 0.75),
        life: cfg.life + Math.floor(Math.random() * 10),
        maxLife: cfg.life,
        color: cfg.color,
        gravity: cfg.rise ? -0.05 : 0.15,
      });
    }
  }

  update() {
    this.timer++;
    let allDead = true;

    this.particles.forEach(p => {
      if (p.life <= 0) return;
      allDead = false;
      p.x    += p.vx;
      p.y    += p.vy;
      p.vy   += p.gravity;
      p.vx   *= 0.96;
      p.life--;
    });

    if (allDead) this.done = true;
  }

  draw(ctx) {
    this.particles.forEach(p => {
      if (p.life <= 0) return;
      const alpha = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.size * alpha), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}

// ============================================================

export class EnemyAnimationManager {
  constructor() {
    this.animations = [];
  }

  // Chame quando um inimigo morrer
  trigger(x, y, type = "skeleton") {
    this.animations.push(new DeathAnimation(x, y, type));
  }

  update() {
    this.animations = this.animations.filter(a => !a.done);
    this.animations.forEach(a => a.update());
  }

  draw(ctx) {
    this.animations.forEach(a => a.draw(ctx));
  }

  hasActive() {
    return this.animations.length > 0;
  }
}
