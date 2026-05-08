

const Audio = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function play({ type = 'sine', freq = 440, freq2 = null, gain = 0.3,
    duration = 0.15, attack = 0.01, decay = 0.05, distortion = false }) {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gainNode = ac.createGain();

      let source = osc;

      if (distortion) {
        const dist = ac.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i * 2) / 256 - 1;
          curve[i] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x));
        }
        dist.curve = curve;
        osc.connect(dist);
        dist.connect(gainNode);
      } else {
        osc.connect(gainNode);
      }

      gainNode.connect(ac.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      if (freq2) osc.frequency.linearRampToValueAtTime(freq2, ac.currentTime + duration);
      gainNode.gain.setValueAtTime(0, ac.currentTime);
      gainNode.gain.linearRampToValueAtTime(gain, ac.currentTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + duration + 0.05);
    } catch (e) {}
  }

  function noise(gain = 0.2, duration = 0.1, freq = 800) {
    try {
      const ac = getCtx();
      const bufferSize = ac.sampleRate * duration;
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const source = ac.createBufferSource();
      source.buffer = buffer;

      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = freq;

      const gainNode = ac.createGain();
      gainNode.gain.setValueAtTime(gain, ac.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ac.destination);
      source.start();
    } catch (e) {}
  }

  return {
    jump()      { play({ type:'sine',    freq:180, freq2:320,  gain:0.25, duration:0.18 }); },
    land()      { noise(0.15, 0.08, 300); },
    dash()      { play({ type:'sawtooth',freq:300, freq2:150,  gain:0.2,  duration:0.12 }); },
    swordSwing(){ play({ type:'sawtooth',freq:220, freq2:80,   gain:0.3,  duration:0.14, distortion:true }); },
    swordHit()  { noise(0.4, 0.1, 600);
                  play({ type:'square',  freq:120, freq2:60,   gain:0.35, duration:0.12 }); },
    playerHurt(){ noise(0.5, 0.18, 200);
                  play({ type:'sawtooth',freq:90,  freq2:50,   gain:0.4,  duration:0.2,  distortion:true }); },
    playerDie() { play({ type:'sawtooth',freq:200, freq2:40,   gain:0.5,  duration:0.6,  distortion:true });
                  noise(0.6, 0.5, 150); },
    enemyHurt() { noise(0.3, 0.08, 500); },
    enemyDie()  { play({ type:'square',  freq:160, freq2:60,   gain:0.35, duration:0.25, distortion:true });
                  noise(0.3, 0.15, 400); },
    bossDie()   { for (let i = 0; i < 4; i++) setTimeout(() => {
                    play({ type:'sawtooth',freq:300-i*50,freq2:50,gain:0.5,duration:0.4,distortion:true });
                    noise(0.5, 0.3, 200);
                  }, i * 180); },
    bossPhase() { play({ type:'sawtooth',freq:80,  freq2:40,   gain:0.6,  duration:0.8,  distortion:true });
                  noise(0.5, 0.5, 100); },
    castBone()  { play({ type:'square',  freq:400, freq2:600,  gain:0.2,  duration:0.1  }); },
    castFire()  { noise(0.3, 0.15, 1200);
                  play({ type:'sawtooth',freq:200, freq2:400,  gain:0.25, duration:0.15 }); },
    castFrost() { play({ type:'sine',    freq:600, freq2:900,  gain:0.2,  duration:0.18 }); },
    castLightning(){ play({ type:'square',freq:800,freq2:1200, gain:0.3,  duration:0.08 });
                  noise(0.4, 0.1, 2000); },
    castShadow(){ play({ type:'sine',    freq:100, freq2:50,   gain:0.35, duration:0.3  }); },
    castPoison(){ play({ type:'sine',    freq:350, freq2:280,  gain:0.2,  duration:0.2  }); },
    orbCollect(){ play({ type:'sine',    freq:500, freq2:800,  gain:0.25, duration:0.15 }); },
    levelUp()   { [0,100,200,350].forEach((t,i) =>
                    setTimeout(() => play({ type:'sine', freq:400+i*120, gain:0.3, duration:0.2 }), t)); },
  };
})();