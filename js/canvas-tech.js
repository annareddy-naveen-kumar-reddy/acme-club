/**
 * ACME CLUB - Dynamic Tech Innovation Canvas Matrix
 * Creates a high-performance connected node & particle network in the Hero background.
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

  // Particle configuration
  const config = {
    particleCount: window.innerWidth < 768 ? 38 : 75,
    maxDistance: window.innerWidth < 768 ? 95 : 140,
    nodeColor: 'rgba(0, 210, 254, ',
    lineColor: 'rgba(59, 130, 246, ',
    accentColor: 'rgba(99, 102, 241, ',
    speedMultiplier: 0.45,
    mouseRadius: 160
  };

  const mouse = {
    x: null,
    y: null,
    isHovering: false
  };

  let particles = [];

  class Particle {
    constructor() {
      this.reset();
      // Distribute randomly across canvas initially
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * config.speedMultiplier;
      this.vy = (Math.random() - 0.5) * config.speedMultiplier;
      this.radius = Math.random() * 1.8 + 1.2;
      this.alpha = Math.random() * 0.5 + 0.3;
      this.baseAlpha = this.alpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce smoothly at boundaries
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Pulse glow
      this.pulsePhase += this.pulseSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.pulsePhase) * 0.2;

      // Mouse interaction
      if (mouse.isHovering && mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < config.mouseRadius) {
          const force = (config.mouseRadius - dist) / config.mouseRadius;
          const angle = Math.atan2(dy, dx);
          // Subtle magnetic pull
          this.x += Math.cos(angle) * force * 1.2;
          this.y += Math.sin(angle) * force * 1.2;
          this.alpha = Math.min(1, this.alpha + force * 0.5);
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = config.nodeColor + this.alpha + ')';
      ctx.shadowColor = '#00D2FE';
      ctx.shadowBlur = this.radius * 3;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset for performance
    }
  }

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
    config.particleCount = width < 768 ? 36 : 75;
    config.maxDistance = width < 768 ? 90 : 135;

    // Re-initialize particles on resize
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < config.maxDistance) {
          const opacity = (1 - dist / config.maxDistance) * 0.32;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = config.lineColor + opacity + ')';
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);

    // Update and draw all particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // Connect nodes
    connectParticles();

    animationFrameId = requestAnimationFrame(animate);
  }

  // Mouse & Touch events
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

  // Pause canvas animation when offscreen for high frame rates & battery efficiency
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
  }, { threshold: 0.1 });

  observer.observe(heroSection);

  // Resize listener with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
    }, 150);
  });

  // Init
  resize();
  animate();
})();
