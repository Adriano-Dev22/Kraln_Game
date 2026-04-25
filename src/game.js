//  KRALN — Game Engine


const TILE = 32;
const GRAVITY = 0.55;
const JUMP_FORCE = -13;
const PLAYER_SPEED = 4.5;
const DASH_SPEED = 12;
const DASH_DURATION = 120;
const DASH_COOLDOWN = 900;

const SWORD = {
  icon: '⚔️', name: 'Sword', color: '#c0c0c0',
  damage: 30, range: 55, cooldown: 20,
  particleColor: '#ffffff', particleSize: 6,
  isMelee: true,
};

const STAVES = {
  bone: {
    icon: '🦴', name: 'Bone Staff', color: '#e8dcc8',
    manaCost: 8, cooldown: 300, speed: 11, damage: 18,
    piercing: false, aoe: false,
    particleColor: '#e8dcc8', particleSize: 5,
    description: 'Fast bone shards',
  },


  fire: {
    icon: '🔥', name: 'Fire Staff', color: '#ff6b00',
    manaCost: 18, cooldown: 600, speed: 8, damage: 35,
    piercing: false, aoe: false, burn: true,
    particleColor: '#ff4400', particleSize: 8,
    description: 'Fireballs that burn',
  },
  
  frost: {
    icon: '❄️', name: 'Frost Staff', color: '#00cfff',
    manaCost: 15, cooldown: 500, speed: 9, damage: 25,
    slow: 0.4, piercing: false, aoe: false,
    particleColor: '#00cfff', particleSize: 7,
    description: 'Freezes enemies',
  },
  lightning: {
    icon: '⚡', name: 'Lightning Staff', color: '#ffe333',
    manaCost: 25, cooldown: 800, speed: 16, damage: 45,
    chain: true, piercing: true,
    particleColor: '#ffe333', particleSize: 4,
    description: 'Chain lightning',
  },
  shadow: {
    icon: '☠️', name: 'Shadow Staff', color: '#9933ff',
    manaCost: 30, cooldown: 1000, speed: 7, damage: 55,
    lifesteal: 0.3, piercing: true,
    particleColor: '#7700cc', particleSize: 10,
    description: 'Life drain beam',
  },
  poison: {
    icon: '🌿', name: 'Poison Staff', color: '#39d353',
    manaCost: 12, cooldown: 400, speed: 6, damage: 12,
    poison: 5, poisonDuration: 180,
    aoe: true, aoeRadius: 40,
    particleColor: '#39d353', particleSize: 6,
    description: 'Toxic spore cloud',
  },
};

// ─── Enemy Definitions ───────────────────────────────────────
const ENEMY_TYPES = {
  ghost: {
    color: '#aaaacc', size: 28, hp: 40, speed: 1.2, damage: 10,
    flying: true, icon: '👻', score: 50, xp: 15,
    drop: 0.2, behavior: 'hover',
  },
  skeleton: {
    color: '#e8dcc8', size: 30, hp: 60, speed: 1.8, damage: 15,
    flying: false, icon: '💀', score: 80, xp: 20,
    drop: 0.3, behavior: 'walk',
  },
  demon: {
    color: '#cc2200', size: 36, hp: 100, speed: 2.2, damage: 25,
    flying: false, icon: '😈', score: 150, xp: 40,
    drop: 0.4, behavior: 'charge',
  },
  bat: {
    color: '#553366', size: 18, hp: 20, speed: 3.5, damage: 8,
    flying: true, icon: '🦇', score: 30, xp: 10,
    drop: 0.1, behavior: 'swoop',
  },
  wraith: {
    color: '#7700cc', size: 32, hp: 80, speed: 1.5, damage: 20,
    flying: true, icon: '🕯️', score: 120, xp: 35,
    drop: 0.35, behavior: 'teleport',
  },
  zombie: {
    color: '#336633', size: 34, hp: 75, speed: 1.0, damage: 18,
    flying: false, icon: '🧟', score: 70, xp: 18,
    drop: 0.25, behavior: 'walk',
  },
};


// ─── Boss Definitions ─────────────────────────────────────────
const BOSS_TYPES = {
  lich: {
    name: 'Lich King', color: '#7700cc', size: 64, hp: 600,
    speed: 1.5, damage: 40, icon: '💜',
    score: 2000, phases: 2,
  },
  dread: {
    name: 'Dreadlord', color: '#8B0000', size: 72, hp: 900,
    speed: 2.0, damage: 55, icon: '🔴',
    score: 3000, phases: 3,
  },
};

// ─── Level Configurations ────────────────────────────────────
function generateLevelConfig(levelIdx) {
  const n = levelIdx + 1;
  const biomes = [
    { biome:'graveyard', bg:['#050508','#0a0a12'], groundColor:'#2a2a1a', wallColor:'#1a1a0f', enemyTypes:['ghost','skeleton','bat'], groundDecor:['grave','tree','bone'] },
    { biome:'crypt',     bg:['#080408','#120812'], groundColor:'#1f1f2a', wallColor:'#0f0f1a', enemyTypes:['skeleton','zombie','wraith'], groundDecor:['stone','rune','bone'] },
    { biome:'abyss',     bg:['#04060a','#0a0616'], groundColor:'#0a1020', wallColor:'#050810', enemyTypes:['demon','wraith','bat','ghost'], groundDecor:['rune','crystal','bone'] },
    { biome:'lich_keep', bg:['#050010','#0d0020'], groundColor:'#140a28', wallColor:'#0a0618', enemyTypes:['wraith','demon','skeleton'], groundDecor:['rune','crystal','stone'] },
    { biome:'inferno',   bg:['#0a0400','#1a0800'], groundColor:'#2a1000', wallColor:'#1a0800', enemyTypes:['demon','zombie','wraith','bat','ghost'], groundDecor:['rune','bone','crystal'] },
  ];

  const biome = biomes[levelIdx % biomes.length];
  const hasBoss = n % 10 === 0;

  return {
    ...biome,
    id: n,
    enemyCount: 8 + Math.floor(n * 1.8),
    spawnRate: Math.max(800, 3500 - n * 60),
    killGoal: 8 + Math.floor(n * 1.8),
    objective: hasBoss ? 'boss' : 'kill_all',
    hasBoss,
    bossType: n % 20 === 0 ? 'dread' : 'lich',
    timeLimit: 0,
    staveReward: null,
    weaponReward: hasBoss ? getWeaponForLevel(n) : null,
    foliage: biome.biome === 'graveyard',
    platforms: Math.min(6 + Math.floor(n * 0.4), 18),
  };
}

function getWeaponForLevel(n) {
  const weapons = ['fire','frost','lightning','shadow','poison'];
  const idx = Math.floor(n / 10) - 1;
  return weapons[idx % weapons.length] || null;
}

const LEVELS = { length: 100 };
LEVELS.get = (idx) => generateLevelConfig(idx);

// ─── Particles ────────────────────────────────────────────────
class Particle {
  constructor(x, y, vx, vy, color, size, life, grav = 0) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.color = color; this.size = size;
    this.life = this.maxLife = life;
    this.grav = grav;
    this.alpha = 1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += this.grav;
    this.vx *= 0.96; this.vy *= 0.96;
    this.life--;
    this.alpha = this.life / this.maxLife;
    this.size *= 0.98;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  get dead() { return this.life <= 0 || this.size < 0.2; }
}

