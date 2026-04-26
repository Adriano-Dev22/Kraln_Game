// ============================================================
// KRALN — Jump Controller (fixes double jump abuse)
// ============================================================

export class JumpController {
  constructor() {
    this.jumpsLeft   = 2;    // max 2 (normal + double)
    this.onGround    = false;
    this.wasOnGround = false;
    this.jumpBuffer  = 0;    // coyote time buffer
    this.jumpPressed = false;
    this.jumpCooldown = 0;

    this.JUMP_FORCE      = -13;
    this.COYOTE_FRAMES   = 6;  // frames de graça ao sair de plataforma
    this.BUFFER_FRAMES   = 8;  // frames de antecipação do pulo
    this.JUMP_COOLDOWN   = 10; // frames mínimos entre pulos
  }

  land() {
    this.onGround  = true;
    this.jumpsLeft = 2;
    this.jumpBuffer = this.COYOTE_FRAMES;
  }

  airborne() {
    this.wasOnGround = this.onGround;
    this.onGround    = false;
    if (this.jumpBuffer > 0) this.jumpBuffer--;
  }

  pressJump() {
    this.jumpPressed = true;
  }

  releaseJump() {
    this.jumpPressed = false;
  }

  update(velY) {
    if (this.jumpCooldown > 0) this.jumpCooldown--;

    if (!this.jumpPressed) return null;
    if (this.jumpCooldown > 0) return null;

    // Pulo normal (no chão ou coyote time)
    if (this.onGround || this.jumpBuffer > 0) {
      this.jumpPressed  = false;
      this.jumpCooldown = this.JUMP_COOLDOWN;
      this.jumpBuffer   = 0;
      this.jumpsLeft    = 1; // só sobra o double jump
      return this.JUMP_FORCE;
    }

    // Double jump (no ar, ainda tem pulo sobrando)
    if (!this.onGround && this.jumpsLeft > 0) {
      this.jumpPressed  = false;
      this.jumpCooldown = this.JUMP_COOLDOWN;
      this.jumpsLeft--;
      return this.JUMP_FORCE * 0.85; // double jump um pouco menor
    }

    return null;
  }

  hasDoubleJump() {
    return !this.onGround && this.jumpsLeft > 0;
  }
}
