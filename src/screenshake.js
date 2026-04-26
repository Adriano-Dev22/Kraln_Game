// ============================================================
// KRALN — Screen Shake System
// ============================================================

export class ScreenShake {
  constructor() {
    this.intensity = 0;
    this.duration = 0;
    this.x = 0;
    this.y = 0;
  }

  // type: 'damage' | 'explosion' | 'boss' | 'parry'
  trigger(type = "damage") {
    const presets = {
      damage:    { intensity: 6,  duration: 12 },
      explosion: { intensity: 10, duration: 18 },
      boss:      { intensity: 14, duration: 24 },
      parry:     { intensity: 4,  duration: 8  },
    };
    const preset = presets[type] || presets.damage;
    // Acumula se já está shakendo
    this.intensity = Math.max(this.intensity, preset.intensity);
    this.duration  = Math.max(this.duration,  preset.duration);
  }

  update() {
    if (this.duration > 0) {
      const factor = this.duration > 6 ? 1 : this.duration / 6;
      this.x = (Math.random() * 2 - 1) * this.intensity * factor;
      this.y = (Math.random() * 2 - 1) * this.intensity * factor;
      this.duration--;
      this.intensity *= 0.92;
    } else {
      this.x = 0;
      this.y = 0;
      this.intensity = 0;
    }
  }

  apply(ctx) {
    if (this.duration > 0) {
      ctx.translate(this.x, this.y);
    }
  }

  isActive() {
    return this.duration > 0;
  }
}
