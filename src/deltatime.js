// ============================================================
// KRALN — Delta Time (framerate-independent movement)
// ============================================================

export class DeltaTime {
  constructor() {
    this.last      = performance.now();
    this.dt        = 1;
    this.fps       = 60;
    this.TARGET_FPS = 60;
    this.min       = 0.5;  // nunca menor que metade do frame
    this.max       = 3;    // nunca maior que 3x (evita tunneling)

    // FPS counter
    this._fpsTimer   = 0;
    this._fpsCounter = 0;
    this._fpsDisplay = 60;
  }

  tick() {
    const now     = performance.now();
    const elapsed = now - this.last;
    this.last     = now;

    // dt = 1 significa velocidade normal a 60fps
    this.dt = Math.min(this.max, Math.max(this.min,
      (elapsed / 1000) * this.TARGET_FPS
    ));

    // FPS counter
    this._fpsCounter++;
    this._fpsTimer += elapsed;
    if (this._fpsTimer >= 500) {
      this._fpsDisplay = Math.round(this._fpsCounter / (this._fpsTimer / 1000));
      this._fpsCounter = 0;
      this._fpsTimer   = 0;
    }

    return this.dt;
  }

  // Escala qualquer valor pelo delta time
  scale(value) {
    return value * this.dt;
  }

  getFPS() {
    return this._fpsDisplay;
  }

  // Desenha o FPS no canto da tela (debug)
  drawFPS(ctx, canvas, visible = true) {
    if (!visible) return;
    ctx.save();
    ctx.font      = "11px monospace";
    ctx.fillStyle = this._fpsDisplay >= 55 ? "#44ff44"
                  : this._fpsDisplay >= 30 ? "#ffaa00"
                  : "#ff4444";
    ctx.textAlign = "left";
    ctx.fillText(`FPS: ${this._fpsDisplay}`, 10, canvas.height - 10);
    ctx.restore();
  }
}