// ─── Projectile ───────────────────────────────────────────────
class Projectile {
  constructor(x, y, vx, vy, staff, fromPlayer = true) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.staff = staff;
    this.fromPlayer = fromPlayer;
    this.dead = false;
    this.size = staff.particleSize * 1.5;
    this.trail = [];
  }
  update(game) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) this.trail.shift();
    this.x += this.vx; this.y += this.vy;
    // Wall / floor collision
    if (this.x < 0 || this.x > game.worldW || this.y > game.worldH || this.y < -200) {
      this.dead = true;
    }
    // Tile collision
    if (game.isSolid(this.x, this.y)) { this.dead = true; this.onHit(game); }
  }
  onHit(game) {
    for (let i = 0; i < 10; i++) {
      game.particles.push(new Particle(
        this.x, this.y,
        (Math.random()-0.5)*4, (Math.random()-0.5)*4,
        this.staff.particleColor, this.staff.particleSize * Math.random(),
        20 + Math.random()*20
      ));
    }
  }
  draw(ctx, camX, camY) {
    const sx = this.x - camX, sy = this.y - camY;
    // Trail
    this.trail.forEach((pt, i) => {
      ctx.save();
      ctx.globalAlpha = (i / this.trail.length) * 0.4;
      ctx.fillStyle = this.staff.particleColor;
      ctx.beginPath();
      ctx.arc(pt.x - camX, pt.y - camY, this.size * (i/this.trail.length), 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
    // Glow
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, this.size * 2.5);
    grad.addColorStop(0, this.staff.color);
    grad.addColorStop(1, 'transparent');
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sx, sy, this.size * 2.5, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // ctx.fillStyle = '#fff';
    // ctx.beginPath();
    // ctx.arc(sx, sy, this.size * 0.5, 0, Math.PI*2);
    // ctx.fill();
    // ctx.fillStyle = this.staff.color;
    // ctx.beginPath();
    // ctx.arc(sx, sy, this.size, 0, Math.PI*2);
    // ctx.fill();
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(Math.atan2(this.vy, this.vx));
    ctx.shadowColor = this.staff.color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = this.staff.color;
    ctx.fillRect(-14, -3, 24, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, -2, 8, 4);
    ctx.restore();

  }
}

// ─── Enemy ────────────────────────────────────────────────────
class Enemy {
  constructor(x, y, type, level) {
    const def = ENEMY_TYPES[type];
    this.x = x; this.y = y;
    this.type = type; this.def = def;
    this.w = def.size; this.h = def.size;
    this.hp = def.hp + level * 20;
    this.maxHp = this.hp;
    this.speed = def.speed + level * 0.15;
    this.damage = def.damage + level * 5;
    this.vy = 0; this.vx = 0;
    this.onGround = false;
    this.dead = false;
    this.dying = false;
    this.dyingTimer = 0;
    this.attackCooldown = 0;
    this.statusEffects = {};
    this.flickerTimer = 0;
    this.dir = 1;
    this.phaseTimer = Math.random() * 200;
    this.teleportCooldown = 0;
    this.hasShard = Math.random() < 0.4;
  }
  update(game) {
    if (this.dying) {
      this.dyingTimer++;
      if (this.dyingTimer > 30) this.dead = true;
      return;
    }
    // Status effects
    if (this.statusEffects.burn) {
      this.statusEffects.burn.timer--;
      if (this.statusEffects.burn.timer <= 0) { delete this.statusEffects.burn; }
      else if (this.statusEffects.burn.timer % 30 === 0) {
        this.takeDamage(this.statusEffects.burn.dps, game, 'fire');
      }
    }
    if (this.statusEffects.poison) {
      this.statusEffects.poison.timer--;
      if (this.statusEffects.poison.timer <= 0) { delete this.statusEffects.poison; }
      else if (this.statusEffects.poison.timer % 20 === 0) {
        this.takeDamage(this.statusEffects.poison.dps, game, 'poison');
      }
    }
    if (this.statusEffects.slow) {
      this.statusEffects.slow.timer--;
      if (this.statusEffects.slow.timer <= 0) delete this.statusEffects.slow;
    }
    const speedMult = this.statusEffects.slow ? this.statusEffects.slow.factor : 1;
    this.phaseTimer++;
    const p = game.player;
    const dx = p.x - this.x, dy = p.y - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (this.def.behavior === 'hover' || this.def.behavior === 'swoop') {
      // Flying
      const tx = dx * 0.02 * speedMult, ty = dy * 0.018 * speedMult;
      this.vx += (tx - this.vx) * 0.1;
      this.vy += (ty - this.vy) * 0.1;
    } else if (this.def.behavior === 'teleport') {
      this.teleportCooldown--;
      if (this.teleportCooldown <= 0 && dist < 400) {
        this.teleportCooldown = 120;
        // Teleport near player
        this.x = p.x + (Math.random()-0.5)*200;
        this.y = p.y - 60;
        for (let i=0;i<15;i++) game.particles.push(new Particle(
          this.x, this.y,
          (Math.random()-0.5)*5, (Math.random()-0.5)*5,
          '#9933ff', 5, 30
        ));
      }
      if (dx !== 0) this.dir = Math.sign(dx);
      this.vx += (Math.sign(dx) * this.speed * speedMult - this.vx)*0.1;
      if (!this.def.flying) this.vy += GRAVITY;
    } else if (this.def.behavior === 'charge') {
      if (dist < 300) {
        this.vx += (Math.sign(dx) * this.speed * speedMult * 1.5 - this.vx)*0.15;
      } else {
        this.vx *= 0.9;
      }
      if (!this.def.flying) this.vy += GRAVITY;
      if (this.onGround && dy < -40) { this.vy = JUMP_FORCE * 0.7; }
    } else {
      // Walk
      if (dx !== 0) this.dir = Math.sign(dx);
      this.vx += (Math.sign(dx) * this.speed * speedMult - this.vx)*0.08;
      this.vy += GRAVITY;
      if (this.onGround && dy < -60) { this.vy = JUMP_FORCE * 0.65; }
    }

    // Move & collide
    this.x += this.vx;
    if (game.isSolid(this.x, this.y) || game.isSolid(this.x + this.w, this.y)) {
      this.x -= this.vx; this.vx = 0;
    }
    this.y += this.vy;
    this.onGround = false;
    if (game.isSolid(this.x + this.w/2, this.y + this.h)) {
      this.y -= this.vy; this.vy = 0; this.onGround = true;
    }
    if (game.isSolid(this.x + this.w/2, this.y)) {
      this.y -= this.vy; this.vy = 0;
    }

    // Clamp
    this.x = Math.max(0, Math.min(game.worldW - this.w, this.x));

    // Attack player
    if (dist < 36 && this.attackCooldown <= 0) {
      game.player.takeDamage(this.damage);
      this.attackCooldown = 90;
    }
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.flickerTimer > 0) this.flickerTimer--;
  }
  takeDamage(dmg, game, type) {
    this.hp -= dmg;
    this.flickerTimer = 8;
    // Damage number
    game.particles.push(new Particle(
      this.x + this.w/2, this.y,
      (Math.random()-0.5)*2, -2,
      type === 'fire' ? '#ff6600' : type === 'poison' ? '#39d353' : '#fff',
      0, 40
    ));
    if (this.hp <= 0 && !this.dying) this.die(game);
  }
  die(game) {
    this.dying = true;
    game.score += this.def.score;
    game.kills++;
    // Drop shard
    if (this.hasShard && game.currentLevel.objective === 'collect_shards') {
      game.droppedShards.push({ x: this.x + this.w/2, y: this.y, collected: false });
    }
    // Drop hp/mana orb
    if (Math.random() < this.def.drop) {
      game.orbs.push({
        x: this.x + this.w/2, y: this.y,
        type: Math.random() < 0.6 ? 'hp' : 'mp',
        vy: -3, collected: false
      });
    }
    for (let i = 0; i < 20; i++) {
      game.particles.push(new Particle(
        this.x + this.w/2, this.y + this.h/2,
        (Math.random()-0.5)*6, (Math.random()-0.5)*6 - 1,
        this.def.color, 4 + Math.random()*4, 40, 0.05
      ));
    }
  }
  draw(ctx, camX, camY) {
    const sx = this.x - camX, sy = this.y - camY;
    const alpha = this.dying ? Math.max(0, 1 - this.dyingTimer/30) : 1;
    if (this.flickerTimer > 0 && Math.floor(this.flickerTimer/2) % 2 === 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(sx + this.w/2, sy + this.h + 2, this.w/2, 6, 0, 0, Math.PI*2);
    ctx.fill();
    // Glow
    const glow = ctx.createRadialGradient(sx+this.w/2,sy+this.h/2,0,sx+this.w/2,sy+this.h/2,this.w);
    glow.addColorStop(0, this.def.color + '44');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sx+this.w/2,sy+this.h/2,this.w,0,Math.PI*2);
    ctx.fill();
    // Body
    ctx.fillStyle = this.statusEffects.slow ? '#00cfff' : this.def.color;
    ctx.beginPath();
    if (this.type === 'ghost' || this.type === 'wraith') {
      // Ghost shape
      ctx.arc(sx+this.w/2, sy+this.h/2, this.w/2, Math.PI, 0);
      ctx.lineTo(sx+this.w, sy+this.h);
      for (let i = 3; i >= 0; i--) {
        const wave = Math.sin(Date.now()*0.005 + i) * 4;
        ctx.lineTo(sx + this.w - (i+0.5)*(this.w/4), sy+this.h+wave);
        ctx.lineTo(sx + this.w - (i+1)*(this.w/4), sy+this.h-wave+3);
      }
      ctx.closePath();
    } else {
      ctx.roundRect(sx, sy, this.w, this.h, 4);
    }
    ctx.fill();
    // Eyes
    const eyeY = sy + this.h * 0.35;
    ctx.fillStyle = '#ff0000';
    ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(sx+this.w*0.35, eyeY, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx+this.w*0.65, eyeY, 4, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // HP bar
    if (this.hp < this.maxHp) {
      const bw = this.w, bh = 4, bx = sx, by = sy - 8;
      ctx.fillStyle = '#333';
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(bx, by, bw*(this.hp/this.maxHp), bh);
    }
    // Status icons
    let si = 0;
    if (this.statusEffects.burn)   { ctx.font='12px serif'; ctx.fillText('🔥', sx+this.w+2, sy+si*14); si++; }
    if (this.statusEffects.poison) { ctx.font='12px serif'; ctx.fillText('☠️', sx+this.w+2, sy+si*14); si++; }
    if (this.statusEffects.slow)   { ctx.font='12px serif'; ctx.fillText('❄️', sx+this.w+2, sy+si*14); si++; }
    ctx.restore();
  }
}

// ─── Boss ─────────────────────────────────────────────────────
class Boss extends Enemy {
  constructor(x, y, type, level) {
    const def = BOSS_TYPES[type];
    super(x, y, 'demon', level);
    this.bossType = type;
    this.bossDef = def;
    this.w = def.size; this.h = def.size;
    this.hp = def.hp + level * 100;
    this.maxHp = this.hp;
    this.speed = def.speed;
    this.damage = def.damage;
    this.phase = 1;
    this.def.color = def.color;
    this.projTimer = 0;
    this.enrageTimer = 0;
    this.name = def.name;
  }
  update(game) {
    // Phase transition
    if (this.hp < this.maxHp * 0.5 && this.phase === 1) {
      this.phase = 2;
      this.speed *= 1.5;
      game.showMessage('⚠️ ' + this.name + ' ENRAGED!');
      for (let i=0;i<30;i++) game.particles.push(new Particle(
        this.x+this.w/2, this.y+this.h/2,
        (Math.random()-0.5)*10,(Math.random()-0.5)*10,
        this.bossDef.color, 8, 60
      ));
    }
    super.update(game);
    // Boss fires projectiles
    this.projTimer--;
    if (this.projTimer <= 0) {
      this.projTimer = this.phase === 1 ? 120 : 70;
      const p = game.player;
      const dx = p.x - this.x, dy = p.y - this.y;
      const dist = Math.sqrt(dx*dx+dy*dy) || 1;
      const speed = 5 + this.phase;
      const staffDef = {...STAVES.shadow, damage: this.damage/2};
      game.projectiles.push(new Projectile(
        this.x+this.w/2, this.y+this.h/2,
        (dx/dist)*speed, (dy/dist)*speed,
        staffDef, false
      ));
      if (this.phase === 2) {
        // Multi-shot
        for (let a = -30; a <= 30; a += 30) {
          const rad = a * Math.PI/180;
          const nx = (dx/dist)*Math.cos(rad) - (dy/dist)*Math.sin(rad);
          const ny = (dx/dist)*Math.sin(rad) + (dy/dist)*Math.cos(rad);
          game.projectiles.push(new Projectile(
            this.x+this.w/2, this.y+this.h/2,
            nx*speed, ny*speed, staffDef, false
          ));
        }
      }
    }
  }
  draw(ctx, camX, camY) {
    super.draw(ctx, camX, camY);
    // Crown effect
    const sx = this.x - camX, sy = this.y - camY;
    ctx.save();
    ctx.font = '36px serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.bossDef.icon, sx + this.w/2, sy + this.h/2 + 12);
    ctx.restore();
  }
}

// ─── Player ───────────────────────────────────────────────────
class Player {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 24; this.h = 42;
    this.vx = 0; this.vy = 0;
    this.onGround = false;
    this.hp = 100; this.maxHp = 100;
    this.mp = 80; this.maxMp = 80;
    this.mpRegen = 0.04;
    this.dead = false;
    this.flickerTimer = 0;
    this.invulTimer = 0;
    this.staves = ['sword'];
    this.swordSwing = 0; // timer da animação do swing
    this.swordDamage = 30;
    this.activeStaff = 0;
    this.staffCooldowns = {};
    this.dir = 1;
    this.dashing = false;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.shielding = false;
    this.crouching = false;
    this.jumpsLeft = 2;
    this.score = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.lastShot = 0;
    this.parrying = false;
    this.parryTimer = 0;
  }
  takeDamage(dmg) {
    if (this.invulTimer > 0 || this.dead) return;
    if (this.shielding) { dmg *= 0.3; }
    if (this.parrying && this.parryTimer > 10) { dmg = 0; }
    this.hp -= dmg;
    this.flickerTimer = 15;
    this.invulTimer = 45;
    if (this.hp <= 0) { this.hp = 0; this.dead = true; }
  }
  addStaff(id) {
    if (!this.staves.includes(id)) this.staves.push(id);
  }


  getCurrentStaff() {
    const id = this.staves[this.activeStaff];
    return id === 'sword' ? SWORD : STAVES[id];
  }


  update(keys, mouse, game) {
    if (this.dead) return;
    this.animTimer++;
    if (this.animTimer % 8 === 0) this.animFrame = (this.animFrame+1) % 4;
    // MP regen
    this.mp = Math.min(this.maxMp, this.mp + this.mpRegen);
    // Invuln / flicker
    if (this.invulTimer > 0) this.invulTimer--;
    if (this.flickerTimer > 0) this.flickerTimer--;
    // Parry
    if (this.parryTimer > 0) this.parryTimer--;
    // Dash
    if (this.dashing) {
      this.dashTimer--;
      if (this.dashTimer <= 0) this.dashing = false;
      this.vx = this.dir * DASH_SPEED;
    } else {
      // Move
      let moving = false;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) { this.vx -= 1.5; this.dir = -1; moving = true; }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) { this.vx += 1.5; this.dir = 1; moving = true; }
      this.vx *= 0.78;
      this.vx = Math.max(-PLAYER_SPEED, Math.min(PLAYER_SPEED, this.vx));
    }
    // Crouch
    this.crouching = keys['ArrowDown'] || keys['s'] || keys['S'];
    this.shielding = keys['c'] || keys['C'];
    this.parrying = keys['c'] || keys['C'];
    if (keys['c'] || keys['C']) this.parryTimer = 12;
    // Gravity
    this.vy += GRAVITY;
    // Jump
    if ((keys['ArrowUp'] || keys[' '] || keys['w'] || keys['W']) && keys._jumpPress) {
      if (this.onGround || this.jumpsLeft > 0) {
        this.vy = JUMP_FORCE;
        this.jumpsLeft = Math.max(0, this.jumpsLeft - 1);
        keys._jumpPress = false;
      }
    }
    // Move & collide
    this.x += this.vx;
    if (game.isSolid(this.x, this.y + this.h/2) || game.isSolid(this.x, this.y + this.h)) {
      this.x -= this.vx; this.vx = 0;
    }
    if (game.isSolid(this.x + this.w, this.y + this.h/2) || game.isSolid(this.x + this.w, this.y + this.h)) {
      this.x -= this.vx; this.vx = 0;
    }
    this.y += this.vy;
    this.onGround = false;
    if (game.isSolid(this.x + this.w/2, this.y + this.h) || game.isSolid(this.x, this.y + this.h) || game.isSolid(this.x + this.w, this.y + this.h)) {
      if (this.vy > 0) { this.y -= this.vy; this.vy = 0; this.onGround = true; this.jumpsLeft = 2; }
    }
    if (game.isSolid(this.x + this.w/2, this.y) || game.isSolid(this.x, this.y) || game.isSolid(this.x + this.w, this.y)) {
      if (this.vy < 0) { this.y -= this.vy; this.vy = 0; }
    }
    // Clamp to world
    this.x = Math.max(0, Math.min(game.worldW - this.w, this.x));
    if (this.y > game.worldH + 200) { this.hp = 0; this.dead = true; }
    // Dash trigger
    if (keys['Shift'] && this.dashCooldown <= 0 && !this.dashing) {
      this.dashing = true;
      this.dashTimer = 12;
      this.dashCooldown = DASH_COOLDOWN;
      for (let i=0;i<8;i++) game.particles.push(new Particle(
        this.x+this.w/2,this.y+this.h/2,
        -this.dir*Math.random()*4,(Math.random()-0.5)*3,
        '#ffffff44', 5, 15
      ));
    }
    if (this.dashCooldown > 0) this.dashCooldown--;
    // Staff cooldowns
    for (const id in this.staffCooldowns) {
      if (this.staffCooldowns[id] > 0) this.staffCooldowns[id]--;
    }
    if (this.swordCooldown > 0) this.swordCooldown--;
    if (this.swordSwing > 0) this.swordSwing--;
    // Switch staff
    for (let i=0;i<this.staves.length;i++) {
      if (keys[String(i+1)]) { this.activeStaff = i; }
    }
    // Cast
    // if (game.keys['x'] || game.keys['X']) {
    //   this.castSpell(mouse, game);
    // }
    if (game.keys['x'] || game.keys['X']) {
      if (this.staves[this.activeStaff] === 'sword') {
        this.swingSword(game);
      } else {
          this.castSpell(mouse, game);
  }
}
  }

  swingSword(game) {
  if (this.swordCooldown > 0) return;
  this.swordCooldown = SWORD.cooldown;
  this.swordSwing = 15;
  const cx = this.x + this.w/2;
  const cy = this.y + this.h/2;
  const hitX = this.dir > 0 ? this.x + this.w : this.x - SWORD.range;
  // Partículas do swing
  for (let i = 0; i < 8; i++) {
    game.particles.push(new Particle(
      hitX, cy + (Math.random()-0.5)*40,
      this.dir * (2 + Math.random()*3),
      (Math.random()-0.5)*3,
      '#c0c0c0', 4 + Math.random()*4, 12
    ));
  }
  // Checar inimigos no alcance
  const targets = game.boss && !game.boss.dead
    ? [game.boss, ...game.enemies]
    : game.enemies;
  for (const e of targets) {
    if (e.dead || e.dying) continue;
    const ex = e.x + e.w/2, ey = e.y + e.h/2;
    const dx = ex - cx, dy = ey - cy;
    if (Math.abs(dx) < SWORD.range + e.w/2 && Math.abs(dy) < 40
        && Math.sign(dx) === this.dir) {
      e.takeDamage(SWORD.damage, game, 'sword');
      if (e instanceof Boss && e.dead) game.bossDefeated = true;
    }
  }
}


  castSpell(mouse, game) {
    const staff = this.getCurrentStaff();
    const id = this.staves[this.activeStaff];
    if (!this.staffCooldowns[id]) this.staffCooldowns[id] = 0;
    if (this.staffCooldowns[id] > 0 || this.mp < staff.manaCost) return;
    this.mp -= staff.manaCost;
    this.staffCooldowns[id] = staff.cooldown / 16; // frames

    // const cx = this.x + this.w/2, cy = this.y + this.h/2;
    // const dx = mouse.worldX - cx, dy = mouse.worldY - cy;
    // const dist = Math.sqrt(dx*dx+dy*dy) || 1;
    // const vx = (dx/dist)*staff.speed, vy = (dy/dist)*staff.speed;
    const cx = this.x + this.w/2, cy = this.y + this.h/2;
    const vx = this.dir * staff.speed;
    const vy = 0;

    if (staff.aoe) {
      // AoE burst
      for (let a=0;a<8;a++) {
        const angle = (a/8)*Math.PI*2;
        game.projectiles.push(new Projectile(cx,cy,Math.cos(angle)*staff.speed,Math.sin(angle)*staff.speed,staff,true));
      }
    } else {
      game.projectiles.push(new Projectile(cx,cy,vx,vy,staff,true));
      if (staff.chain) {
        // Extra spread shots
        for (let a of [-20,20]) {
          const rad = a*Math.PI/180;
          const nx = vx*Math.cos(rad)-vy*Math.sin(rad);
          const ny = vx*Math.sin(rad)+vy*Math.cos(rad);
          game.projectiles.push(new Projectile(cx,cy,nx,ny,staff,true));
        }
      }
    }
    // Muzzle particles
    for (let i=0;i<6;i++) game.particles.push(new Particle(
      cx, cy, vx+(Math.random()-0.5)*3, vy+(Math.random()-0.5)*3,
      staff.particleColor, staff.particleSize, 15
    ));
  }
  draw(ctx, camX, camY) {
    const sx = this.x - camX, sy = this.y - camY;
    if (this.flickerTimer > 0 && Math.floor(this.flickerTimer/2)%2===0) return;
    ctx.save();
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(sx+this.w/2, sy+this.h+2, this.w/2, 5, 0, 0, Math.PI*2);
    ctx.fill();
    // Body (robe)
    const robeColor = this.shielding ? '#3355aa' : '#1a0a2a';
    ctx.fillStyle = robeColor;
    ctx.beginPath();
    ctx.roundRect(sx+2, sy+18, this.w-4, this.h-18, [0,0,6,6]);
    ctx.fill();
    // Robe detail
    ctx.fillStyle = '#2a1a3a';
    ctx.fillRect(sx+this.w/2-1, sy+24, 2, this.h-30);
    // Head
    ctx.fillStyle = '#c8a87a';
    ctx.beginPath();
    ctx.arc(sx+this.w/2, sy+13, 11, 0, Math.PI*2);
    ctx.fill();
    // Hood
    ctx.fillStyle = '#0d0015';
    ctx.beginPath();
    ctx.arc(sx+this.w/2, sy+11, 11, Math.PI, 0);
    ctx.lineTo(sx+this.w/2+13, sy+11);
    ctx.closePath();
    ctx.fill();
    // Eyes glow
    ctx.fillStyle = '#cc44ff';
    ctx.shadowColor = '#cc44ff'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(sx+this.w/2-4, sy+13, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx+this.w/2+4, sy+13, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;


    // Staff (weapon)
    // const staff = this.getCurrentStaff();
    // const staffX = this.dir > 0 ? sx+this.w+2 : sx-10;
    // ctx.strokeStyle = '#4a2a00';
    // ctx.lineWidth = 3;
    // ctx.beginPath();
    // ctx.moveTo(staffX, sy+10);
    // ctx.lineTo(staffX, sy+this.h);
    // ctx.stroke();
    // ctx.font = '18px serif';
    // ctx.fillText(staff.icon, staffX-9, sy+12);

    // Weapon draw
    if (this.staves[this.activeStaff] === 'sword') {
      const swingAngle = this.swordSwing > 0
        ? this.dir * (Math.PI/4 - (this.swordSwing/15)*(Math.PI/2))
        : this.dir * Math.PI/4;
      const baseX = sx + this.w/2;
      const baseY = sy + this.h/2;
      ctx.save();
      ctx.translate(baseX, baseY);
      ctx.rotate(swingAngle);
      ctx.strokeStyle = this.swordSwing > 0 ? '#ffffff' : '#c0c0c0';
      ctx.lineWidth = 4;
      ctx.shadowColor = this.swordSwing > 0 ? '#ffffff' : '#888';
      ctx.shadowBlur = this.swordSwing > 0 ? 15 : 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.dir * 50, 0);
      ctx.stroke();
      ctx.restore();
    } else {
      const staff = this.getCurrentStaff();
      const staffX = this.dir > 0 ? sx+this.w+2 : sx-10;
      ctx.strokeStyle = '#4a2a00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(staffX, sy+10);
      ctx.lineTo(staffX, sy+this.h);
      ctx.stroke();
      ctx.font = '18px serif';
      ctx.fillText(staff.icon, staffX-9, sy+12);
    }


    // Dash trail
    if (this.dashing) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sx - this.dir*20, sy, this.w, this.h);
    }
    // Shield
    if (this.shielding) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#3388ff';
      ctx.beginPath();
      ctx.arc(sx+this.w/2, sy+this.h/2, 30, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#55aaff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx+this.w/2, sy+this.h/2, 30, 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ─── World Generation ─────────────────────────────────────────
function generateWorld(level) {
  const COLS = 80, ROWS = 30;
  const tiles = Array.from({length:ROWS}, () => Array(COLS).fill(0));
  const cfg = level;
  // Ground
  for (let c=0;c<COLS;c++) {
    for (let r=ROWS-6;r<ROWS;r++) tiles[r][c] = 1;
  }
  // Platforms
  const platCount = cfg.platforms || 6;
  for (let i=0;i<platCount;i++) {
    const row = Math.floor(ROWS*0.35 + Math.random()*(ROWS*0.45));
    const col = Math.floor(2 + Math.random()*(COLS-10));
    const len = Math.floor(4 + Math.random()*8);
    for (let c=col;c<Math.min(COLS-1,col+len);c++) tiles[row][c] = 1;
  }
  // Walls
  for (let r=0;r<ROWS;r++) { tiles[r][0]=1; tiles[r][COLS-1]=1; }
  for (let c=0;c<COLS;c++) { tiles[0][c]=0; }
  // Ceiling holes
  for (let c=2;c<COLS-2;c++) tiles[0][c]=0;
  // Generate decorations
  const decor = [];
  const decorTypes = cfg.groundDecor || ['grave'];
  for (let c=2;c<COLS-2;c++) {
    const r = ROWS-7;
    if (tiles[r+1][c]===1 && tiles[r][c]===0 && Math.random()<0.15) {
      decor.push({ x:c*TILE, y:r*TILE, type: decorTypes[Math.floor(Math.random()*decorTypes.length)] });
    }
  }
  return { tiles, COLS, ROWS, decor };
}

// ─── Main Game Class ──────────────────────────────────────────
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.running = false;
    this.paused = false;
    this.currentLevelIdx = 0;
    this.score = 0;
    this.kills = 0;
    this.droppedShards = [];
    this.collectedShards = 0;
    this.orbs = [];
    this.levelTimer = 0;
    this.escapeReached = false;
    this.worldW = 80 * TILE;
    this.worldH = 30 * TILE;
    this.keys = {};
    this.mouse = { x:0, y:0, left:false, right:false, leftPress:false, worldX:0, worldY:0 };
    this.particles = [];
    this.projectiles = [];
    this.enemies = [];
    this.spawnTimer = 0;
    this.camX = 0; this.camY = 0;
    this.messages = [];
    this.boss = null;
    this.bossDefeated = false;
    this.objectiveComplete = false;
    this.exitX = 0; this.exitY = 0;
    this.fogTime = 0;
    this.ambientParticleTimer = 0;
    this.initInput();
  }

  get currentLevel() { return LEVELS.get(this.currentLevelIdx); }

  initInput() {
    const kd = (e) => {
      const prev = this.keys[e.key];
      this.keys[e.key] = true;
      if (!prev && (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W'))
        this.keys._jumpPress = true;
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') this.togglePause();
      e.preventDefault();
    };
    const ku = (e) => { this.keys[e.key] = false; };
    const mm = (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - r.left) * (this.canvas.width / r.width);
      this.mouse.y = (e.clientY - r.top) * (this.canvas.height / r.height);
      this.mouse.worldX = this.mouse.x + this.camX;
      this.mouse.worldY = this.mouse.y + this.camY;
    };
    const md = (e) => {
      if (e.button===0) { this.mouse.left=true; this.mouse.leftPress=true; }
      if (e.button===2) { this.mouse.right=true; }
      e.preventDefault();
    };
    const mu = (e) => {
      if (e.button===0) this.mouse.left=false;
      if (e.button===2) this.mouse.right=false;
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    this.canvas.addEventListener('mousemove', mm);
    this.canvas.addEventListener('mousedown', md);
    this.canvas.addEventListener('mouseup', mu);
    this.canvas.addEventListener('contextmenu', e=>e.preventDefault());
    this._cleanup = () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }

  stop() { this.running = false; if (this._cleanup) this._cleanup(); }
  togglePause() { this.paused = !this.paused; }

  startLevel(idx) {
    this.currentLevelIdx = idx;
    const cfg = this.currentLevel;
    this.world = generateWorld(cfg);
    this.kills = 0;
    this.droppedShards = [];
    this.collectedShards = 0;
    this.orbs = [];
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.boss = null;
    this.bossDefeated = false;
    this.objectiveComplete = false;
    this.escapeReached = false;
    this.spawnTimer = 0;
    this.levelTimer = cfg.timeLimit * 60 || 0;
    // Spawn player on a platform
    const R = this.world.ROWS - 8, C = 4;
    this.player = new Player(C*TILE, R*TILE);


    // Give staves from previous levels
    // for (let i=0;i<=idx;i++) {
    //   if (LEVELS[i].staveReward) this.player.addStaff(LEVELS[i].staveReward);
    // }

    for (let i=0;i<=idx;i++) {
      const lvl = LEVELS.get(i);
      if (lvl.staveReward) this.player.addStaff(lvl.staveReward);
    }


    // Exit door position
    this.exitX = (this.world.COLS-4)*TILE;
    this.exitY = (this.world.ROWS-8)*TILE;
    // Initial enemies
    this.spawnEnemies(Math.floor(cfg.enemyCount * 0.5));
    // Boss
    if (cfg.hasBoss) {
      this.boss = new Boss(this.worldW/2, (this.world.ROWS-10)*TILE, cfg.bossType, idx+1);
    }
    // Show objective
    const objText = t('msg_level_obj')[idx % 5] || '';
    this.showMessage(objText, 5000);
    this.updateHUD();
    this.running = true;
    this.loop();
  }

  spawnEnemies(count) {
    const cfg = this.currentLevel;
    for (let i=0;i<count;i++) {
      const type = cfg.enemyTypes[Math.floor(Math.random()*cfg.enemyTypes.length)];
      const col = Math.floor(10 + Math.random()*(this.world.COLS-15));
      const row = this.world.ROWS - 8;
      const e = new Enemy(col*TILE, row*TILE, type, this.currentLevelIdx+1);
      this.enemies.push(e);
    }
  }

  isSolid(x, y) {
    const col = Math.floor(x/TILE), row = Math.floor(y/TILE);
    if (row < 0 || row >= this.world.ROWS || col < 0 || col >= this.world.COLS) return false;
    return this.world.tiles[row][col] === 1;
  }

  checkObjective() {
    if (this.objectiveComplete) return;
    const cfg = this.currentLevel;
    if (cfg.objective === 'kill_all') {
      if (this.kills >= cfg.killGoal && this.enemies.filter(e=>!e.dead).length === 0) {
        this.objectiveComplete = true;
        this.onLevelComplete();
      }
    } else if (cfg.objective === 'boss') {
      if (this.bossDefeated) { this.objectiveComplete = true; this.onLevelComplete(); }
    } else if (cfg.objective === 'collect_shards') {
      if (this.collectedShards >= cfg.collectGoal) { this.objectiveComplete = true; this.onLevelComplete(); }
    } else if (cfg.objective === 'escape') {
      const p = this.player;
      const dx = p.x - this.exitX, dy = p.y - this.exitY;
      if (Math.sqrt(dx*dx+dy*dy) < 60) { this.objectiveComplete = true; this.onLevelComplete(); }
    }
  }

  onLevelComplete() {
    this.running = false;
    const reward = this.currentLevel.staveReward
      ? (t('msg_new_staff') + ' ' + (STAVES[this.currentLevel.staveReward]?.icon || ''))
      : '';
    document.getElementById('lu-title').textContent = t('lu_title');
    document.getElementById('lu-score').textContent = `${t('hud_score')}: ${this.score}`;
    document.getElementById('lu-reward').textContent = reward;
    showScreen('levelup-screen');
  }

  onGameOver() {
    this.running = false;
    document.getElementById('go-title').textContent = t('go_title');
    const msgs = t('go_msgs');
    document.getElementById('go-msg').textContent = msgs[Math.floor(Math.random()*msgs.length)];
    document.getElementById('go-score').textContent = `${t('hud_score')}: ${this.score}`;
    showScreen('gameover-screen');
  }

  updateHUD() {
    const p = this.player;
    document.getElementById('hp-bar').style.width = (p.hp/p.maxHp*100) + '%';
    document.getElementById('hud-hp-text').textContent = `${Math.ceil(p.hp)}/${p.maxHp}`;
    document.getElementById('mp-bar').style.width = (p.mp/p.maxMp*100) + '%';
    document.getElementById('hud-mp-text').textContent = `${Math.floor(p.mp)}/${p.maxMp}`;
    document.getElementById('hud-level').textContent = `${t('hud_level')} ${this.currentLevelIdx+1}`;
    document.getElementById('hud-score').textContent = `${t('hud_score')}: ${this.score}`;
    // Staves
    const hudStaves = document.getElementById('hud-staves');
    hudStaves.innerHTML = '';

    p.staves.forEach((id,i) => {
      const s = id === 'sword' ? SWORD : STAVES[id];
      if (!s) return;
      const cd = p.staffCooldowns[id] || 0;
      const maxCd = (s.cooldown || 20) / 16;


      const slot = document.createElement('div');
      slot.className = 'staff-slot' + (i===p.activeStaff ? ' active' : '');
      slot.innerHTML = `<span>${s.icon}</span><span class="slot-key">${i+1}</span><div class="cooldown-overlay" style="height:${(cd/maxCd*100)||0}%"></div>`;
      hudStaves.appendChild(slot);
    });
    // Boss bar
    const bossHud = document.getElementById('hud-boss');
    if (this.boss && !this.boss.dead) {
      bossHud.style.display = 'block';
      document.getElementById('boss-name').textContent = t('hud_boss_prefix') + this.boss.name;
      document.getElementById('boss-bar').style.width = (this.boss.hp/this.boss.maxHp*100)+'%';
    } else {
      bossHud.style.display = 'none';
    }
  }

  showMessage(text, duration = 3000) {
    const el = document.createElement('div');
    el.className = 'hud-msg';
    el.textContent = text;
    document.getElementById('hud-messages').appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  updateProjectileHits() {
    for (const proj of this.projectiles) {
      if (proj.dead) continue;
      // Enemy hit
      const targets = this.boss && !this.boss.dead ? [this.boss, ...this.enemies] : this.enemies;
      for (const e of targets) {
        if (e.dead || e.dying) continue;
        if (!proj.fromPlayer) continue;
        const dx = proj.x - (e.x+e.w/2), dy = proj.y - (e.y+e.h/2);
        if (Math.abs(dx) < e.w/2+proj.size && Math.abs(dy) < e.h/2+proj.size) {
          e.takeDamage(proj.staff.damage, this, proj.staff.id || 'normal');
          // Apply status
          if (proj.staff.burn) e.statusEffects.burn = { timer:90, dps:8 };
          if (proj.staff.slow) e.statusEffects.slow = { timer:120, factor:proj.staff.slow };
          if (proj.staff.poison) e.statusEffects.poison = { timer:proj.staff.poisonDuration, dps:proj.staff.poison };
          if (proj.staff.lifesteal) { this.player.hp = Math.min(this.player.maxHp, this.player.hp+proj.staff.damage*proj.staff.lifesteal); }
          if (e instanceof Boss && e.dead) this.bossDefeated = true;
          proj.onHit(this);
          if (!proj.staff.piercing) { proj.dead = true; break; }
        }
      }
      // Player hit by enemy projectiles
      if (!proj.fromPlayer && this.player) {
        const p = this.player;
        const dx = proj.x - (p.x+p.w/2), dy = proj.y - (p.y+p.h/2);
        if (Math.abs(dx)<p.w/2+proj.size && Math.abs(dy)<p.h/2+proj.size) {
          this.player.takeDamage(proj.staff.damage);
          proj.onHit(this);
          proj.dead = true;
        }
      }
    }
  }

  collectOrbs() {
    const p = this.player;
    for (const orb of this.orbs) {
      if (orb.collected) continue;
      orb.vy += 0.2; orb.y += orb.vy;
      const dx = p.x+p.w/2 - orb.x, dy = p.y+p.h/2 - orb.y;
      if (Math.sqrt(dx*dx+dy*dy) < 30) {
        orb.collected = true;
        if (orb.type === 'hp') { p.hp = Math.min(p.maxHp, p.hp+25); this.showMessage(t('msg_health_orb')); }
        else { p.mp = Math.min(p.maxMp, p.mp+20); this.showMessage(t('msg_mana_orb')); }
        for (let i=0;i<10;i++) this.particles.push(new Particle(
          orb.x, orb.y, (Math.random()-0.5)*4, (Math.random()-0.5)*4,
          orb.type==='hp'?'#ff4444':'#4488ff', 4, 25
        ));
      }
    }
    this.orbs = this.orbs.filter(o=>!o.collected);
    // Collect shards
    for (const sh of this.droppedShards) {
      if (sh.collected) continue;
      const dx = p.x+p.w/2-sh.x, dy = p.y+p.h/2-sh.y;
      if (Math.sqrt(dx*dx+dy*dy)<30) {
        sh.collected=true; this.collectedShards++;
        this.showMessage(`Soul Shard ${this.collectedShards}/${this.currentLevel.collectGoal}`);
        for (let i=0;i<15;i++) this.particles.push(new Particle(sh.x,sh.y,(Math.random()-0.5)*5,(Math.random()-0.5)*5,'#9933ff',5,30));
      }
    }
    this.droppedShards = this.droppedShards.filter(s=>!s.collected);
  }

  update() {
    if (!this.running || this.paused) return;
    // Player
    this.player.update(this.keys, this.mouse, this);
    this.keys._jumpPress = false;
    // Enemies
    this.spawnTimer++;
    if (this.spawnTimer >= this.currentLevel.spawnRate/16 && this.enemies.filter(e=>!e.dead).length < this.currentLevel.enemyCount) {
      const type = this.currentLevel.enemyTypes[Math.floor(Math.random()*this.currentLevel.enemyTypes.length)];
      const side = Math.random()<0.5 ? 2 : this.world.COLS-4;
      const row = this.world.ROWS-8;
      this.enemies.push(new Enemy(side*TILE, row*TILE, type, this.currentLevelIdx+1));
      this.spawnTimer = 0;
    }
    this.enemies.forEach(e => { if (!e.dead) e.update(this); });
    this.enemies = this.enemies.filter(e=>!e.dead);
    if (this.boss && !this.boss.dead) this.boss.update(this);
    // Projectiles
    this.projectiles.forEach(p => p.update(this));
    this.updateProjectileHits();
    this.projectiles = this.projectiles.filter(p=>!p.dead);
    // Particles
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p=>!p.dead);
    // Orbs & shards
    this.collectOrbs();
    // Ambient particles (fog/dust)
    this.ambientParticleTimer++;
    if (this.ambientParticleTimer%30===0) {
      this.particles.push(new Particle(
        this.camX + Math.random()*this.canvas.width,
        this.camY + Math.random()*this.canvas.height,
        (Math.random()-0.5)*0.5, -0.3,
        'rgba(100,50,150,0.3)', 12+Math.random()*20, 120
      ));
    }
    // Camera follow player
    const targetX = this.player.x - this.canvas.width/2 + this.player.w/2;
    const targetY = this.player.y - this.canvas.height/2 + this.player.h/2;
    this.camX += (targetX - this.camX) * 0.1;
    this.camY += (targetY - this.camY) * 0.1;
    this.camX = Math.max(0, Math.min(this.worldW - this.canvas.width, this.camX));
    this.camY = Math.max(0, Math.min(this.worldH - this.canvas.height, this.camY));
    // Time limit
    if (this.currentLevel.timeLimit && this.levelTimer > 0) {
      this.levelTimer--;
      if (this.levelTimer <= 0) {
        if (this.currentLevel.objective === 'escape') this.onGameOver();
        else this.onLevelComplete();
      }
    }
    this.fogTime += 0.002;
    this.checkObjective();
    if (this.player.dead) this.onGameOver();
    this.updateHUD();
  }

  draw() {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    const cfg = this.currentLevel;
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, cfg.bg[0]);
    sky.addColorStop(1, cfg.bg[1]);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i=0;i<80;i++) {
      const sx=(Math.sin(i*37.1)*W*2)%W, sy=(Math.cos(i*13.7)*H*1.5)%H;
      const flick = Math.sin(this.fogTime*5+i)*0.5+0.5;
      ctx.globalAlpha = flick*0.7;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;
    // Tiles
    const c0=Math.max(0,Math.floor(this.camX/TILE)), c1=Math.min(this.world.COLS,c0+Math.ceil(W/TILE)+2);
    const r0=Math.max(0,Math.floor(this.camY/TILE)), r1=Math.min(this.world.ROWS,r0+Math.ceil(H/TILE)+2);
    for (let r=r0;r<r1;r++) {
      for (let c=c0;c<c1;c++) {
        if (this.world.tiles[r][c]===1) {
          const tx=c*TILE-this.camX, ty=r*TILE-this.camY;
          // Main tile
          ctx.fillStyle = cfg.groundColor;
          ctx.fillRect(tx, ty, TILE, TILE);
          // Top highlight
          const isTop = r>0 && this.world.tiles[r-1][c]===0;
          if (isTop) {
            ctx.fillStyle = cfg.wallColor;
            ctx.fillRect(tx, ty, TILE, 4);
            // Moss/runes
            if ((r+c)%5===0) {
              ctx.fillStyle = 'rgba(100,200,100,0.15)';
              ctx.fillRect(tx+4, ty, TILE-8, 3);
            }
          }
          // Grid lines
          ctx.strokeStyle = 'rgba(0,0,0,0.2)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(tx, ty, TILE, TILE);
        }
      }
    }
    // Decorations
    this.world.decor.forEach(d => {
      const dx = d.x - this.camX, dy = d.y - this.camY;
      if (dx < -50 || dx > W+50) return;
      ctx.save();
      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      if (d.type === 'grave') { ctx.fillText('🪦', dx+16, dy+20); }
      else if (d.type === 'tree') { ctx.fillText('🌲', dx+16, dy+22); }
      else if (d.type === 'bone') { ctx.fillText('🦴', dx+16, dy+20); }
      else if (d.type === 'rune') {
        ctx.fillStyle = '#6600cc';
        ctx.shadowColor='#9933ff'; ctx.shadowBlur=10;
        ctx.fillText('ᚱ', dx+16, dy+20);
      } else if (d.type === 'crystal') {
        ctx.fillStyle = '#00ccff';
        ctx.shadowColor='#00ffff'; ctx.shadowBlur=12;
        ctx.fillText('💎', dx+16, dy+20);
      } else if (d.type === 'stone') {
        ctx.fillStyle='#666'; ctx.fillText('🪨', dx+16, dy+20);
      }
      ctx.restore();
    });
    // Exit door (escape levels)
    if (this.currentLevel.objective === 'escape') {
      const ex=this.exitX-this.camX, ey=this.exitY-this.camY;
      ctx.save();
      ctx.shadowColor='#00ff88'; ctx.shadowBlur=20;
      ctx.fillStyle='#00ff88';
      ctx.fillRect(ex-2, ey, 44, 60);
      ctx.fillStyle='#003322';
      ctx.fillRect(ex+2, ey+4, 36, 52);
      ctx.fillStyle='#00ff88';
      ctx.font='24px serif'; ctx.textAlign='center';
      ctx.fillText('🚪', ex+22, ey+36);
      ctx.restore();
    }
    // Soul shards
    this.droppedShards.forEach(sh => {
      const sx=sh.x-this.camX, sy=sh.y-this.camY;
      ctx.save();
      ctx.shadowColor='#cc66ff'; ctx.shadowBlur=15;
      ctx.fillStyle='#cc66ff';
      ctx.font='20px serif'; ctx.textAlign='center';
      ctx.fillText('💠', sx, sy);
      ctx.restore();
    });
    // Orbs
    this.orbs.forEach(o => {
      const ox=o.x-this.camX, oy=o.y-this.camY;
      ctx.save();
      ctx.shadowBlur=12;
      ctx.shadowColor=o.type==='hp'?'#ff4444':'#4488ff';
      ctx.fillStyle=o.type==='hp'?'#ff4444':'#4488ff';
      ctx.beginPath(); ctx.arc(ox,oy,8,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
    // Particles
    this.particles.forEach(p => p.draw(ctx));
    // Enemies
    this.enemies.forEach(e => e.draw(ctx, this.camX, this.camY));
    if (this.boss && !this.boss.dead) this.boss.draw(ctx, this.camX, this.camY);
    // Projectiles
    this.projectiles.forEach(p => p.draw(ctx, this.camX, this.camY));
    // Player
    if (!this.player.dead) this.player.draw(ctx, this.camX, this.camY);
    // Fog vignette
    // Darkness with light around player
    const playerScreenX = this.player.x - this.camX + this.player.w/2;
    const playerScreenY = this.player.y - this.camY + this.player.h/2;

    const darkness = ctx.createRadialGradient(
      playerScreenX, playerScreenY, 80,
      playerScreenX, playerScreenY, 380
    );
    darkness.addColorStop(0, 'transparent');
    darkness.addColorStop(1, 'rgba(0,0,0,0.94)');
    ctx.fillStyle = darkness;
    ctx.fillRect(0, 0, W, H);
    const vign = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.9);
    vign.addColorStop(0, 'transparent');
    vign.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = vign;
    ctx.fillRect(0, 0, W, H);
    // Time limit HUD
    if (this.currentLevel.timeLimit && this.levelTimer > 0) {
      const secs = Math.ceil(this.levelTimer/60);
      ctx.save();
      ctx.fillStyle = secs < 15 ? '#ff4444' : '#ffcc44';
      ctx.font = "bold 22px 'Share Tech Mono', monospace";
      ctx.textAlign = 'center';
      ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 15;
      ctx.fillText(`⏱ ${secs}s`, W/2, 60);
      ctx.restore();
    }
    // Crosshair
    const mx=this.mouse.x, my=this.mouse.y;
    ctx.save();
    ctx.strokeStyle='rgba(200,50,50,0.8)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(mx-12,my); ctx.lineTo(mx+12,my); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mx,my-12); ctx.lineTo(mx,my+12); ctx.stroke();
    ctx.beginPath(); ctx.arc(mx,my,6,0,Math.PI*2); ctx.stroke();
    ctx.restore();
    // Pause overlay
    if (this.paused) {
      ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#fff';
      ctx.font="40px 'Cinzel Decorative', serif";
      ctx.textAlign='center';
      ctx.shadowColor='#cc0000'; ctx.shadowBlur=20;
      ctx.fillText('PAUSED', W/2, H/2);
      ctx.font="18px 'Share Tech Mono', monospace";
      ctx.shadowBlur=0;
      ctx.fillText('Press P or ESC to continue', W/2, H/2+50);
    }
  }

  loop() {
    if (!this.running) return;
    this.resize();
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  resize() {
    const W=window.innerWidth, H=window.innerHeight;
    if (this.canvas.width!==W || this.canvas.height!==H) {
      this.canvas.width=W; this.canvas.height=H;
    }
  }
}

// ─── Global API ───────────────────────────────────────────────
let game = null;

function startGame() {
  if (game) game.stop();
  game = new Game(document.getElementById('gameCanvas'));
  window.gameInstance = game;
  showScreen('hud');
  game.startLevel(0);
}

function nextLevel() {
  if (!game) return;
  const nextIdx = game.currentLevelIdx + 1;
  if (nextIdx >= 100) {
    // Victory — loop with harder difficulty or back to menu
    showScreen('menu-screen');
    return;
  }
  showScreen('hud');
  game.startLevel(nextIdx);
}

function restartGame() {
  if (game) game.stop();
  game = new Game(document.getElementById('gameCanvas'));
  window.gameInstance = game;
  showScreen('hud');
  game.startLevel(0);
}

// Init canvas size
window.addEventListener('resize', () => {
  const canvas = document.getElementById('gameCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
document.getElementById('gameCanvas').width = window.innerWidth;
document.getElementById('gameCanvas').height = window.innerHeight;

// Draw atmospheric background on canvas when on menus
function drawMenuBG() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const W=canvas.width, H=canvas.height;
  let t=0, particles=[];
  for(let i=0;i<80;i++) particles.push({
    x:Math.random()*W, y:Math.random()*H,
    vx:(Math.random()-0.5)*0.4, vy:-0.2-Math.random()*0.5,
    size:Math.random()*3+1, alpha:Math.random()*0.5+0.1,
    color:Math.random()<0.5?'#660033':'#330066'
  });
  function frame() {
    if(document.getElementById('hud').style.display!=='none'&&document.getElementById('hud').classList.contains('active')) return;
    ctx.fillStyle='rgba(5,5,8,0.15)';
    ctx.fillRect(0,0,W,H);
    t+=0.01;
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.y<-10){p.y=H+10;p.x=Math.random()*W;}
      ctx.save(); ctx.globalAlpha=p.alpha*(Math.sin(t+p.x)*0.3+0.7);
      ctx.fillStyle=p.color; ctx.shadowColor=p.color; ctx.shadowBlur=8;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(frame);
  }
  ctx.fillStyle='#050508'; ctx.fillRect(0,0,W,H);
  frame();
}
drawMenuBG();
