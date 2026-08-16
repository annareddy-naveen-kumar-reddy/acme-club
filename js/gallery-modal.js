/**
 * ACME CLUB - Gallery Lightbox & Filter System
 * Accessible modal lightbox with keyboard navigation, touch swipe, and category filters.
 */

(function () {
  'use strict';

  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentGalleryItems = [];
  let currentIndex = 0;

  function updateGalleryItemsList() {
    // Only select visible gallery items based on current category filter
    const visibleCards = Array.from(document.querySelectorAll('.gallery-card:not([hidden])'));
    currentGalleryItems = visibleCards.map((card, idx) => {
      const img = card.querySelector('img');
      const title = card.querySelector('.gallery-card-title')?.textContent.trim() || `Photo ${idx + 1}`;
      const subtitle = card.querySelector('.gallery-card-tag')?.textContent.trim() || 'ACME Gallery';
      return {
        src: img?.getAttribute('data-full-src') || img?.src || '',
        alt: img?.alt || title,
        title: title,
        subtitle: subtitle
      };
    });
  }

  function openLightbox(index) {
    updateGalleryItemsList();
    if (currentGalleryItems.length === 0) return;

    currentIndex = (index >= 0 && index < currentGalleryItems.length) ? index : 0;
    renderCurrentPhoto();

    if (lightbox) {
      if (typeof lightbox.showModal === 'function') {
        try {
          lightbox.showModal();
        } catch (e) {
          lightbox.setAttribute('open', 'true');
        }
      } else {
        lightbox.setAttribute('open', 'true');
      }
      lightbox.classList.add('is-active');
      document.body.style.overflow = 'hidden'; // Prevent page scroll
    }
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('is-active');
    setTimeout(() => {
      if (typeof lightbox.close === 'function') {
        try {
          lightbox.close();
        } catch (e) {
          lightbox.removeAttribute('open');
        }
      } else {
        lightbox.removeAttribute('open');
      }
      document.body.style.overflow = '';
    }, 200);
  }

  function renderCurrentPhoto() {
    if (!currentGalleryItems[currentIndex]) return;
    const item = currentGalleryItems[currentIndex];

    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.96)';

      setTimeout(() => {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        lightboxImg.onload = () => {
          lightboxImg.style.opacity = '1';
          lightboxImg.style.transform = 'scale(1)';
        };
        // In case cached
        if (lightboxImg.complete) {
          lightboxImg.style.opacity = '1';
          lightboxImg.style.transform = 'scale(1)';
        }
      }, 80);
    }

    if (lightboxCaption) {
      lightboxCaption.innerHTML = `<strong>${item.title}</strong><span>${item.subtitle}</span>`;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${currentGalleryItems.length}`;
    }
  }

  function nextPhoto() {
    if (currentGalleryItems.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentGalleryItems.length;
    renderCurrentPhoto();
  }

  function prevPhoto() {
    if (currentGalleryItems.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    renderCurrentPhoto();
  }

  // Event Listeners for Gallery Cards
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-card');
    if (card) {
      const visibleCards = Array.from(document.querySelectorAll('.gallery-card:not([hidden])'));
      const idx = visibleCards.indexOf(card);
      if (idx !== -1) {
        openLightbox(idx);
      }
    }
  });

  // Modal Control Buttons
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });

  // Backdrop click dismissal
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextPhoto();
    } else if (e.key === 'ArrowLeft') {
      prevPhoto();
    }
  });

  // Gallery Filter Tabs
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.removeAttribute('hidden');
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.setAttribute('hidden', 'true');
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

})();
