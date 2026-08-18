/**
 * ACME CLUB - Next-Gen Interactive Cyber Aurora & Quantum Matrix Engine
 * Creates a mesmerizing, multi-layered connected neural network with
 * fiber-optic data pulses, glowing energy nodes, and interactive magnetic ripples.
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

  // Modern Color Palettes for Nodes & Beams
  const colors = [
    { r: 0, g: 210, b: 254, hex: '#00d2fe' },   // Electric Cyan
    { r: 59, g: 130, b: 246, hex: '#3b82f6' },  // Vibrant Blue
    { r: 168, g: 85, b: 247, hex: '#a855f7' },  // Neon Purple
    { r: 16, g: 185, b: 129, hex: '#10b981' },  // Emerald Green
    { r: 245, g: 158, b: 11, hex: '#f59e0b' }   // Amber Gold
  ];

  // Configuration
  const isMobile = window.innerWidth < 768;
  const config = {
    nodeCount: isMobile ? 32 : 64,
    dustCount: isMobile ? 25 : 50,
    maxDistance: isMobile ? 110 : 160,
    mouseRadius: isMobile ? 120 : 200,
    speedMultiplier: 0.55
  };

  const mouse = {
    x: null,
    y: null,
    targetX: null,
    targetY: null,
    isHovering: false,
    rippleRadius: 0,
    maxRipple: 140
  };

  let nodes = [];
  let stardust = [];
  let dataPulses = [];

  // Floating Stardust Class (Deep Background Layer)
  class DustParticle {
    constructor() {
      this.reset();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.size = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
      ctx.fill();
    }
  }

  // Quantum Node Class (Foreground Layer)
  class QuantumNode {
    constructor(index) {
      this.index = index;
      this.reset();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseX = this.x;
      this.baseY = this.y;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * config.speedMultiplier;
      this.vy = (Math.random() - 0.5) * config.speedMultiplier;
      this.radius = Math.random() * 2.4 + 1.8;
      this.color = colors[this.index % colors.length];
      this.pulseSpeed = Math.random() * 0.03 + 0.015;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.alpha = Math.random() * 0.4 + 0.6;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Soft boundary reflection
      if (this.x < 15 || this.x > width - 15) this.vx *= -1;
      if (this.y < 15 || this.y > height - 15) this.vy *= -1;

      // Organic sine wave oscillation
      this.pulsePhase += this.pulseSpeed;
      const pulseGlow = Math.sin(this.pulsePhase) * 0.3;

      // Interactive Mouse Repel & Magnetic Field
      if (mouse.isHovering && mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < config.mouseRadius) {
          const force = (config.mouseRadius - dist) / config.mouseRadius;
          const angle = Math.atan2(dy, dx);
          
          // Smooth orbital magnetic distortion
          this.x -= Math.cos(angle) * force * 3.5;
          this.y -= Math.sin(angle) * force * 3.5;
        }
      }
    }

    draw() {
      const currentGlow = Math.max(0.2, this.alpha + Math.sin(this.pulsePhase) * 0.25);
      
      // Outer Radiant Halo
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius * 4.5
      );
      gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentGlow * 0.7})`);
      gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentGlow * 0.2})`);
      gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 4.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Solid Bright Center Core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = this.color.hex;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Fiber-Optic Data Pulse Class (Traveling Laser Packets)
  class DataPulse {
    constructor(nodeA, nodeB) {
      this.nodeA = nodeA;
      this.nodeB = nodeB;
      this.progress = 0;
      this.speed = Math.random() * 0.015 + 0.008;
      this.size = Math.random() * 2 + 2;
      this.color = nodeA.color;
    }

    update() {
      this.progress += this.speed;
    }

    draw() {
      const x = this.nodeA.x + (this.nodeB.x - this.nodeA.x) * this.progress;
      const y = this.nodeA.y + (this.nodeB.y - this.nodeA.y) * this.progress;

      ctx.beginPath();
      ctx.arc(x, y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = this.color.hex;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;

    const mobileMode = width < 768;
    config.nodeCount = mobileMode ? 32 : 64;
    config.dustCount = mobileMode ? 25 : 50;
    config.maxDistance = mobileMode ? 110 : 160;

    // Build Stardust
    stardust = [];
    for (let i = 0; i < config.dustCount; i++) {
      stardust.push(new DustParticle());
    }

    // Build Nodes
    nodes = [];
    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push(new QuantumNode(i));
    }

    dataPulses = [];
  }

  function connectAndSpawnPulses() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < config.maxDistance) {
          const factor = 1 - dist / config.maxDistance;
          const alpha = factor * 0.38;

          // Gradient Line between the two connected nodes
          const lineGrad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          lineGrad.addColorStop(0, `rgba(${nodes[i].color.r}, ${nodes[i].color.g}, ${nodes[i].color.b}, ${alpha})`);
          lineGrad.addColorStop(1, `rgba(${nodes[j].color.r}, ${nodes[j].color.g}, ${nodes[j].color.b}, ${alpha})`);

          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = lineGrad;
          ctx.lineWidth = factor * 1.6;
          ctx.stroke();

          // Random chance to spawn a traveling data pulse along this line
          if (Math.random() < 0.0006 && dataPulses.length < 15) {
            dataPulses.push(new DataPulse(nodes[i], nodes[j]));
          }
        }
      }
    }
  }

  function drawInteractiveRipples() {
    if (mouse.isHovering && mouse.x !== null && mouse.y !== null) {
      mouse.rippleRadius = (mouse.rippleRadius + 1.2) % mouse.maxRipple;
      const rippleAlpha = Math.max(0, 1 - mouse.rippleRadius / mouse.maxRipple) * 0.25;

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.rippleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 210, 254, ${rippleAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Soft ambient cursor glow
      const cursorGlow = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 100
      );
      cursorGlow.addColorStop(0, 'rgba(0, 210, 254, 0.12)');
      cursorGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.06)');
      cursorGlow.addColorStop(1, 'rgba(0, 210, 254, 0)');

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
      ctx.fillStyle = cursorGlow;
      ctx.fill();
    }
  }

  function animate() {
    if (!isVisible) return;

    time += 0.01;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background Stardust Layer
    for (let i = 0; i < stardust.length; i++) {
      stardust[i].update();
      stardust[i].draw();
    }

    // 2. Draw Connected Matrix Links & Spawn Pulses
    connectAndSpawnPulses();

    // 3. Update & Draw Data Pulses
    for (let i = dataPulses.length - 1; i >= 0; i--) {
      dataPulses[i].update();
      dataPulses[i].draw();
      if (dataPulses[i].progress >= 1) {
        dataPulses.splice(i, 1);
      }
    }

    // 4. Draw Foreground Quantum Nodes
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
    }

    // 5. Draw Interactive Mouse Ripples & Aura
    drawInteractiveRipples();

    animationFrameId = requestAnimationFrame(animate);
  }

  // Interactive Event Listeners
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

  // Smooth Debounced Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
    }, 120);
  });

  // Start Canvas
  resize();
  animate();
})();
