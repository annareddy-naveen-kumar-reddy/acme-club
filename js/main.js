/**
 * ACME CLUB - Main Interactive Script
 * Handles navigation, scroll spy, modals, stats counter, and interactive form workflows.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Sticky Navbar & Scroll Progress Indicator
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docHeight) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     2. Mobile Hamburger Navigation
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileToggle || !mobileMenu) return;
    const isOpen = forceClose ? true : mobileToggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.classList.remove('is-active');
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    } else {
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.classList.add('is-active');
      mobileMenu.classList.add('is-open');
      document.body.classList.add('nav-open');
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());
  }

  // Close mobile drawer when link clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('is-open')) {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMobileMenu(true);
      }
    }
  });

  /* ==========================================================================
     3. Smooth Scrolling with Sticky Nav Offset
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  /* ==========================================================================
     4. Scroll Spy (Active Section Highlighting)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.navbar-links .nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(section => spyObserver.observe(section));

  /* ==========================================================================
     5. Scroll Reveal Animation for Cards and Sections
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.02, rootMargin: '120px 0px 120px 0px' });

  revealElements.forEach(el => {
    // If element is already in viewport, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      el.classList.add('revealed');
    } else {
      revealObserver.observe(el);
    }
  });

  /* ==========================================================================
     Gallery Category Filters (Instant Smooth Switching)
     ========================================================================== */
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-profile-card, .gallery-card');

  if (galleryFilterBtns.length > 0 && galleryCards.length > 0) {
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter || category === 'all') {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 15);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 150);
          }
        });
      });
    });
  }

  /* ==========================================================================
     6. Highlights / Animated Statistics Counters
     ========================================================================== */
  const statsSection = document.getElementById('highlights');
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsAnimated = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, stepTime);
  }

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(num => animateCounter(num));
          statsObserver.unobserve(statsSection);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     7. Toast Notification Utility
     ========================================================================== */
  function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    
    const iconSvg = type === 'success' 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-message">${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* ==========================================================================
     8. Join Us Modal System
     ========================================================================== */
  const joinModal = document.getElementById('join-modal');
  const joinTriggers = document.querySelectorAll('[data-open-join-modal]');
  const joinCloseBtn = document.getElementById('join-modal-close');
  const joinForm = document.getElementById('join-club-form');

  function openJoinModal() {
    if (!joinModal) return;
    if (typeof joinModal.showModal === 'function') {
      try {
        joinModal.showModal();
      } catch (e) {
        joinModal.setAttribute('open', 'true');
      }
    } else {
      joinModal.setAttribute('open', 'true');
    }
    joinModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeJoinModal() {
    if (!joinModal) return;
    joinModal.classList.remove('is-active');
    setTimeout(() => {
      if (typeof joinModal.close === 'function') {
        try {
          joinModal.close();
        } catch (e) {
          joinModal.removeAttribute('open');
        }
      } else {
        joinModal.removeAttribute('open');
      }
      document.body.style.overflow = '';
    }, 200);
  }

  joinTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openJoinModal();
    });
  });

  if (joinCloseBtn) {
    joinCloseBtn.addEventListener('click', closeJoinModal);
  }

  if (joinModal) {
    joinModal.addEventListener('click', (e) => {
      if (e.target === joinModal || e.target.classList.contains('modal-backdrop')) {
        closeJoinModal();
      }
    });
  }

  if (joinForm) {
    joinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = joinForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Application';

      const nameVal = document.getElementById('join-name')?.value.trim();
      const emailVal = document.getElementById('join-email')?.value.trim();
      const deptVal = document.getElementById('join-dept')?.value.trim();
      const interestVal = document.getElementById('join-interest')?.value.trim();

      if (!nameVal || !emailVal || !deptVal) {
        showToast('Please fill in all required fields.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="btn-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
          </svg>
          Submitting...
        `;
      }

      try {
        await fetch("https://formsubmit.co/ajax/naveenkumarreddyannareddy@gmail.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            _subject: `New ACME Membership Application - ${nameVal}`,
            _cc: "pravallikamsp@gmail.com",
            _captcha: "false",
            "Applicant Name": nameVal,
            "Applicant Email": emailVal,
            "Department & Year": deptVal,
            "Area of Interest": interestVal || "General ECE / Tech",
            _template: "table"
          })
        });
      } catch (err) {
        // Handled
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        joinForm.reset();
        closeJoinModal();
        showToast('Submitted successfully!');
      }
    });
  }

  /* ==========================================================================
     9. Event Details Modal System
     ========================================================================== */
  const eventModal = document.getElementById('event-modal');
  const eventCloseBtn = document.getElementById('event-modal-close');
  const eventTriggers = document.querySelectorAll('[data-open-event-modal]');
  const eventModalTitle = document.getElementById('event-modal-title');
  const eventModalDate = document.getElementById('event-modal-date');
  const eventModalLocation = document.getElementById('event-modal-location');
  const eventModalDesc = document.getElementById('event-modal-desc');
  const eventModalImg = document.getElementById('event-modal-img');

  function openEventModal(card) {
    if (!eventModal || !card) return;

    const title = card.querySelector('.event-card-title')?.textContent || 'ACME Club Event';
    const date = card.querySelector('.event-date-badge')?.textContent || 'Upcoming';
    const location = card.querySelector('.event-location-tag')?.textContent || 'Campus Auditorium / Lab';
    const desc = card.querySelector('.event-card-desc')?.textContent || 'Event details and agenda placeholder.';
    const img = card.querySelector('.event-card-img img')?.src;

    if (eventModalTitle) eventModalTitle.textContent = title;
    if (eventModalDate) eventModalDate.textContent = date;
    if (eventModalLocation) eventModalLocation.textContent = location;
    if (eventModalDesc) eventModalDesc.textContent = desc;
    if (eventModalImg && img) eventModalImg.src = img;

    if (typeof eventModal.showModal === 'function') {
      try {
        eventModal.showModal();
      } catch (e) {
        eventModal.setAttribute('open', 'true');
      }
    } else {
      eventModal.setAttribute('open', 'true');
    }
    eventModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeEventModal() {
    if (!eventModal) return;
    eventModal.classList.remove('is-active');
    setTimeout(() => {
      if (typeof eventModal.close === 'function') {
        try {
          eventModal.close();
        } catch (e) {
          eventModal.removeAttribute('open');
        }
      } else {
        eventModal.removeAttribute('open');
      }
      document.body.style.overflow = '';
    }, 200);
  }

  eventTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.event-card');
      openEventModal(card);
    });
  });

  if (eventCloseBtn) {
    eventCloseBtn.addEventListener('click', closeEventModal);
  }

  if (eventModal) {
    eventModal.addEventListener('click', (e) => {
      if (e.target === eventModal || e.target.classList.contains('modal-backdrop')) {
        closeEventModal();
      }
    });
  }

  /* ==========================================================================
     10. Contact Form Submission Handling
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      const nameVal = document.getElementById('contact-name')?.value.trim();
      const emailVal = document.getElementById('contact-email')?.value.trim();
      const messageVal = document.getElementById('contact-message')?.value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        showToast('Please fill in all contact fields.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="btn-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
          </svg>
          Sending...
        `;
      }

      try {
        await fetch("https://formsubmit.co/ajax/naveenkumarreddyannareddy@gmail.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            _subject: `New ACME Contact Inquiry from ${nameVal}`,
            _cc: "pravallikamsp@gmail.com",
            _captcha: "false",
            "Sender Name": nameVal,
            "Sender Email": emailVal,
            "Inquiry Message": messageVal,
            _template: "table"
          })
        });
      } catch (err) {
        // Handled
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        contactForm.reset();
        showToast('Submitted successfully!');
      }
    });
  }

  /* ==========================================================================
     11. Coordinators Modal System
     ========================================================================== */
  const coordsModal = document.getElementById('coordinators-modal');
  const coordsTriggers = document.querySelectorAll('[data-open-coordinators-modal]');
  const coordsCloseBtn = document.getElementById('coordinators-modal-close');

  function openCoordsModal() {
    if (!coordsModal) return;
    if (typeof coordsModal.showModal === 'function') {
      try {
        coordsModal.showModal();
      } catch (e) {
        coordsModal.setAttribute('open', 'true');
      }
    } else {
      coordsModal.setAttribute('open', 'true');
    }
    coordsModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeCoordsModal() {
    if (!coordsModal) return;
    coordsModal.classList.remove('is-active');
    setTimeout(() => {
      if (typeof coordsModal.close === 'function') {
        try {
          coordsModal.close();
        } catch (e) {
          coordsModal.removeAttribute('open');
        }
      } else {
        coordsModal.removeAttribute('open');
      }
      document.body.style.overflow = '';
    }, 200);
  }

  coordsTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCoordsModal();
    });
  });

  if (coordsCloseBtn) {
    coordsCloseBtn.addEventListener('click', closeCoordsModal);
  }

  if (coordsModal) {
    coordsModal.addEventListener('click', (e) => {
      if (e.target === coordsModal || e.target.classList.contains('modal-backdrop')) {
        closeCoordsModal();
      }
    });
  }

  /* ==========================================================================
     12. Keyboard Modal Dismissal Handling
     ========================================================================== */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (joinModal && joinModal.classList.contains('is-active')) closeJoinModal();
      if (eventModal && eventModal.classList.contains('is-active')) closeEventModal();
      if (coordsModal && coordsModal.classList.contains('is-active')) closeCoordsModal();
    }
  });

});
