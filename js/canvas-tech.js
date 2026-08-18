/**
 * ACME CLUB - Dynamic Floating Crystal Bubbles & Interactive Luminescent Orbs Engine
 * Creates a mesmerizing, vibrant floating bubble ecosystem with realistic glass refraction,
 * pure white light reflections, organic buoyancy, and interactive cursor physics.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let animationFrameId = null;
  let isVisible = true;
  let time = 0;

  // Vibrant Bubble Palette with Crystal Highlights
  const bubblePalettes = [
    {
      glow: 'rgba(0, 210, 254, 0.45)',
      fillStart: 'rgba(0, 210, 254, 0.28)',
      fillMid: 'rgba(37, 117, 252, 0.15)',
      fillEnd: 'rgba(10, 25, 55, 0.05)',
      rim: 'rgba(255, 255, 255, 0.85)',
      accent: '#00d2fe'
    },
    {
      glow: 'rgba(168, 85, 247, 0.45)',
      fillStart: 'rgba(168, 85, 247, 0.28)',
      fillMid: 'rgba(236, 72, 153, 0.15)',
      fillEnd: 'rgba(25, 10, 45, 0.05)',
      rim: 'rgba(255, 255, 255, 0.85)',
      accent: '#a855f7'
    },
    {
      glow: 'rgba(0, 245, 212, 0.45)',
      fillStart: 'rgba(0, 245, 212, 0.28)',
      fillMid: 'rgba(0, 187, 249, 0.15)',
      fillEnd: 'rgba(5, 35, 40, 0.05)',
      rim: 'rgba(255, 255, 255, 0.85)',
      accent: '#00f5d4'
    },
    {
      glow: 'rgba(59, 130, 246, 0.45)',
      fillStart: 'rgba(59, 130, 246, 0.28)',
      fillMid: 'rgba(99, 102, 241, 0.15)',
      fillEnd: 'rgba(10, 20, 50, 0.05)',
      rim: 'rgba(255, 255, 255, 0.9)',
      accent: '#3b82f6'
    },
    {
      glow: 'rgba(251, 191, 36, 0.4)',
      fillStart: 'rgba(251, 191, 36, 0.25)',
      fillMid: 'rgba(245, 158, 11, 0.12)',
      fillEnd: 'rgba(35, 25, 5, 0.05)',
      rim: 'rgba(255, 255, 255, 0.85)',
      accent: '#fbbf24'
    }
  ];

  const isMobile = window.innerWidth < 768;
  const config = {
    bubbleCount: isMobile ? 28 : 55,
    microBubbleCount: isMobile ? 20 : 45,
    mouseRepelRadius: isMobile ? 130 : 190
  };

  const mouse = {
    x: null,
    y: null,
    isHovering: false,
    speed: 0,
    lastX: null,
    lastY: null
  };

  let bubbles = [];
  let microBubbles = [];
  let burstParticles = [];

  // Main Floating Crystal Bubble Class
  class CrystalBubble {
    constructor(initRandomY = false) {
      this.palette = bubblePalettes[Math.floor(Math.random() * bubblePalettes.length)];
      this.reset(initRandomY);
    }

    reset(initRandomY = false) {
      this.radius = Math.random() * 24 + 10; // Sizes between 10px and 34px
      this.x = Math.random() * width;
      this.y = initRandomY ? Math.random() * height : height + this.radius + Math.random() * 50;
      
      // Buoyancy speed: larger bubbles rise slightly faster
      this.vy = -(Math.random() * 0.6 + 0.4 + (this.radius / 40) * 0.35);
      this.vx = (Math.random() - 0.5) * 0.4;
      
      // Horizontal wobble oscillation
      this.wobbleSpeed = Math.random() * 0.025 + 0.012;
      this.wobblePhase = Math.random() * Math.PI * 2;
      this.wobbleAmp = Math.random() * 1.4 + 0.6;
      
      // Breathing scale
      this.breathSpeed = Math.random() * 0.02 + 0.01;
      this.breathPhase = Math.random() * Math.PI * 2;
      this.alpha = Math.random() * 0.3 + 0.7;
    }

    update() {
      this.wobblePhase += this.wobbleSpeed;
      this.breathPhase += this.breathSpeed;

      // Natural rising and wobbling
      this.y += this.vy;
      this.x += this.vx + Math.sin(this.wobblePhase) * this.wobbleAmp * 0.3;

      // Mouse Interaction: Smooth repulsion & bouncing
      if (mouse.isHovering && mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < config.mouseRepelRadius && dist > 0) {
          const force = (config.mouseRepelRadius - dist) / config.mouseRepelRadius;
          const angle = Math.atan2(dy, dx);
          
          this.x += Math.cos(angle) * force * 5;
          this.y += Math.sin(angle) * force * 5;
        }
      }

      // Reset when floating off the top
      if (this.y < -this.radius * 2) {
        this.reset(false);
      }

      // Wrap horizontal bounds smoothly
      if (this.x < -this.radius) this.x = width + this.radius;
      if (this.x > width + this.radius) this.x = -this.radius;
    }

    draw() {
      const currentRadius = this.radius * (1 + Math.sin(this.breathPhase) * 0.05);

      ctx.save();
      ctx.translate(this.x, this.y);

      // 1. Soft Ambient Outer Halo Glow
      const glowGrad = ctx.createRadialGradient(0, 0, currentRadius * 0.5, 0, 0, currentRadius * 2.2);
      glowGrad.addColorStop(0, this.palette.glow);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, currentRadius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // 2. Glass Bubble Body (Iridescent Spherical Gradient)
      const bodyGrad = ctx.createRadialGradient(
        -currentRadius * 0.35, -currentRadius * 0.35, currentRadius * 0.1,
        0, 0, currentRadius
      );
      bodyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      bodyGrad.addColorStop(0.3, this.palette.fillStart);
      bodyGrad.addColorStop(0.7, this.palette.fillMid);
      bodyGrad.addColorStop(1, this.palette.fillEnd);

      ctx.beginPath();
      ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // 3. Crisp Luminous White Rim / Border
      ctx.beginPath();
      ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
      ctx.strokeStyle = this.palette.rim;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 4. White Primary Crescent Highlight (Top-Left Glass Reflection)
      ctx.beginPath();
      ctx.ellipse(
        -currentRadius * 0.38,
        -currentRadius * 0.38,
        currentRadius * 0.35,
        currentRadius * 0.18,
        Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();

      // 5. White Secondary Subtle Backlight (Bottom-Right Reflection)
      ctx.beginPath();
      ctx.ellipse(
        currentRadius * 0.35,
        currentRadius * 0.35,
        currentRadius * 0.22,
        currentRadius * 0.1,
        Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();

      ctx.restore();
    }
  }

  // Micro Shimmering Floating Bubbles (Background Layer)
  class MicroBubble {
    constructor(initRandomY = false) {
      this.reset(initRandomY);
    }

    reset(initRandomY = false) {
      this.x = Math.random() * width;
      this.y = initRandomY ? Math.random() * height : height + 10 + Math.random() * 30;
      this.radius = Math.random() * 3.5 + 1.5;
      this.vy = -(Math.random() * 0.4 + 0.2);
      this.vx = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.3;
      this.color = Math.random() > 0.4 ? '#ffffff' : '#00d2fe';
    }

    update() {
      this.y += this.vy;
      this.x += this.vx;

      if (this.y < -10) this.reset(false);
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  // Interactive Click Burst Spark Particles
  class BurstSpark {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.radius = Math.random() * 3 + 1.5;
      this.alpha = 1;
      this.decay = Math.random() * 0.03 + 0.02;
      this.color = bubblePalettes[Math.floor(Math.random() * bubblePalettes.length)].accent;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;

    const mobileMode = width < 768;
    config.bubbleCount = mobileMode ? 28 : 55;
    config.microBubbleCount = mobileMode ? 20 : 45;

    // Create Bubbles distributed across the full viewport initially
    bubbles = [];
    for (let i = 0; i < config.bubbleCount; i++) {
      bubbles.push(new CrystalBubble(true));
    }

    // Create Micro Shimmer Bubbles
    microBubbles = [];
    for (let i = 0; i < config.microBubbleCount; i++) {
      microBubbles.push(new MicroBubble(true));
    }
  }

  function animate() {
    if (!isVisible) return;

    time += 0.015;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background Micro Bubbles
    for (let i = 0; i < microBubbles.length; i++) {
      microBubbles[i].update();
      microBubbles[i].draw();
    }

    // 2. Draw Floating Crystal Bubbles
    for (let i = 0; i < bubbles.length; i++) {
      bubbles[i].update();
      bubbles[i].draw();
    }

    // 3. Update & Draw Click Burst Particles
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      burstParticles[i].update();
      burstParticles[i].draw();
      if (burstParticles[i].alpha <= 0) {
        burstParticles.splice(i, 1);
      }
    }

    // 4. Cursor Fluid Halo
    if (mouse.isHovering && mouse.x !== null && mouse.y !== null) {
      const cursorAura = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 90
      );
      cursorAura.addColorStop(0, 'rgba(0, 210, 254, 0.18)');
      cursorAura.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
      cursorAura.addColorStop(1, 'rgba(0, 210, 254, 0)');

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 90, 0, Math.PI * 2);
      ctx.fillStyle = cursorAura;
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Interactive Events
  const heroSection = document.getElementById('home') || canvas.parentElement;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isHovering = true;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.isHovering = false;
    mouse.x = null;
    mouse.y = null;
  });

  heroSection.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Spawn shimmer bubble burst
    for (let i = 0; i < 14; i++) {
      burstParticles.push(new BurstSpark(clickX, clickY));
    }
  });

  heroSection.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.isHovering = true;
    }
  }, { passive: true });

  heroSection.addEventListener('touchend', () => {
    mouse.isHovering = false;
  });

  // Battery-efficient tab/scroll visibility pause
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        if (!animationFrameId) animate();
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    });
  }, { threshold: 0.05 });

  observer.observe(heroSection);

  // Resize listener
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
    }, 120);
  });

  // Initialize
  resize();
  animate();
})();
